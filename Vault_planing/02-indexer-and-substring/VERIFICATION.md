# Verification: Phase 2 — Client Indexer & Substring N-Gram Engine

**Phase:** Phase 2  
**Target:** Client-Side Tokenization, Substring N-Gram Engine & Inverted Index  
**Directory:** `Vault_planing/02-indexer-and-substring/`

---

## 1. Automated Verification Commands

```bash
# Run all Phase 2 and regression tests
npm test

# Run indexer specific tests
node --experimental-strip-types --test tests/indexer/*.test.ts
```

---

## 2. Test Scenarios & Acceptance Criteria

### Test Scenario 1: Normalization & Punctuation Stripping
- **Given**: Plaintext text with mixed casing, symbols, and whitespace:
  `"Enterprise Financial-Report #2026: Confidential!"`
- **When**: `normalizeText` and `extractWords` are executed.
- **Then**:
  - Normalized string is lowercase and trimmed.
  - Extracted words: `["enterprise", "financial-report", "2026", "confidential"]`.

---

### Test Scenario 2: 3-Gram Sliding Window Bounds
- **Given**: Keyword `"vault"`.
- **When**: `generateNgrams("vault", 3)` is executed.
- **Then**:
  - Emits exactly 3 trigrams: `["vau", "aut", "ult"]`.
  - For string `"ab"` (shorter than $n=3$), returns empty array `[]` without throwing.

---

### Test Scenario 3: Substring Query Decomposition
- **Given**: Search query `"financial"`.
- **When**: `parseSearchQuery("financial", 3)` is executed.
- **Then**:
  - Classified as `"SUBSTRING_CONJUNCTIVE"`.
  - Required tokens: `["fin", "ina", "nan", "anc", "nci", "cia", "ial"]` ($9 - 3 + 1 = 7$ trigrams).
- **Short Query Edge Case**:
  - For query `"id"` ($|Q| < 3$), classified as `"EXACT_WORD"` with `requiredTokens: ["id"]`.

---

### Test Scenario 4: End-to-End Plaintext Substring Matching
- **Given**: 3 test documents:
  - `doc1`: `"Confidential financial audit and tax records."`
  - `doc2`: `"Auditor general review of company accounts."`
  - `doc3`: `"Engineering roadmap and database architecture."`
- **When**:
  - All 3 documents are indexed in `PlaintextInvertedIndex`.
  - Substring search is performed for `"audit"`.
  - Trigrams for `"audit"` are `["aud", "udi", "dit"]`.
  - Intersection of matching documents across all 3 trigrams is computed.
- **Then**:
  - Candidate set returned: `["doc1", "doc2"]`.
  - `doc3` is excluded because it contains none of the trigrams.

---

### Test Scenario 5: Client-Side False-Positive Pruning
- **Given**:
  - `docA`: `"The auditor signed off on the audit."` (True positive for `"audit"`)
  - `docB`: `"An applaud for the credit."` (Contains `"aud"` from applaud, `"dit"` from credit, but NOT contiguous `"audit"`).
- **When**: `pruneFalsePositiveCandidates("audit", [docA, docB])` is executed.
- **Then**:
  - Returns `["docA"]`.
  - `docB` is pruned from the final verified result.
