# 04. Bridging the Gaps: Verifiability, Substring Search & Audit Logging

This document provides concrete architectural and cryptographic designs for the **three essential capabilities** required by our Problem Statement that are missing from Clusion:
1. **Verifiable Search** (Cryptographic Proofs of Correctness and Completeness)
2. **Substring Search** (N-gram Blind Indexing over Ciphertext)
3. **Untrusted Server Audit Logging** (Zero-Knowledge Audit Trails)

---

## Part 1: Verifiable Search Engine

### 1.1. Threat Model & Failure Modes
In untrusted cloud storage, the server is modeled as **malicious (active adversary)** rather than honest-but-curious:
- **Suppression Attacks (False Negatives)**: The cloud server drops matching documents (e.g., to conserve bandwidth, cover up data loss, or censor records).
- **Injection Attacks (False Positives)**: The server injects fake or unauthorized document IDs into search results.
- **Tampering Attacks (Corruption)**: The server alters encrypted payloads or replaces them with older versions (replay attacks).

Clusion provides zero detection mechanisms against these attacks.

### 1.2. Authenticated Inverted Index (AII) Architecture
To guarantee **Soundness** (results are authentic) and **Completeness** (no matching records were omitted), we construct an **Authenticated Inverted Index** using **Merkle Trees** over postings lists.

```
Postings List for Keyword w: [doc_01, doc_05, doc_12, doc_40]
                              │
                              ▼
                   Merkle Tree Construction
                              │
                         [Root_w]  <── Stored in Client Local Commitment / Header
                        /        \
                    H(01,05)    H(12,40)
                    /      \     /      \
                  H(01)   H(05) H(12)  H(40)
                   │       │     │       │
                 doc_01  doc_05 doc_12  doc_40
```

### 1.3. Cryptographic Verification Scheme

#### 1. Setup Phase (Client-Side Digest Commitments)
For every keyword $w \in \mathcal{W}$ with postings list $\text{DB}(w) = \{id_1, id_2, \dots, id_m\}$:
1. Sort document IDs in strict lexicographical order: $id_1 < id_2 < \dots < id_m$.
2. For each document, compute leaf hash using the verification key $K_{auth}$:
   $$h_i = H(K_{auth} \parallel id_i \parallel i)$$
3. Construct a binary Merkle tree over leaves $\{h_1, \dots, h_m\}$, producing keyword root digest:
   $$R_w = \text{MerkleRoot}(\{h_1, \dots, h_m\})$$
4. Compute an authenticated keyword commitment:
   $$\text{Tag}_w = H(K_{auth} \parallel w \parallel |DB(w)| \parallel R_w)$$
5. The client stores a compact local commitment table $\mathcal{T}_{auth}[tag_w] \leftarrow (|DB(w)|, R_w)$ or a top-level Merkle root over all keywords.

#### 2. Query Phase (Server Execution & Proof Generation)
1. Client sends search trapdoor $T_w$ to the server.
2. Server retrieves the encrypted postings list: $\mathcal{C}_w = \{c_1, c_2, \dots, c_m\}$.
3. Server generates verification proof $\Pi_w$:
   - For full list queries: $\Pi_w = (m, R_w)$ where $R_w$ is reconstructed from the leaf hashes.
   - For partial/subset queries: $\Pi_w$ contains the Merkle audit path (sibling hashes along the tree path).
4. Server returns payload $(\mathcal{C}_w, \Pi_w)$ to the client.

#### 3. Verification Phase: $\text{Verify}(K_{auth}, w, \mathcal{C}_w, \Pi_w)$
Before trusting the result, the client executes:
1. **Size Completeness Check**: Verify $|\mathcal{C}_w| == m_{expected}$ from local commitment $\mathcal{T}_{auth}[tag_w]$. If size differs, **REJECT (Suppression attack detected)**.
2. **Payload Decryption & Leaf Hashing**:
   $$\forall c_i \in \mathcal{C}_w: \quad id_i = \text{Dec}_{K_{enc}}(c_i)$$
   $$h'_i = H(K_{auth} \parallel id_i \parallel i)$$
3. **Merkle Root Recomputation**:
   $$R'_w = \text{MerkleRoot}(\{h'_1, h'_2, \dots, h'_m\})$$
4. **Root Comparison**:
   $$\text{Assert } R'_w == R_{w, expected}$$
5. If matches: Search results are cryptographically proven authentic and complete.  
   If mismatch: **REJECT (Tampering detected, alert logged)**.

---

## Part 2: Substring Search Engine over SSE

### 2.1. The Substring Search Challenge
Standard SSE schemes (including Clusion) index whole stemmed tokens. If a user queries substring `"pass"` to find documents containing `"password"` or `"bypass"`, exact-match trapdoors fail because $F(K, \text{"pass"}) \neq F(K, \text{"password"})$.

### 2.2. N-Gram Blind Index Decomposition
To support arbitrary substring search over encrypted data, we implement **Client-Side N-Gram Tokenization**:

