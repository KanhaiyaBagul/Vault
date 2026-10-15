# Plan: Phase 4 — Verifiability Engine & Cryptographic Proofs

**Phase:** Phase 4  
**Target:** Cryptographically Verifiable Search via Merkle Trees & Authenticated Inverted Index  
**Directory:** `Vault_planing/04-verifiability-engine/`  
**Outputs Target:** `src/verifiability/` and `tests/verifiability/`

---

## 1. Wave-Based Execution Strategy

```
┌────────────────────────────────────────────────────────┐
│ WAVE 1: Cryptographic Accumulator & Merkle Tree Core   │
│ Task 1.1: Merkle Tree Builder & Proof Generator        │
│ Task 1.2: Leaf hash canonicalization                   │
│ Task 1.3: Unit tests for Merkle tree and proof paths   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 2: Authenticated Index & Token Commitments        │
│ Task 2.1: Token Commitment generator via K_auth        │
│ Task 2.2: Client AuthenticatedIndex State Tracker      │
│ Task 2.3: Unit tests for commitment generation/check   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 3: Prover, Verifier & Active Attacker Defense     │
│ Task 3.1: Server Proof Bundler (server_prover.ts)      │
│ Task 3.2: Client Verification Engine (client_verifier) │
│ Task 3.3: Module entry point (src/verifiability/index) │
│ Task 3.4: Active attacker tamper test suite            │
│ Task 3.5: Full project regression verification         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Task Breakdown

### Wave 1: Cryptographic Accumulator & Merkle Tree Core

#### Task 1.1: Merkle Tree Core (`src/verifiability/merkle_tree.ts`)
- **Functions & Classes to implement**:
  - `computeLeafHash(addressHex: string, opaqueDocRef: string, counterIndex: number): Promise<string>`:
    - Canonical serialization: `SHA-256("VAULT:LEAF:" || addressHex || ":" || opaqueDocRef || ":" || counterIndex)`.
  - `buildMerkleTree(leafHashes: string[]): Promise<MerkleTree>`:
    - Builds binary tree with intermediate node hashes `SHA-256("VAULT:NODE:" || left || right)`.
    - Returns root hash and level layers.
  - `generateInclusionProof(tree: MerkleTree, leafIndex: number): MerkleProofPath`
  - `verifyInclusionProof(leafHash: string, proof: MerkleProofPath, rootHash: string): Promise<boolean>`
- **Verification**: `tests/verifiability/merkle_tree.test.ts`.

---

### Wave 2: Authenticated Index & Token Commitments

#### Task 2.1: Authenticated Inverted Index (`src/verifiability/authenticated_index.ts`)
- **Functions & Classes to implement**:
  - `computeTokenCommitment(kAuth: CryptoKey, tagBytes: Uint8Array, count: number, rootHashHex: string): Promise<string>`:
    - Computes `HMAC-SHA256(kAuth, tag || count || rootHashHex)`.
  - `AuthenticatedIndex`:
    - Tracks per-token `{ rootHashHex: string; commitmentHex: string; count: number }`.
    - Updated whenever document entries are added.
- **Verification**: `tests/verifiability/authenticated_index.test.ts`.

---

### Wave 3: Prover, Verifier & Active Attacker Defense

#### Task 3.1: Server Proof Bundler (`src/verifiability/server_prover.ts`)
- Untrusted server returns `VerifiableSearchResult`:
  - `records: EncryptedPostingRecord[]`
  - `rootHashHex: string`
  - `proofPaths?: MerkleProofPath[]`

#### Task 3.2: Client Proof Verifier (`src/verifiability/client_verifier.ts`)
- `verifySearchResult(subkeys: VaultSubkeys, tokenCommitment: TokenCommitment, bundle: VerifiableSearchResult): Promise<VerificationResult>`:
  - Validates Completeness (`bundle.records.length === tokenCommitment.count`).
  - Validates Soundness (recomputed Merkle root equals `tokenCommitment.rootHashHex`).
  - Validates Commitment Signature (`HMAC(kAuth, ...) === tokenCommitment.commitmentHex`).
  - Emits specific diagnostics on failure: `DROPPED_RECORDS`, `FABRICATED_RECORDS`, `TAMPERED_ROOT`, `TAMPERED_COMMITMENT`.

#### Task 3.3: Module Entry Point (`src/verifiability/index.ts`)
- Re-exports all Phase 4 classes and functions.

#### Task 3.4: Active Attacker Tamper Suite (`tests/verifiability/attacker_tamper.test.ts`)
- Proves mathematically that:
  - Dropping 1 result is detected immediately.
  - Injecting 1 fake result is detected immediately.
  - Modifying 1 byte in a ciphertext is caught.
  - Replaying stale results from an older state is caught.

---

## 3. Success Criteria Checklist

- [ ] Merkle Tree generates valid root digests and verifiable inclusion proofs.
- [ ] Token commitments authenticate count and tree root using $K_{auth}$.
- [ ] Client verifier detects dropped documents with 100% certainty (Completeness).
- [ ] Client verifier detects fabricated/altered documents with 100% certainty (Soundness).
- [ ] Substring queries verify across all constituent N-grams.
- [ ] All automated tests pass with zero failures.
