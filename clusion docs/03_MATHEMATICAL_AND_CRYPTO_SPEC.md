# 03. Mathematical & Cryptographic Specification

This document formalizes the mathematical foundations, cryptographic constructions, and exact pseudocode extracted from the **Clusion** library, adapted for our **Verifiable Searchable Symmetric Encryption (SSE) Engine**.

---

## 1. Cryptographic Primitives & Notation

### 1.1. Notation
- $\lambda \in \mathbb{N}$: Cryptographic security parameter ($\lambda = 128$ or $256$).
- $\mathcal{W}$: Keyword space ($\{0, 1\}^*$).
- $\mathcal{D}$: Document space (identifiers $id \in \mathcal{D}$).
- $\text{DB}$: Plaintext database, viewed as an inverted index $\text{DB}: \mathcal{W} \to 2^{\mathcal{D}}$, where $\text{DB}(w) = \{id_1, id_2, \dots, id_m\}$.
- $\text{EDB}$: Encrypted database stored on the untrusted server.
- $F: \{0, 1\}^k \times \{0, 1\}^* \to \{0, 1\}^k$: Pseudorandom Function (PRF), instantiated via **HMAC-SHA256** or **AES-CMAC**.
- $H: \{0, 1\}^* \to \{0, 1\}^n$: Cryptographic collision-resistant hash function (e.g., **SHA-256**).
- $(\text{Enc}, \text{Dec})$: Authenticated Symmetric Encryption scheme (IND-CPA / IND-CCA2 secure), instantiated via **AES-256-GCM**.
- $\oplus$: Bitwise XOR operation.
- $a \parallel b$: Byte concatenation of strings $a$ and $b$.

---

## 2. Key Derivation Architecture

To achieve clean domain separation and prevent key reuse vulnerabilities across indexing, trapdoors, document payload encryption, and verifiability, the master key is derived via a secure Key Derivation Function (HKDF or PBKDF2), and sub-keys are generated using PRF domain separation:

```
                      Master Password / Entropy
                                  │
                                  ▼
                   PBKDF2-HMAC-SHA256(Pass, Salt)
                                  │
                                  ▼
                          Master Key: K_master
                                  │
         ┌────────────┬───────────┴───────────┬─────────────┬─────────────┐
         ▼            ▼                       ▼             ▼             ▼
      K_trap        K_addr                  K_mask        K_enc         K_auth
    (Trapdoor     (Address/Index           (Postings     (Document     (Merkle Proof
       PRF)           PRF)                   Mask)       Payloads)      MAC/Tree)
```

### Key Generation Algorithm: $\text{KeyGen}(1^\lambda, \text{password})$
1. $\text{salt} \leftarrow_{\$} \{0, 1\}^{128}$
2. $K_{master} \leftarrow \text{PBKDF2}(\text{HMAC-SHA256}, \text{password}, \text{salt}, c = 100{,}000, 256)$
3. Derive 5 domain-separated subkeys:
   - $K_{trap} = F(K_{master}, \text{"DOMAIN:TRAPDOOR:01"})$
   - $K_{addr} = F(K_{master}, \text{"DOMAIN:ADDRESS:02"})$
   - $K_{mask} = F(K_{master}, \text{"DOMAIN:MASKING:03"})$
   - $K_{enc}  = F(K_{master}, \text{"DOMAIN:PAYLOAD:04"})$
   - $K_{auth} = F(K_{master}, \text{"DOMAIN:VERIFY:05"})$
4. Output private key tuple $\text{SK} = (K_{trap}, K_{addr}, K_{mask}, K_{enc}, K_{auth})$.

---

## 3. Scheme 1: Cash et al. Response-Hiding 2-Level Multi-Map ($\text{RH-2Lev}$)

Extracted from `RH2Lev.java` and `TSet.java` in Clusion.

### 3.1. Construction Goal
Enables the untrusted server to look up all document records matching keyword $w$ in $O(|\text{DB}(w)|)$ time without revealing:
1. The plaintext keyword $w$.
2. The plaintext document IDs $\{id_1, id_2, \dots\}$.
3. The contents of documents.

### 3.2. Index Setup Algorithm: $\text{Setup}(\text{SK}, \text{DB})$
Given database $\text{DB}$, with postings lists $\text{DB}(w) = \{id_1, id_2, \dots, id_{t_w}\}$:

