# Research: Phase 4 — Verifiability Engine & Cryptographic Proofs

**Phase:** Phase 4  
**Target:** Cryptographically Verifiable Search via Merkle Trees & Authenticated Inverted Index  
**Directory:** `Vault_planing/04-verifiability-engine/`  
**Dependencies:** Phase 1 (`src/crypto/`), Phase 2 (`src/indexer/`), Phase 3 (`src/engine/`)

---

## 1. The Threat Model: Malicious Untrusted Cloud

In traditional cloud storage, the server is assumed to be **semi-honest** ("honest-but-curious" — it executes protocols faithfully while trying to glean information).

However, in real-world enterprise deployments (e.g., government subpoenas, rogue sysadmins, ransomware, or silent storage bit-rot), the cloud must be treated as **malicious**:
1. **Omission (Dropping Postings)**:
   - A corrupt server returns 2 documents instead of 5 when searching for `"audit"`, hiding sensitive compliance infractions.
2. **Fabrication (Injecting False Postings)**:
   - An attacker inserts forged ciphertext entries to exhaust client decrypt resources or cause Denial of Service.
3. **Tampering (Byte Flipping)**:
   - An attacker modifies bytes in encrypted records.
4. **Stale State Replay**:
   - An attacker serves search results from an older version of the database before a revocation or update occurred.

---

## 2. Mathematical Scheme: Authenticated Inverted Index (AII)

To provide verifiable search without trusting the server, we implement an **Authenticated Inverted Index**:

### 2.1. Leaf Hash Construction
For each keyword or $n$-gram $w$, the postings list $P(w)$ consists of $c_w$ records:
$$P(w) = [ (L_{w,0}, \text{opaqueDocRef}_0), (L_{w,1}, \text{opaqueDocRef}_1), \dots, (L_{w, c_w-1}, \text{opaqueDocRef}_{c_w-1}) ]$$

Each record is hashed into a canonical leaf:
$$\text{Leaf}_i = \text{SHA-256}\left(\text{"VAULT:LEAF:"} \parallel L_{w,i} \parallel \text{":"} \parallel \text{opaqueDocRef}_i \parallel \text{":"} \parallel i\right)$$

### 2.2. Binary Merkle Tree Accumulation
The leaves are paired and hashed recursively:
$$\text{Node}_{parent} = \text{SHA-256}\left(\text{"VAULT:NODE:"} \parallel \text{Node}_{left} \parallel \text{Node}_{right}\right)$$

For odd numbers of nodes at any level, the standard practice (RFC 6962 / Certificate Transparency) duplicates the last node or carries it upward.

The root of this tree for keyword $w$ is denoted $R_w$.

### 2.3. Client Commitment via Dedicated Authentication Key ($K_{auth}$)
In Phase 1, we derived 5 dedicated subkeys using HKDF, including $K_{auth}$ (`HMAC-SHA256`).
When the client updates the index for token $w$, the client computes and stores:
$$\text{Commit}_w = \text{HMAC}(K_{auth}, tag_w \parallel c_w \parallel R_w)$$

The client stores a compact table:
$$\Sigma_{auth}[w] = \{ c_w, R_w, \text{Commit}_w \}$$

The memory footprint on the client is minimal ($O(|W|)$ 32-byte hashes), while the untrusted server stores the actual multi-map.

---

## 3. Query & Verification Protocol

```
CLIENT (Trusted)                                                    SERVER (Untrusted)
Holds: Σ[w] = c_w, Commit_w, K_auth                                 Holds: Blind Index EDB
───────────────────────────────────                                 ──────────────────────
1. Send Query Trapdoor:
   tag_w, c_w ────────────────────────────────────────────────────► 2. Retrieve records:
                                                                       Records = {V_0, ..., V_{c_w-1}}
                                                                       Build/Retrieve Merkle Tree
   Receive {Records, R_server, Proofs} ◄─────────────────────────── Send Records + R_server
   
3. Verify Completeness & Soundness:
   a. Check Cardinality:
      assert(Records.length == c_w) [FAIL -> DROPPED_RECORDS]
   b. Recompute Leaves from Records:
      Leaf_i = SHA-256("VAULT:LEAF:" || L_i || ":" || opaqueDocRef_i || ":" || i)
   c. Recompute Root:
      R_computed = MerkleRoot(Leaves)
   d. Check Root Equivalence:
      assert(R_computed == R_server == R_w) [FAIL -> FABRICATED_OR_MODIFIED]
   e. Verify HMAC Commitment:
      ExpectedCommit = HMAC(K_auth, tag_w || c_w || R_computed)
      assert(constantTimeEqual(ExpectedCommit, Commit_w)) [FAIL -> TAMPERED_COMMITMENT]
   
   => IF ALL PASS: SEARCH RESULT IS MATHEMATICALLY PROVEN COMPLETE & SOUND.
```

---

## 4. Multi-Token / Substring Conjunction Verification

For substring search over 3-grams:
1. The server returns posting records and proof paths for all constituent 3-grams $\{g_1, g_2, \dots, g_k\}$.
2. The client verifies the Merkle completeness and soundness of **every** constituent 3-gram against its commitment.
3. The server computes the set intersection on `opaqueDocRef`.
4. The client independently verifies that every returned candidate document ref exists in the verified leaves of all $k$ 3-grams.
5. Zero false positives or omitted documents can bypass this check.
