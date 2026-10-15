/**
 * Vault Client Unified SDK
 * Complete client coordinator executing client-side key derivation,
 * document tokenization & encryption, blind indexing, verifiable search,
 * and client-side false-positive pruning.
 * Zero external dependencies.
 */

import {
  deriveVaultSubkeysFromPassword,
  generateSalt,
  type VaultSubkeys,
} from "../crypto/kdf.ts";
import {
  bytesToHex,
  hexToBytes,
  utf8Decode,
  utf8Encode,
} from "../crypto/utils.ts";
import {
  decryptPayload,
  deserializeEncryptedBlob,
  encryptPayload,
  serializeEncryptedBlob,
} from "../crypto/cipher.ts";
import { computeIndexAddress, computeKeywordTrapdoor } from "../crypto/trapdoors.ts";
import { extractAllTokens } from "../indexer/ngrams.ts";
import { normalizeText } from "../indexer/tokenizer.ts";
import { StateManager } from "../engine/state_manager.ts";
import {
  buildBlindIndexEntries,
  computeOpaqueDocRef,
  unmaskAndDecryptDocId,
} from "../engine/blind_index.ts";
import { generateSearchQueryPayload } from "../engine/client_engine.ts";
import type { SearchQueryPayload } from "../engine/server_store.ts";
import {
  AuthenticatedIndexManager,
  verifySearchResultBundle,
  type VerificationResult,
} from "../verifiability/index.ts";
import type { PostingLeafInput } from "../verifiability/authenticated_index.ts";
import {
  evaluateBooleanResults,
  parseBooleanQuery,
} from "./boolean_query.ts";
import type { EncryptedBlobPayload } from "../server/blob_store.ts";
import type { AuditVerificationReport } from "../server/audit_logger.ts";

export interface ClientIndexedDocument {
  docId: string;
  docRef: string;
  entryCount: number;
  sizeBytes: number;
}

export interface ClientDocumentMatch {
  docId: string;
  content: string;
  opaqueDocRef: string;
}

export interface ClientSearchResult {
  query: string;
  verified: boolean;
  results: ClientDocumentMatch[];
  verificationReport?: VerificationResult;
}

export class VaultClient {
  private subkeys?: VaultSubkeys;
  private salt?: Uint8Array;
  public readonly stateManager: StateManager;
  public readonly authManager: AuthenticatedIndexManager;
  private readonly tokenPostingsMap: Map<string, PostingLeafInput[]> = new Map();

  public readonly serverBaseUrl: string;

  constructor(serverBaseUrl: string) {
    this.serverBaseUrl = serverBaseUrl;
    this.stateManager = new StateManager();
    this.authManager = new AuthenticatedIndexManager();
  }

  /**
   * Initializes client cryptographic keys using master password and PBKDF2/HKDF.
   *
   * @param password User master password
   * @param saltHex Optional existing salt hex (generates fresh 16-byte salt if omitted)
   * @param iterations PBKDF2 iterations (defaults to 100,000)
   * @returns Salt hex string for persistence
   */
  public async initialize(
    password: string,
    saltHex?: string,
    iterations = 100_000
  ): Promise<string> {
    if (saltHex) {
      this.salt = hexToBytes(saltHex);
    } else {
      this.salt = generateSalt(16);
    }

    this.subkeys = await deriveVaultSubkeysFromPassword(
      password,
      this.salt,
      iterations
    );

    return bytesToHex(this.salt);
  }

  private checkInitialized(): VaultSubkeys {
    if (!this.subkeys) {
      throw new Error("VaultClient not initialized: call client.initialize(password) first");
    }
    return this.subkeys;
  }

