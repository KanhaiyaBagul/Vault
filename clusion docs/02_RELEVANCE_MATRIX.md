# 02. Relevance Matrix: Clusion vs. Verifiable SSE Problem Statement

This document maps every component in **Clusion** directly against our **Problem Statement**, categorizing what we **adopt and extract**, what we **discard**, and the **critical architectural gaps** we must engineer from scratch.

---

## 1. Problem Statement Requirements Breakdown

| Requirement Identifier | Problem Statement Requirement | Core Technical Implication |
| :--- | :--- | :--- |
| **REQ-1** | **Searchable Symmetric Encryption (SSE)** | Symmetric PRF trapdoors, blind inverted indexing, sub-linear ciphertext search. |
| **REQ-2** | **Cryptographic Trapdoors & Blind Indexes** | Keyword token hashing using HMAC / AES-CMAC; deterministic PRFs over private keys. |
| **REQ-3** | **Boolean & Substring Query Execution** | Untrusted server executes AND/OR/NOT and substring queries over opaque tokens. |
| **REQ-4** | **Verifiable Search Engine** | Client verifies that search results are both **correct** (not tampered) and **complete** (server did not omit matching documents). |
| **REQ-5** | **Zero Server Knowledge** | Server learns nothing about keywords, query semantics, or file plaintexts. |
| **REQ-6** | **Untrusted Server Audit Log** | Formal, tamper-evident audit trail recording only opaque hashes, blinded tokens, and ciphertexts. |
| **REQ-7** | **Client-Server Architecture** | Client handles encryption/decryption/verification; server hosts encrypted indexes and document payloads. |

---

## 2. Component-by-Component Relevance Evaluation

| Clusion Component | Files in Clusion | Verdict | Rationale & Reuse Plan |
| :--- | :--- | :---: | :--- |
| **Cryptographic PRF & Trapdoors** | `CryptoPrimitives.java`<br>`RR2Lev.token()`<br>`DynRH.genToken()` | **REUSE (ADAPT)** | **Direct mathematical match.** Derives search tokens $K_1 = \text{PRF}(K, "1" + w)$ and $K_2 = \text{PRF}(K, "2" + w)$. We will extract the PRF key-derivation logic and port it to modern Web Crypto / HMAC-SHA256. |
| **Response-Hiding 2-Level Multi-Map** | `RH2Lev.java`<br>`EMM2Lev.java` | **REUSE (ADAPT)** | **Direct algorithmic match.** Implements 2-level small/medium/large block packing for sub-linear search. Guarantees server only receives encrypted document references, requiring client `resolve()`. |
| **Tuple-Set Inverted Index (TSet)** | `TSet.java`<br>`Record.java`<br>`TSetResultFormat.java` | **REUSE (ADAPT)** | **Direct algorithmic match.** Cash et al. TSet bucket hashing and XOR masking for $O(1)$ I/O access per posting. Invaluable for the server-side blind index database schema. |
| **Boolean & Disjunctive Queries** | `IEX2Lev.java`<br>`TokenDIS.java` | **REUSE (ADAPT)** | **Direct algorithmic match.** Kamara-Moataz set-difference formula $DB(w_1) \cup (DB(w_2) \setminus DB(w_1))$ using global and local multi-maps. Provides the exact mechanism for server-side boolean search over ciphertext. |
| **Dynamic SSE & Forward Privacy** | `DynRH.java`<br>`DlsD.java` | **REUSE (ADAPT)** | **Direct algorithmic match.** Counter-based state table $\text{state}[w]$ and forward-secure token rotation prevents the server from correlating new document uploads with past search queries. |
| **Document Text Extraction & Tokenizer** | `TextExtractPar.java`<br>`Tokenizer.java`<br>`TextProc.java` | **REPLACE** | Apache Lucene/PDFBox/POI are heavyweight Java libraries with legacy APIs. We will replace these with lightweight client-side tokenizers and N-gram generators (e.g., standard regex tokenizers in TypeScript/Node.js or PDF.js). |
| **Bloom / Matryoshka Filters (ZMF)** | `ZMF.java`<br>`ZMFFormat.java` | **DISCARD** | Complex online ciphers (HCB1) and linear false-positive Bloom checks are inferior to 2Lev / DynRH multi-maps for exact document retrieval. |
| **Hadoop / AWS Cloud MapReduce** | `IEX2LevAMAZON.java` | **DISCARD** | Outdated AWS SDK 1.11 and Hadoop 2.7 MapReduce bindings. Irrelevant to a modern web client-server microservice or cloud native database. |
| **Android Port** | `android/` directory | **DISCARD** | Spongy Castle wrappers for legacy Android versions. Unnecessary for our target architecture. |
| **Local CLI Benchmark Harnesses** | `src/test/java/org/crypto/sse/TestLocal*.java` | **DISCARD** | Interactive `System.in` console loops simulating both client and server in one thread. We need real REST/WebSocket client-server separation. |