1. Initialize primary encrypted dictionary $\gamma$ and secondary array $A$.
2. Define small-block threshold $S$ (e.g., $S = 20$) and large-block threshold $B$ (e.g., $B = 200$).
3. For each keyword $w \in \mathcal{W}$:
   - Derive keyword-specific search tag:
     $$tag_w = F(K_{trap}, w)$$
   - Let $t = |\text{DB}(w)|$ be the number of matching documents.
   - For each document $id_i \in \text{DB}(w)$, compute blind encrypted document reference:
     $$c_i = \text{Enc}_{K_{enc}}(id_i)$$
   
   - **Case 1: Small List ($t \le S$)**
     - Pack the references into a single block:
       $$M = \text{"1"} \parallel c_1 \parallel \text{separator} \parallel c_2 \dots \parallel c_t$$
     - Compute dictionary address: $L = F(K_{addr}, tag_w \parallel \text{"0"})$
     - Compute ciphertext value: $V = \text{AES-CTR}(F(K_{mask}, tag_w), \text{IV}, M)$
     - Store $(\gamma[L] \leftarrow V)$.

   - **Case 2: Medium List ($S < t \le B$)**
     - Select a free contiguous block in secondary array $A$ at index $pos$.
     - Store the encrypted postings in $A[pos]$:
       $$A[pos] = \text{AES-CTR}(F(K_{mask}, tag_w), \text{IV}, c_1 \parallel \dots \parallel c_t)$$
     - In primary dictionary, store the pointer:
       $$M = \text{"2"} \parallel pos$$
       $$L = F(K_{addr}, tag_w \parallel \text{"0"}); \quad V = \text{AES-CTR}(F(K_{mask}, tag_w), \text{IV}, M)$$
       $$\gamma[L] \leftarrow V$$

   - **Case 3: Large List ($t > B$)**
     - Split postings across $\lceil t/B \rceil$ array blocks: $pos_1, pos_2, \dots$
     - Primary dictionary stores the list of pointers:
       $$M = \text{"3"} \parallel pos_1 \parallel \text{separator} \parallel pos_2 \dots$$
       $$\gamma[L] \leftarrow \text{AES-CTR}(F(K_{mask}, tag_w), \text{IV}, M)$$

4. Output encrypted index $\text{EDB} = (\gamma, A)$.

### 3.3. Trapdoor Generation: $\text{Trapdoor}(\text{SK}, w)$
To search for keyword $w$, the client computes:
1. $tag_w = F(K_{trap}, w)$
2. $K_1 = F(K_{addr}, tag_w)$ (Used by server to compute address $L$)
3. $K_2 = F(K_{mask}, tag_w)$ (Used by server to decrypt pointers and outer block masks)
4. Client sends search trapdoor $T_w = (K_1, K_2)$ to the server.
*(Notice: The client does NOT send $K_{enc}$. The server cannot decrypt $c_i$.)*

### 3.4. Server Search Execution: $\text{Search}(\text{EDB}, T_w)$
The untrusted server executes:
1. Reconstruct primary address: $L = F(K_1, \text{"0"})$.
2. If $L \notin \gamma$, return empty result $\emptyset$.
3. Retrieve ciphertext $V = \gamma[L]$ and decrypt using $K_2$:
   $$M = \text{Dec}_{K_2}(V)$$
4. Parse header flag from $M$:
   - If flag = `"1"`: Directly parse encrypted tokens $\{c_1, \dots, c_t\}$ from $M$.
   - If flag = `"2"`: Extract array index $pos$, retrieve $A[pos]$, decrypt using $K_2$, and extract $\{c_1, \dots, c_t\}$.
   - If flag = `"3"`: Extract indices $\{pos_1, pos_2, \dots\}$, retrieve and decrypt each block from $A$, concatenating all $\{c_1, \dots, c_t\}$.
5. Return the list of encrypted document references $\mathcal{C}_w = \{c_1, c_2, \dots, c_t\}$ to the client.

### 3.5. Client Resolution: $\text{Resolve}(\text{SK}, \mathcal{C}_w)$
Client receives $\mathcal{C}_w$ from the server and decrypts:
$$\forall c_i \in \mathcal{C}_w: \quad id_i = \text{Dec}_{K_{enc}}(c_i)$$
Client obtains the exact matching document IDs without revealing them to the server.

---

## 4. Scheme 2: Forward-Secure Dynamic SSE ($\text{DynRH}$)

Extracted from `DynRH.java` in Clusion.

### 4.1. The Forward-Security Problem
In enterprise storage, new documents are continuously uploaded. If an untrusted server previously intercepted search trapdoor $T_w$ for keyword $w$, a naive SSE scheme allows the server to test all future uploads against $T_w$, learning which newly added documents contain $w$.  
**Forward Privacy** guarantees that a new document insertion reveals no information about past search queries.

### 4.2. State Maintenance
The client maintains a local state map:
$$\Sigma: \mathcal{W} \to \mathbb{N}$$
Where $\Sigma[w] = c_w$ is the count of how many times keyword $w$ has been inserted.

### 4.3. Dynamic Document Insertion: $\text{Update}(\text{SK}, \Sigma, op, w, id)$
When adding a document $id$ containing keyword $w$:
1. $c = \Sigma[w]$ (default to $0$ if not seen)
2. $\Sigma[w] = c + 1$
3. Derive keyword addressing key: $K_w = F(K_{trap}, w)$
4. Compute search label for this insertion counter:
   $$label = F(K_w, \text{String}(c))$$
5. Encrypt document identifier:
   $$value = \text{Enc}_{K_{enc}}(id)$$
6. Send update tuple $(label, value)$ to the server.
7. Server stores in encrypted dictionary: $\text{EDB}[label] \leftarrow value$.

*(Security: The server sees an opaque pseudo-random label and ciphertext. It cannot correlate this $label$ with previous queries because $label$ is derived from the new counter $c$.)*

