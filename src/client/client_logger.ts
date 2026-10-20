/**
 * Vault Client Security & Activity Logger
 * Tamper-evident, zero-knowledge client telemetry engine.
 * Records cryptographic lifecycle events (key derivation, encryption, trapdoor generation,
 * Merkle proof verification, attacker tamper defenses) with cryptographic hash chaining.
 * 
 * STRICT INVARIANT: ZERO PLAINTEXT LEAKAGE.
 * Plaintexts, passwords, and raw cryptographic subkeys are strictly forbidden.
 */

import { bytesToHex, utf8Encode } from "../crypto/utils.ts";

export type ClientLogCategory =
  | "KEY_MANAGEMENT"
  | "INGESTION"
  | "SEARCH"
  | "SECURITY"
  | "CLOUD";

export type ClientLogStatus =
  | "SUCCESS"
  | "VERIFIED"
  | "WARNING"
  | "TAMPER_DETECTED"
  | "ERROR";

export interface ClientSecurityLogEntry {
  id: string;
  seq: number;
  timestamp: number;
  category: ClientLogCategory;
  event: string;
  status: ClientLogStatus;
  docRef?: string;
  docId?: string;
  provider?: string;
  details: Record<string, string | number | boolean | undefined>;
  prevHash: string;
  entryHash: string;
}

export interface ClientLogVerificationReport {
  isValid: boolean;
  verifiedCount: number;
  tamperedSeq?: number;
  error?: string;
}

const GENESIS_PREV_HASH = "0".repeat(64);

/**
 * Validates that an event does NOT contain plaintext leaks, secrets, or keys.
 */
export function sanitizeLogDetails(
  details: Record<string, unknown>
): Record<string, string | number | boolean | undefined> {
  const sanitized: Record<string, string | number | boolean | undefined> = {};

  const forbiddenKeys = ["plaintext", "password", "masterkey", "secret", "rawkey", "content"];

  for (const [key, value] of Object.entries(details)) {
    const lowerKey = key.toLowerCase();

    if (forbiddenKeys.some((f) => lowerKey === f || (lowerKey.includes(f) && lowerKey !== "contenttype" && lowerKey !== "contentlength"))) {
      throw new Error(`Security Violation: Attempted to log forbidden sensitive field '${key}' to client audit log`);
    }

    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      // Check string value for suspiciously long text that looks like accidental plaintext dump
      if (typeof value === "string" && value.length > 512 && !/^[0-9a-fA-F]+$/.test(value)) {
        throw new Error(`Security Violation: Field '${key}' contains unhashed plaintext data (>512 non-hex chars)`);
      }
      sanitized[key] = value;
    } else {
      sanitized[key] = String(value);
    }
  }

  return sanitized;
}

/**
 * Computes deterministic SHA-256 hash for a log entry.
 */
export async function computeEntryHash(
  entry: Omit<ClientSecurityLogEntry, "entryHash">
): Promise<string> {
  const sortedDetailsKeys = Object.keys(entry.details).sort();
  const sortedDetails: Record<string, unknown> = {};
  for (const k of sortedDetailsKeys) {
    sortedDetails[k] = entry.details[k];
  }

  const payload = [
    entry.seq,
    entry.timestamp,
    entry.category,
    entry.event,
    entry.status,
    entry.docRef || "",
    entry.docId || "",
    entry.provider || "",
    entry.prevHash,
    JSON.stringify(sortedDetails),
  ].join("|");

  const digest = await globalThis.crypto.subtle.digest("SHA-256", utf8Encode(payload));
  return bytesToHex(new Uint8Array(digest));
}

export class ClientSecurityLogger {
  private entries: ClientSecurityLogEntry[] = [];
  private latestHash: string = GENESIS_PREV_HASH;
  private readonly maxEntries: number;

  constructor(maxEntries = 200) {
    this.maxEntries = maxEntries;
  }

