# Research: Phase 3 — Blind Inverted Index & Dynamic Multi-Map

**Phase:** Phase 3  
**Target:** Blind Inverted Index & Forward-Secure Dynamic Multi-Map Engine  
**Directory:** `Vault_planing/03-blind-index-multimap/`  
**Dependencies:** Phase 1 (`src/crypto/`), Phase 2 (`src/indexer/`)

---

## 1. Domain Problem & SSE Mechanics

In Phase 1, we implemented the cryptographic primitives ($K_{trap}, K_{addr}, K_{mask}, K_{enc}, K_{auth}$), and in Phase 2, we built the client-side text extractor and N-gram generator.

**The Phase 3 Objective:**
Combine the plaintext inverted index with the cryptographic primitives to produce the **Blind Inverted Index** and **Dynamic Multi-Map** ($\text{EDB}$), enabling the untrusted server to execute search queries over ciphertext with:
1. **Response-Hiding Confidentiality**: The server learns zero plaintext document IDs.
2. **Forward Privacy**: Newly uploaded documents cannot be correlated with past search queries.
3. **Sub-linear Search Time**: The server locates matching records in $O(|DB(w)|)$ time without scanning the entire database.

---

## 2. Mathematical Scheme Adaptation from Clusion

We adopt and modernize the core principles of **Cash et al. 2Lev** and **DynRH** from Clusion:

```
CLIENT (Trusted)                                                SERVER (Untrusted)
State Table: Σ[w] = count                                       Encrypted Store: EDB[L] -> V
────────────────────────                                        ────────────────────────────
1. Index Document (doc_1):
   For token w in doc_1:
     c = Σ[w]++
     tag_w = PRF(K_trap, w)
     L = PRF(K_addr, tag_w || c)
     enc_id = AES_GCM(K_enc, doc_1)
     mask = PRF(K_mask, tag_w || c)
     V = XOR(enc_id, mask)
     Send (L, V) ─────────────────────────────────────────────► Store EDB[L] = V

2. Search Query (w):
   c = Σ[w]
   tag_w = PRF(K_trap, w)
   Send Search Trapdoor (tag_w, c) ──────────────────────────► For i = 0 to c - 1:
                                                                 L_i = PRF(K_addr, tag_w || i)
                                                                 V_i = EDB[L_i]
   Receive {V_0, V_1, ...} ◄────────────────────────────────── Return {V_0, V_1, ...}
   
3. Resolve:
   For V_i in results:
     mask_i = PRF(K_mask, tag_w || i)
     enc_id_i = XOR(V_i, mask_i)
     doc_id = Decrypt(K_enc, enc_id_i)
```

---

## 3. Cryptographic Security & Forward Privacy

### 3.1. Why Forward Privacy Is Essential
In an enterprise cloud storage system, documents are continuously added, updated, and deleted.  
- If the server intercepts a search trapdoor $T_w$ for `"financial"`, a non-forward-private SSE scheme allows the server to test all future document uploads against $T_w$.
- **DynRH Counter-Based Forward Privacy**:
  - Each document upload derives its addressing label $L_c$ using the *current counter* $c = \Sigma[w]$.
  - The server only knows $L_0, L_1, \dots, L_{c-1}$ from past queries.
  - The server **cannot predict** future labels $L_c, L_{c+1}, \dots$ without the client search token.
  - Hence, future uploads remain unlinkable to past search queries.

### 3.2. Response-Hiding vs. Response-Revealing Trade-off
- In Clusion's `RR2Lev`, the server decrypts document IDs and learns matching file names.
- In our target engine (as specified in the image), the server must return matching document references **without learning the document IDs or file contents**.
- Therefore, we implement **Response-Hiding**:
  - Document IDs are encrypted with $K_{enc}$ (`AES-256-GCM`).
  - The server only manipulates opaque ciphertext blocks.
  - Only the client holding $K_{enc}$ can resolve the document IDs.

---

## 4. Multi-Token Conjunctive Substring Evaluation on Untrusted Server

To support substring search:
1. Client decomposes query $Q$ into $k$ 3-grams: $\{g_1, g_2, \dots, g_k\}$.
2. Client emits search tokens for all $k$ 3-grams:
   $$\mathcal{T}_Q = \left\{ (T_{g_1}, c_{g_1}), (T_{g_2}, c_{g_2}), \dots, (T_{g_k}, c_{g_k}) \right\}$$
3. Server evaluates:
   $$\forall j \in [1, k]: \quad \mathcal{R}_j = \{ \text{EDB}[\text{PRF}(K_{addr}, T_{g_j} \parallel i)] \mid i \in [0, c_{g_j} - 1] \}$$
4. Server computes the intersection across all posting sets:
   $$\mathcal{R}_{conj} = \mathcal{R}_1 \cap \mathcal{R}_2 \dots \cap \mathcal{R}_k$$
   *(Note: Since document IDs are deterministically blinded or indexed with an opaque document UUID hash, the server can compute the set intersection over opaque identifiers without learning the plaintext IDs).*
5. Server returns matching opaque records $\mathcal{R}_{conj}$ to the client.
