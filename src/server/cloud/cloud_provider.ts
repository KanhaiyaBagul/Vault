/**
 * Cloud Storage Provider Interface & Types
 * Defines the standard contract for untrusted third-party cloud object storage.
 * In accordance with SSE zero-trust invariants, providers store ONLY opaque ciphertexts,
 * nonces, and docRef hashes without plaintext keys, filenames, or content.
 */

export interface EncryptedBlobPayload {
  docRef: string;          // 64-char opaque document reference hash
  ivHex: string;           // 24-char hex initialization vector (96-bit)
  ciphertextHex: string;   // Hex-encoded AES-256-GCM ciphertext + 16-byte tag
  sizeBytes: number;       // Size of encrypted payload in bytes
  uploadedAt: number;      // Epoch timestamp (ms)
}

export interface StoragePutResult {
  success: boolean;
  docRef: string;
  storageKey: string;
  etag?: string;
  provider: string;
  storedAt: number;
}

export interface CloudProviderHealth {
  ok: boolean;
  provider: string;
  bucket?: string;
  endpoint?: string;
  totalBlobs?: number;
  latencyMs?: number;
  error?: string;
  details?: Record<string, unknown>;
}

export interface ICloudStorageProvider {
  readonly providerName: string;

  /**
   * Stores an opaque encrypted blob payload in third-party storage.
   */
  putBlob(payload: EncryptedBlobPayload): Promise<StoragePutResult>;

  /**
   * Retrieves an encrypted blob payload by its opaque 64-character hash.
   */
  getBlob(docRef: string): Promise<EncryptedBlobPayload | undefined>;

  /**
   * Checks whether a blob exists in storage.
   */
  hasBlob(docRef: string): Promise<boolean>;

  /**
   * Deletes an encrypted blob from storage.
   */
  deleteBlob(docRef: string): Promise<boolean>;

  /**
   * Lists all stored opaque document reference hashes.
   */
  listBlobs(): Promise<string[]>;

  /**
   * Performs an active health check / ping against the cloud storage target.
   */
  healthCheck(): Promise<CloudProviderHealth>;
}
