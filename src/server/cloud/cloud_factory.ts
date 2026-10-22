/**
 * Cloud Storage Factory & Runtime Manager
 * Manages active cloud storage providers, supports dynamic provider switching,
 * loads environment configuration, and provides fallback guarantees.
 */

import type { ICloudStorageProvider, CloudProviderHealth } from "./cloud_provider.ts";
import { InMemoryStorageProvider } from "./memory_provider.ts";
import { DiskStorageProvider } from "./disk_provider.ts";
import { S3CloudStorageProvider, type S3ProviderConfig } from "./s3_provider.ts";
import { SupabaseStorageProvider, type SupabaseProviderConfig } from "./supabase_provider.ts";

export type CloudProviderType = "memory" | "disk" | "s3" | "supabase";

export interface CloudStorageConfig {
  provider: CloudProviderType;
  diskPath?: string;
  s3?: S3ProviderConfig;
  supabase?: SupabaseProviderConfig;
}

export class CloudStorageFactory {
  private activeProvider: ICloudStorageProvider;
  private currentConfig: CloudStorageConfig;

  constructor(initialConfig?: Partial<CloudStorageConfig>) {
    this.currentConfig = this.resolveConfig(initialConfig);
    this.activeProvider = this.createProvider(this.currentConfig);
  }

  /**
   * Resolves configuration from environment variables or supplied overrides.
   */
  private resolveConfig(overrides?: Partial<CloudStorageConfig>): CloudStorageConfig {
    const envProvider = (process.env.STORAGE_PROVIDER?.toLowerCase() || "memory") as CloudProviderType;
    const provider = overrides?.provider || envProvider;

    const config: CloudStorageConfig = {
      provider,
      diskPath: overrides?.diskPath || process.env.STORAGE_DISK_PATH || "./.vault_storage",
    };

    const rawS3 = (overrides?.s3 || overrides || {}) as any;
    if (overrides?.s3 || rawS3.s3Bucket || rawS3.s3AccessKeyId || process.env.S3_BUCKET) {
      config.s3 = {
        bucket: overrides?.s3?.bucket || rawS3.s3Bucket || rawS3.bucket || process.env.S3_BUCKET || "vault-encrypted-blobs",
        region: overrides?.s3?.region || rawS3.s3Region || rawS3.region || process.env.S3_REGION || process.env.AWS_REGION || "us-east-1",
        endpoint: overrides?.s3?.endpoint || rawS3.s3Endpoint || rawS3.endpoint || process.env.S3_ENDPOINT,
        accessKeyId: overrides?.s3?.accessKeyId || rawS3.s3AccessKeyId || rawS3.accessKeyId || process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: overrides?.s3?.secretAccessKey || rawS3.s3SecretAccessKey || rawS3.secretAccessKey || process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
        forcePathStyle: overrides?.s3?.forcePathStyle || rawS3.forcePathStyle,
      };
    }

    const rawSupabase = (overrides?.supabase || overrides || {}) as any;
    if (overrides?.supabase || rawSupabase.supabaseUrl || rawSupabase.supabaseKey || rawSupabase.apiKey || process.env.SUPABASE_URL) {
      config.supabase = {
        supabaseUrl: overrides?.supabase?.supabaseUrl || rawSupabase.supabaseUrl || process.env.SUPABASE_URL || "",
        apiKey: overrides?.supabase?.apiKey || rawSupabase.supabaseKey || rawSupabase.apiKey || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "",
        bucket: overrides?.supabase?.bucket || rawSupabase.supabaseBucket || rawSupabase.bucket || process.env.SUPABASE_BUCKET || "vault-encrypted-blobs",
      };
    }

    return config;
  }

  /**
   * Instantiates a concrete ICloudStorageProvider.
   */
  public createProvider(config: CloudStorageConfig): ICloudStorageProvider {
    switch (config.provider) {
      case "disk":
        return new DiskStorageProvider(config.diskPath);
      case "s3": {
        const rawS3 = (config.s3 || config || {}) as any;
        const subS3 = config.s3 || {
          bucket: rawS3.s3Bucket || rawS3.bucket || "vault-encrypted-blobs",
          region: rawS3.s3Region || rawS3.region || "us-east-1",
          endpoint: rawS3.s3Endpoint || rawS3.endpoint,
          accessKeyId: rawS3.s3AccessKeyId || rawS3.accessKeyId || "",
          secretAccessKey: rawS3.s3SecretAccessKey || rawS3.secretAccessKey || "",
        };
        if (!subS3.accessKeyId || !subS3.secretAccessKey) {
          throw new Error("S3 provider requested but Access Key ID or Secret Access Key is missing");
        }
        return new S3CloudStorageProvider(subS3);
      }
      case "supabase": {
        const rawSb = (config.supabase || config || {}) as any;
        const subSb = config.supabase || {
          supabaseUrl: rawSb.supabaseUrl || "",
          apiKey: rawSb.supabaseKey || rawSb.apiKey || "",
          bucket: rawSb.supabaseBucket || rawSb.bucket || "vault-encrypted-blobs",
        };
        if (!subSb.supabaseUrl || !subSb.apiKey) {
          throw new Error("Supabase provider requested but Project URL or API Key is missing");
        }
        return new SupabaseStorageProvider(subSb);
      }
      case "memory":
      default:
        return new InMemoryStorageProvider();
    }
  }

  /**
   * Returns the currently active storage provider.
   */
  public getProvider(): ICloudStorageProvider {
    return this.activeProvider;
  }

  /**
   * Returns the current configuration (with secret keys masked).
   */
  public getConfig(): Record<string, unknown> {
    return {
      provider: this.currentConfig.provider,
      diskPath: this.currentConfig.diskPath,
      s3: this.currentConfig.s3
        ? {
            bucket: this.currentConfig.s3.bucket,
            region: this.currentConfig.s3.region,
            endpoint: this.currentConfig.s3.endpoint || "AWS Standard",
            accessKeyId: this.currentConfig.s3.accessKeyId
              ? `${this.currentConfig.s3.accessKeyId.slice(0, 4)}...${this.currentConfig.s3.accessKeyId.slice(-4)}`
              : "(not set)",
            secretAccessKey: this.currentConfig.s3.secretAccessKey ? "********" : "(not set)",
          }
        : undefined,
      supabase: this.currentConfig.supabase
        ? {
            supabaseUrl: this.currentConfig.supabase.supabaseUrl,
            bucket: this.currentConfig.supabase.bucket,
            apiKey: this.currentConfig.supabase.apiKey ? "********" : "(not set)",
          }
        : undefined,
    };
  }

  /**
   * Dynamically switches the active storage provider at runtime.
   */
  public async switchProvider(newConfig: CloudStorageConfig): Promise<CloudProviderHealth> {
    const candidateProvider = this.createProvider(newConfig);
    const health = await candidateProvider.healthCheck();

    if (!health.ok && newConfig.provider !== "memory") {
      throw new Error(`Provider connection test failed for '${newConfig.provider}': ${health.error || "Unknown error"}`);
    }

    this.activeProvider = candidateProvider;
    this.currentConfig = newConfig;
    return health;
  }
}
