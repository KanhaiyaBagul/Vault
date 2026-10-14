# Context: Phase 2 — Client Indexer & Substring N-Gram Engine

**Phase:** Phase 2  
**Target:** Client-Side Tokenization, Substring N-Gram Engine & Inverted Index  
**Directory:** `Vault_planing/02-indexer-and-substring/`  
**Dependencies:** Phase 1 (`src/crypto/`)

---

## 1. Scope & Boundaries

### 1.1. In-Scope Deliverables
1. **Text Extraction & Normalization (`src/indexer/tokenizer.ts`)**:
   - `normalizeText(text: string): string`: Unicode case folding, control character stripping, whitespace regularization.
   - `extractWords(text: string): string[]`: Word boundary extraction for exact keyword indexing.
2. **N-Gram Sliding Window Engine (`src/indexer/ngrams.ts`)**:
   - `generateNgrams(text: string, n = 3): string[]`: Generates character $n$-grams from normalized text.
   - `extractAllTokens(text: string, n = 3): { words: string[]; ngrams: string[]; allTokens: string[] }`: Unified token extractor combining word tokens and $n$-grams.
3. **Substring Query Decomposer (`src/indexer/query_parser.ts`)**:
   - `decomposeSubstringQuery(query: string, n = 3): { queryType: "EXACT" | "SUBSTRING_CONJUNCTIVE"; tokens: string[] }`: Decomposes user search queries into the required token set for server evaluation.
   - `pruneFalsePositiveCandidates(query: string, candidateDocuments: Array<{ id: string; content: string }>): string[]`: Local client-side false-positive pruning over decrypted candidates.
4. **Inverted Index Data Structures (`src/indexer/inverted_index.ts`)**:
   - `class PlaintextInvertedIndex`:
     - `addDocument(docId: string, content: string): void`
     - `removeDocument(docId: string): void`
     - `getPostings(token: string): Set<string>`
     - `getAllTokens(): string[]`
     - `getDocumentTokens(docId: string): Set<string>`
     - `stats(): { documentCount: number; tokenCount: number; totalPostings: number }`
5. **Comprehensive Automated Test Suite (`tests/indexer/`)**:
   - Word tokenization and normalization tests.
   - 3-gram sliding window tests with boundary conditions.
   - Substring query decomposition tests.
   - False positive candidate pruning tests.
   - Inverted index add/remove/query consistency tests.

### 1.2. Out-of-Scope (Deferred to Later Phases)
- Cryptographic trapdoor derivation on tokens (Phase 3).
- Encrypted multi-map packing and masking (Phase 3).
- Merkle tree authentication over postings lists (Phase 4).
- Server database schema and REST API endpoints (Phase 5).

---

## 2. Core Architecture Contracts & TypeScript Types

```typescript
export interface DocumentInput {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface TokenizedDocument {
  docId: string;
  words: Set<string>;
  ngrams: Set<string>;
  allTokens: Set<string>;
  contentLength: number;
}

export type QueryType = "EXACT_WORD" | "SUBSTRING_CONJUNCTIVE";

export interface ParsedQuery {
  rawQuery: string;
  normalizedQuery: string;
  queryType: QueryType;
  requiredTokens: string[]; // List of tokens that must match (conjunction)
}

export interface InvertedIndexStats {
  documentCount: number;
  uniqueTokenCount: number;
  totalPostingsCount: number;
  averagePostingsPerToken: number;
}
```

---

## 3. Performance & Quality Guarantees

1. **Zero External Dependencies**: Pure TypeScript and Web APIs running identically in Node.js and modern browsers.
2. **Sub-linear Query Token Count**: For query $Q$ with length $L$, emits exactly $L - n + 1$ tokens, keeping network payload minimal.
3. **Deterministic Token Ordering**: Tokens within posting sets are stored in strict lexicographical order for downstream Merkle tree indexing.
