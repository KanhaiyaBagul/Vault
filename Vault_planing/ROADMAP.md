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
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 7: Linear UI/UX Redesign & Custom Color Palette System           │
│ DESIGN.md Linear aesthetic, Alabaster Grey, Racing Red, Black Cherry   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 8: Claude Warm-Editorial UI/UX with Luxury Swatch Palette        │
│ Warm tinted cream canvas, Soft Limestone, Terracotta Clay, Deep Rust   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Phase 9: Third-Party Cloud Storage Integration (ACTIVE)                │
│ AWS S3, Cloudflare R2, MinIO, Supabase REST & Local Disk Provider      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Phase Details

### Phase 1: Cryptographic Primitives Engine & Key Derivation
- **Status:** **COMPLETED** (24 / 24 automated tests passing)
- **Directory:** `Vault_planing/01-crypto-primitives/`
- **Goal:** Built the foundational cryptographic core in TypeScript using standard Web Crypto API (`SubtleCrypto`). Provides domain-separated key derivation from a user master password, deterministic PRF trapdoors, and authenticated document payload encryption.

### Phase 2: Client Indexer & Substring N-Gram Engine
- **Status:** **COMPLETED** (20 / 20 automated tests passing; 44 / 44 project total)
- **Directory:** `Vault_planing/02-indexer-and-substring/`
- **Goal:** Extracted text from client documents, normalized, and generated inverted index mappings supporting both exact keywords and arbitrary substring queries via 3-gram sliding windows. Provides client-side false-positive candidate pruning.

### Phase 3: Blind Inverted Index & Dynamic Multi-Map
- **Status:** **COMPLETED** (21 / 21 automated tests passing; 65 / 65 project total)
- **Directory:** `Vault_planing/03-blind-index-multimap/`
- **Goal:** Adapted Clusion's `RH-2Lev` and `DynRH` to construct encrypted blind indexes where the server stores opaque tokens without learning document IDs or query terms. Implemented forward-secure state management (`StateManager`), blind entry builder (`buildBlindIndexEntries`), untrusted multi-map store (`ServerBlindStore`), and client SSE query generator/resolver (`client_engine.ts`).

### Phase 4: Verifiability Engine & Cryptographic Proofs
- **Status:** **COMPLETED** (14 / 14 automated tests passing; 79 / 79 project total)
- **Directory:** `Vault_planing/04-verifiability-engine/`
- **Goal:** Implemented Authenticated Inverted Indexes (AII) with Merkle trees over postings lists to prove mathematically that search results returned by an untrusted cloud server are complete (zero dropped IDs), sound (zero fabricated/tampered IDs), and fresh (zero stale replays). Validated with an active adversary tamper test suite (`attacker_tamper.test.ts`).

### Phase 5: Untrusted Server Backend & Audit Logger
- **Status:** **COMPLETED** (11 / 11 automated tests passing; 90 / 90 project total)
- **Directory:** `Vault_planing/05-server-backend-audit/`
- **Goal:** Built the untrusted cloud REST microservice storing encrypted document blobs (`EncryptedBlobStore`), executing blind trapdoor evaluations over ciphertext (`ServerSearchController`), and producing tamper-evident zero-knowledge audit logs (`ZeroKnowledgeAuditLogger`) linking operations via SHA-256 hash chains.

### Phase 6: Client Integration, Interactive Web UI & Verification
- **Status:** **COMPLETED** (6 / 6 automated tests passing; 96 / 96 project total)
- **Directory:** `Vault_planing/06-client-integration-ui/`
- **Goal:** Integrate end-to-end client search flows with Kamara-Moataz IEX boolean evaluation, build an interactive split-screen web application dashboard with "Untrusted Cloud Lens", live Merkle proof verification badges, attacker simulation controls, and zero-knowledge audit log visualizers.

### Phase 7: Linear UI/UX Redesign & Custom Color Palette System
- **Status:** **COMPLETED** (96 / 96 project total)
- **Directory:** `Vault_planing/07-ui-ux-linear-redesign/`
- **Goal:** Redesigned the user interface according to DESIGN.md (Linear aesthetic) and the user's custom palette: Alabaster Grey (#D9D9D9), Racing Red (#DD0200), Black Cherry (#55100D), and Coffee Bean (#1A0706). Implemented layered charcoal/cherry surfaces, pill-shaped CTAs, tight radii, and refined typography.

### Phase 8: Claude Warm-Editorial UI/UX with Luxury Swatch Palette
- **Status:** **COMPLETED** (96 / 96 project total)
- **Directory:** `Vault_planing/08-claude-editorial-ui/`
- **Goal:** Restyled the user interface following Anthropic Claude's warm-editorial architecture, paired with the user's luxury swatch palette: Soft Limestone (#F0E6D8) canvas and cards, Terracotta Clay (#B5543A) CTAs, Deep Rust (#5A2E25) dark product chrome windows, and Olive Accent (#6F7F5F) for verified cryptographic proofs. Incorporates Cormorant Garamond display serif headlines, humanist Inter body, and 8px/12px geometric radii.

### Phase 9: Third-Party Cloud Storage Integration
- **Status:** **COMPLETED** (118 / 118 project total)
- **Directory:** `Vault_planing/09-cloud-storage-integration/`
- **Goal:** Implemented pluggable third-party cloud storage integration (AWS S3, Cloudflare R2, MinIO, Supabase Storage, and Local Disk Vault) where the untrusted cloud stores only opaque encrypted payloads (AES-256-GCM), and our client application retrieves, verifies, and decodes them locally. Includes runtime provider switching and a Cloud Connector UI drawer.
