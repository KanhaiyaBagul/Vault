# Context: Phase 1 — Cryptographic Primitives Engine & Key Derivation

**Phase:** Phase 1  
**Target:** Cryptographic Primitives & Key Derivation  
**Directory:** `Vault_planing/01-crypto-primitives/`

---

## 1. Scope & Boundaries

### 1.1. In-Scope Deliverables
1. **Master Key Derivation (`kdf.ts`)**:
   - `deriveMasterKey(password: string, salt: Uint8Array, iterations?: number): Promise<CryptoKey>`
   - `deriveSubkeys(masterKey: CryptoKey): Promise<VaultSubkeys>`
   - `generateSalt(length?: number): Uint8Array`
2. **Deterministic PRF & Search Trapdoors (`trapdoors.ts`)**:
   - `computeKeywordTrapdoor(kTrap: CryptoKey, keyword: string): Promise<Uint8Array>`
   - `computeIndexAddress(kAddr: CryptoKey, tag: Uint8Array, counter: number): Promise<string>`
   - `computeMask(kMask: CryptoKey, tag: Uint8Array, counter: number, length?: number): Promise<Uint8Array>`
3. **Authenticated Document Payload Cipher (`cipher.ts`)**:
   - `encryptPayload(kEnc: CryptoKey, plaintext: Uint8Array): Promise<EncryptedBlob>`
   - `decryptPayload(kEnc: CryptoKey, encrypted: EncryptedBlob): Promise<Uint8Array>`
   - `generateIV(length?: number): Uint8Array`
4. **Encoding & Constant-Time Utilities (`utils.ts`)**:
   - Hex / Base64 serialization: `bytesToHex`, `hexToBytes`, `bytesToBase64`, `base64ToBytes`.
   - Security: `constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean`.
5. **Test Harness & Test Vectors (`tests/`)**:
   - Deterministic test vector validation.
   - Bit-flip tamper detection tests.
   - IV freshness and non-reuse assertions.

### 1.2. Out-of-Scope (Deferred to Later Phases)
- Text tokenization and N-gram extraction (Phase 2).
- Server-side blind index database schema and storage (Phase 3 & Phase 5).
- Full Merkle Tree construction and proof verification (Phase 4).
- HTTP REST API routes and database connections (Phase 5).

---

## 2. Cryptographic Architecture Contracts & TypeScript Types

```typescript
// Core subkey container holding the 5 domain-separated keys
export interface VaultSubkeys {
  kTrap: CryptoKey;   // PRF key for keyword search trapdoors (HMAC-SHA256)
  kAddr: CryptoKey;   // PRF key for blind index row addressing (HMAC-SHA256)
  kMask: CryptoKey;   // Masking key for blinding postings lists (HMAC-SHA256)
  kEnc: CryptoKey;    // Symmetric cipher key for file payloads (AES-256-GCM)
  kAuth: CryptoKey;   // Authentication key for Merkle leaf proofs (HMAC-SHA256)
}

// Encrypted blob container for authenticated ciphertexts
export interface EncryptedBlob {
  iv: Uint8Array;            // Exactly 12 bytes (96 bits)
  ciphertext: Uint8Array;    // Encrypted bytes (includes GCM 128-bit tag in Web Crypto)
  tagLengthBits: number;     // Fixed at 128
}

// Serialized representation for network transport or database persistence
export interface SerializedEncryptedBlob {
  ivHex: string;
  ciphertextHex: string;
}

// Trapdoor output format
export interface SearchTrapdoor {
  tokenHex: string;          // Hex-encoded 256-bit PRF token
  rawBytes: Uint8Array;      // 32-byte raw token
}
```

---

## 3. Security Guarantees & Constraints

1. **IND-CCA2 Security**: All payload ciphertexts are produced via `AES-256-GCM` with 128-bit authentication tags. Tampered ciphertexts must throw an error upon decryption.
2. **PRF Indistinguishability**: Without knowledge of $K_{trap}$, the output of `computeKeywordTrapdoor` must be computationally indistinguishable from uniform random noise of length 256 bits.
3. **Zero Shared Secrets**: The server is never provided $K_{master}$, $K_{enc}$, or $K_{auth}$. The server only receives derived query trapdoors and opaque address labels.
4. **No External NPM Dependencies**: Uses pure standard Web Crypto API (`globalThis.crypto.subtle`), ensuring instant browser and Node.js execution without vulnerable or bloated native C bindings.
