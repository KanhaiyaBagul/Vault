/**
 * S3-Compatible Cloud Storage Provider (AWS S3, Cloudflare R2, MinIO, Wasabi)
 * Zero external npm dependencies: implements native AWS Signature Version 4 (AWS4-HMAC-SHA256)
 * using standard Node.js crypto and fetch.
 */

import * as crypto from "node:crypto";
import type {
  ICloudStorageProvider,
  EncryptedBlobPayload,
  StoragePutResult,
  CloudProviderHealth,
} from "./cloud_provider.ts";

export interface S3ProviderConfig {
  bucket: string;
  region?: string;
  endpoint?: string;              // Custom endpoint for Cloudflare R2, MinIO, etc.
  accessKeyId: string;
  secretAccessKey: string;
  forcePathStyle?: boolean;       // Set true for MinIO/Localstack (default: false if custom endpoint or AWS)
  customFetch?: typeof fetch;     // Injected fetch handler (for mock/unit tests)
}

export class S3CloudStorageProvider implements ICloudStorageProvider {
  public readonly providerName = "s3";
  public readonly bucket: string;
  public readonly region: string;
  public readonly endpoint: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly forcePathStyle: boolean;
  private readonly fetchFn: typeof fetch;

  constructor(config: S3ProviderConfig) {
    if (!config.bucket) throw new Error("S3ProviderConfig requires 'bucket'");
    if (!config.accessKeyId) throw new Error("S3ProviderConfig requires 'accessKeyId'");
    if (!config.secretAccessKey) throw new Error("S3ProviderConfig requires 'secretAccessKey'");

    this.bucket = config.bucket;
    this.region = config.region || "us-east-1";
    this.endpoint = (config.endpoint || `https://s3.${this.region}.amazonaws.com`).replace(/\/+$/, "");
    this.accessKeyId = config.accessKeyId;
    this.secretAccessKey = config.secretAccessKey;
    this.forcePathStyle = config.forcePathStyle ?? (this.endpoint.includes("localhost") || this.endpoint.includes("127.0.0.1"));
    this.fetchFn = config.customFetch || globalThis.fetch;
  }

  /**
   * Derives SigV4 HMAC-SHA256 signing key.
   */
  private getSignatureKey(dateStamp: string): Buffer {
    const kDate = crypto.createHmac("sha256", "AWS4" + this.secretAccessKey).update(dateStamp).digest();
    const kRegion = crypto.createHmac("sha256", kDate).update(this.region).digest();
    const kService = crypto.createHmac("sha256", kRegion).update("s3").digest();
    return crypto.createHmac("sha256", kService).update("aws4_request").digest();
  }

  /**
   * Constructs signed headers for an S3 REST request using SigV4.
   */
  public signRequest(
    method: string,
    url: URL,
    headers: Record<string, string>,
    payloadBody: string | Buffer
  ): Record<string, string> {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.substring(0, 8);

    const payloadHash = crypto
      .createHash("sha256")
      .update(payloadBody)
      .digest("hex");

    const signedHeadersList: Record<string, string> = {
      ...headers,
      host: url.host,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    };

    // Canonical headers in lowercase sorted order
    const sortedHeaderKeys = Object.keys(signedHeadersList)
      .map((k) => k.toLowerCase())
      .sort();

    const canonicalHeadersStr = sortedHeaderKeys
      .map((k) => `${k}:${signedHeadersList[k].trim()}\n`)
      .join("");

    const signedHeadersHeader = sortedHeaderKeys.join(";");

    // Canonical query string
    const queryEntries: string[] = [];
    url.searchParams.sort();
    url.searchParams.forEach((val, key) => {
      queryEntries.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
    });
    const canonicalQueryString = queryEntries.join("&");

    const canonicalUri = url.pathname.startsWith("/") ? url.pathname : `/${url.pathname}`;

    const canonicalRequest = [
      method.toUpperCase(),
      canonicalUri,
      canonicalQueryString,
      canonicalHeadersStr,
      signedHeadersHeader,
      payloadHash,
    ].join("\n");

    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
    ].join("\n");

    const signingKey = this.getSignatureKey(dateStamp);
    const signature = crypto
      .createHmac("sha256", signingKey)
      .update(stringToSign)
      .digest("hex");

