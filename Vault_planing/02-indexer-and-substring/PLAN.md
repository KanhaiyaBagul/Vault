# Plan: Phase 2 — Client Indexer & Substring N-Gram Engine

**Phase:** Phase 2  
**Target:** Client-Side Tokenization, Substring N-Gram Engine & Inverted Index  
**Directory:** `Vault_planing/02-indexer-and-substring/`  
**Outputs Target:** `src/indexer/` and `tests/indexer/`

---

## 1. Wave-Based Execution Strategy

```
┌────────────────────────────────────────────────────────┐
│ WAVE 1: Tokenizer & N-Gram Sliding Window Engine       │
│ Task 1.1: Text normalization & word extractor          │
│ Task 1.2: Character 3-Gram sliding window generator    │
│ Task 1.3: Unit tests for tokenizer & N-grams           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 2: Substring Query Decomposer & Candidate Pruner  │
│ Task 2.1: Query parser (exact vs. conjunctive n-grams) │
│ Task 2.2: Client false-positive candidate pruner       │
│ Task 2.3: Unit tests for query decomposition           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 3: Plaintext Inverted Index Multi-Map & Regression│
│ Task 3.1: Inverted index & forward index coordinator   │
│ Task 3.2: Module entry point (src/indexer/index.ts)    │
│ Task 3.3: Integration tests & full regression suite    │
└────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Task Breakdown

### Wave 1: Tokenizer & N-Gram Sliding Window Engine

#### Task 1.1: Text Normalization & Word Extractor (`src/indexer/tokenizer.ts`)
- **Functions to implement**:
  - `normalizeText(text: string): string`: Converts to lowercase, strips control characters, normalizes Unicode whitespace.
  - `extractWords(text: string): string[]`: Extracts individual alphanumeric tokens (`/[a-z0-9_-]+/g`), filtering out short noise.
- **Verification**: Tests validating handling of mixed casing, punctuation, symbols, and Unicode strings.

#### Task 1.2: Character N-Gram Generator (`src/indexer/ngrams.ts`)
- **Functions to implement**:
  - `generateNgrams(text: string, n = 3): string[]`: Generates 3-grams across normalized text.
  - `extractAllTokens(text: string, n = 3): { words: Set<string>; ngrams: Set<string>; allTokens: Set<string> }`: Unified extractor producing word tokens + $n$-grams.
- **Verification**: Tests validating sliding window bounds, handling short strings ($< n$), deduplication.

#### Task 1.3: Unit Tests (`tests/indexer/tokenizer.test.ts` & `tests/indexer/ngrams.test.ts`)
- **Verification**: Test edge cases (empty strings, single characters, strings shorter than $n$, repetitive characters like `"aaaa"`).

---

### Wave 2: Substring Query Decomposer & Candidate Pruner

#### Task 2.1: Substring Query Parser (`src/indexer/query_parser.ts`)
- **Functions to implement**:
  - `parseSearchQuery(query: string, n = 3): ParsedQuery`:
    - Normalizes query.
    - If $|query| < n$: Classified as `"EXACT_WORD"`.
    - If $|query| \ge n$: Classified as `"SUBSTRING_CONJUNCTIVE"`, decomposed into $L - n + 1$ overlapping 3-grams.
- **Verification**: Test query decomposition with known inputs (e.g., `"security"` $\to$ `["sec", "ecu", "cur", "uri", "rit", "ity"]`).

#### Task 2.2: Local Client Candidate Pruner
- **Functions to implement**:
  - `pruneFalsePositiveCandidates(query: string, candidates: Array<{ id: string; content: string }>): string[]`:
    - Filters decrypted candidate documents returning only those containing the exact contiguous query string.
- **Verification**: Tests validating that false positive candidates (documents that contain all 3-grams in separate disjoint locations) are correctly rejected.

---

### Wave 3: Inverted Index Multi-Map & Regression

#### Task 3.1: Plaintext Inverted Index (`src/indexer/inverted_index.ts`)
- **Class to implement**: `PlaintextInvertedIndex`
  - Inverted map: `Map<string, Set<string>>` (token $\to$ document IDs).
  - Forward map: `Map<string, Set<string>>` (document ID $\to$ tokens).
  - Methods: `addDocument(id, content)`, `removeDocument(id)`, `getPostings(token)`, `getAllTokens()`, `stats()`.
- **Verification**: Tests for incremental document additions, deletions, and postings list retrieval.

#### Task 3.2: Module Entry Point (`src/indexer/index.ts`)
- Exports all tokenizer, n-gram, query parser, and inverted index classes.

#### Task 3.3: Regression Suite
- Update `package.json` test script: `"test": "node --experimental-strip-types --test tests/**/*.test.ts"`.
- Run full regression suite verifying both Phase 1 crypto tests and Phase 2 indexer tests pass simultaneously.

---

## 3. Success Criteria Checklist

- [ ] Text normalization handles Unicode, casing, and punctuation consistently.
- [ ] 3-gram sliding window produces valid character trigrams without gaps.
- [ ] Queries $\ge 3$ characters decompose into deterministic conjunctive $n$-gram sets.
- [ ] Inverted index maps tokens to document IDs with $O(1)$ lookup time.
- [ ] Local client pruner successfully filters false-positive candidate documents.
- [ ] All automated unit and integration tests pass with 100% green status.
