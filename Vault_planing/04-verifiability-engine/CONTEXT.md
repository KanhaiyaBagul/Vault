# Context: Phase 4 — Verifiability Engine & Cryptographic Proofs

**Phase:** Phase 4  
**Target:** Cryptographically Verifiable Search via Merkle Trees & Authenticated Inverted Index  
**Directory:** `Vault_planing/04-verifiability-engine/`  
**Outputs Target:** `src/verifiability/` and `tests/verifiability/`  
**Dependencies:** Phase 1 (`src/crypto/`), Phase 2 (`src/indexer/`), Phase 3 (`src/engine/`)

---

## 1. Domain Problem & Scope

In Phase 3, we built the Blind Inverted Index allowing the untrusted server to execute search queries over ciphertext. However, an untrusted or compromised cloud server could act dishonestly:
1. **Omission Attack (Dropping Results)**: The server suppresses incriminating or critical documents by omitting them from search results.
2. **Fabrication Attack (Injecting Results)**: The server injects fake or unauthorized document pointers to waste client resources or frame a user.
3. **Replay Attack (Stale State)**: The server returns results corresponding to an older state before new documents were uploaded.

**Phase 4 Objective:**
Implement **Authenticated Inverted Indexes (AII)** using **Merkle Trees** and **HMAC-SHA256 Commitments** ($K_{auth}$) to prove that search results returned by the untrusted cloud server are:
- **Sound**: Every returned document reference is mathematically verified to be authentic and un-tampered.
- **Complete**: Zero matching documents have been omitted or dropped by the server.
- **Fresh**: The result set reflects the exact current state version without stale replays.

---

## 2. In-Scope Deliverables

1. **Merkle Tree Core (`src/verifiability/merkle_tree.ts`)**:
   - Deterministic leaf hashing for posting records ($L_c, \text{opaqueDocRef}, \text{counterIndex}$).
   - Binary Merkle Tree construction using native `SubtleCrypto` SHA-256.
   - Inclusion proof path generation and verification.
2. **Authenticated Inverted Index Engine (`src/verifiability/authenticated_index.ts`)**:
   - Builds per-token Merkle Trees over blind index postings.
   - Derives token commitments: $\text{Commit}_w = \text{HMAC}(K_{auth}, tag_w \parallel c_w \parallel R_w)$.
   - Manages client-side commitment accumulator table.
3. **Server Proof Generator (`src/verifiability/server_prover.ts`)**:
   - When serving search queries, untrusted server returns posting records alongside the Merkle tree root and verification proofs.
4. **Client Proof Verifier (`src/verifiability/client_verifier.ts`)**:
   - Validates completeness (cardinality matches committed $c_w$).
   - Validates soundness (recomputed root matches committed $R_w$, authenticated by $K_{auth}$).
   - Validates freshness (counter matches client state).
5. **Active Attacker Tamper Test Suite (`tests/verifiability/attacker_tamper.test.ts`)**:
   - Proves mathematically that dropped documents, fabricated documents, altered ciphertexts, and replayed states are 100% caught.
