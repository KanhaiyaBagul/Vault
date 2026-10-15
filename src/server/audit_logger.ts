/**
 * Tamper-Evident Zero-Knowledge Audit Logger
 * Maintains an append-only cryptographic hash chain (SHA-256) of all system operations.
 * Zero-Knowledge Property: The audit trail records ONLY opaque hashes, trapdoor tokens,
 * and ciphertexts — zero plaintexts or file titles are ever logged.
 * Zero external dependencies.
 */

import { bytesToHex, constantTimeEqual, hexToBytes, utf8Encode } from "../crypto/utils.ts";

export type AuditOperationType =
  | "SYSTEM_INIT"
  | "INDEX_DOCUMENT"
  | "SEARCH_QUERY"
  | "RETRIEVE_BLOB";

export interface AuditLogEntry {
  index: number;
  timestamp: number;
  operationType: AuditOperationType;
  opaqueDetails: Record<string, unknown>;
  detailsHash: string; // SHA-256 of deterministic JSON representation
  prevHash: string;    // SHA-256 hash of previous audit entry (or 64 zeros for genesis)
  entryHash: string;   // SHA-256 hash of this entry
}

export interface AuditVerificationReport {
  isChainValid: boolean;
  brokenIndex?: number;
  reason?: string;
  totalEntries: number;
  latestHash?: string;
}

/**
 * Computes deterministic SHA-256 hash of arbitrary details object.
 */
export async function computeDetailsHash(details: Record<string, unknown>): Promise<string> {
  // Sort keys alphabetically for canonical JSON representation
  const sortedKeys = Object.keys(details).sort();
  const sortedObj: Record<string, unknown> = {};
  for (const k of sortedKeys) {
    sortedObj[k] = details[k];
  }

  const jsonStr = JSON.stringify(sortedObj);
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    utf8Encode(jsonStr) as BufferSource
  );
  return bytesToHex(new Uint8Array(digest));
}

/**
 * Computes deterministic SHA-256 hash pointer for an audit entry:
 * entryHash = SHA-256("VAULT:AUDIT:" || index || ":" || timestamp || ":" || opType || ":" || detailsHash || ":" || prevHash)
 */
export async function computeAuditEntryHash(
  index: number,
  timestamp: number,
  opType: AuditOperationType,
  detailsHash: string,
  prevHash: string
): Promise<string> {
  const message = `VAULT:AUDIT:${index}:${timestamp}:${opType}:${detailsHash}:${prevHash}`;
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    utf8Encode(message) as BufferSource
  );
  return bytesToHex(new Uint8Array(digest));
}

/**
 * Append-only cryptographic hash chain logger.
 */
export class ZeroKnowledgeAuditLogger {
  private readonly chain: AuditLogEntry[] = [];
  private genesisInitialized = false;

  /**
   * Initializes the immutable Genesis entry if not already present.
   */
  public async ensureGenesis(): Promise<void> {
    if (this.genesisInitialized && this.chain.length > 0) {
      return;
    }

    const index = 0;
    const timestamp = 0; // Canonical genesis timestamp
    const opType: AuditOperationType = "SYSTEM_INIT";
    const details = { system: "VaultSSE", version: "1.0.0", protocol: "DynRH-AII" };
    const detailsHash = await computeDetailsHash(details);
    const prevHash = "0".repeat(64); // 256 bits of zeros

    const entryHash = await computeAuditEntryHash(
      index,
      timestamp,
      opType,
      detailsHash,
      prevHash
    );

    this.chain.push({
      index,
      timestamp,
      operationType: opType,
      opaqueDetails: details,
      detailsHash,
      prevHash,
      entryHash,
    });

    this.genesisInitialized = true;
  }

