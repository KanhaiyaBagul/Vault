# Clusion Documentation & SSE Extraction Blueprint

This directory (`clusion docs/`) contains the complete architectural map, cryptographic specifications, algorithm extractions, and bridging blueprints derived from the **Clusion** library (`k:/Coding Projects/Vault/Clusion`), specifically tailored to building the **Verifiable Searchable Symmetric Encryption (SSE) Engine**.

---

## Executive Summary & Problem Statement Alignment

### The Problem Statement
> **Verifiable Searchable Symmetric Encryption (SSE) Engine**  
> *Domain: Encrypted Databases / Cryptographic Engineering / Cloud Security*  
> Storing sensitive enterprise documents in third-party cloud storage leaves proprietary data exposed to insider attacks, while standard end-to-end encryption completely breaks server-side keyword indexing and full-text search capabilities.  
> **Objective:** Construct a cryptographic search engine from scratch implementing Searchable Symmetric Encryption (using cryptographic trapdoors, blind indexes, and inverted index token hashing) that enables an untrusted server to execute substring or boolean keyword queries over ciphertext.  
> **Expected Outcome:** A server-client architecture where the client uploads fully encrypted document payloads along with encrypted search tokens. The server returns exact matching document IDs for search queries without learning the underlying keywords, the query contents, or the plaintext files (proven via an untrusted server audit log showing only opaque hashes and ciphertexts).

---

## How Clusion Informs Our Solution

**Clusion** is an academic-grade Java reference library for state-of-the-art Searchable Symmetric Encryption developed by cryptographic researchers (Tarik Moataz, Seny Kamara et al.). It implements foundational SSE schemes with sub-linear search complexity:
- **Cash et al. (NDSS 2014) 2Lev & TSet**: 2-Level encrypted multi-maps and tuple-set indexing for sub-linear search over encrypted inverted indexes.
- **Kamara & Moataz (Eurocrypt 2017) IEX-2Lev**: Boolean and disjunctive search using global and local multi-maps with set differences.
- **DynRH & Dls^D (IEEE S&P 2019)**: Dynamic encrypted multi-maps with forward security and breach resistance.

However, Clusion is a **monolithic academic Java benchmark** designed for single-machine RAM/Hadoop evaluations. It lacks:
1. **Verifiability**: Detecting if an untrusted cloud server omitted, modified, or forged search results.
2. **Substring Search**: Performing arbitrary substring queries over encrypted data (Clusion only supports exact token matching).
3. **Server-Client Network Architecture**: A production client-server protocol with REST/gRPC APIs.
4. **Untrusted Server Audit Logging**: Cryptographic zero-leakage audit logs showing only opaque hashes and ciphertexts.
5. **Modern Stack Portability**: Modern Web Crypto API / Node.js TypeScript implementations rather than legacy Java 7/8 Bouncy Castle.

This documentation suite extracts the battle-tested mathematical foundations of Clusion while providing the exact specifications and designs to bridge the missing gaps for our target engine.

---

## Document Index

| Document | Purpose |
| :--- | :--- |
| **[01_CODEBASE_MAP.md](file:///k:/Coding%20Projects/Vault/clusion%20docs/01_CODEBASE_MAP.md)** | Full structural and technical map of the Clusion codebase (files, classes, crypto primitives, external dependencies, and build pipeline). |
| **[02_RELEVANCE_MATRIX.md](file:///k:/Coding%20Projects/Vault/clusion%20docs/02_RELEVANCE_MATRIX.md)** | Precise breakdown of what we **need**, what we **discard**, and the **critical gaps** we must implement for our problem statement. |
| **[03_MATHEMATICAL_AND_CRYPTO_SPEC.md](file:///k:/Coding%20Projects/Vault/clusion%20docs/03_MATHEMATICAL_AND_CRYPTO_SPEC.md)** | Mathematical algorithms, pseudocode, and security formulas extracted from Clusion (KeyGen, Setup, Trapdoor, Search, Resolve, Forward Privacy, Boolean IEX). |
| **[04_BRIDGING_THE_GAPS_VERIFIABILITY_SUBSTRING.md](file:///k:/Coding%20Projects/Vault/clusion%20docs/04_BRIDGING_THE_GAPS_VERIFIABILITY_SUBSTRING.md)** | Concrete cryptographic designs for **Verifiability** (Merkle Authenticated Inverted Indexes), **Substring Search** (N-gram blind indexing), and **Untrusted Server Audit Logging**. |
| **[05_SYSTEM_ARCHITECTURE_AND_API.md](file:///k:/Coding%20Projects/Vault/clusion%20docs/05_SYSTEM_ARCHITECTURE_AND_API.md)** | End-to-end Client-Server architecture, network protocol, API specification, and Web Crypto API / Node.js cryptographic porting guide. |
| **[06_IMPLEMENTATION_BLUEPRINT.md](file:///k:/Coding%20Projects/Vault/clusion%20docs/06_IMPLEMENTATION_BLUEPRINT.md)** | Practical, step-by-step engineering roadmap to implement the engine from scratch, complete with core code contracts and verification tests. |
| **[07_LEGACY_VS_MODERN_CODE_SPEC.md](file:///k:/Coding%20Projects/Vault/clusion%20docs/07_LEGACY_VS_MODERN_CODE_SPEC.md)** | Detailed code-by-code contrast between 10-year-old legacy Clusion Java and the modern 2026 Web Crypto TypeScript implementation. |

---

## Architectural Comparison Matrix

| Feature | Clusion Implementation | Our Verifiable SSE Engine Requirement |
| :--- | :--- | :--- |
| **Inverted Index** | 2Lev MultiMap & TSet (Cash et al.) | Blind Inverted Index (Token Hashing + Encrypted MultiMap) |
| **Search Trapdoor** | PRF/CMAC on keywords: $K_w = \text{CMAC}(K, w)$ | HMAC-SHA256 / AES-CMAC cryptographic search trapdoors |
| **Boolean Queries** | IEX-2Lev (Global + Local Multi-Maps) | Decomposed IEX boolean evaluation over blind token sets |
| **Substring Search** | Not supported (Exact keywords only) | N-gram blind index decomposition + client candidate filtering |
| **Data Dynamic Updates** | DynRH / Dls^D with Forward Privacy | Dynamic encrypted index with forward-secure token versioning |
| **Result Confidentiality** | RH-2Lev (Response-Hiding: doc IDs encrypted) | Response-Hiding or Blind ID mapping; server learns no plaintexts |
| **Result Verifiability** | **None** (Server is trusted to return correct results) | **Authenticated Merkle Index / Accumulator Proofs** ($\Pi$) |
| **Audit Logging** | Local text file debug logging (`logs.txt`) | **Tamper-evident Audit Log** (Opaque hashes & ciphertexts only) |
| **System Architecture** | Local in-memory benchmark / Hadoop MapReduce | **Client-Server REST/WebSockets** (Client Web Crypto + Server DB) |
