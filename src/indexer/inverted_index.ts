/**
 * Plaintext Inverted Index Engine
 * Provides multi-map token indexing, forward mapping, and candidate query intersection.
 * Serves as the pre-encryption inverted index representation for Cash et al. and DynRH SSE.
 * Zero external dependencies.
 */

import { extractAllTokens } from "./ngrams.ts";
import { parseSearchQuery } from "./query_parser.ts";
import { normalizeText } from "./tokenizer.ts";

export interface InvertedIndexStats {
  documentCount: number;
  uniqueTokenCount: number;
  totalPostingsCount: number;
  averagePostingsPerToken: number;
}

export class PlaintextInvertedIndex {
  // Inverted multi-map: Token -> Set of Document IDs
  private invertedMap = new Map<string, Set<string>>();

  // Forward index: Document ID -> Set of Tokens contained in Document
  private forwardMap = new Map<string, Set<string>>();

  /**
   * Adds or updates a document in the inverted index.
   * Extracts both discrete word tokens and N-grams for substring capability.
   * @param docId Unique document identifier
   * @param content Plaintext document body
   * @param n N-gram window size (defaults to 3)
   */
  public addDocument(docId: string, content: string, n = 3): void {
    if (!docId) {
      throw new Error("Document ID cannot be empty");
    }

    // If document already exists, remove it first to handle updates cleanly
    if (this.forwardMap.has(docId)) {
      this.removeDocument(docId);
    }

    const { allTokens } = extractAllTokens(content, n);
    const tokenSet = new Set<string>(allTokens);

    // Update forward index
    this.forwardMap.set(docId, tokenSet);

    // Update inverted multi-map
    for (const token of tokenSet) {
      let postings = this.invertedMap.get(token);
      if (!postings) {
        postings = new Set<string>();
        this.invertedMap.set(token, postings);
      }
      postings.add(docId);
    }
  }

  /**
   * Removes a document from the inverted index and cleans up its postings
   * @param docId Unique document identifier to delete
   */
  public removeDocument(docId: string): void {
    const tokens = this.forwardMap.get(docId);
    if (!tokens) {
      return;
    }

    for (const token of tokens) {
      const postings = this.invertedMap.get(token);
      if (postings) {
        postings.delete(docId);
        if (postings.size === 0) {
          this.invertedMap.delete(token);
        }
      }
    }

    this.forwardMap.delete(docId);
  }

  /**
   * Retrieve matching document IDs for an exact token (word or n-gram)
   * @param token Search token
   * @returns Set of matching document IDs (or empty set if token not found)
   */
  public getPostings(token: string): Set<string> {
    const normalized = normalizeText(token);
    return new Set(this.invertedMap.get(normalized) ?? []);
  }

  /**
   * Simulates the server-side conjunctive N-gram substring lookup
   * Computes the set intersection across all N-grams required for the query string.
   * @param query Search query
   * @param n N-gram window size (defaults to 3)
   * @returns Array of candidate document IDs containing all query tokens
   */
  public searchSubstring(query: string, n = 3): string[] {
    const parsed = parseSearchQuery(query, n);
    if (parsed.requiredTokens.length === 0) {
      return [];
    }

    let intersection: Set<string> | null = null;

    for (const token of parsed.requiredTokens) {
      const postings = this.getPostings(token);
      if (postings.size === 0) {
        return []; // If any required n-gram has 0 matches, intersection is empty
      }

      if (intersection === null) {
        intersection = new Set(postings);
      } else {
        const nextIntersection = new Set<string>();
        for (const id of intersection) {
          if (postings.has(id)) {
            nextIntersection.add(id);
          }
        }
        intersection = nextIntersection;
        if (intersection.size === 0) {
          return [];
        }
      }
    }

    return Array.from(intersection ?? []).sort();
  }

  /**
   * Get all tokens contained in a specific document
   */
  public getDocumentTokens(docId: string): Set<string> {
    return new Set(this.forwardMap.get(docId) ?? []);
  }

  /**
   * Get all unique indexed tokens across the entire database
   */
  public getAllTokens(): string[] {
    return Array.from(this.invertedMap.keys()).sort();
  }

  /**
   * Number of indexed documents
   */
  public get documentCount(): number {
    return this.forwardMap.size;
  }

  /**
   * Number of unique indexed tokens
   */
  public get tokenCount(): number {
    return this.invertedMap.size;
  }

  /**
   * Comprehensive database metrics
   */
  public stats(): InvertedIndexStats {
    let totalPostings = 0;
    for (const postings of this.invertedMap.values()) {
      totalPostings += postings.size;
    }

    const uniqueTokens = this.invertedMap.size;
    return {
      documentCount: this.forwardMap.size,
      uniqueTokenCount: uniqueTokens,
      totalPostingsCount: totalPostings,
      averagePostingsPerToken: uniqueTokens > 0 ? totalPostings / uniqueTokens : 0,
    };
  }
}
