# Verification: Phase 1 — Cryptographic Primitives Engine & Key Derivation

**Phase:** Phase 1  
**Target:** Cryptographic Primitives & Key Derivation  
**Directory:** `Vault_planing/01-crypto-primitives/`

---

## 1. Automated Verification Commands

When Phase 1 execution completes, the following commands will validate all deliverables:

```bash
# 1. Typecheck & Build
npm run typecheck

# 2. Run All Cryptographic Unit Tests
npm test

# 3. Run Specific Tamper-Resistance & Vector Verification
node --test tests/crypto/cipher.test.js
node --test tests/crypto/trapdoors.test.js
node --test tests/crypto/kdf.test.js
```

---

## 2. Test Scenarios & Acceptance Criteria

### Test Scenario 1: PBKDF2 Repeatability & Salt Sensitivity
- **Given**: A user password `"EnterpriseVaultMasterKey2026!"` and salt $S_1$.
- **When**: `deriveMasterKey` is executed twice with the same password and salt.
- **Then**:
  - The derived master keys must be identical.
  - All 5 derived subkeys ($K_{trap}, K_{addr}, K_{mask}, K_{enc}, K_{auth}$) must be identical.
- **Negative Check**:
  - Change 1 character in the password: `"EnterpriseVaultMasterKey2026?"`.
  - The derived subkeys must be completely distinct (hamming distance near 50%).

---

### Test Scenario 2: Subkey Domain Orthogonality
- **Given**: Derived subkeys from a valid master key.
- **Then**:
  - Exported raw bytes of $K_{trap}, K_{addr}, K_{mask}, K_{enc}, K_{auth}$ must all be pairwise non-equal.
  - No key can be derived from another without the master key.

---

### Test Scenario 3: Deterministic Keyword PRF Trapdoors
- **Given**: Subkey $K_{trap}$ and keyword `"financial-statement"`.
- **When**: `computeKeywordTrapdoor` is evaluated 1,000 times.
- **Then**:
  - Every evaluation returns the exact same 32-byte hash token.
  - Normalization check: `"Financial-Statement "` produces the exact same trapdoor as `"financial-statement"`.
  - Distinct keyword check: `"financial-statement"` vs `"financial-statements"` produces uncorrelated tokens.

---

### Test Scenario 4: Dynamic Counter Blind Addressing
- **Given**: Subkey $K_{addr}$ and keyword tag $tag_w$.
- **When**: Addresses are computed for counters $c = 0, 1, 2, \dots, 99$.
- **Then**:
  - Every address $L_c = \text{computeIndexAddress}(K_{addr}, tag_w, c)$ is unique.
  - Collision rate across $10{,}000$ counter addresses must be $0$.

---

### Test Scenario 5: Authenticated Encryption Roundtrip
- **Given**: Plaintext payload (e.g., 500 KB document buffer).
- **When**: Encrypted via `encryptPayload(kEnc, plaintext)` and decrypted via `decryptPayload(kEnc, encryptedBlob)`.
- **Then**:
  - Decrypted buffer matches original plaintext byte-for-byte.
  - Fresh IV check: Encrypting the identical plaintext twice produces different ciphertexts and unique 12-byte IVs.

---

### Test Scenario 6: Active Attacker Bit-Flip Tamper Resistance
- **Given**: Valid encrypted blob $(\text{IV}, \text{Ciphertext}, \text{Tag})$.
- **Action A (Ciphertext Tamper)**: Flip bit 0 of byte 10 in `ciphertext`.
  - **Expectation**: `decryptPayload` must throw an error. Decryption must **never** succeed with corrupted plaintext.
- **Action B (IV Tamper)**: Flip 1 bit in `iv`.
  - **Expectation**: `decryptPayload` must throw an error.
- **Action C (Tag Tamper)**: Truncate or alter the 128-bit GCM tag.
  - **Expectation**: `decryptPayload` must throw an error.

---

### Test Scenario 7: Constant-Time Comparison Timing Safety
- **Given**: Identical byte arrays $A$ and $B$, and mismatched array $C$.
- **When**: `constantTimeEqual(A, B)` and `constantTimeEqual(A, C)` are executed.
- **Then**:
  - Returns `true` for $A == B$, and `false` for $A \neq C$.
  - Executes in constant time regardless of where the first differing byte is located.
