/**
 * In-Memory Cloud Storage Provider
 * Implements ICloudStorageProvider for offline testing, CI/CD, and fast regression suites.
 */

import type {
  ICloudStorageProvider,
  EncryptedBlobPayload,
  StoragePutResult,
  CloudProviderHealth,
} from "./cloud_provider.ts";

export class InMemoryStorageProvider implements ICloudStorageProvider {
  public readonly providerName = "memory";
  private readonly store = new Map<string, EncryptedBlobPayload>();

  public async putBlob(payload: EncryptedBlobPayload): Promise<StoragePutResult> {
    if (!payload.docRef || !payload.ciphertextHex || !payload.ivHex) {
      throw new Error("Invalid EncryptedBlobPayload: docRef, ivHex, and ciphertextHex are required");
    }

    this.store.set(payload.docRef, { ...payload });
    return {
      success: true,
      docRef: payload.docRef,
      storageKey: `memory://${payload.docRef}`,
      etag: `mem-${payload.sizeBytes}-${payload.uploadedAt}`,
      provider: this.providerName,
      storedAt: Date.now(),
    };
  }

  public async getBlob(docRef: string): Promise<EncryptedBlobPayload | undefined> {
    const item = this.store.get(docRef);
    return item ? { ...item } : undefined;
  }

  public async hasBlob(docRef: string): Promise<boolean> {
    return this.store.has(docRef);
  }

  public async deleteBlob(docRef: string): Promise<boolean> {
    return this.store.delete(docRef);
  }

  public async listBlobs(): Promise<string[]> {
    return Array.from(this.store.keys());
  }

  public async healthCheck(): Promise<CloudProviderHealth> {
    return {
      ok: true,
      provider: this.providerName,
      totalBlobs: this.store.size,
      latencyMs: 0.1,
      details: {
        mode: "in-memory simulation",
        allocatedEntries: this.store.size,
      },
    };
  }

  /**
   * Resets/clears all stored in-memory blobs (useful for test isolation).
   */
  public clear(): void {
    this.store.clear();
  }
}
