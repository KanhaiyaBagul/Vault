# Research: Phase 1 — Cryptographic Primitives Engine & Key Derivation

**Phase:** Phase 1  
**Target:** Cryptographic Primitives & Key Derivation  
**Location:** `Vault_planing/01-crypto-primitives/`  
**Standard:** Web Crypto API (`SubtleCrypto` — W3C Recommendation)

---

## 1. Domain Problem & Cryptographic Requirements

The Verifiable Searchable Symmetric Encryption (SSE) engine requires a rock-solid, zero-dependency cryptographic layer running in both **Node.js (v18+)** and modern **Web Browsers (React / Web Workers)**.

### Core Requirements
1. **Password-Based Master Key Derivation**: Derive a high-entropy master key from a user password with resistance against GPU/ASIC dictionary attacks.
2. **Domain-Separated Subkey Derivation**: Derive 5 distinct, cryptographically independent subkeys from the master key so that search trapdoor leakage cannot compromise document contents or verification digests.
3. **Deterministic PRF Search Trapdoors**: Evaluate search tokens $T_w = \text{PRF}(K_{trap}, w)$ that are deterministic for identical keywords but indistinguishable from random bytes to an untrusted server.
4. **Blind Index Address Evaluation**: Compute pseudo-random database table addresses $L = \text{PRF}(K_{addr}, T_w \parallel c)$ for posting counters $c$.
5. **Postings Value Masking**: Generate pseudo-random masks $M = H(K_{mask}, T_w \parallel c)$ to blind document pointers in the inverted index.
6. **Authenticated Document Payload Encryption**: Encrypt document payloads using authenticated symmetric encryption (IND-CCA2) where any unauthorized bit alteration immediately fails verification.

---

## 2. Primitives Evaluation & Technology Selection

### 2.1. Master Key Derivation: PBKDF2 vs. HKDF vs. Argon2

| KDF Algorithm | Security Properties | Web Crypto Support | Verdict |
| :--- | :--- | :---: | :--- |
| **Argon2id** | Memory-hard, state-of-the-art password hashing. | **No** (requires WASM / non-native C bindings). | Rejected for core crypto to avoid bloated WASM dependencies. |
| **PBKDF2-HMAC-SHA256** | Standard NIST SP 800-132, configurable iteration count, resistant to parallel attacks. | **Native** (Universal browser & Node support). | **SELECTED for Password $\to$ Master Key.** (100,000 iterations, 128-bit random salt). |
| **HKDF-SHA256** | Extract-and-Expand PRF (RFC 5869), optimal for high-entropy master keys. | **Native** in Web Crypto. | **SELECTED for Subkey Derivation from Master Key.** |

**Strategy**:
1. User Password + Salt $\xrightarrow{\text{PBKDF2-HMAC-SHA256 (100,000 iter)}}$ Master Secret Key $K_{master}$.
2. $K_{master}$ + Info Context $\xrightarrow{\text{HKDF-Expand (SHA-256)}}$ 5 Subkeys.

---

### 2.2. Search Trapdoor PRF: HMAC-SHA256 vs. AES-CMAC

In Clusion, the author utilized `AESFastEngine` in `CMac` mode (Bouncy Castle Java).

- **Web Crypto Reality**: `AES-CMAC` is **not part of the standard W3C Web Crypto API**. While Node.js native `crypto` supports CMAC, browser `window.crypto.subtle` does not.
- **HMAC-SHA256**: Fully standardized in W3C Web Crypto, hardware-accelerated, produces 256-bit uniform outputs.
- **Cryptographic Security**: Under the standard PRF assumption, HMAC-SHA256 is computationally indistinguishable from a random oracle.
- **Verdict**: Use **HMAC-SHA256** for all search trapdoors, keyword tagging, and blind address generation.

---

### 2.3. Document Payload Cipher: AES-256-GCM vs. AES-CTR

Clusion used AES-CTR with manual fixed-size string padding (`\t\t\t`) and separate HMAC in some methods.

- **Security Risks of AES-CTR without MAC**: CTR mode is malleable. An active attacker on the cloud server can flip bits in the ciphertext and manipulate decrypted document contents without detection.
- **AES-256-GCM**:
  - Provides **Authenticated Encryption with Associated Data (AEAD)**.
  - Generates a 128-bit authentication tag validating both ciphertext integrity and authenticity.
  - IND-CCA2 secure.
  - Native hardware acceleration via Intel AES-NI / ARM Crypto instructions.
- **IV / Nonce Rules**:
  - Exactly 96 bits (12 bytes) generated via cryptographically secure RNG (`crypto.getRandomValues`).
  - **Never reuse an IV with the same key**. Every encrypted document and block receives a fresh random 12-byte IV.
- **Verdict**: Use **AES-256-GCM** exclusively for document and posting payload ciphertexts.

---

## 3. Subkey Domain Separation Specification

To ensure cross-scheme independence, each subkey is derived using HKDF-Expand with distinct domain labels:

```typescript
export enum KeyDomain {
  TRAPDOOR = "VAULT:DOM:TRAPDOOR:01",   // Used for keyword PRF trapdoors
  ADDRESS  = "VAULT:DOM:ADDRESS:02",    // Used for blind index row addressing
  MASKING  = "VAULT:DOM:MASKING:03",    // Used for XOR/stream masking of postings
  PAYLOAD  = "VAULT:DOM:PAYLOAD:04",    // Used for AES-256-GCM file encryption
  VERIFY   = "VAULT:DOM:VERIFY:05",     // Used for Merkle tree authentication
}
```

Mathematically:
$$\forall d \in \text{KeyDomain}: \quad K_d = \text{HKDF-Expand}(K_{master}, \text{info} = d, \text{length} = 256 \text{ bits})$$

---

## 4. Constant-Time Operations & Attack Mitigations

1. **Timing Attacks on Tokens & Tags**:
   - Verification of MACs and hashes must not leak timing information.
   - Use constant-time byte comparison:
     ```typescript
     export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
       if (a.length !== b.length) return false;
       let c = 0;
       for (let i = 0; i < a.length; i++) {
         c |= a[i] ^ b[i];
       }
       return c === 0;
     }
     ```
2. **Byte Encoding**:
   - Standardize on `UTF-8` via `TextEncoder` and `TextDecoder`.
   - Standardize on lowercase hexadecimal and URL-safe Base64 for string representations.