    const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersHeader}, Signature=${signature}`;

    return {
      ...signedHeadersList,
      Authorization: authorizationHeader,
    };
  }

  /**
   * Generates target URL for a given object key.
   */
  private getObjectUrl(key: string, queryParams?: Record<string, string>): URL {
    let urlStr: string;
    if (this.forcePathStyle) {
      urlStr = `${this.endpoint}/${this.bucket}/${encodeURIComponent(key)}`;
    } else {
      // Virtual hosted style
      try {
        const u = new URL(this.endpoint);
        urlStr = `${u.protocol}//${this.bucket}.${u.host}/${encodeURIComponent(key)}`;
      } catch {
        urlStr = `${this.endpoint}/${this.bucket}/${encodeURIComponent(key)}`;
      }
    }

    const url = new URL(urlStr);
    if (queryParams) {
      for (const [k, v] of Object.entries(queryParams)) {
        url.searchParams.set(k, v);
      }
    }
    return url;
  }

  public async putBlob(payload: EncryptedBlobPayload): Promise<StoragePutResult> {
    const key = `${payload.docRef}.enc.json`;
    const url = this.getObjectUrl(key);
    const bodyStr = JSON.stringify(payload);

    const headers = this.signRequest(
      "PUT",
      url,
      { "content-type": "application/json" },
      bodyStr
    );

    const res = await this.fetchFn(url.toString(), {
      method: "PUT",
      headers,
      body: bodyStr,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`S3 PUT failed [HTTP ${res.status}]: ${errText}`);
    }

    const etag = res.headers.get("etag") || `s3-${payload.docRef.slice(0, 8)}`;

    return {
      success: true,
      docRef: payload.docRef,
      storageKey: `s3://${this.bucket}/${key}`,
      etag: etag.replace(/"/g, ""),
      provider: this.providerName,
      storedAt: Date.now(),
    };
  }

  public async getBlob(docRef: string): Promise<EncryptedBlobPayload | undefined> {
    const key = `${docRef}.enc.json`;
    const url = this.getObjectUrl(key);

    const headers = this.signRequest("GET", url, {}, "");

    const res = await this.fetchFn(url.toString(), {
      method: "GET",
      headers,
    });

    if (res.status === 404) {
      return undefined;
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`S3 GET failed [HTTP ${res.status}]: ${errText}`);
    }

    const data = await res.json();
    return data as EncryptedBlobPayload;
  }

  public async hasBlob(docRef: string): Promise<boolean> {
    const key = `${docRef}.enc.json`;
    const url = this.getObjectUrl(key);

    const headers = this.signRequest("HEAD", url, {}, "");

    const res = await this.fetchFn(url.toString(), {
      method: "HEAD",
      headers,
    });

    return res.status >= 200 && res.status < 300;
  }

  public async deleteBlob(docRef: string): Promise<boolean> {
    const key = `${docRef}.enc.json`;
    const url = this.getObjectUrl(key);

    const headers = this.signRequest("DELETE", url, {}, "");

    const res = await this.fetchFn(url.toString(), {
      method: "DELETE",
      headers,
    });

    return res.status === 204 || res.status === 200 || res.status === 404;
  }

  public async listBlobs(): Promise<string[]> {
    // S3 ListObjectsV2
    const url = this.getObjectUrl("", { "list-type": "2" });
    const headers = this.signRequest("GET", url, {}, "");

    const res = await this.fetchFn(url.toString(), {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`S3 List failed [HTTP ${res.status}]: ${errText}`);
    }

    const xml = await res.text();
    // Simple regex extraction to avoid heavy XML parser dependency
    const keyMatches = xml.matchAll(/<Key>([a-fA-F0-9]{64})\.enc\.json<\/Key>/g);
    const keys: string[] = [];
    for (const match of keyMatches) {
      keys.push(match[1]);
    }
    return keys;
  }

  public async healthCheck(): Promise<CloudProviderHealth> {
    const startTime = Date.now();
    try {
      const url = this.getObjectUrl("", { "list-type": "2", "max-keys": "1" });
      const headers = this.signRequest("GET", url, {}, "");

      const res = await this.fetchFn(url.toString(), {
        method: "GET",
        headers,
      });

      const latencyMs = Date.now() - startTime;

      if (!res.ok) {
        const errText = await res.text();
        return {
          ok: false,
          provider: this.providerName,
          bucket: this.bucket,
          endpoint: this.endpoint,
          latencyMs,
          error: `HTTP ${res.status}: ${errText}`,
        };
      }

      return {
        ok: true,
        provider: this.providerName,
        bucket: this.bucket,
        endpoint: this.endpoint,
        latencyMs,
        details: {
          region: this.region,
          forcePathStyle: this.forcePathStyle,
          authenticated: true,
        },
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        ok: false,
        provider: this.providerName,
        bucket: this.bucket,
        endpoint: this.endpoint,
        latencyMs: Date.now() - startTime,
        error: error.message,
      };
    }
  }
}
