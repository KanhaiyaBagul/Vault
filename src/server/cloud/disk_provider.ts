/**
 * Local Disk Cloud Storage Provider
 * Persists opaque encrypted payloads to disk under a dedicated vault directory.
 * Simulates a local cold-storage / air-gapped encrypted vault.
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";
import type {
  ICloudStorageProvider,
  EncryptedBlobPayload,
  StoragePutResult,
  CloudProviderHealth,
} from "./cloud_provider.ts";

export class DiskStorageProvider implements ICloudStorageProvider {
  public readonly providerName = "disk";
  public readonly storageDir: string;
  private initialized = false;

  constructor(storageDir = "./.vault_storage") {
    this.storageDir = path.resolve(storageDir);
  }

  private async ensureDir(): Promise<void> {
    if (!this.initialized) {
      await fs.mkdir(this.storageDir, { recursive: true });
      this.initialized = true;
    }
  }

  private getFilePath(docRef: string): string {
    // Sanitize docRef to ensure alphanumeric only
    const safeDocRef = docRef.replace(/[^a-fA-F0-9]/g, "");
    if (!safeDocRef || safeDocRef.length !== 64) {
      throw new Error(`Invalid 64-char hex docRef: ${docRef}`);
    }
    return path.join(this.storageDir, `${safeDocRef}.json`);
  }

  public async putBlob(payload: EncryptedBlobPayload): Promise<StoragePutResult> {
    await this.ensureDir();
    const filePath = this.getFilePath(payload.docRef);
    const content = JSON.stringify(payload, null, 2);
    await fs.writeFile(filePath, content, "utf-8");

    return {
      success: true,
      docRef: payload.docRef,
      storageKey: filePath,
      etag: `disk-${payload.sizeBytes}-${payload.uploadedAt}`,
      provider: this.providerName,
      storedAt: Date.now(),
    };
  }

  public async getBlob(docRef: string): Promise<EncryptedBlobPayload | undefined> {
    await this.ensureDir();
    try {
      const filePath = this.getFilePath(docRef);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content) as EncryptedBlobPayload;
    } catch (err: unknown) {
      const error = err as NodeJS.ErrnoException;
      if (error.code === "ENOENT") {
        return undefined;
      }
      throw err;
    }
  }

  public async hasBlob(docRef: string): Promise<boolean> {
    await this.ensureDir();
    try {
      const filePath = this.getFilePath(docRef);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  public async deleteBlob(docRef: string): Promise<boolean> {
    await this.ensureDir();
    try {
      const filePath = this.getFilePath(docRef);
      await fs.unlink(filePath);
      return true;
    } catch (err: unknown) {
      const error = err as NodeJS.ErrnoException;
      if (error.code === "ENOENT") {
        return false;
      }
      throw err;
    }
  }

  public async listBlobs(): Promise<string[]> {
    await this.ensureDir();
    const entries = await fs.readdir(this.storageDir);
    return entries
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.slice(0, -5));
  }

  public async healthCheck(): Promise<CloudProviderHealth> {
    const startTime = Date.now();
    try {
      await this.ensureDir();
      const files = await this.listBlobs();
      return {
        ok: true,
        provider: this.providerName,
        totalBlobs: files.length,
        latencyMs: Date.now() - startTime,
        details: {
          storagePath: this.storageDir,
          accessible: true,
        },
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        ok: false,
        provider: this.providerName,
        latencyMs: Date.now() - startTime,
        error: error.message,
        details: { storagePath: this.storageDir },
      };
    }
  }
}
