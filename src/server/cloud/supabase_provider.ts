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

export function normalizeSupabaseUrl(rawUrl: string): string {
  let url = (rawUrl || "").trim().replace(/\/+$/, "");
  // Check if it's a dashboard URL: https://supabase.com/dashboard/project/<ref>...
  const dashboardMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
  if (dashboardMatch) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }
  // Check if it's just the project ref: e.g. ryfafenurtpwediiurjx
  if (/^[a-z0-9]{15,25}$/i.test(url)) {
    return `https://${url}.supabase.co`;
  }
  // If no scheme was provided, default to https://
  if (url && !/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url;
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

    this.supabaseUrl = normalizeSupabaseUrl(config.supabaseUrl);
    this.apiKey = config.apiKey.trim();
    this.bucket = config.bucket?.trim() || "vault-encrypted-blobs";
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
    let res = await this.fetchFn(url, {
      method: "POST",
      headers: {
        ...this.getHeaders("application/json"),
        "x-upsert": "true",
      },
      body: bodyStr,
    });

    // If bucket was not found, attempt to auto-create and retry
    if (res.status === 404) {
      try {
        await this.ensureBucketExists();
        res = await this.fetchFn(url, {
          method: "POST",
          headers: {
            ...this.getHeaders("application/json"),
            "x-upsert": "true",
          },
          body: bodyStr,
        });
      } catch {
        // Fall through to error reporting below
      }
    }

    if (!res.ok) {
      const errText = await res.text();
      let errorMsg = `Supabase PUT failed [HTTP ${res.status}]: ${errText}`;
      if (res.status === 404) {
        errorMsg = `Bucket '${this.bucket}' not found in Supabase. Please create bucket '${this.bucket}' in Supabase Dashboard (Storage > New bucket).`;
      } else if (res.status === 401 || res.status === 403) {
        errorMsg = `Supabase PUT authentication failed [HTTP ${res.status}]. Check your API key.`;
      }
      throw new Error(errorMsg);
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
      let res = await this.fetchFn(url, {
        method: "GET",
        headers: this.getHeaders(),
      });

      // If bucket was not found, attempt auto-create
      if (res.status === 404) {
        try {
          await this.ensureBucketExists();
          res = await this.fetchFn(url, {
            method: "GET",
            headers: this.getHeaders(),
          });
        } catch {
          // Ignore auto-create error and proceed to diagnostic error below
        }
      }

      const latencyMs = Date.now() - startTime;
      if (!res.ok) {
        const errText = await res.text();
        let helpfulMsg = `HTTP ${res.status}: ${errText}`;
        if (res.status === 404) {
          helpfulMsg = `Bucket '${this.bucket}' not found in Supabase project (${this.supabaseUrl}). Please create bucket '${this.bucket}' in Supabase Dashboard (Storage > New bucket).`;
        } else if (
          res.status === 401 ||
          res.status === 403 ||
          errText.includes("Compact JWS") ||
          errText.includes("Unauthorized") ||
          errText.includes("AccessDenied") ||
          errText.includes("jwt")
        ) {
          helpfulMsg = `Authentication failed [HTTP ${res.status}]: Invalid API key. Make sure to copy the full 'anon public' or 'service_role' key (starts with 'eyJhbGci...') from Supabase Dashboard > Project Settings > API.`;
        }
        return {
          ok: false,
          provider: this.providerName,
          bucket: this.bucket,
          endpoint: this.supabaseUrl,
          latencyMs,
          error: helpfulMsg,
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
      let errorMsg = error.message;
      if (errorMsg.includes("ENOTFOUND") || errorMsg.includes("getaddrinfo")) {
        errorMsg = `Could not reach Supabase URL '${this.supabaseUrl}'. Please verify your project reference and ensure the Supabase project is active (not paused).`;
      }
      return {
        ok: false,
        provider: this.providerName,
        bucket: this.bucket,
        endpoint: this.supabaseUrl,
        latencyMs: Date.now() - startTime,
        error: errorMsg,
      };
    }
  }

  private async ensureBucketExists(): Promise<void> {
    const createUrl = `${this.supabaseUrl}/storage/v1/bucket`;
    await this.fetchFn(createUrl, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        id: this.bucket,
        name: this.bucket,
        public: false,
      }),
    });
  }
}
