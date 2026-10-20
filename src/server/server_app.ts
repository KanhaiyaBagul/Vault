/**
 * Vault SSE Cloud Microservice & REST Router
 * Standalone HTTP server handling encrypted uploads, blind queries,
 * blob downloads, and zero-knowledge audit inspection.
 * Zero external dependencies (uses native node:http).
 */

import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { EncryptedBlobStore, type EncryptedBlobPayload } from "./blob_store.ts";
import { ZeroKnowledgeAuditLogger } from "./audit_logger.ts";
import { ServerBlindStore, type SearchTrapdoorToken } from "../engine/server_store.ts";
import type { BlindIndexEntry } from "../engine/blind_index.ts";
import { ServerSearchController } from "./search_controller.ts";
import { CloudStorageFactory, type CloudStorageConfig } from "./cloud/index.ts";

export interface VaultServerOptions {
  kAddr?: CryptoKey; // Optional: server-side trapdoor evaluation key (if delegated)
  cloudConfig?: Partial<CloudStorageConfig>;
}

export class VaultServerApp {
  public readonly cloudFactory: CloudStorageFactory;
  public readonly blobStore: EncryptedBlobStore;
  public readonly blindStore: ServerBlindStore;
  public readonly auditLogger: ZeroKnowledgeAuditLogger;
  public readonly searchController: ServerSearchController;
  private readonly kAddr?: CryptoKey;
  private server?: http.Server;

  constructor(options: VaultServerOptions = {}) {
    this.cloudFactory = new CloudStorageFactory(options.cloudConfig);
    this.blobStore = new EncryptedBlobStore(this.cloudFactory.getProvider());
    this.blindStore = new ServerBlindStore();
    this.auditLogger = new ZeroKnowledgeAuditLogger();
    this.searchController = new ServerSearchController(this.blindStore);
    this.kAddr = options.kAddr;
  }

