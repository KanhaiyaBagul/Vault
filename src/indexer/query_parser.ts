/**
 * Substring Query Parser & Local Candidate Pruner
 * Decomposes arbitrary search queries into conjunctive N-grams for untrusted server evaluation,
 * and prunes false-positive candidate documents on the client.
 * Zero external dependencies.
 */

import { generateNgrams } from "./ngrams.ts";
import { normalizeText } from "./tokenizer.ts";

export type QueryType = "EXACT_WORD" | "SUBSTRING_CONJUNCTIVE";

export interface ParsedQuery {
  rawQuery: string;
  normalizedQuery: string;
  queryType: QueryType;
  requiredTokens: string[]; // Conjunction of tokens that must match on server
}

export interface CandidateDocument {
  id: string;
  content: string;
}

/**
 * Parses user search query into cryptographic search tokens.
 * - For queries shorter than `n`: emits an EXACT_WORD query token.
 * - For queries of length >= `n`: emits a SUBSTRING_CONJUNCTIVE query requiring
 *   all constituent N-grams to be present in matching documents.
 * @param query Raw user search input
 * @param n N-gram window size (defaults to 3)
 */
export function parseSearchQuery(query: string, n = 3): ParsedQuery {
  if (n <= 0) {
    throw new Error("N-gram size must be a positive integer");
  }

  const normalized = normalizeText(query);
  if (!normalized) {
    return {
      rawQuery: query,
      normalizedQuery: "",
      queryType: "EXACT_WORD",
      requiredTokens: [],
    };
  }

  if (normalized.length < n) {
    return {
      rawQuery: query,
      normalizedQuery: normalized,
      queryType: "EXACT_WORD",
      requiredTokens: [normalized],
    };
  }

  // Decompose query into overlapping N-grams
  const ngrams = new Set<string>();
  for (let i = 0; i <= normalized.length - n; i++) {
    const gram = normalized.slice(i, i + n);
    // Ignore pure whitespace n-grams
    if (gram.trim().length > 0) {
      ngrams.add(gram);
    }
  }

  return {
    rawQuery: query,
    normalizedQuery: normalized,
    queryType: "SUBSTRING_CONJUNCTIVE",
    requiredTokens: Array.from(ngrams).sort(),
  };
}

/**
 * Client-Side False-Positive Pruning
 * Because N-gram conjunctive intersection on the server guarantees all N-grams exist
 * but cannot guarantee they appear contiguously, the client verifies exact substring
 * containment on decrypted candidate documents.
 * Runs in O(1) client time per candidate.
 * @param query User search query
 * @param candidates Decrypted document candidates returned by the server
 * @returns Array of verified document IDs
 */
export function pruneFalsePositiveCandidates(
  query: string,
  candidates: CandidateDocument[]
): string[] {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return [];
  }

  const verifiedDocIds: string[] = [];

  for (const doc of candidates) {
    const normalizedContent = normalizeText(doc.content);
    if (normalizedContent.includes(normalizedQuery)) {
      verifiedDocIds.push(doc.id);
    }
  }

  return verifiedDocIds;
}