  /**
   * Appends an operation to the cryptographic audit chain.
   *
   * @param opType Type of operation performed
   * @param opaqueDetails Blinded operational metadata (strictly zero plaintext)
   * @param timestamp Optional override timestamp (defaults to Date.now())
   */
  public async logOperation(
    opType: AuditOperationType,
    opaqueDetails: Record<string, unknown>,
    timestamp = Date.now()
  ): Promise<AuditLogEntry> {
    await this.ensureGenesis();

    const index = this.chain.length;
    const prevEntry = this.chain[index - 1];
    const prevHash = prevEntry.entryHash;

    const detailsHash = await computeDetailsHash(opaqueDetails);
    const entryHash = await computeAuditEntryHash(
      index,
      timestamp,
      opType,
      detailsHash,
      prevHash
    );

    const entry: AuditLogEntry = {
      index,
      timestamp,
      operationType: opType,
      opaqueDetails: { ...opaqueDetails },
      detailsHash,
      prevHash,
      entryHash,
    };

    this.chain.push(entry);
    return entry;
  }

  /**
   * Returns a copy of all audit log entries.
   */
  public getEntries(): AuditLogEntry[] {
    return [...this.chain];
  }

  /**
   * Returns specific entry by index.
   */
  public getEntry(index: number): AuditLogEntry | undefined {
    return this.chain[index];
  }

  /**
   * Returns the latest hash in the chain (head pointer).
   */
  public latestHash(): string {
    if (this.chain.length === 0) {
      return "0".repeat(64);
    }
    return this.chain[this.chain.length - 1].entryHash;
  }

  /**
   * Returns total count of audit entries.
   */
  public size(): number {
    return this.chain.length;
  }

  /**
   * Cryptographically verifies the entire hash chain from Genesis to Head.
   * Pinpoints the exact index if any record has been modified, injected, or reordered.
   */
  public async verifyAuditChain(): Promise<AuditVerificationReport> {
    await this.ensureGenesis();

    for (let i = 0; i < this.chain.length; i++) {
      const entry = this.chain[i];

      // 1. Check index sequence
      if (entry.index !== i) {
        return {
          isChainValid: false,
          brokenIndex: i,
          reason: `Index sequence broken: entry has index ${entry.index}, expected ${i}`,
          totalEntries: this.chain.length,
        };
      }

      // 2. Check previous hash pointer
      if (i === 0) {
        if (entry.prevHash !== "0".repeat(64)) {
          return {
            isChainValid: false,
            brokenIndex: 0,
            reason: "Genesis prevHash must be 64 zeros",
            totalEntries: this.chain.length,
          };
        }
      } else {
        const expectedPrev = this.chain[i - 1].entryHash;
        if (
          !constantTimeEqual(
            hexToBytes(entry.prevHash),
            hexToBytes(expectedPrev)
          )
        ) {
          return {
            isChainValid: false,
            brokenIndex: i,
            reason: `Broken hash pointer at index ${i}: prevHash does not match entry ${i - 1}'s entryHash`,
            totalEntries: this.chain.length,
          };
        }
      }

      // 3. Recompute details hash
      const recomputedDetailsHash = await computeDetailsHash(entry.opaqueDetails);
      if (
        !constantTimeEqual(
          hexToBytes(entry.detailsHash),
          hexToBytes(recomputedDetailsHash)
        )
      ) {
        return {
          isChainValid: false,
          brokenIndex: i,
          reason: `Tampered opaqueDetails at index ${i}: detailsHash does not match content digest`,
          totalEntries: this.chain.length,
        };
      }

      // 4. Recompute entry hash
      const recomputedEntryHash = await computeAuditEntryHash(
        entry.index,
        entry.timestamp,
        entry.operationType,
        recomputedDetailsHash,
        entry.prevHash
      );

      if (
        !constantTimeEqual(
          hexToBytes(entry.entryHash),
          hexToBytes(recomputedEntryHash)
        )
      ) {
        return {
          isChainValid: false,
          brokenIndex: i,
          reason: `Tampered entryHash at index ${i}: stored hash does not match recomputed SHA-256 block hash`,
          totalEntries: this.chain.length,
        };
      }
    }

    return {
      isChainValid: true,
      totalEntries: this.chain.length,
      latestHash: this.latestHash(),
    };
  }
}