  /**
   * Helper to parse JSON body from incoming HTTP request.
   */
  private async parseJsonBody<T>(req: http.IncomingMessage): Promise<T> {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          if (!body) {
            resolve({} as T);
            return;
          }
          resolve(JSON.parse(body) as T);
        } catch (err) {
          reject(new Error("Malformed JSON request body"));
        }
      });
      req.on("error", (err) => reject(err));
    });
  }

  /**
   * Helper to send JSON responses with CORS headers.
   */
  private sendJson(res: http.ServerResponse, statusCode: number, data: unknown): void {
    const json = JSON.stringify(data);
    res.writeHead(statusCode, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end(json);
  }

  /**
   * Internal request handler routing all REST endpoints.
   */
  public async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const pathname = url.pathname;
    const method = req.method?.toUpperCase();

    // Handle CORS preflight
    if (method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    try {
      // 0. Static web asset delivery from public/
      if (method === "GET" && !pathname.startsWith("/api/")) {
        const publicDir = path.resolve(process.cwd(), "public");
        const relPath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
        const safePath = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, "");
        const fullPath = path.join(publicDir, safePath);

        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          const ext = path.extname(fullPath).toLowerCase();
          const mimeTypes: Record<string, string> = {
            ".html": "text/html; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".js": "application/javascript; charset=utf-8",
            ".json": "application/json",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".svg": "image/svg+xml",
            ".ico": "image/x-icon",
          };
          const contentType = mimeTypes[ext] ?? "application/octet-stream";
          const content = fs.readFileSync(fullPath);
          res.writeHead(200, {
            "Content-Type": contentType,
            "Content-Length": content.length,
            "Access-Control-Allow-Origin": "*",
          });
          res.end(content);
          return;
        }
      }
      // 1. Health check: GET /api/v1/health
      if (method === "GET" && pathname === "/api/v1/health") {
        this.sendJson(res, 200, {
          success: true,
          status: "healthy",
          cloudProvider: this.blobStore.getProviderName(),
          storedBlobs: this.blobStore.size(),
          blindEntries: this.blindStore.size(),
          auditEntries: this.auditLogger.size(),
          uptimeSec: Math.floor(process.uptime()),
        });
        return;
      }

      // 2. Index Document & Store Blob: POST /api/v1/index
      if (method === "POST" && pathname === "/api/v1/index") {
        const body = await this.parseJsonBody<{
          docRef: string;
          entries: BlindIndexEntry[];
          encryptedBlob: EncryptedBlobPayload;
        }>(req);

        if (!body.docRef || !body.entries || !body.encryptedBlob) {
          this.sendJson(res, 400, {
            success: false,
            error: "docRef, entries, and encryptedBlob are required",
          });
          return;
        }

        // Insert blind index entries
        this.searchController.indexEntries(body.entries);

        // Store encrypted blob awaiting cloud confirmation
        await this.blobStore.putBlobAsync(body.encryptedBlob);

        // Record zero-knowledge audit log
        await this.auditLogger.logOperation("INDEX_DOCUMENT", {
          docRef: body.docRef,
          entryCount: body.entries.length,
          sizeBytes: body.encryptedBlob.sizeBytes,
        });

        this.sendJson(res, 201, {
          success: true,
          docRef: body.docRef,
          storedEntries: body.entries.length,
        });
        return;
      }

      // 3. Search: POST /api/v1/search
      if (method === "POST" && pathname === "/api/v1/search") {
        const body = await this.parseJsonBody<{
          queryType: "EXACT_WORD" | "SUBSTRING_CONJUNCTIVE";
          tokens: SearchTrapdoorToken[];
        }>(req);

        if (!body.queryType || !body.tokens) {
          this.sendJson(res, 400, {
            success: false,
            error: "queryType and tokens are required",
          });
          return;
        }

        // Execute search and assemble Merkle proof bundles
        const bundles = await this.searchController.executeSearch(
          this.kAddr,
          body.queryType,
          body.tokens
        );

        // Record zero-knowledge audit log
        await this.auditLogger.logOperation("SEARCH_QUERY", {
          queryType: body.queryType,
          tokenCount: body.tokens.length,
          matchCount: bundles[0]?.records.length ?? 0,
          merkleRootHex: bundles[0]?.rootHashHex ?? "0".repeat(64),
        });

        this.sendJson(res, 200, {
          success: true,
          bundles,
        });
        return;
      }

      // 4. Download Blob: GET /api/v1/blobs/:ref
      if (method === "GET" && pathname.startsWith("/api/v1/blobs/")) {
        const docRef = pathname.replace("/api/v1/blobs/", "").trim();
        const blob = await this.blobStore.getBlobAsync(docRef);

        if (!blob) {
          this.sendJson(res, 404, {
            success: false,
            error: `Encrypted blob '${docRef}' not found`,
          });
          return;
        }

        // Record retrieval in audit log
        await this.auditLogger.logOperation("RETRIEVE_BLOB", {
          docRef,
          provider: this.blobStore.getProviderName(),
          sizeBytes: blob.sizeBytes,
        });

        this.sendJson(res, 200, {
          success: true,
          blob,
        });
        return;
      }

      // 4a. Delete Blob: DELETE /api/v1/blobs/:ref
      if (method === "DELETE" && pathname.startsWith("/api/v1/blobs/")) {
        const docRef = pathname.replace("/api/v1/blobs/", "").trim();
        const exists = await this.blobStore.hasBlobAsync(docRef);

        if (!exists) {
          this.sendJson(res, 404, {
            success: false,
            error: `Encrypted blob '${docRef}' not found to delete`,
          });
          return;
        }

        await this.blobStore.deleteBlobAsync(docRef);

        // Record deletion in audit log
        await this.auditLogger.logOperation("DELETE_BLOB", {
          docRef,
          provider: this.blobStore.getProviderName(),
        });

        this.sendJson(res, 200, {
          success: true,
          docRef,
          deleted: true,
        });
        return;
      }

      // 4b. Cloud Storage Status: GET /api/v1/cloud/status
      if (method === "GET" && pathname === "/api/v1/cloud/status") {
        const health = await this.cloudFactory.getProvider().healthCheck();
        this.sendJson(res, 200, {
          success: true,
          provider: this.cloudFactory.getProvider().providerName,
          health,
          config: this.cloudFactory.getConfig(),
          storedBlobs: this.blobStore.size(),
        });
        return;
      }

      // 4c. Cloud Storage Test / Ping: POST /api/v1/cloud/test
      if (method === "POST" && pathname === "/api/v1/cloud/test") {
        const body = await this.parseJsonBody<CloudStorageConfig>(req);
        if (!body.provider) {
          this.sendJson(res, 400, {
            success: false,
            error: "provider field is required ('memory', 'disk', 's3', 'supabase')",
          });
          return;
        }

        try {
          const candidate = this.cloudFactory.createProvider(body);
          const health = await candidate.healthCheck();
          this.sendJson(res, health.ok ? 200 : 400, {
            success: health.ok,
            provider: body.provider,
            health,
            error: health.ok ? undefined : (health.error || "Connection failed"),
          });
        } catch (err: unknown) {
          const error = err as Error;
          this.sendJson(res, 400, {
            success: false,
            error: error.message,
          });
        }
        return;
      }

      // 4d. Cloud Storage Configuration: POST /api/v1/cloud/config
      if (method === "POST" && pathname === "/api/v1/cloud/config") {
        const body = await this.parseJsonBody<CloudStorageConfig>(req);
        if (!body.provider) {
          this.sendJson(res, 400, {
            success: false,
            error: "provider field is required ('memory', 'disk', 's3', 'supabase')",
          });
          return;
        }

        try {
          const health = await this.cloudFactory.switchProvider(body);
          this.blobStore.setProvider(this.cloudFactory.getProvider());

          await this.auditLogger.logOperation("CLOUD_PROVIDER_SWITCHED", {
            provider: body.provider,
            bucket: health.bucket || "local",
            status: health.ok ? "CONNECTED" : "FAILED",
          });

          this.sendJson(res, 200, {
            success: true,
            provider: body.provider,
            health,
            config: this.cloudFactory.getConfig(),
          });
        } catch (err: unknown) {
          const error = err as Error;
          this.sendJson(res, 400, {
            success: false,
            error: error.message,
          });
        }
        return;
      }

      // 5. Inspect Audit Log: GET /api/v1/audit/log
      if (method === "GET" && pathname === "/api/v1/audit/log") {
        await this.auditLogger.ensureGenesis();
        this.sendJson(res, 200, {
          success: true,
          entries: this.auditLogger.getEntries(),
          headHash: this.auditLogger.latestHash(),
        });
        return;
      }

      // 6. Verify Audit Hash Chain: GET /api/v1/audit/verify
      if (method === "GET" && pathname === "/api/v1/audit/verify") {
        const report = await this.auditLogger.verifyAuditChain();
        this.sendJson(res, 200, {
          success: true,
          ...report,
        });
        return;
      }

      // 404 Not Found
      this.sendJson(res, 404, {
        success: false,
        error: `Route ${method} ${pathname} not found`,
      });
    } catch (err: any) {
      this.sendJson(res, 500, {
        success: false,
        error: err.message ?? "Internal Server Error",
      });
    }
  }

  /**
   * Starts HTTP server on the specified port.
   * Passing port = 0 binds to a random available ephemeral port.
   */
  public listen(port = 0): Promise<number> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this.handleRequest(req, res).catch((err) => {
          this.sendJson(res, 500, { success: false, error: err.message });
        });
      });

      this.server.on("error", (err) => reject(err));

      this.server.listen(port, () => {
        const addr = this.server?.address();
        if (typeof addr === "object" && addr) {
          resolve(addr.port);
        } else {
          resolve(port);
        }
      });
    });
  }

  /**
   * Closes the running HTTP server.
   */
  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        resolve();
        return;
      }
      this.server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
