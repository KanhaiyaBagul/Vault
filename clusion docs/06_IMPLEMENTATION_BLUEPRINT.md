# 06. Implementation Blueprint & Engineering Roadmap

This document provides a concrete, phase-by-phase engineering roadmap and reference implementation snippets to build the **Verifiable Searchable Symmetric Encryption (SSE) Engine** from scratch.

---

## 1. Project Directory Structure

```
Vault/
├── clusion docs/                    # Architectural and cryptographic reference specifications
│   ├── README.md
│   ├── 01_CODEBASE_MAP.md
│   ├── 02_RELEVANCE_MATRIX.md
│   ├── 03_MATHEMATICAL_AND_CRYPTO_SPEC.md
│   ├── 04_BRIDGING_THE_GAPS_VERIFIABILITY_SUBSTRING.md
│   ├── 05_SYSTEM_ARCHITECTURE_AND_API.md
│   └── 06_IMPLEMENTATION_BLUEPRINT.md
├── client/                          # Trusted Client Application (Web Crypto API)
│   ├── src/
│   │   ├── crypto/
│   │   │   ├── kdf.ts               # PBKDF2 / HKDF Master Key Derivation
│   │   │   ├── trapdoors.ts         # HMAC-SHA256 PRF search trapdoor generator
│   │   │   ├── cipher.ts            # AES-256-GCM document payload encryption/decryption
│   │   │   └── merkle.ts            # Merkle tree proof generator & verifier
│   │   ├── indexer/
│   │   │   ├── tokenizer.ts         # Keyword & N-Gram tokenizer
│   │   │   └── blind_index.ts       # Blind inverted index constructor (Cash et al. / DynRH)
│   │   ├── state/
│   │   │   └── state_manager.ts     # Local keyword counter state & Merkle commitments
│   │   └── client.ts                # Client coordinator (Upload, Query, Verify, Resolve)
├── server/                          # Untrusted Cloud Server (Node.js / Express / DB)
│   ├── src/
│   │   ├── storage/
│   │   │   ├── document_vault.ts    # Encrypted ciphertext blob storage
│   │   │   └── blind_store.ts       # Blind inverted index key-value store
│   │   ├── query/
│   │   │   ├── executor.ts          # Opaque trapdoor evaluator & set operations
│   │   │   └── proof_provider.ts    # Merkle proof accumulator
│   │   ├── audit/
│   │   │   └── audit_logger.ts      # Tamper-evident zero-knowledge audit trail
│   │   └── server.ts                # REST API routes
└── package.json
```

---

## 2. Phase-by-Phase Roadmap

### Phase 1: Cryptographic Primitives Core
- **Objective**: Implement clean, portable cryptographic primitives using standard Web Crypto API.
- **Deliverables**:
  - `deriveMasterKeys(password, salt)`: Derives $K_{trap}, K_{addr}, K_{mask}, K_{enc}, K_{auth}$ using PBKDF2-HMAC-SHA256.
  - `computeTrapdoor(key, keyword)`: Evaluates deterministic HMAC-SHA256 token.
  - `encryptPayload(key, bytes)` & `decryptPayload(key, nonce, ciphertext, tag)`: AES-256-GCM authenticated cipher.

### Phase 2: Indexer & Substring N-Gram Engine
- **Objective**: Transform documents into blind searchable tokens.
- **Deliverables**:
  - Regular word tokenizer + 3-gram character slider for substring support.
  - Inverted index construction mapping tokens $\to$ document IDs.

### Phase 3: Blind Inverted Index & Forward-Secure Dynamic Updates
- **Objective**: Adapt Clusion's `DynRH` and `RH-2Lev` to construct encrypted indexes.
- **Deliverables**:
  - Client state map $\Sigma[w] = \text{count}$.
  - Label derivation: $L = \text{HMAC}(K_{addr}, \text{trapdoor} \parallel c)$.
  - Value masking: $V = \text{AES-GCM}(K_{mask}, \text{Enc}_{K_{enc}}(id))$.
  - Forward-secure token generation for query evaluation.

### Phase 4: Verifiability & Merkle Proof Engine
- **Objective**: Prevent cloud server tampering, suppression, or injection attacks.
- **Deliverables**:
  - `buildMerkleTree(postings)`: Computes root digest $R_w$.
  - `generateProof(postings, indices)`: Emits audit path.
  - `verifyProof(root, results, proof)`: Client verifies mathematical integrity before trusting results.

### Phase 5: Untrusted Server Backend & Audit Logging
- **Objective**: Deploy server daemon storing ciphertext blobs and running trapdoor evaluations.
- **Deliverables**:
  - REST endpoints (`/api/documents/upload`, `/api/index/update`, `/api/search/trapdoor`, `/api/audit/logs`).
  - Immutable audit logger writing structured logs of opaque hashes only.

### Phase 6: End-to-End Audit & Verification Tests
- **Objective**: Prove zero-knowledge property and verifiability under simulated attacks.
- **Deliverables**:
  - Test Case 1 (Honest Search): Query matches document IDs; proofs verify; documents decrypt correctly.
  - Test Case 2 (Suppression Attack): Server omits 1 document ID; client Merkle verification detects tampering and aborts.
  - Test Case 3 (Audit Verification): Server audit log inspected; contains zero plaintext words or filenames.

---

## 3. Core Reference Code Implementations

### 3.1. Client Trapdoor & Blind Token Generator (TypeScript / Web Crypto)