```
Document Text: "password"
   │
   ▼ 3-Gram Sliding Window Decomposition
["pas", "ass", "ssw", "swo", "wor", "ord"]
   │
   ▼ Blind Token Hashing (HMAC-SHA256)
[T_"pas", T_"ass", T_"ssw", T_"swo", T_"wor", T_"ord"]
   │
   ▼ Inserted into Encrypted Inverted Index
EDB[T_"pas"] ──► {doc_1}
EDB[T_"ass"] ──► {doc_1, doc_4}
...
```

### 2.3. Substring Query Protocol

#### Step 1: Client Query Decomposition
Suppose user searches for substring $Q = \text{"sword"}$ with parameter $n = 3$:
1. Client decomposes $Q$ into $(|Q| - n + 1) = 3$ consecutive 3-grams:
   $$G(Q) = \{\text{"swo"}, \text{"wor"}, \text{"ord"}\}$$
2. For each 3-gram $g_j \in G(Q)$, client computes blind trapdoor:
   $$T_{g_j} = F(K_{trap}, g_j)$$
3. Client sends conjunctive query token:
   $$\mathcal{T}_{sub} = (T_{\text{"swo"}}, T_{\text{"wor"}}, T_{\text{"ord"}})$$

#### Step 2: Server Conjunctive Evaluation
The untrusted server executes:
1. Look up posting list for each $n$-gram:
   $$R_1 = \text{EDB}[T_{\text{"swo"}}], \quad R_2 = \text{EDB}[T_{\text{"wor"}}], \quad R_3 = \text{EDB}[T_{\text{"ord"}}]$$
2. Compute set intersection:
   $$\mathcal{C}_{candidate} = R_1 \cap R_2 \cap R_3$$
3. Server returns candidate encrypted document set $\mathcal{C}_{candidate}$ to client.
*(The server performs this using only opaque hashes. It never learns the string `"sword"` or the $n$-grams).*

#### Step 3: Client Resolution & Local False-Positive Pruning
1. Client decrypts candidate documents.
2. In the rare case of $n$-gram false positives (where all 3-grams exist in a document but in different positions), the client verifies exact substring containment in the decrypted text.

---

## Part 3: Untrusted Server Audit Logging

### 3.1. Zero-Knowledge Audit Requirements
The Problem Statement requires:
> *"Proven via an untrusted server audit log showing only opaque hashes and ciphertexts."*

To satisfy this, the server maintains an **Append-Only Tamper-Evident Audit Log** recording all search and storage activities.

### 3.2. Audit Log Record Specification

Each audit entry contains strictly non-sensitive cryptographic artifacts:

```json
{
  "log_id": "audit_8f91c7a2-1402-48a1",
  "timestamp": "2026-10-14T09:15:32.408Z",
  "operation": "SEARCH_QUERY",
  "client_ip_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "trapdoors_received": [
    "0x7a29e4b105d45f3484501a3511e649d2cb098f98f62c0b798cf0c07ef4c84a2b",
    "0x91fbc34a81098ef902b78129cc8412ad0188942b0f817456bc910245a8e102f3"
  ],
  "evaluated_index_addresses": [
    "0x12c4b890d2e817a2",
    "0x89d2e104f7a63b19"
  ],
  "returned_postings_count": 3,
  "returned_ciphertext_hashes": [
    "sha256:d41d8cd98f00b204e9800998ecf8427e",
    "sha256:9e107d9d372bb6826bd81d3542a419d6",
    "sha256:e4d909c290d0fb1ca068ffaddf22cbd0"
  ],
  "proof_root_emitted": "0x5d41402abc4b2a76b9719d911017c592",
  "execution_duration_ms": 1.42
}
```

### 3.3. Mathematical Proof of Zero Server Knowledge

| Observable Field in Server Log | Cryptographic Formulation | Information Leakage to Server/Auditor |
| :--- | :--- | :--- |
| `trapdoors_received` | $T_w = \text{HMAC}_{K_{trap}}(w)$ | **Zero.** Under the PRF security of HMAC-SHA256, $T_w$ is computationally indistinguishable from a uniform random 256-bit string without $K_{trap}$. |
| `evaluated_index_addresses` | $L = \text{HMAC}_{K_{addr}}(T_w \parallel c)$ | **Zero.** Uniformly distributed pseudo-random bucket address. Reveals only access pattern (which rows were read). |
| `returned_ciphertext_hashes` | $H(\text{AES-GCM}(K_{enc}, \text{doc\_id}))$ | **Zero.** IND-CPA and IND-CTXT security ensures ciphertexts reveal zero plaintext bits. |
| `proof_root_emitted` | $R_w = \text{MerkleRoot}(DB(w))$ | **Zero.** Collision-resistant one-way hash root. Infeasible to invert. |
| **Plaintext Keywords** | — | **NEVER PRESENT.** |
| **Plaintext File Contents** | — | **NEVER PRESENT.** |
