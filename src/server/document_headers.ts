/**
 * Document Header Store & Lightweight Discovery Catalog
 * Persists and indexes lightweight document metadata without ciphertext payloads.
 * Enables < 20ms document catalog discovery and provider-isolated listing.
 */

import * as fs from "node:fs";
import * as path from "node:path";

export interface DocumentHeader {
  docRef: string;
  filename: string;
  fileSize: number;
  contentType?: string;
  storedAt: number;
  keywordCount: number;
  provider: string;
}

export class DocumentHeaderStore {
  private readonly headers = new Map<string, DocumentHeader>();
  private readonly filePath?: string;

  constructor(filePath?: string) {
    this.filePath = filePath;
    this.load();
  }

  private load(): void {
    if (!this.filePath) return;
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item && item.docRef) {
              this.headers.set(item.docRef, item);
            }
          }
        }
      }
    } catch (err) {
      console.warn(`[DocumentHeaderStore] Failed to load header index from ${this.filePath}:`, err);
    }
  }

  public save(): void {
    if (!this.filePath) return;
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data = JSON.stringify(Array.from(this.headers.values()), null, 2);
      fs.writeFileSync(this.filePath, data, "utf-8");
    } catch (err) {
      console.warn(`[DocumentHeaderStore] Failed to save header index to ${this.filePath}:`, err);
    }
  }

  public addHeader(header: DocumentHeader): void {
    this.headers.set(header.docRef, { ...header });
    this.save();
  }

  public getHeader(docRef: string): DocumentHeader | undefined {
    return this.headers.get(docRef);
  }

  public removeHeader(docRef: string): boolean {
    const deleted = this.headers.delete(docRef);
    if (deleted) {
      this.save();
    }
    return deleted;
  }

  public listHeaders(providerName?: string, activeDocRefs?: string[]): DocumentHeader[] {
    const results: DocumentHeader[] = [];

    if (activeDocRefs && activeDocRefs.length > 0) {
      const refSet = new Set(activeDocRefs);
      for (const ref of activeDocRefs) {
        const existing = this.headers.get(ref);
        if (existing) {
          if (!providerName || existing.provider === providerName) {
            results.push({ ...existing });
          }
        } else {
          // Synthesize lightweight placeholder header for unindexed cloud blob
          results.push({
            docRef: ref,
            filename: `document_${ref.slice(0, 8)}.enc`,
            fileSize: 0,
            contentType: "text/plain",
            storedAt: Date.now(),
            keywordCount: 0,
            provider: providerName || "cloud",
          });
        }
      }
      return results;
    }

    if (activeDocRefs && activeDocRefs.length === 0) {
      // Active provider explicitly reported 0 blobs
      return [];
    }

    // Fallback: filter stored headers by provider
    for (const header of this.headers.values()) {
      if (!providerName || header.provider === providerName) {
        results.push({ ...header });
      }
    }
    return results;
  }

  public size(): number {
    return this.headers.size;
  }

  public clear(): void {
    this.headers.clear();
    this.save();
  }
}
