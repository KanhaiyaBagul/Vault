/**
 * Client-Side Searchable Symmetric Encryption (SSE) Engine
 * Coordinates query parsing, trapdoor generation, server dispatch,
 * response-hiding unmasking/decryption, and client-side false-positive pruning.
 * Zero external dependencies.
 */

import type { VaultSubkeys } from "../crypto/kdf.ts";
import { bytesToHex } from "../crypto/utils.ts";
import { computeIndexAddress, computeKeywordTrapdoor } from "../crypto/trapdoors.ts";
import {
  parseSearchQuery,
  pruneFalsePositiveCandidates,
  type CandidateDocument,
} from "../indexer/query_parser.ts";
import { unmaskAndDecryptDocId } from "./blind_index.ts";
import { StateManager } from "./state_manager.ts";
import {
  ServerBlindStore,
  type EncryptedPostingRecord,
  type SearchQueryPayload,
  type SearchTrapdoorToken,
} from "./server_store.ts";

/**
 * Generates an encrypted search query payload from a user query string.
 * Decomposes substring queries into conjunctive N-grams or exact words,
 * generates PRF trapdoors, reads current state counters, and precomputes address labels.
 *
 * @param subkeys Client cryptographic subkey set
 * @param stateManager Client keyword counter state
 * @param query Plaintext user search query
 * @param n N-gram window size (defaults to 3)
 */
export async function generateSearchQueryPayload(
  subkeys: VaultSubkeys,
  stateManager: StateManager,
  query: string,
  n = 3
): Promise<SearchQueryPayload> {
  const parsed = parseSearchQuery(query, n);

  if (parsed.requiredTokens.length === 0) {
    return {
      queryType: parsed.queryType,
      tokens: [],
    };
  }

  const tokens: SearchTrapdoorToken[] = [];

  for (const token of parsed.requiredTokens) {
    const count = stateManager.getCount(token);
    const trapdoorBytes = await computeKeywordTrapdoor(subkeys.kTrap, token);
    const trapdoorHex = bytesToHex(trapdoorBytes);

    // Precompute blind address labels L_0 ... L_{count-1} for untrusted server lookup
    const addressHexList: string[] = [];
    for (let i = 0; i < count; i++) {
      const addr = await computeIndexAddress(subkeys.kAddr, trapdoorBytes, i);
      addressHexList.push(addr);
    }

    tokens.push({
      trapdoorHex,
      trapdoorBytes,
      count,
      addressHexList,
    });
  }

  return {
    queryType: parsed.queryType,
    tokens,
  };
}

/**
 * Unmasks and decrypts encrypted posting records returned by the untrusted server.
 * Uses the primary token's trapdoor tag and AES-256-GCM key to restore document IDs.
 *
 * @param subkeys Client cryptographic subkey set
 * @param primaryTrapdoorBytes Trapdoor bytes of the primary search token (token 0)
 * @param records Encrypted posting records returned by the server
 * @returns Array of unique plaintext document IDs
 */
export async function resolveSearchResults(
  subkeys: VaultSubkeys,
  primaryTrapdoorBytes: Uint8Array,
  records: EncryptedPostingRecord[]
): Promise<string[]> {
  const docIds: string[] = [];
  const seen = new Set<string>();

  for (const record of records) {
    const docId = await unmaskAndDecryptDocId(
      subkeys,
      primaryTrapdoorBytes,
      record.counterIndex,
      record.encryptedValueHex
    );

    if (!seen.has(docId)) {
      seen.add(docId);
      docIds.push(docId);
    }
  }

  return docIds;
}

/**
 * High-level end-to-end client search execution:
 * 1. Generates cryptographic search payload from query
 * 2. Checks client state (returns [] early if any required token was never indexed)
 * 3. Queries untrusted ServerBlindStore
 * 4. Resolves and decrypts candidate document IDs
 * 5. Optionally applies client-side candidate pruning if document content lookup is provided
 *
 * @param subkeys Client cryptographic subkey set
 * @param stateManager Client keyword counter state
 * @param serverStore Untrusted server blind store
 * @param query Plaintext user query
 * @param docContents Optional map of docId -> plaintext content for false-positive pruning
 * @param n N-gram window size (defaults to 3)
 */
export async function executeClientSearch(
  subkeys: VaultSubkeys,
  stateManager: StateManager,
  serverStore: ServerBlindStore,
  query: string,
  docContents?: Map<string, string>,
  n = 3
): Promise<string[]> {
  const payload = await generateSearchQueryPayload(subkeys, stateManager, query, n);

  if (payload.tokens.length === 0) {
    return [];
  }

  // If any required token has count 0 in client state, no document in the store can match
  for (const token of payload.tokens) {
    if (token.count === 0) {
      return [];
    }
  }

  // Execute query on untrusted server
  const records = await serverStore.searchConjunctiveTrapdoors(subkeys.kAddr, payload.tokens);
  if (records.length === 0) {
    return [];
  }

  // Resolve document IDs from primary token postings
  const primaryTokenBytes = payload.tokens[0].trapdoorBytes;
  const candidateDocIds = await resolveSearchResults(subkeys, primaryTokenBytes, records);

  // If document contents are available, prune false positive candidates
  if (docContents && docContents.size > 0) {
    const candidates: CandidateDocument[] = candidateDocIds.map((id) => ({
      id,
      content: docContents.get(id) ?? "",
    }));
    return pruneFalsePositiveCandidates(query, candidates);
  }

  return candidateDocIds;
}
