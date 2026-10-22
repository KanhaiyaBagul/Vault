/**
 * Cloud Storage Profile Manager
 * Manages named cloud connection profiles (Supabase, AWS S3, Local Disk, Memory),
 * handles credential masking, 1-click activation, and disk persistence to ./.vault_storage/cloud_profiles.json.
 * Zero external dependencies.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import type { CloudProviderType, CloudStorageConfig, CloudStorageFactory } from "./cloud_factory.ts";
import type { CloudProviderHealth } from "./cloud_provider.ts";

export interface CloudProfile {
  id: string;
  name: string;
  provider: CloudProviderType;
  config: CloudStorageConfig;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastTestedAt?: string;
  lastStatus?: "CONNECTED" | "FAILED" | "UNTESTED";
  latencyMs?: number;
}

export class CloudProfileManager {
  private readonly storageFilePath: string;
  private profiles: Map<string, CloudProfile> = new Map();
  private activeProfileId: string = "profile_disk_default";

  constructor(customStoragePath?: string) {
    this.storageFilePath = customStoragePath || path.resolve(process.cwd(), ".vault_storage", "cloud_profiles.json");
    this.ensureDirectory();
    this.loadProfiles();
  }

  private ensureDirectory(): void {
    const dir = path.dirname(this.storageFilePath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch (err) {
        console.warn(`[CloudProfileManager] Could not create directory ${dir}:`, err);
      }
    }
  }

  /**
   * Loads profiles from disk or seeds defaults if none exist.
   */
  public loadProfiles(): void {
    this.profiles.clear();

    if (fs.existsSync(this.storageFilePath)) {
      try {
        const raw = fs.readFileSync(this.storageFilePath, "utf8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.profiles)) {
          for (const p of parsed.profiles) {
            this.profiles.set(p.id, p);
          }
          if (parsed.activeProfileId && this.profiles.has(parsed.activeProfileId)) {
            this.activeProfileId = parsed.activeProfileId;
          } else {
            const firstActive = parsed.profiles.find((p: CloudProfile) => p.isActive);
            if (firstActive) {
              this.activeProfileId = firstActive.id;
            } else if (parsed.profiles.length > 0) {
              this.activeProfileId = parsed.profiles[0].id;
              this.profiles.get(this.activeProfileId)!.isActive = true;
            }
          }
          return;
        }
      } catch (err) {
        console.warn("[CloudProfileManager] Failed to parse existing profiles file, seeding defaults:", err);
      }
    }

    // Seed defaults
    this.seedDefaultProfiles();
    this.persistToDisk();
  }

  /**
   * Seeds standard out-of-the-box profiles.
   */
  private seedDefaultProfiles(): void {
    const now = new Date().toISOString();

    const memoryProfile: CloudProfile = {
      id: "profile_memory_default",
      name: "In-Memory Ephemeral Vault",
      provider: "memory",
      config: {
        provider: "memory",
      },
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastStatus: "CONNECTED",
    };

    const diskProfile: CloudProfile = {
      id: "profile_disk_default",
      name: "Local Offline Disk Vault",
      provider: "disk",
      config: {
        provider: "disk",
        diskPath: process.env.STORAGE_DISK_PATH || "./.vault_storage",
      },
      isActive: false,
      createdAt: now,
      updatedAt: now,
      lastStatus: "UNTESTED",
    };

    this.profiles.set(memoryProfile.id, memoryProfile);
    this.profiles.set(diskProfile.id, diskProfile);
    this.activeProfileId = memoryProfile.id;

    // Check if user has Supabase environment variables defined
    if (process.env.SUPABASE_URL) {
      const supabaseProfile: CloudProfile = {
        id: "profile_supabase_env",
        name: "Supabase Environment Vault",
        provider: "supabase",
        config: {
          provider: "supabase",
          supabase: {
            supabaseUrl: process.env.SUPABASE_URL,
            apiKey: process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "",
            bucket: process.env.SUPABASE_BUCKET || "vault-encrypted-blobs",
          },
        },
        isActive: false,
        createdAt: now,
        updatedAt: now,
        lastStatus: "UNTESTED",
      };
      this.profiles.set(supabaseProfile.id, supabaseProfile);
    }
  }

  /**
   * Persists current profiles to JSON on disk.
   */
  public persistToDisk(): void {
    try {
      this.ensureDirectory();
      const payload = {
        version: 1,
        activeProfileId: this.activeProfileId,
        updatedAt: new Date().toISOString(),
        profiles: Array.from(this.profiles.values()),
      };
      fs.writeFileSync(this.storageFilePath, JSON.stringify(payload, null, 2), "utf8");
    } catch (err) {
      console.warn("[CloudProfileManager] Failed to persist profiles to disk:", err);
    }
  }

  /**
   * Returns all profiles with secret credentials masked for UI/API consumption.
   */
  public listProfilesMasked(): { activeProfileId: string; profiles: CloudProfile[] } {
    const list = Array.from(this.profiles.values()).map((p) => this.maskProfile(p));
    return {
      activeProfileId: this.activeProfileId,
      profiles: list,
    };
  }

  /**
   * Returns a copy of the profile with secrets masked.
   */
  public maskProfile(p: CloudProfile): CloudProfile {
    const clone: CloudProfile = JSON.parse(JSON.stringify(p));
    clone.isActive = clone.id === this.activeProfileId;

    if (clone.config.s3?.secretAccessKey) {
      clone.config.s3.secretAccessKey = "********";
    }
    if (clone.config.s3?.accessKeyId && clone.config.s3.accessKeyId.length > 8) {
      clone.config.s3.accessKeyId = `${clone.config.s3.accessKeyId.slice(0, 4)}...${clone.config.s3.accessKeyId.slice(-4)}`;
    }
    if (clone.config.supabase?.apiKey) {
      clone.config.supabase.apiKey = "********";
    }
    // Flat mirrors for client convenience
    if (clone.config.supabase) {
      (clone.config as any).supabaseUrl = clone.config.supabase.supabaseUrl;
      (clone.config as any).supabaseBucket = clone.config.supabase.bucket;
      (clone.config as any).supabaseKey = clone.config.supabase.apiKey;
    }
    if (clone.config.s3) {
      (clone.config as any).s3Bucket = clone.config.s3.bucket;
      (clone.config as any).s3Region = clone.config.s3.region;
      (clone.config as any).s3AccessKeyId = clone.config.s3.accessKeyId;
      (clone.config as any).s3SecretAccessKey = clone.config.s3.secretAccessKey;
    }
    return clone;
  }

  /**
   * Retrieves an unmasked profile by ID (internal server use only).
   */
  public getProfileRaw(id: string): CloudProfile | undefined {
    return this.profiles.get(id);
  }

  /**
   * Returns the currently active profile (unmasked).
   */
  public getActiveProfile(): CloudProfile | undefined {
    return this.profiles.get(this.activeProfileId);
  }

  /**
   * Creates or updates a profile.
   * If secret values are "********" or empty on update, preserves existing secrets.
   */
  public saveProfile(input: {
    id?: string;
    name: string;
    provider: CloudProviderType;
    config: CloudStorageConfig;
    makeActive?: boolean;
  }): CloudProfile {
    const now = new Date().toISOString();
    const existing = input.id ? this.profiles.get(input.id) : undefined;
    const id = input.id && existing ? input.id : `prof_${crypto.randomBytes(6).toString("hex")}`;

    const config: CloudStorageConfig = {
      provider: input.provider,
    };

    const rawCfg = (input.config || {}) as any;

    if (input.provider === "disk") {
      config.diskPath = rawCfg.diskPath?.trim() || "./.vault_storage";
    } else if (input.provider === "s3") {
      const existingSecret = existing?.config.s3?.secretAccessKey || "";
      const existingKey = existing?.config.s3?.accessKeyId || "";
      const newSecret = (rawCfg.s3?.secretAccessKey || rawCfg.s3SecretAccessKey || rawCfg.secretAccessKey)?.trim();
      const newKey = (rawCfg.s3?.accessKeyId || rawCfg.s3AccessKeyId || rawCfg.accessKeyId)?.trim();
      const bucket = (rawCfg.s3?.bucket || rawCfg.s3Bucket || rawCfg.bucket)?.trim() || "vault-encrypted-blobs";
      const region = (rawCfg.s3?.region || rawCfg.s3Region || rawCfg.region)?.trim() || "us-east-1";
      const endpoint = (rawCfg.s3?.endpoint || rawCfg.s3Endpoint || rawCfg.endpoint)?.trim() || undefined;

      const finalKey = newKey && !newKey.includes("...") ? newKey : existingKey;
      const finalSecret = newSecret && newSecret !== "********" ? newSecret : existingSecret;

      if (!finalKey || !finalSecret) {
        throw new Error("S3 configuration requires Access Key ID and Secret Access Key.");
      }

      config.s3 = {
        bucket,
        region,
        endpoint,
        accessKeyId: finalKey,
        secretAccessKey: finalSecret,
      };
    } else if (input.provider === "supabase") {
      const existingKey = existing?.config.supabase?.apiKey || "";
      const existingUrl = existing?.config.supabase?.supabaseUrl || "";
      const newKey = (rawCfg.supabase?.apiKey || rawCfg.supabaseKey || rawCfg.apiKey)?.trim();
      const newUrl = (rawCfg.supabase?.supabaseUrl || rawCfg.supabaseUrl)?.trim();
      const bucket = (rawCfg.supabase?.bucket || rawCfg.supabaseBucket || rawCfg.bucket)?.trim() || "vault-encrypted-blobs";

      const finalUrl = newUrl || existingUrl;
      const finalKey = newKey && newKey !== "********" ? newKey : existingKey;

      if (!finalUrl || !finalKey) {
        throw new Error("Supabase connection requires both Project URL and API Key.");
      }

      config.supabase = {
        supabaseUrl: finalUrl,
        bucket,
        apiKey: finalKey,
      };
    }

    const profile: CloudProfile = {
      id,
      name: input.name?.trim() || `${input.provider.toUpperCase()} Connection`,
      provider: input.provider,
      config,
      isActive: input.makeActive || (existing ? existing.isActive : false),
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
      lastStatus: existing?.lastStatus || "UNTESTED",
      lastTestedAt: existing?.lastTestedAt,
      latencyMs: existing?.latencyMs,
    };

    if (profile.isActive) {
      for (const p of this.profiles.values()) {
        p.isActive = false;
      }
      profile.isActive = true;
      this.activeProfileId = id;
    }

    this.profiles.set(id, profile);
    this.persistToDisk();
    return profile;
  }

  /**
   * Activates a profile, switches the factory provider, runs healthCheck, and updates state.
   */
  public async activateProfile(id: string, factory: CloudStorageFactory): Promise<{ profile: CloudProfile; health: CloudProviderHealth }> {
    const target = this.profiles.get(id);
    if (!target) {
      throw new Error(`Profile with ID '${id}' not found`);
    }

    const health = await factory.switchProvider(target.config);

    target.lastStatus = health.ok ? "CONNECTED" : "FAILED";
    target.lastTestedAt = new Date().toISOString();
    target.latencyMs = health.latencyMs;

    for (const p of this.profiles.values()) {
      p.isActive = false;
    }
    target.isActive = true;
    this.activeProfileId = id;

    this.persistToDisk();
    return { profile: target, health };
  }

  /**
   * Deletes a profile by ID. Cannot delete the active profile unless it's the only one.
   */
  public deleteProfile(id: string): { success: boolean; error?: string } {
    if (!this.profiles.has(id)) {
      return { success: false, error: "Profile not found" };
    }
    if (this.activeProfileId === id && this.profiles.size > 1) {
      return { success: false, error: "Cannot delete the currently active cloud profile. Please activate another profile first." };
    }

    this.profiles.delete(id);
    if (this.activeProfileId === id && this.profiles.size > 0) {
      const next = this.profiles.keys().next().value;
      if (next) {
        this.activeProfileId = next;
        this.profiles.get(next)!.isActive = true;
      }
    }
    this.persistToDisk();
    return { success: true };
  }

  /**
   * Tests ping for a profile without activating it.
   */
  public async testProfilePing(id: string, factory: CloudStorageFactory): Promise<CloudProviderHealth> {
    const target = this.profiles.get(id);
    if (!target) {
      throw new Error(`Profile with ID '${id}' not found`);
    }

    const provider = factory.createProvider(target.config);
    const health = await provider.healthCheck();

    target.lastStatus = health.ok ? "CONNECTED" : "FAILED";
    target.lastTestedAt = new Date().toISOString();
    target.latencyMs = health.latencyMs;
    this.persistToDisk();

    return health;
  }
}