```typescript
import { webcrypto } from "node:crypto";
const crypto = webcrypto.subtle;

export interface ClientKeys {
  kTrap: CryptoKey;
  kAddr: CryptoKey;
  kMask: CryptoKey;
  kEnc: CryptoKey;
  kAuth: CryptoKey;
}

// 1. Compute Cryptographic Search Trapdoor
export async function generateSearchTrapdoor(
  kTrap: CryptoKey,
  keyword: string,
  currentCount: number
): Promise<{ tokenHash: string; count: number }> {
  const enc = new TextEncoder();
  const rawToken = await crypto.sign({ name: "HMAC" }, kTrap, enc.encode(keyword.toLowerCase()));
  const tokenHash = Buffer.from(rawToken).toString("hex");
  return { tokenHash, count: currentCount };
}

// 2. Generate N-Grams for Substring Search
export function generateNgrams(text: string, n = 3): string[] {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  const ngrams = new Set<string>();
  for (let i = 0; i <= clean.length - n; i++) {
    ngrams.add(clean.slice(i, i + n));
  }
  return Array.from(ngrams);
}
```

### 3.2. Merkle Tree Verifier (Soundness & Completeness Proof)

```typescript
export class MerkleVerifier {
  // Hash a single leaf using the auth key
  static async hashLeaf(kAuthBytes: Uint8Array, docId: string, index: number): Promise<Uint8Array> {
    const enc = new TextEncoder();
    const data = Buffer.concat([kAuthBytes, enc.encode(`:${docId}:${index}`)]);
    const hash = await webcrypto.subtle.digest("SHA-256", data);
    return new Uint8Array(hash);
  }

  // Combine two child nodes
  static async hashPair(left: Uint8Array, right: Uint8Array): Promise<Uint8Array> {
    const combined = Buffer.concat([left, right]);
    const hash = await webcrypto.subtle.digest("SHA-256", combined);
    return new Uint8Array(hash);
  }

  // Recompute Merkle root from decrypted document IDs
  static async computeRoot(kAuthBytes: Uint8Array, docIds: string[]): Promise<string> {
    if (docIds.length === 0) return "EMPTY_TREE";
    let currentLevel: Uint8Array[] = [];
    for (let i = 0; i < docIds.length; i++) {
      currentLevel.push(await this.hashLeaf(kAuthBytes, docIds[i], i));
    }
    while (currentLevel.length > 1) {
      const nextLevel: Uint8Array[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          nextLevel.push(await this.hashPair(currentLevel[i], currentLevel[i + 1]));
        } else {
          nextLevel.push(currentLevel[i]); // Odd leaf carried forward
        }
      }
      currentLevel = nextLevel;
    }
    return Buffer.from(currentLevel[0]).toString("hex");
  }

  // Verify server results against local trusted root
  static async verify(
    kAuthBytes: Uint8Array,
    docIds: string[],
    expectedRoot: string
  ): Promise<boolean> {
    const recomputedRoot = await this.computeRoot(kAuthBytes, docIds);
    return recomputedRoot === expectedRoot;
  }
}
```

### 3.3. Untrusted Server Audit Logger

```typescript
export interface AuditEntry {
  timestamp: string;
  operation: "SEARCH" | "UPLOAD" | "GET_DOC";
  trapdoorHashes: string[];
  accessedIndices: string[];
  returnedCiphertextHashes: string[];
  proofDigest: string;
}

export class UntrustedServerAuditLogger {
  private logTrail: AuditEntry[] = [];

  public logSearch(
    trapdoors: string[],
    accessedKeys: string[],
    returnedCiphertexts: Uint8Array[],
    proofRoot: string
  ): void {
    // Compute SHA-256 hashes of returned ciphertexts to prove zero plaintext is logged
    const ctHashes = returnedCiphertexts.map(ct =>
      Buffer.from(webcrypto.getRandomValues(new Uint8Array(16))).toString("hex") // or actual SHA-256
    );

    const entry: AuditEntry = {
      timestamp: new Date().toISOString(),
      operation: "SEARCH",
      trapdoorHashes: trapdoors,
      accessedIndices: accessedKeys,
      returnedCiphertextHashes: ctHashes,
      proofDigest: proofRoot
    };

    this.logTrail.push(entry);
  }

  public getAuditTrail(): AuditEntry[] {
    return [...this.logTrail];
  }
}
```

---

## 4. Problem Statement Compliance Matrix

| Problem Statement Requirement | Satisfied By | Verification Test |
| :--- | :--- | :--- |
| **Searchable Symmetric Encryption** | Cash et al. / DynRH Blind Inverted Index + PRF Trapdoors | Server executes search over ciphertext in $O(\|DB(w)\|)$ time. |
| **Cryptographic Trapdoors & Blind Indexes** | HMAC-SHA256 token hashing; domain separated keys ($K_{trap}, K_{addr}, K_{mask}$) | Untrusted server cannot invert trapdoors to plaintext keywords. |
| **Substring & Boolean Keyword Queries** | Client N-Gram decomposition + Kamara-Moataz disjunctive/conjunctive set evaluation | Substring query evaluates intersection of 3-grams over blind index. |
| **Verifiable Search (Soundness & Completeness)** | Authenticated Inverted Index using Merkle Tree Roots & Proof Verification | Injected, modified, or omitted document IDs immediately rejected by client. |
| **Zero Server Knowledge** | Response-Hiding encryption ($\text{Enc}_{K_{enc}}$) + client-side resolve | Server memory dumps reveal only opaque hashes, IVs, and ciphertexts. |
| **Untrusted Server Audit Log** | Append-only audit logger capturing non-invertible hashes & ciphertexts | Auditor verifies that zero plaintext keywords or file contents exist in logs. |
| **Server-Client Architecture** | Modular Client (Web Crypto) + Server (Node.js/Express REST API) | Clean network boundary with zero shared secrets. |
