# Plan: Phase 3 — Blind Inverted Index & Dynamic Multi-Map

**Phase:** Phase 3  
**Target:** Blind Inverted Index & Forward-Secure Dynamic Multi-Map Engine  
**Directory:** `Vault_planing/03-blind-index-multimap/`  
**Outputs Target:** `src/engine/` and `tests/engine/`

---

## 1. Wave-Based Execution Strategy

```
┌────────────────────────────────────────────────────────┐
│ WAVE 1: Client State & Blind Index Entry Builder       │
│ Task 1.1: Client State Manager (Σ[w] counter state)    │
│ Task 1.2: Blind Index Entry Builder (L_c & V_c tokens) │
│ Task 1.3: Unit tests for state & entry generation      │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 2: Untrusted Server Blind Multi-Map Store         │
│ Task 2.1: In-memory Server Blind Multi-Map Store       │
│ Task 2.2: Opaque trapdoor evaluator (Exact & Conjunction)
│ Task 2.3: Unit tests for server query execution        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 3: Client SSE Engine, Resolver & Regression       │
│ Task 3.1: Client Query Generator & Result Resolver     │
│ Task 3.2: Module entry point (src/engine/index.ts)     │
│ Task 3.3: End-to-end exact & substring search tests    │
│ Task 3.4: Full project regression verification         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Task Breakdown

### Wave 1: Client State & Blind Index Entry Builder

#### Task 1.1: Client State Manager (`src/engine/state_manager.ts`)
- **Class to implement**: `StateManager`
  - Internal map: `Map<string, number>` tracking token insertion count $\Sigma[w]$.
  - Methods: `getCount(token): number`, `incrementCount(token): number`, `getAllTokens(): string[]`, `exportState(): Record<string, number>`, `importState(data)`.
- **Verification**: Tests validating state preservation and deterministic counter increments.

#### Task 1.2: Blind Index Entry Builder (`src/engine/blind_index.ts`)
- **Functions to implement**:
  - `buildBlindIndexEntries(subkeys: VaultSubkeys, stateManager: StateManager, docId: string, tokens: string[]): Promise<BlindIndexEntry[]>`:
    - For each token $w$:
      - Get current counter $c$ and increment state.
      - Compute $tag_w = \text{computeKeywordTrapdoor}(K_{trap}, w)$.
      - Compute address $L_c = \text{computeIndexAddress}(K_{addr}, tag_w, c)$.
      - Encrypt document ID $c_{doc} = \text{encryptPayload}(K_{enc}, \text{UTF8}(docId))$.
      - Mask document reference using $M_c = \text{computeMask}(K_{mask}, tag_w, c)$.
      - Compute opaque doc reference hash: $H(K_{addr} \parallel docId)$ for server set intersection.
      - Emit `BlindIndexEntry`.
- **Verification**: Tests verifying address uniqueness, mask reversibility, and zero plaintext exposure.

#### Task 1.3: Unit Tests (`tests/engine/state_manager.test.ts` & `tests/engine/blind_index.test.ts`)

---

### Wave 2: Untrusted Server Blind Multi-Map Store

#### Task 2.1: Server Blind Multi-Map Store (`src/engine/server_store.ts`)
- **Class to implement**: `ServerBlindStore`
  - Internal table: `Map<string, EncryptedPostingRecord>` where keys are $L_c$.
  - Methods:
    - `insertEntries(entries: BlindIndexEntry[]): void`
    - `searchSingleTrapdoor(kAddr: CryptoKey, trapdoorBytes: Uint8Array, count: number): Promise<EncryptedPostingRecord[]>`
    - `searchConjunctiveTrapdoors(kAddr: CryptoKey, trapdoors: SearchTrapdoorToken[]): Promise<EncryptedPostingRecord[]>`
- **Verification**: Unit tests proving the server can evaluate exact and multi-token conjunctive queries using only opaque hashes.

---

### Wave 3: Client SSE Engine, Resolver & Regression

#### Task 3.1: Client Search Trapdoor Generator & Resolver (`src/engine/client_engine.ts`)
- **Functions to implement**:
  - `generateSearchQueryPayload(subkeys: VaultSubkeys, stateManager: StateManager, query: string, n = 3): Promise<SearchQueryPayload>`:
    - Decomposes query into tokens via Phase 2 `parseSearchQuery`.
    - Generates PRF trapdoors and retrieves current counters.
  - `resolveSearchResults(subkeys: VaultSubkeys, records: EncryptedPostingRecord[]): Promise<string[]>`:
    - Unmasks and decrypts document IDs using $K_{enc}$.
- **Verification**: End-to-end test validating that searching for a substring or keyword returns the exact matching plaintext document IDs.

#### Task 3.2: Module Entry Point (`src/engine/index.ts`)
- Re-exports all Phase 3 classes and functions.

#### Task 3.3: End-to-End Tests (`tests/engine/e2e_search.test.ts`)
- Tests complete flow:
  1. Client derives keys from password.
  2. Client indexes 5 sample documents (financial, engineering, legal).
  3. Uploads blind index to `ServerBlindStore`.
  4. Client queries exact word `"financial"` -> gets correct doc IDs.
  5. Client queries substring `"audit"` -> gets documents containing `"auditing"` and `"auditor"`.
  6. Client prunes false positives.
  7. Forward privacy test: Upload new document, verify past trapdoors do not match newly added address labels until new search token is generated.

#### Task 3.4: Full Project Regression
- Run `npm test` verifying all 3 phases pass together with 100% green status.

---

## 3. Success Criteria Checklist

- [ ] State Manager accurately maintains per-token insertion counters $\Sigma[w]$.
- [ ] Blind index generator outputs opaque 256-bit row addresses $L_c$ and masked values $V_c$.
- [ ] Server store evaluates single and conjunctive trapdoors without knowledge of plaintext keywords.
- [ ] Client resolver unmasks and decrypts document IDs with 100% fidelity.
- [ ] Substring search works end-to-end over ciphertext via 3-gram conjunctions.
- [ ] Forward privacy prevents correlation between new uploads and past queries.
- [ ] All automated tests pass with zero failures.