---

## 3. The Three Critical Gaps (Missing from Clusion)

Clusion provides the **cryptographic SSE foundations**, but completely lacks the three pillars of our specific Problem Statement:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLUSION CAPABILITIES                            │
│  - PRF Search Trapdoors            - Response-Hiding Multi-Maps        │
│  - Cash et al. TSet / 2Lev         - Kamara-Moataz Boolean IEX         │
│  - Dynamic Updates & Forward Privacy                                   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                ┌──────────────────┴──────────────────┐
                ▼                                     ▼
┌───────────────────────────────┐     ┌──────────────────────────────────┐
│   WHAT CLUSION IS MISSING     │     │     OUR ARCHITECTURAL SOLUTION   │
├───────────────────────────────┤     ├──────────────────────────────────┤
│ 1. Zero Verifiability         │ ──► │ Merkle Authenticated Inverted    │
│    (Server can drop/fake IDs) │     │ Index & Proof Verification       │
├───────────────────────────────┤     ├──────────────────────────────────┤
│ 2. Exact Keywords Only        │ ──► │ N-Gram Decomposition Blind Index │
│    (No substring search)      │     │ & Client-Side Result Pruning     │
├───────────────────────────────┤     ├──────────────────────────────────┤
│ 3. No Network / Client-Server │ ──► │ REST API + Authenticated Payload │
│    & No Audit Log             │     │ Vault + Tamper-Evident Audit Log │
└───────────────────────────────┘     └──────────────────────────────────┘
```

### Gap 1: Verifiability & Cryptographic Proofs
- **The Problem in Clusion**: Clusion assumes an *honest-but-curious* (passive) server that executes queries faithfully. In real cloud environments, an untrusted or compromised server may maliciously omit matching records, return stale records, or inject fabricated document IDs. Clusion has zero mathematical verification.
- **Our Solution**:
  - Implement an **Authenticated Inverted Index (AII)** using **Merkle Trees** or **Cryptographic Accumulators**.
  - For every keyword posting list $DB(w)$, compute a cryptographic digest/root $R_w = \text{MerkleRoot}(DB(w))$.
  - The server returns matching ciphertexts along with a cryptographic verification path/proof $\Pi$.
  - The client verifies $\Pi$ against an authenticated commitment before accepting search results.

### Gap 2: Substring Query Execution
- **The Problem in Clusion**: Clusion only indexes exact words emitted by Lucene (`"security"` does not match `"sec"`, `"cure"`, or `"rity"`).
- **Our Solution**:
  - Implement **N-Gram Tokenization** (typically $n = 3$ or $n = 4$) at client indexing time.
  - Substrings $\sigma$ of length $\ge n$ are decomposed into consecutive $n$-grams.
  - The client constructs a multi-token conjunctive trapdoor for the constituent $n$-grams.
  - The server computes the intersection of document IDs matching all $n$-grams, executing substring search over encrypted tokens without learning the underlying text.

### Gap 3: Client-Server Architecture & Tamper-Evident Audit Logging
- **The Problem in Clusion**: Clusion is an in-memory Java benchmark that logs debug timings to `logs.txt`.
- **Our Solution**:
  - Build a clean **Client-Server Architecture**:
    - **Client**: Web Crypto / Node.js agent responsible for document chunking, payload encryption (AES-256-GCM), trapdoor derivation, proof verification, and local decryption.
    - **Server**: Untrusted Node.js/PostgreSQL engine storing encrypted blobs, blind index postings, executing set operations, and producing proof payloads.
  - **Server Audit Log**: An immutable append-only audit trail proving that the server only observes:
    - Opaque query tokens: $T_w = \text{HMAC}(K_{trapdoor}, w)$
    - Encrypted document records: $C_{doc} = (\text{IV}, \text{Ciphertext}, \text{AuthTag})$
    - Zero plaintext keywords or file contents ever enter server memory.

---

## 4. Extraction Summary Table

| Category | Keep from Clusion | Replace / Build New |
| :--- | :--- | :--- |
| **Cryptographic PRF** | Mathematical formulas for $K_1, K_2$ trapdoors | Port from Java BouncyCastle to Web Crypto API / SubtleCrypto |
| **Inverted Index Data Structure** | 2-level multimap / TSet bucket architecture | Re-implement in TypeScript/PostgreSQL with blind indexes |
| **Query Engine** | Boolean set-difference algorithm ($IEX$) | Add multi-keyword boolean coordinator and N-gram substring handler |
| **Integrity & Verification** | None | **Merkle Authenticated Inverted Index Proofs** |
| **Storage & Network** | None (discard Hadoop / Java Serialization) | REST / WebSocket API + Document Payload Vault |
| **Audit Log** | None (discard `logs.txt`) | **Cryptographic Tamper-Evident Audit Log** |
