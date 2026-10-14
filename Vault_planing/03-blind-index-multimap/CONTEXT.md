# Context: Phase 3 — Blind Inverted Index & Dynamic Multi-Map

**Phase:** Phase 3  
**Target:** Blind Inverted Index & Forward-Secure Dynamic Multi-Map Engine  
**Directory:** `Vault_planing/03-blind-index-multimap/`  
**Dependencies:** Phase 1 (`src/crypto/`), Phase 2 (`src/indexer/`)

---

## 1. Scope & Boundaries

### 1.1. In-Scope Deliverables
1. **Client State Manager (`src/engine/state_manager.ts`)**:
   - Manages persistent keyword insertion counts $\Sigma: \text{token} \to \text{count}$.
   - Provides thread-safe / atomic counter increments for forward privacy.
   - Serializes / deserializes state for client storage.
2. **Blind Index Entry Builder (`src/engine/blind_index.ts`)**:
   - `buildBlindIndexEntries(subkeys: VaultSubkeys, stateManager: StateManager, docId: string, tokens: string[]): Promise<BlindIndexUpdate>`
   - Computes opaque addresses $L_c = \text{PRF}(K_{addr}, tag_w \parallel c)$.
   - Computes response-hiding encrypted document references using $K_{enc}$.
   - Blinds document references using keystream masks $M_c$.
3. **Server Blind Multi-Map Store (`src/engine/server_store.ts`)**:
   - Untrusted server-side key-value database simulation.
   - `storeIndexEntries(entries: BlindIndexEntry[]): void`
   - `searchSingle(trapdoorHex: string, count: number): EncryptedPostingRecord[]`
   - `searchConjunctive(trapdoors: Array<{ trapdoorHex: string; count: number }>): EncryptedPostingRecord[]`
   - Zero access to cryptographic keys ($K_{trap}, K_{addr}, K_{mask}, K_{enc}$).
4. **Client SSE Coordinator & Resolver (`src/engine/client_engine.ts`)**:
   - `generateSearchTrapdoors(subkeys: VaultSubkeys, stateManager: StateManager, query: string, n = 3): Promise<SearchQueryPayload>`
   - `resolveResults(subkeys: VaultSubkeys, encryptedRecords: EncryptedPostingRecord[]): Promise<string[]>`
5. **Comprehensive Automated Test Suite (`tests/engine/`)**:
   - Forward privacy tests (verifying address unpredictability across updates).
   - Exact keyword search over blind index.
   - Substring search over blind index via 3-gram conjunctions.
   - Response-hiding verification (confirming server store contains zero plaintext words or document IDs).

### 1.2. Out-of-Scope (Deferred to Later Phases)
- Merkle root digests and verification proof paths (Phase 4).
- Production PostgreSQL tables and Express REST routes (Phase 5).

---

## 2. Core Architecture Contracts & TypeScript Types

```typescript
export interface BlindIndexEntry {
  addressHex: string;          // L_c: 64-char hex PRF address
  encryptedValueHex: string;   // V_c: Masked / encrypted document reference
  opaqueDocRef: string;        // Opaque document pointer hash for server-side set operations
}

export interface BlindIndexUpdate {
  docId: string;
  entries: BlindIndexEntry[];
}

export interface SearchTrapdoorToken {
  trapdoorHex: string;         // tag_w: 64-char hex
  trapdoorBytes: Uint8Array;   // 32-byte raw PRF token
  count: number;               // Current counter c from client state
}

export interface SearchQueryPayload {
  queryType: "EXACT_WORD" | "SUBSTRING_CONJUNCTIVE";
  tokens: SearchTrapdoorToken[];
}

export interface EncryptedPostingRecord {
  addressHex: string;
  encryptedValueHex: string;
  opaqueDocRef: string;
  counterIndex: number;
}
```

---

## 3. Information Leakage Fences

1. **Server Knowledge Bound**:
   - The server only observes: $L_c$ (opaque 256-bit hash), $V_c$ (opaque ciphertext block), and `opaqueDocRef`.
   - The server **cannot** learn:
     - The plaintext keyword or $n$-gram.
     - The plaintext document filename or identifier.
     - The document plaintext contents.
2. **Access Pattern Leakage**: The server only learns which encrypted rows are accessed and how many results match (the standard Cash et al. access pattern leakage).
