# Verification: Phase 3 — Blind Inverted Index & Dynamic Multi-Map

**Phase:** Phase 3  
**Target:** Blind Inverted Index & Forward-Secure Dynamic Multi-Map Engine  
**Directory:** `Vault_planing/03-blind-index-multimap/`

---

## 1. Automated Verification Commands

```bash
# Run all project unit and integration tests
npm test

# Run Phase 3 specific engine tests
node --experimental-strip-types --test tests/engine/*.test.ts
```

---

## 2. Test Scenarios & Acceptance Criteria

### Test Scenario 1: State Counter Increments & Persistence
- **Given**: Fresh `StateManager`.
- **When**:
  - `incrementCount("audit")` is called 3 times.
- **Then**:
  - Returned counter values are $0, 1, 2$.
  - State exported to JSON and imported into a new `StateManager` preserves `getCount("audit") == 3`.

---

### Test Scenario 2: Zero Plaintext Exposure in Blind Index Entries
- **Given**: Document `"doc_fin_01"` with content `"quarterly revenue report"`.
- **When**: `buildBlindIndexEntries` produces entries for server upload.
- **Then**:
  - All `addressHex` values are 64-character uniform hexadecimal strings.
  - All `encryptedValueHex` values are opaque encrypted bytes.
  - A substring search for `"revenue"` or `"doc_fin_01"` in the serialized JSON output finds **zero occurrences**.

---

### Test Scenario 3: End-to-End Exact Keyword Search over Blind Index
- **Given**:
  - Document 1: `"Secret corporate budget allocation."`
  - Document 2: `"Engineering design for cryptographic engine."`
- **When**:
  - Documents are indexed in `ServerBlindStore`.
  - Client queries `"budget"`.
- **Then**:
  - Server matches 1 entry without learning the word `"budget"`.
  - Client resolves result to `["doc1"]`.

---

### Test Scenario 4: End-to-End Substring Search over Ciphertext
- **Given**:
  - Document A: `"Reviewing taxation laws and tax-free investments."`
  - Document B: `"Company syntaxes and coding style."`
  - Document C: `"Completely unrelated contents."`
- **When**:
  - Client queries substring `"tax"`.
  - Decomposes into 3-gram `"tax"`.
- **Then**:
  - Server evaluates blind index rows matching `"tax"`.
  - Client resolves results to `["docA", "docB"]`.
  - `docC` is excluded.

---

### Test Scenario 5: Forward Privacy Verification
- **Given**: An untrusted server that recorded the search trapdoor for `"crypto"` at time $T_1$.
- **Action**:
  - Document 1 contains `"crypto"`. Counter $c = 0 \to 1$.
  - Client queries `"crypto"` with count 1. Server returns `doc1`.
  - At time $T_2$, Document 2 containing `"crypto"` is uploaded. Counter $c = 1 \to 2$.
  - Document 2's address is $L_1 = \text{PRF}(K_{addr}, tag \parallel 1)$.
- **Verification**:
  - The server **cannot** locate Document 2 using the old search token $(tag, \text{count}=1)$ because $L_1$ was never evaluated or revealed.
  - Only when the client issues a new query with $\text{count}=2$ does the server discover Document 2.

---

### Test Scenario 6: Response-Hiding Integrity
- **Given**: `ServerBlindStore` containing 10 indexed documents.
- **When**: Memory dump of `ServerBlindStore` is inspected.
- **Then**:
  - Contains zero plaintext file paths, filenames, or content strings.
  - All keys are 256-bit PRF hashes; all values are AES-GCM ciphertexts.
