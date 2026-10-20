/**
 * Supabase Storage Cloud Provider
 * Implements ICloudStorageProvider via Supabase Storage REST API v1.
 * Zero external npm dependencies: uses standard Node fetch.
 */

import type {
  ICloudStorageProvider,
  EncryptedBlobPayload,
  StoragePutResult,
  CloudProviderHealth,
} from "./cloud_provider.ts";

export interface SupabaseProviderConfig {
  supabaseUrl: string;          // e.g. https://xyzcompany.supabase.co
  apiKey: string;               // Supabase service_role key or anon key
  bucket?: string;              // Defaults to 'vault-encrypted-blobs'
  customFetch?: typeof fetch;   // Optional fetch handler for test mocking
}

export class SupabaseStorageProvider implements ICloudStorageProvider {
  public readonly providerName = "supabase";
  public readonly supabaseUrl: string;
  public readonly bucket: string;
  private readonly apiKey: string;
  private readonly fetchFn: typeof fetch;

  constructor(config: SupabaseProviderConfig) {
    if (!config.supabaseUrl) throw new Error("SupabaseProviderConfig requires 'supabaseUrl'");
    if (!config.apiKey) throw new Error("SupabaseProviderConfig requires 'apiKey'");

    this.supabaseUrl = config.supabaseUrl.replace(/\/+$/, "");
    this.apiKey = config.apiKey;
    this.bucket = config.bucket || "vault-encrypted-blobs";
    this.fetchFn = config.customFetch || globalThis.fetch;
  }

  private getHeaders(contentType = "application/json"): Record<string, string> {
    return {
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": contentType,
    };
  }

  public async putBlob(payload: EncryptedBlobPayload): Promise<StoragePutResult> {
    const key = `${payload.docRef}.enc.json`;
    const url = `${this.supabaseUrl}/storage/v1/object/${this.bucket}/${key}`;
    const bodyStr = JSON.stringify(payload);

    // Try upserting object
    const res = await this.fetchFn(url, {
      method: "POST",
      headers: {
        ...this.getHeaders("application/json"),
        "x-upsert": "true",
      },
      body: bodyStr,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Supabase PUT failed [HTTP ${res.status}]: ${errText}`);
    }

    return {
      success: true,
      docRef: payload.docRef,
      storageKey: `supabase://${this.bucket}/${key}`,
      etag: `sb-${payload.docRef.slice(0, 8)}`,
      provider: this.providerName,
      storedAt: Date.now(),
    };
  }

  public async getBlob(docRef: string): Promise<EncryptedBlobPayload | undefined> {
    const key = `${docRef}.enc.json`;
    const url = `${this.supabaseUrl}/storage/v1/object/authenticated/${this.bucket}/${key}`;

    const res = await this.fetchFn(url, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (res.status === 404) {
      return undefined;
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Supabase GET failed [HTTP ${res.status}]: ${errText}`);
    }

    const data = await res.json();
    return data as EncryptedBlobPayload;
  }

  public async hasBlob(docRef: string): Promise<boolean> {
    const key = `${docRef}.enc.json`;
    const url = `${this.supabaseUrl}/storage/v1/object/info/${this.bucket}/${key}`;

    const res = await this.fetchFn(url, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return res.status >= 200 && res.status < 300;
  }

  public async deleteBlob(docRef: string): Promise<boolean> {
    const key = `${docRef}.enc.json`;
    const url = `${this.supabaseUrl}/storage/v1/object/${this.bucket}`;

    const res = await this.fetchFn(url, {
      method: "DELETE",
      headers: this.getHeaders(),
      body: JSON.stringify({ prefixes: [key] }),
    });

    return res.status >= 200 && res.status < 300;
  }

  public async listBlobs(): Promise<string[]> {
    const url = `${this.supabaseUrl}/storage/v1/object/list/${this.bucket}`;

    const res = await this.fetchFn(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ limit: 100, prefix: "" }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Supabase List failed [HTTP ${res.status}]: ${errText}`);
    }

    interface SupabaseFileItem {
      name: string;
    }
    const items = (await res.json()) as SupabaseFileItem[];
    const docRefs: string[] = [];
    for (const item of items) {
      if (item.name && item.name.endsWith(".enc.json")) {
        docRefs.push(item.name.replace(".enc.json", ""));
      }
    }
    return docRefs;
  }

  public async healthCheck(): Promise<CloudProviderHealth> {
    const startTime = Date.now();
    try {
      const url = `${this.supabaseUrl}/storage/v1/bucket/${this.bucket}`;
      const res = await this.fetchFn(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      const latencyMs = Date.now() - startTime;
      if (!res.ok) {
        const errText = await res.text();
        return {
          ok: false,
          provider: this.providerName,
          bucket: this.bucket,
          endpoint: this.supabaseUrl,
          latencyMs,
          error: `HTTP ${res.status}: ${errText}`,
        };
      }

      return {
        ok: true,
        provider: this.providerName,
        bucket: this.bucket,
        endpoint: this.supabaseUrl,
        latencyMs,
        details: { authenticated: true },
      };
    } catch (err: unknown) {
      const error = err as Error;
      return {
        ok: false,
        provider: this.providerName,
        bucket: this.bucket,
        endpoint: this.supabaseUrl,
        latencyMs: Date.now() - startTime,
        error: error.message,
      };
    }
  }
}
