# Plan: Phase 1 — Cryptographic Primitives Engine & Key Derivation

**Phase:** Phase 1  
**Target:** Cryptographic Primitives & Key Derivation  
**Directory:** `Vault_planing/01-crypto-primitives/`  
**Outputs Target:** `src/crypto/` and `tests/crypto/`

---

## 1. Wave-Based Execution Strategy

```
┌────────────────────────────────────────────────────────┐
│ WAVE 1: Foundation & Utilities                         │
│ Task 1.1: Environment & TypeScript config              │
│ Task 1.2: Cryptographic utilities (Hex, B64, TimeSafe) │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 2: Key Derivation & PRF Trapdoors                 │
│ Task 2.1: PBKDF2 & HKDF Key Derivation (kdf.ts)        │
│ Task 2.2: Deterministic PRF Trapdoors (trapdoors.ts)   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 3: Authenticated Cipher & Automated Test Harness  │
│ Task 3.1: Authenticated AES-256-GCM Cipher (cipher.ts) │
│ Task 3.2: Automated Cryptographic Test Suite           │
│ Task 3.3: Bit-Flip Tamper Resistance Verification      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Task Breakdown

### Wave 1: Foundation & Utilities

#### Task 1.1: Project Setup & TypeScript Configuration
- **Files to create/modify**:
  - `package.json`: Configure project metadata, `"type": "module"`, scripts for building and testing.
  - `tsconfig.json`: Enable modern ESNext modules, strict type-checking, DOM + ESNext library types.
- **Dependencies**: Native Node.js test runner (`node:test`, `node:assert`) or `tsx` / `vitest` with zero runtime dependencies.
- **Verification**: Run TypeScript compilation check (`tsc --noEmit`).

#### Task 1.2: Cryptographic Utilities (`src/crypto/utils.ts`)
- **Objective**: Implement secure byte manipulation, high-entropy random generation, and timing attack protections.
- **Functions to implement**:
  - `randomBytes(length: number): Uint8Array`: Uses `crypto.getRandomValues`.
  - `constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean`: Constant-time comparison preventing timing attacks.
  - `bytesToHex(bytes: Uint8Array): string`: Fast hex serialization.
  - `hexToBytes(hex: string): Uint8Array`: Hex parser with validation.
  - `bytesToBase64(bytes: Uint8Array): string` & `base64ToBytes(b64: string): Uint8Array`.
- **Verification**: Unit tests validating hex and Base64 roundtrips and constant-time equality edge cases.

---

### Wave 2: Key Derivation & PRF Trapdoors

#### Task 2.1: Master Key Derivation & Subkey Derivation (`src/crypto/kdf.ts`)
- **Objective**: Derive master key from user password and expand into 5 domain-separated subkeys.
- **Functions to implement**:
  - `generateSalt(length = 16): Uint8Array`
  - `deriveMasterKey(password: string, salt: Uint8Array, iterations = 100000): Promise<CryptoKey>`
    - Imports password via `crypto.subtle.importKey("raw", ...)`.
    - Derives 256-bit AES/HKDF key via `crypto.subtle.deriveKey` using `PBKDF2` with `SHA-256`.
  - `deriveSubkeys(masterKey: CryptoKey): Promise<VaultSubkeys>`
    - Uses HKDF-Expand with distinct `info` strings:
      - `kTrap`: `HMAC` (SHA-256) for search trapdoors.
      - `kAddr`: `HMAC` (SHA-256) for blind index addressing.
      - `kMask`: `HMAC` (SHA-256) for postings masking.
      - `kEnc`: `AES-GCM` (256-bit) for document payload encryption.
      - `kAuth`: `HMAC` (SHA-256) for Merkle leaf digests.
- **Verification**: Verify that two identical passwords + salt produce identical keys, while changing 1 bit in password or salt yields completely orthogonal subkeys.

#### Task 2.2: Deterministic PRF Trapdoors & Addressing (`src/crypto/trapdoors.ts`)
- **Objective**: Implement Clusion's keyword trapdoor and address formulas using HMAC-SHA256 PRF.
- **Functions to implement**:
  - `computeKeywordTrapdoor(kTrap: CryptoKey, keyword: string): Promise<Uint8Array>`
    - Normalizes keyword (lowercase, trimmed).
    - Returns `crypto.subtle.sign({ name: "HMAC" }, kTrap, UTF8(keyword))`.
  - `computeIndexAddress(kAddr: CryptoKey, tag: Uint8Array, counter: number): Promise<string>`
    - Evaluates $L_c = \text{HMAC}_{kAddr}(tag \parallel \text{counter})$.
    - Returns hex string for direct dictionary lookup.
  - `computeMask(kMask: CryptoKey, tag: Uint8Array, counter: number, length = 32): Promise<Uint8Array>`
    - Generates keystream mask for blinded postings.
- **Verification**: Deterministic output for identical $(keyword, counter)$ pairs; high entropy distribution across counters.

---

### Wave 3: Authenticated Payload Cipher & Automated Verification

#### Task 3.1: Authenticated AES-256-GCM Cipher (`src/crypto/cipher.ts`)
- **Objective**: Implement IND-CCA2 authenticated encryption for document payloads.
- **Functions to implement**:
  - `generateIV(length = 12): Uint8Array`: Fresh 96-bit random IV.
  - `encryptPayload(kEnc: CryptoKey, plaintext: Uint8Array, additionalData?: Uint8Array): Promise<EncryptedBlob>`
    - Encrypts via `crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData, tagLength: 128 }, kEnc, plaintext)`.
    - Returns `{ iv, ciphertext, tagLengthBits: 128 }`.
  - `decryptPayload(kEnc: CryptoKey, blob: EncryptedBlob, additionalData?: Uint8Array): Promise<Uint8Array>`
    - Decrypts via `crypto.subtle.decrypt(...)`. Throws `OperationError` if ciphertext or tag was tampered.
  - `serializeEncryptedBlob(blob: EncryptedBlob): SerializedEncryptedBlob`
  - `deserializeEncryptedBlob(serialized: SerializedEncryptedBlob): EncryptedBlob`
- **Verification**: Roundtrip encryption/decryption of text and binary payloads.

#### Task 3.2: Comprehensive Cryptographic Test Suite (`tests/crypto/`)
- **Objective**: Create automated tests covering all primitives.
- **Test files**:
  - `tests/crypto/utils.test.ts`: Encoding roundtrips, constant-time compare.
  - `tests/crypto/kdf.test.ts`: PBKDF2 repeatability, subkey domain isolation.
  - `tests/crypto/trapdoors.test.ts`: Deterministic trapdoors, address uniqueness.
  - `tests/crypto/cipher.test.ts`: Encrypt-decrypt roundtrips, random IV validation.

#### Task 3.3: Bit-Flip Tamper Resistance Verification
- **Objective**: Prove that tampering with even a single bit in the ciphertext causes immediate decryption failure.
- **Test Scenario**:
  - Encrypt test document `"Confidential Financial Report 2026"`.
  - Invert 1 bit in byte position 5 of the ciphertext.
  - Attempt decryption with `decryptPayload`.
  - **Assert**: Throws error; zero plaintext is leaked.

---

## 3. Success Criteria Checklist

- [ ] All cryptographic code compiles with zero TypeScript errors under strict mode.
- [ ] Uses 100% native Web Crypto API (`SubtleCrypto`) with zero third-party crypto libraries.
- [ ] PBKDF2 derives master key with 100,000 iterations and random salt.
- [ ] HKDF separates master key into 5 distinct subkeys ($K_{trap}, K_{addr}, K_{mask}, K_{enc}, K_{auth}$).
- [ ] PRF trapdoors produce deterministic 256-bit tokens for identical search keywords.
- [ ] Postings addresses evaluate dynamically from keyword tags and insertion counters.
- [ ] AES-256-GCM encrypts with random 96-bit IVs and 128-bit authentication tags.
- [ ] Bit-flip tests prove that any tampering with ciphertext causes immediate rejection.
- [ ] All automated tests pass with 100% green status.