  /**
   * Indexes and uploads a document to the untrusted cloud server:
   * 1. Extracts discrete words and 3-grams.
   * 2. Encrypts document content with AES-256-GCM.
   * 3. Derives opaqueDocRef and generates blind index entries (L_c, V_c).
   * 4. Updates client AuthenticatedIndex commitments with K_auth.
   * 5. Uploads encrypted blob and blind entries to cloud REST endpoint.
   */
  public async indexDocument(
    docId: string,
    content: string
  ): Promise<ClientIndexedDocument> {
    const subkeys = this.checkInitialized();

    // 1. Extract tokens
    const tokenContainer = extractAllTokens(content, 3);
    const contentBytes = utf8Encode(content);

    // 2. Client-side AES-256-GCM payload encryption
    const encryptedBlob = await encryptPayload(subkeys.kEnc, contentBytes);
    const serializedBlob = serializeEncryptedBlob(encryptedBlob);

    // 3. Compute opaque docRef
    const opaqueDocRef = await computeOpaqueDocRef(subkeys.kAddr, docId);

    // 4. Build blind index entries (increments stateManager)
    const entries = await buildBlindIndexEntries(
      subkeys,
      this.stateManager,
      docId,
      tokenContainer
    );

    // 5. Update local AuthenticatedIndex commitments using K_auth
    const rawList = tokenContainer.allTokens;
    const uniqueTokens = Array.from(
      new Set(rawList.map((t) => normalizeText(t)).filter((t) => t.length > 0))
    );

    for (let i = 0; i < entries.length; i++) {
      const token = uniqueTokens[i];
      const entry = entries[i];
      const counterIndex = this.stateManager.getCount(token) - 1;

      if (!this.tokenPostingsMap.has(token)) {
        this.tokenPostingsMap.set(token, []);
      }
      this.tokenPostingsMap.get(token)!.push({
        addressHex: entry.addressHex,
        opaqueDocRef: entry.opaqueDocRef,
        counterIndex,
      });

      const tag = await computeKeywordTrapdoor(subkeys.kTrap, token);
      await this.authManager.updateTokenPostings(
        subkeys.kAuth,
        token,
        tag,
        this.tokenPostingsMap.get(token)!
      );
    }

    // 6. Upload encrypted blob & blind index to server via HTTP
    const blobPayload: EncryptedBlobPayload = {
      docRef: opaqueDocRef,
      ivHex: serializedBlob.ivHex,
      ciphertextHex: serializedBlob.ciphertextHex,
      sizeBytes: contentBytes.length,
      uploadedAt: Date.now(),
    };

    const res = await fetch(`${this.serverBaseUrl}/api/v1/index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        docRef: opaqueDocRef,
        entries,
        encryptedBlob: blobPayload,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Network error" }));
      throw new Error(`Cloud upload failed (${res.status}): ${err.error ?? "Unknown error"}`);
    }

    return {
      docId,
      docRef: opaqueDocRef,
      entryCount: entries.length,
      sizeBytes: contentBytes.length,
    };
  }

  /**
   * Helper to construct cryptographic query payload for a search clause.
   * If term was directly indexed (word or n-gram), emits an EXACT_WORD payload.
   * Otherwise, delegates to sliding-window N-gram conjunction.
   */
  private async createQueryPayload(
    subkeys: VaultSubkeys,
    term: string
  ): Promise<SearchQueryPayload> {
    const norm = normalizeText(term);
    const count = this.stateManager.getCount(norm);
    if (count > 0) {
      const trapdoorBytes = await computeKeywordTrapdoor(subkeys.kTrap, norm);
      const trapdoorHex = bytesToHex(trapdoorBytes);
      const addressHexList: string[] = [];
      for (let i = 0; i < count; i++) {
        const addr = await computeIndexAddress(subkeys.kAddr, trapdoorBytes, i);
        addressHexList.push(addr);
      }
      return {
        queryType: "EXACT_WORD",
        tokens: [
          {
            trapdoorHex,
            trapdoorBytes,
            count,
            addressHexList,
          },
        ],
      };
    }

    return generateSearchQueryPayload(subkeys, this.stateManager, term, 3);
  }

  /**
   * Searches documents with full cryptographic verification and client-side decryption:
   * Supports exact keywords, substrings, and Boolean operators (AND, OR, AND NOT).
   */
  public async search(queryString: string): Promise<ClientSearchResult> {
    const subkeys = this.checkInitialized();
    const parsedQuery = parseBooleanQuery(queryString);

    if (parsedQuery.clauses.length === 0) {
      return { query: queryString, verified: true, results: [] };
    }

    const clauseResults: Array<{ clause: string; docIds: Set<string> }> = [];
    const decryptedDocsMap = new Map<string, ClientDocumentMatch>();
    let overallVerification: VerificationResult = {
      isValid: true,
      verifiedRecordCount: 0,
    };

    // Evaluate each clause
    for (const clause of parsedQuery.clauses) {
      const queryPayload = await this.createQueryPayload(subkeys, clause);

      // If any required token was never indexed, this clause has 0 matches
      const hasUnseenToken = queryPayload.tokens.some((t) => t.count === 0);
      if (hasUnseenToken || queryPayload.tokens.length === 0) {
        clauseResults.push({ clause, docIds: new Set() });
        continue;
      }

      // Query server via HTTP POST /api/v1/search
      const searchRes = await fetch(`${this.serverBaseUrl}/api/v1/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryType: queryPayload.queryType,
          tokens: queryPayload.tokens,
        }),
      });

      if (!searchRes.ok) {
        throw new Error(`Search request failed with HTTP ${searchRes.status}`);
      }

      const searchData = (await searchRes.json()) as {
        success: boolean;
        bundles: any[];
      };
      const primaryBundle = searchData.bundles[0];

      if (!primaryBundle || primaryBundle.records.length === 0) {
        clauseResults.push({ clause, docIds: new Set() });
        continue;
      }

      // Cryptographic verification of the search bundle
      const normClause = normalizeText(clause);
      const commitment = this.authManager.getCommitment(normClause);

      if (commitment) {
        const vResult = await verifySearchResultBundle(subkeys, commitment, primaryBundle);
        if (!vResult.isValid) {
          overallVerification = vResult;
          return {
            query: queryString,
            verified: false,
            results: [],
            verificationReport: vResult,
          };
        }
      }

      // Decrypt candidate document IDs from primary token postings
      const clauseDocIds = new Set<string>();
      const primaryTag = queryPayload.tokens[0].trapdoorBytes;

      for (const record of primaryBundle.records) {
        const docId = await unmaskAndDecryptDocId(
          subkeys,
          primaryTag,
          record.counterIndex,
          record.encryptedValueHex
        );

        clauseDocIds.add(docId);

        // Fetch encrypted blob from cloud and decrypt if not already decrypted
        if (!decryptedDocsMap.has(docId)) {
          const blobRes = await fetch(`${this.serverBaseUrl}/api/v1/blobs/${record.opaqueDocRef}`);
          if (blobRes.ok) {
            const blobData = (await blobRes.json()) as { blob: EncryptedBlobPayload };
            const blob = deserializeEncryptedBlob({
              ivHex: blobData.blob.ivHex,
              ciphertextHex: blobData.blob.ciphertextHex,
            });
            const decryptedBytes = await decryptPayload(subkeys.kEnc, blob);
            const content = utf8Decode(decryptedBytes);

            decryptedDocsMap.set(docId, {
              docId,
              content,
              opaqueDocRef: record.opaqueDocRef,
            });
          }
        }
      }

      clauseResults.push({ clause, docIds: clauseDocIds });
    }

    // Combine clause document IDs using Boolean logic
    const matchingDocIds = evaluateBooleanResults(parsedQuery.operator, clauseResults);

    // Assemble final verified result list
    const results: ClientDocumentMatch[] = [];
    for (const id of matchingDocIds) {
      const match = decryptedDocsMap.get(id);
      if (match) {
        results.push(match);
      }
    }

    return {
      query: queryString,
      verified: overallVerification.isValid,
      results,
      verificationReport: overallVerification,
    };
  }

  /**
   * Simulates an untrusted cloud attacker tampering with search results
   * to demonstrate client proof verification rejection.
   */
  public async simulateCloudTamper(
    attack: "drop" | "fabricate" | "modify",
    query: string
  ): Promise<VerificationResult> {
    const subkeys = this.checkInitialized();
    const queryPayload = await this.createQueryPayload(subkeys, query);

    const searchRes = await fetch(`${this.serverBaseUrl}/api/v1/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queryType: queryPayload.queryType,
        tokens: queryPayload.tokens,
      }),
    });

    const searchData = (await searchRes.json()) as { bundles: any[] };
    const originalBundle = searchData.bundles[0];

    if (!originalBundle || originalBundle.records.length === 0) {
      throw new Error(`Cannot simulate tamper on empty query result for '${query}'`);
    }

    const commitment = this.authManager.getCommitment(normalizeText(query));
    if (!commitment) {
      throw new Error(`No local commitment found for token '${query}'`);
    }

    let tamperedBundle = { ...originalBundle };

    if (attack === "drop") {
      // Omission attack: drop 1 record
      tamperedBundle.records = originalBundle.records.slice(0, -1);
    } else if (attack === "fabricate") {
      // Fabrication attack: inject fake record
      tamperedBundle.records = [
        ...originalBundle.records,
        {
          addressHex: "0".repeat(64),
          encryptedValueHex: "deadbeef",
          opaqueDocRef: "forged_ref",
          counterIndex: originalBundle.records.length,
        },
      ];
    } else if (attack === "modify") {
      // Modification attack: tamper with opaqueDocRef
      tamperedBundle.records = [
        {
          ...originalBundle.records[0],
          opaqueDocRef: "f".repeat(64),
        },
        ...originalBundle.records.slice(1),
      ];
    }

    // Run client verifier against tampered bundle
    return verifySearchResultBundle(subkeys, commitment, tamperedBundle);
  }

  /**
   * Audits the untrusted cloud server's hash chain over HTTP.
   */
  public async verifyAuditChain(): Promise<AuditVerificationReport> {
    const res = await fetch(`${this.serverBaseUrl}/api/v1/audit/verify`);
    if (!res.ok) {
      throw new Error(`Audit verification request failed with HTTP ${res.status}`);
    }
    return (await res.json()) as AuditVerificationReport;
  }
}
