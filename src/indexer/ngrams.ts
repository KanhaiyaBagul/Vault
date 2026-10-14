/**
 * Character N-Gram Sliding Window Engine
 * Enables arbitrary substring search over encrypted inverted indexes.
 * Zero external dependencies.
 */

import { extractWords, normalizeText } from "./tokenizer.ts";

export interface DocumentTokens {
  words: string[];
  ngrams: string[];
  allTokens: string[];
}

/**
 * Generates character N-grams using a sliding window of length `n`.
 * Extracts n-grams from each word/token to maintain language boundaries.
 * @param text Raw or normalized input text
 * @param n Length of sliding window (defaults to 3 for trigrams)
 * @returns Sorted array of unique N-grams
 */
export function generateNgrams(text: string, n = 3): string[] {
  if (n <= 0) {
    throw new Error("N-gram size must be a positive integer");
  }

  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }

  const words = extractWords(normalized, n);
  const ngrams = new Set<string>();

  for (const word of words) {
    if (word.length < n) {
      continue;
    }
    for (let i = 0; i <= word.length - n; i++) {
      ngrams.add(word.slice(i, i + n));
    }
  }

  return Array.from(ngrams).sort();
}

/**
 * Extracts both discrete words and N-grams from text into a unified container
 * @param text Raw document text
 * @param n N-gram window size (defaults to 3)
 */
export function extractAllTokens(text: string, n = 3): DocumentTokens {
  const words = extractWords(text, 2);
  const ngrams = generateNgrams(text, n);

  const allTokensSet = new Set<string>();
  for (const w of words) {
    allTokensSet.add(w);
  }
  for (const ng of ngrams) {
    allTokensSet.add(ng);
  }

  return {
    words,
    ngrams,
    allTokens: Array.from(allTokensSet).sort(),
  };
}