  /**
   * Appends a new tamper-evident client security log entry.
   */
  public async logEvent(
    category: ClientLogCategory,
    event: string,
    details: Record<string, unknown> = {},
    status: ClientLogStatus = "SUCCESS",
    meta?: {
      docRef?: string;
      docId?: string;
      provider?: string;
    }
  ): Promise<ClientSecurityLogEntry> {
    const cleanDetails = sanitizeLogDetails(details);
    const seq = this.entries.length + 1;
    const timestamp = Date.now();
    const prevHash = this.latestHash;

    const partialEntry: Omit<ClientSecurityLogEntry, "entryHash"> = {
      id: globalThis.crypto.randomUUID ? globalThis.crypto.randomUUID() : `log-${seq}-${Date.now()}`,
      seq,
      timestamp,
      category,
      event,
      status,
      docRef: meta?.docRef,
      docId: meta?.docId,
      provider: meta?.provider,
      details: cleanDetails,
      prevHash,
    };

    const entryHash = await computeEntryHash(partialEntry);
    const fullEntry: ClientSecurityLogEntry = {
      ...partialEntry,
      entryHash,
    };

    this.entries.push(fullEntry);
    this.latestHash = entryHash;

    // Maintain max entries limit while keeping chain valid
    if (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    return fullEntry;
  }

  /**
   * Retrieves log entries, optionally filtered by category.
   */
  public getEntries(category?: ClientLogCategory): ClientSecurityLogEntry[] {
    if (!category) {
      return [...this.entries];
    }
    return this.entries.filter((e) => e.category === category);
  }

  /**
   * Returns current head hash of the client log chain.
   */
  public getHeadHash(): string {
    return this.latestHash;
  }

  /**
   * Returns count of logged entries.
   */
  public size(): number {
    return this.entries.length;
  }

  /**
   * Verifies the cryptographic integrity of the entire client log hash chain.
   */
  public async verifyLogChain(): Promise<ClientLogVerificationReport> {
    if (this.entries.length === 0) {
      return { isValid: true, verifiedCount: 0 };
    }

    let expectedPrevHash = this.entries[0]?.prevHash ?? GENESIS_PREV_HASH;

    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      if (!entry) continue;

      if (entry.prevHash !== expectedPrevHash) {
        return {
          isValid: false,
          verifiedCount: i,
          tamperedSeq: entry.seq,
          error: `Broken hash chain pointer at seq #${entry.seq}: expected prevHash ${expectedPrevHash}, found ${entry.prevHash}`,
        };
      }

      const recomputed = await computeEntryHash({
        id: entry.id,
        seq: entry.seq,
        timestamp: entry.timestamp,
        category: entry.category,
        event: entry.event,
        status: entry.status,
        docRef: entry.docRef,
        docId: entry.docId,
        provider: entry.provider,
        details: entry.details,
        prevHash: entry.prevHash,
      });

      if (recomputed !== entry.entryHash) {
        return {
          isValid: false,
          verifiedCount: i,
          tamperedSeq: entry.seq,
          error: `Entry hash mismatch at seq #${entry.seq}: log entry has been tampered with or modified`,
        };
      }

      expectedPrevHash = entry.entryHash;
    }

    return {
      isValid: true,
      verifiedCount: this.entries.length,
    };
  }

  /**
   * Exports audit log as a verifiable JSON structure for SIEM or external compliance audit.
   */
  public async exportAuditLogJson(): Promise<string> {
    const report = await this.verifyLogChain();
    const exportBundle = {
      title: "VAULT SSE Client Security & Cryptographic Audit Trail",
      exportedAt: new Date().toISOString(),
      generator: "VAULT W3C WebCrypto Native Client",
      integrity: {
        isValid: report.isValid,
        verifiedCount: report.verifiedCount,
        headHash: this.latestHash,
      },
      entries: this.entries,
    };
    return JSON.stringify(exportBundle, null, 2);
  }

  /**
   * Clears in-memory logs and resets hash chain.
   */
  public clear(): void {
    this.entries = [];
    this.latestHash = GENESIS_PREV_HASH;
  }

  /**
   * Serializes logs for encrypted persistence.
   */
  public exportState(): { entries: ClientSecurityLogEntry[]; latestHash: string } {
    return {
      entries: [...this.entries],
      latestHash: this.latestHash,
    };
  }

  /**
   * Restores state from persistent storage.
   */
  public importState(data: { entries: ClientSecurityLogEntry[]; latestHash: string }): void {
    if (Array.isArray(data.entries)) {
      this.entries = [...data.entries];
      this.latestHash = data.latestHash || (this.entries[this.entries.length - 1]?.entryHash ?? GENESIS_PREV_HASH);
    }
  }
}