### 4.4. Forward-Secure Query: $\text{SearchDyn}(\text{SK}, \Sigma, w)$
1. $c = \Sigma[w]$
2. Client derives $K_w = F(K_{trap}, w)$
3. Client sends trapdoor $T_w = (K_w, c)$ to the server.
4. Server executes:
   $$\text{For } i = 0, 1, \dots, c-1:$$
   $$label_i = F(K_w, \text{String}(i))$$
   $$\text{If } label_i \in \text{EDB}, \quad \text{retrieve } value_i = \text{EDB}[label_i]$$
5. Server returns $\{value_0, value_1, \dots\}$ to the client.

---

## 5. Scheme 3: Sub-Linear Boolean Queries ($\text{IEX-2Lev}$)

Extracted from `IEX2Lev.java` and `TokenDIS.java` in Clusion (Kamara & Moataz Eurocrypt 2017).

### 5.1. Disjunctive Search Formulation
A disjunctive query is $(w_1 \lor w_2 \lor \dots \lor w_m)$.  
Directly evaluating unions leaks the constituent posting sizes and can be inefficient. Clusion reformulates disjunctions into disjoint set differences:
$$\text{DB}(w_1 \lor w_2) = \text{DB}(w_1) \cup \left( \text{DB}(w_2) \setminus \text{DB}(w_1) \right)$$
$$\text{DB}(w_1 \lor w_2 \lor w_3) = \text{DB}(w_1) \cup \left( \text{DB}(w_2) \setminus \text{DB}(w_1) \right) \cup \left( \text{DB}(w_3) \setminus (\text{DB}(w_1) \cup \text{DB}(w_2)) \right)$$

### 5.2. Multi-Map Architecture
To compute set differences $\text{DB}(w_j) \setminus \text{DB}(w_i)$ without revealing non-matching items:
1. **Global Multi-Map ($\text{GMM}$)**: Stores primary postings lists for each keyword: $w \mapsto \text{DB}(w)$.
2. **Local Multi-Maps ($\text{LMM}_{w_i}$)**: For each keyword $w_i$, a separate encrypted multi-map indexes all co-occurring keywords $w_j$:
   $$w_j \mapsto \text{DB}(w_i) \cap \text{DB}(w_j)$$

### 5.3. Disjunctive Token Generation: $\text{TokenDIS}$
For query $(w_1 \lor w_2 \lor \dots \lor w_m)$:
1. $T_{global} = \text{Trapdoor}(K_{trap}, w_1)$ (Retrieves full $\text{DB}(w_1)$ from GMM).
2. $T_{dict} = F(K_{addr}, \text{"DICT:"} \parallel w_1)$ (Locates $w_1$'s local multimap on server).
3. For each subsequent keyword $w_j$ ($j = 2, \dots, m$):
   - Key for $w_1$'s local map is $K_{LMM} = F(K_{trap}, w_1)$.
   - Local token for $w_j$: $T_{local, j} = \text{Trapdoor}(K_{LMM}, w_j)$.
4. Client transmits $(T_{global}, T_{dict}, \{T_{local, 2}, \dots, T_{local, m}\})$.

### 5.4. Server Disjunctive Evaluation
1. Server queries GMM using $T_{global} \implies R_1 = \text{DB}(w_1)$.
2. Server locates $\text{LMM}_{w_1}$ using $T_{dict}$.
3. For each $j \in [2, m]$:
   - Server queries $\text{LMM}_{w_1}$ using $T_{local, j} \implies I_j = \text{DB}(w_1) \cap \text{DB}(w_j)$.
   - Server computes set difference: $R_j = \text{DB}(w_j) \setminus I_j$.
4. Total Result: $R = R_1 \cup R_2 \cup \dots \cup R_m$.
5. Worst-case asymptotic search time is sub-linear: $O(\sum |\text{DB}(w_i)|)$.

---

## 6. Mathematical Complexity & Leakage Profile

| Scheme | Storage Complexity | Search Complexity | Leakage Function $\mathcal{L}$ |
| :--- | :--- | :--- | :--- |
| **Cash et al. 2Lev** | $O(\sum_{w} \|\text{DB}(w)\|)$ | $O(\|\text{DB}(w)\|)$ optimal | **Search Pattern** (whether same keyword queried twice) + **Access Pattern** (which encrypted blocks accessed). |
| **Clusion RH-2Lev** | $O(\sum_{w} \|\text{DB}(w)\|)$ | $O(\|\text{DB}(w)\|)$ optimal | Search Pattern + Access Pattern. **Response is hidden** (Server does NOT learn document IDs). |
| **DynRH (Dynamic)** | $O(N)$ where $N = \text{total updates}$ | $O(\|\text{DB}(w)\|)$ | Forward-private. Server learns nothing about new uploads matching previous queries until keyword is searched again. |
| **Kamara-Moataz IEX** | $O(\sum \|\text{DB}(w)\| + \sum \|\text{DB}(w_i) \cap \text{DB}(w_j)\|)$ | $O(\sum \|\text{DB}(w_i)\|)$ sub-linear | Search Pattern + Co-occurrence Access Pattern for query keywords. |
