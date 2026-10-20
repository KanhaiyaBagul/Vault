/**
 * Encrypted Blob Object Store
 * Stores AES-256-GCM encrypted document payloads keyed strictly by opaqueDocRef.
 * Pluggable architecture supporting third-party cloud backends (AWS S3, Cloudflare R2,
 * MinIO, Supabase Storage, and Local Disk Vault) with local in-memory caching.
 * Zero plaintext knowledge: server possesses zero knowledge of filenames or file contents.
 */

import type {
  ICloudStorageProvider,
  EncryptedBlobPayload,
  StoragePutResult,
  CloudProviderHealth,
} from "./cloud/index.ts";
import { InMemoryStorageProvider } from "./cloud/memory_provider.ts";

export type { EncryptedBlobPayload };

export class EncryptedBlobStore {
  private readonly cache: Map<string, EncryptedBlobPayload> = new Map();
  private provider: ICloudStorageProvider;

  constructor(provider?: ICloudStorageProvider) {
    this.provider = provider || new InMemoryStorageProvider();
  }

  /**
   * Sets the active cloud storage provider.
   */
  public setProvider(provider: ICloudStorageProvider): void {
    this.provider = provider;
  }

  /**
   * Returns the current cloud storage provider.
   */
  public getProvider(): ICloudStorageProvider {
    return this.provider;
  }

  /**
   * Returns the current provider name.
   */
  public getProviderName(): string {
    return this.provider.providerName;
  }

  /**
   * Stores an encrypted document blob synchronously in memory cache
   * and dispatches cloud upload to the active third-party provider.
   */
  public putBlob(blob: EncryptedBlobPayload): void {
    if (!blob.docRef || !blob.ciphertextHex || !blob.ivHex) {
      throw new Error("Invalid EncryptedBlobPayload: docRef, ivHex, and ciphertextHex are required");
    }
    this.cache.set(blob.docRef, { ...blob });
    // Asynchronously synchronize with third-party cloud provider
    this.provider.putBlob(blob).catch((err: unknown) => {
      console.warn(`[CloudStorage] Asynchronous putBlob to ${this.provider.providerName} failed:`, err);
    });
  }

  /**
   * Stores an encrypted document blob awaiting confirmation from third-party cloud.
   */
  public async putBlobAsync(blob: EncryptedBlobPayload): Promise<StoragePutResult> {
    if (!blob.docRef || !blob.ciphertextHex || !blob.ivHex) {
      throw new Error("Invalid EncryptedBlobPayload: docRef, ivHex, and ciphertextHex are required");
    }
    this.cache.set(blob.docRef, { ...blob });
    return this.provider.putBlob(blob);
  }

  /**
   * Retrieves an encrypted document blob by its opaque reference hash from cache.
   */
  public getBlob(docRef: string): EncryptedBlobPayload | undefined {
    return this.cache.get(docRef);
  }

  /**
   * Retrieves an encrypted document blob by its opaque reference hash,
   * querying the third-party cloud provider if not found in local cache.
   */
  public async getBlobAsync(docRef: string): Promise<EncryptedBlobPayload | undefined> {
    const cached = this.cache.get(docRef);
    if (cached) return cached;

    const fromCloud = await this.provider.getBlob(docRef);
    if (fromCloud) {
      this.cache.set(docRef, fromCloud);
    }
    return fromCloud;
  }

  /**
   * Checks whether a blob exists in the cache or cloud.
   */
  public hasBlob(docRef: string): boolean {
    return this.cache.has(docRef);
  }

  /**
   * Checks whether a blob exists in the third-party cloud provider.
   */
  public async hasBlobAsync(docRef: string): Promise<boolean> {
    if (this.cache.has(docRef)) return true;
    return this.provider.hasBlob(docRef);
  }

  /**
   * Deletes a blob by its opaque reference hash from both cache and cloud.
   */
  public deleteBlob(docRef: string): boolean {
    const inCache = this.cache.delete(docRef);
    this.provider.deleteBlob(docRef).catch((err: unknown) => {
      console.warn(`[CloudStorage] Asynchronous deleteBlob from ${this.provider.providerName} failed:`, err);
    });
    return inCache;
  }

  /**
   * Deletes a blob awaiting cloud provider deletion.
   */
  public async deleteBlobAsync(docRef: string): Promise<boolean> {
    this.cache.delete(docRef);
    return this.provider.deleteBlob(docRef);
  }

  /**
   * Returns list of all stored opaque document reference hashes.
   */
  public listDocRefs(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Returns list of all stored opaque document reference hashes from cloud.
   */
  public async listDocRefsAsync(): Promise<string[]> {
    const cloudBlobs = await this.provider.listBlobs();
    return Array.from(new Set([...this.cache.keys(), ...cloudBlobs]));
  }

  /**
   * Returns total number of stored blobs.
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Returns total byte size of all stored ciphertexts.
   */
  public totalBytes(): number {
    let sum = 0;
    for (const b of this.cache.values()) {
      sum += b.sizeBytes;
    }
    return sum;
  }

  /**
   * Clears all stored blobs in memory.
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Runs an active health check against the current cloud provider.
   */
  public async healthCheck(): Promise<CloudProviderHealth> {
    return this.provider.healthCheck();
  }
}
