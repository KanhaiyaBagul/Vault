/**
 * Client-Side Text Normalizer and Word Tokenizer
 * Zero external dependencies.
 */

/**
 * Normalizes raw text for indexing and search:
 * 1. Unicode NFKC normalization
 * 2. Case folding to lowercase
 * 3. Replaces control characters and irregular whitespace with standard single spaces
 * 4. Trims leading and trailing whitespace
 */
export function normalizeText(text: string): string {
  if (!text) {
    return "";
  }
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\x00-\x1F\x7F-\x9F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extracts discrete word tokens from text.
 * Suitable for exact keyword indexing and inverted index construction.
 * @param text Input raw or normalized string
 * @param minLength Minimum word length to retain (defaults to 2)
 */
export function extractWords(text: string, minLength = 2): string[] {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }

  // Matches alphanumeric sequences including hyphens and underscores
  const rawWords = normalized.match(/[a-z0-9]+(?:[-_][a-z0-9]+)*/g) ?? [];
  const uniqueWords = new Set<string>();

  for (const word of rawWords) {
    if (word.length >= minLength) {
      uniqueWords.add(word);
    }
  }

  return Array.from(uniqueWords).sort();
}
