/**
 * Encrypted Blob Object Store
 * Stores AES-256-GCM encrypted document payloads keyed strictly by opaqueDocRef.
 * Zero plaintext knowledge: server possesses zero knowledge of filenames or file contents.
 * Zero external dependencies.
 */

export interface EncryptedBlobPayload {
  docRef: string;          // 64-char opaque document reference hash
  ivHex: string;           // 24-char hex initialization vector
  ciphertextHex: string;   // Hex-encoded AES-256-GCM ciphertext + 16-byte tag
  sizeBytes: number;       // Size of encrypted payload in bytes
  uploadedAt: number;      // Epoch timestamp (ms)
}

/**
 * In-memory simulation of cloud object storage (e.g. S3/GCS bucket).
 * Keyed strictly by opaqueDocRef hashes.
 */
export class EncryptedBlobStore {
  private readonly blobs: Map<string, EncryptedBlobPayload> = new Map();

  /**
   * Stores an encrypted document blob.
   *
   * @param blob EncryptedBlobPayload containing opaqueDocRef, IV, and ciphertext
   */
  public putBlob(blob: EncryptedBlobPayload): void {
    if (!blob.docRef || !blob.ciphertextHex || !blob.ivHex) {
      throw new Error("Invalid EncryptedBlobPayload: docRef, ivHex, and ciphertextHex are required");
    }
    this.blobs.set(blob.docRef, { ...blob });
  }

  /**
   * Retrieves an encrypted document blob by its opaque reference hash.
   *
   * @param docRef 64-char opaque document reference hash
   */
  public getBlob(docRef: string): EncryptedBlobPayload | undefined {
    return this.blobs.get(docRef);
  }

  /**
   * Checks whether a blob exists in the store.
   */
  public hasBlob(docRef: string): boolean {
    return this.blobs.has(docRef);
  }

  /**
   * Deletes a blob by its opaque reference hash.
   */
  public deleteBlob(docRef: string): boolean {
    return this.blobs.delete(docRef);
  }

  /**
   * Returns list of all stored opaque document reference hashes.
   */
  public listDocRefs(): string[] {
    return Array.from(this.blobs.keys());
  }

  /**
   * Returns total number of stored blobs.
   */
  public size(): number {
    return this.blobs.size;
  }

  /**
   * Returns total byte size of all stored ciphertexts.
   */
  public totalBytes(): number {
    let sum = 0;
    for (const b of this.blobs.values()) {
      sum += b.sizeBytes;
    }
    return sum;
  }

  /**
   * Clears all stored blobs (for test cleanup).
   */
  public clear(): void {
    this.blobs.clear();
  }
}
