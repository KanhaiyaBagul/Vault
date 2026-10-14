# Project Roadmap: Verifiable Searchable Symmetric Encryption (SSE) Engine

**Project:** Verity / Vault  
**Domain:** Encrypted Databases / Cryptographic Engineering / Cloud Security  

### Official Problem Statement (Problem 2 — 2 of 5 Teams)
> **Problem Statement:** Storing sensitive enterprise documents in third-party cloud storage leaves proprietary data exposed to insider attacks, while standard end-to-end encryption completely breaks server-side keyword indexing and full-text search capabilities.  
> **Objective:** Construct a cryptographic search engine from scratch implementing Searchable Symmetric Encryption (using cryptographic trapdoors, blind indexes, and inverted index token hashing) that enables an untrusted server to execute substring or boolean keyword queries over ciphertext.  
> **Expected Outcome:** A server-client architecture where the client uploads fully encrypted document payloads along with encrypted search tokens. The server returns exact matching document IDs for search queries without learning the underlying keywords, the query contents, or the plaintext files (proven via an untrusted server audit log showing only opaque hashes and ciphertexts).

### 10-Year Clusion Code Modernization Directive
> [!IMPORTANT]
> The **Clusion** library (`k:/Coding Projects/Vault/Clusion`) is an academic Java codebase from 2014–2016. While its underlying mathematical SSE papers (Cash et al. 2Lev, DynRH forward privacy, Kamara-Moataz IEX boolean) are mathematically sound, **the raw implementation is 10 years old and cannot be used as-is**.
> 
> **Our engineering policy across all phases:**
> 1. **Discard Legacy Insecurities:** Completely eliminate deprecated `PBKDF2WithHmacSHA1`, malleable unauthenticated AES-CTR, and non-standard Bouncy Castle CMAC.
> 2. **Modern Production Primitives:** Implement native Web Crypto API (`SubtleCrypto`), `PBKDF2-HMAC-SHA256` (100k iter) + `HKDF-Expand`, and authenticated `AES-256-GCM` (IND-CCA2).
> 3. **Bridge Missing Capabilities:** Clusion has **zero verifiability**, **zero substring search**, and **zero audit logging**. We build Authenticated Inverted Indexes (Merkle trees), N-gram blind indexing, and tamper-evident audit logging from scratch.
> 4. **Modern Architecture:** Transform single-JVM `System.in` console loops into a real Client-Server architecture (React Client + Node.js/PostgreSQL Server).

---

## Phases Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 1: Cryptographic Primitives Engine & Key Derivation (CURRENT)    │
│ Web Crypto API, PBKDF2/HKDF domain separation, HMAC PRFs, AES-256-GCM  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 2: Client Indexer & Substring N-Gram Engine                      │
│ Document parsing, tokenization, 3-gram decomposition, inverted mapping │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 3: Blind Inverted Index & Forward-Secure Dynamic Multi-Map       │
│ Cash et al. 2Lev / DynRH token hashing, counter state, response-hiding │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 4: Verifiability Engine (Merkle Tree Proofs & Soundness)         │
│ Authenticated Inverted Index, Merkle proofs, anti-suppression check    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 5: Untrusted Server Backend & Zero-Knowledge Audit Logger        │
│ Node.js/Express REST server, blind query executor, tamper-evident log  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 6: Client CLI/Web UI, Boolean Search & End-to-End Verification   │
│ IEX boolean coordinator, document decryption, live attack simulations  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Phase Details

### Phase 1: Cryptographic Primitives Engine & Key Derivation
- **Status:** **In Planning (Active)**
- **Directory:** `Vault_planing/01-crypto-primitives/`
- **Goal:** Build the foundational cryptographic core in TypeScript using standard Web Crypto API (`SubtleCrypto`). Provide domain-separated key derivation from a user master password, deterministic PRF trapdoors, and authenticated document payload encryption.
- **Core Deliverables:**
  - `kdf.ts`: PBKDF2 key derivation with 5 domain-separated subkeys ($K_{trap}, K_{addr}, K_{mask}, K_{enc}, K_{auth}$).
  - `trapdoors.ts`: Deterministic HMAC-SHA256 PRF keyword tokens and blind index location labels.
  - `cipher.ts`: Authenticated AES-256-GCM document encryption/decryption with random IVs and integrity tags.
  - Automated test suite validating test vectors, tamper resistance, and bit-flip detection.

### Phase 2: Client Indexer & Substring N-Gram Engine
- **Status:** Backlog
- **Goal:** Extract text from client documents, normalize, and generate inverted index mappings supporting both exact keywords and arbitrary substring queries via 3-gram sliding windows.

### Phase 3: Blind Inverted Index & Dynamic Multi-Map
- **Status:** Backlog
- **Goal:** Adapt Clusion's `RH-2Lev` and `DynRH` to construct encrypted blind indexes where the server stores opaque tokens without learning document IDs or query terms. Forward-secure state management.

### Phase 4: Verifiability Engine & Cryptographic Proofs
- **Status:** Backlog
- **Goal:** Implement Authenticated Inverted Indexes (AII) with Merkle trees over postings lists to prove that search results returned by an untrusted cloud server are mathematically correct and complete (no dropped or fabricated IDs).

### Phase 5: Untrusted Server Backend & Audit Logger
- **Status:** Backlog
- **Goal:** Stand up the untrusted cloud REST microservice storing encrypted blobs, executing blind trapdoor evaluations over ciphertext, and producing tamper-evident audit logs showing only opaque hashes.

### Phase 6: Client Integration, Boolean Queries & Verification
- **Status:** Backlog
- **Goal:** Integrate end-to-end client search flows with Kamara-Moataz IEX boolean evaluation, automated verification tests, and simulated cloud insider attack demonstrations.
