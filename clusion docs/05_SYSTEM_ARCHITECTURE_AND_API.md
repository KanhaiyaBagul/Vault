# 05. System Architecture & Network API Specification

This document defines the complete **Client-Server Architecture**, **REST/JSON Network Protocol**, and **Web Crypto API Porting Guide** to build our Verifiable SSE Engine from scratch.

---

## 1. System Architecture Overview

```
                      TRUST BOUNDARY
┌─────────────────────────────────────────────────────────────────┐
│                    TRUSTED CLIENT ENVIRONMENT                   │
│                                                                 │
│  ┌───────────────────┐    ┌──────────────────────────────────┐  │
│  │ Document Extractor│    │ Web Crypto / Key Derivation      │  │
│  │ & N-Gram Tokenizer│    │ (PBKDF2, HMAC-SHA256, AES-GCM)   │  │
│  └─────────┬─────────┘    └────────────────┬─────────────────┘  │
│            │                               │                    │
│            ▼                               ▼                    │
│  ┌───────────────────┐    ┌──────────────────────────────────┐  │
│  │ Blind Index Maker │    │ Cryptographic Proof Verifier     │  │
│  │ & Trapdoor Engine │    │ (Merkle Root & Completeness)     │  │
│  └─────────┬─────────┘    └────────────────▲─────────────────┘  │
│            │                               │                    │
└────────────┼───────────────────────────────┼────────────────────┘
             │ HTTPS / REST API              │ Verified
             │ (Opaque Hashes & Ciphertexts) │ Ciphertexts + Proofs
┌────────────▼───────────────────────────────┴────────────────────┐
│                   UNTRUSTED CLOUD SERVER                        │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ REST API Router (/api/search, /api/documents, /api/index) │  │
│  └─────────┬───────────────────────────────┬─────────────────┘  │
│            ▼                               ▼                    │
│  ┌───────────────────┐    ┌──────────────────────────────────┐  │
│  │ Blind Index Store │    │ Encrypted Document Vault         │  │
│  │ (PostgreSQL / K-V)│    │ (Opaque Ciphertext Payloads)     │  │
│  └─────────┬─────────┘    └────────────────┬─────────────────┘  │
│            │                               │                    │
│            ▼                               ▼                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Immutable Tamper-Evident Audit Logger                     │  │
│  │ (Proves zero plaintext exposure to third-party auditors)  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Responsibilities

### 2.1. Trusted Client (Browser or Desktop CLI)
1. **Key Custody**: Master password and derived keys ($K_{trap}, K_{addr}, K_{mask}, K_{enc}, K_{auth}$) never leave client volatile memory.
2. **Payload Encryption**: Encrypts raw files using **AES-256-GCM** with random 96-bit nonces.
3. **Blind Index Generation**: Tokenizes files into keywords and $n$-grams; hashes tokens using $K_{trap}$ to generate blind index postings.
4. **Proof Generation & Storage**: Constructs local Merkle tree digests for each posting list.
5. **Trapdoor Calculation**: Derives deterministic PRF tokens for user queries.
6. **Result Verification & Decryption**: Validates server Merkle proofs $\Pi_w$ against local commitments before decrypting document references and payloads.

### 2.2. Untrusted Cloud Server (Node.js / Express / PostgreSQL)
1. **Blind Storage**: Stores opaque key-value pairs without knowledge of the underlying keywords or document IDs.
2. **Ciphertext Query Execution**: Uses client trapdoors to locate matching encrypted postings without learning the query terms.
3. **Proof Delivery**: Supplies the cryptographic Merkle proofs alongside search responses.
4. **Audit Logging**: Emits real-time cryptographic audit events showing only opaque hashes and ciphertexts.

---

## 3. Database Schema (Untrusted Server)

```sql
-- 1. Encrypted Document Payload Storage
CREATE TABLE encrypted_documents (
    doc_id_hash VARCHAR(64) PRIMARY KEY,     -- SHA-256 hash of opaque document ID
    nonce_iv BYTEA NOT NULL,                 -- 12-byte AES-GCM IV
    ciphertext_payload BYTEA NOT NULL,       -- Encrypted file bytes
    auth_tag BYTEA NOT NULL,                 -- 16-byte GCM authentication tag
    file_size_bytes INTEGER NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Blind Inverted Index (Cash et al. / DynRH Model)
CREATE TABLE blind_inverted_index (
    blind_token_hash VARCHAR(64) NOT NULL,   -- HMAC-SHA256(K_addr, tag_w || counter)
    entry_level VARCHAR(8) NOT NULL,         -- 'LEVEL_1' (Dictionary) or 'LEVEL_2' (Array)
    encrypted_value BYTEA NOT NULL,          -- AES-CTR / GCM encrypted posting block
    merkle_proof_digest VARCHAR(64) NOT NULL,-- Sub-tree Merkle root for verification
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (blind_token_hash, entry_level)
);

-- 3. Immutable Tamper-Evident Audit Log
CREATE TABLE untrusted_server_audit_log (
    log_id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    operation_type VARCHAR(32) NOT NULL,     -- 'SEARCH', 'UPLOAD_INDEX', 'DOCUMENT_GET'
    trapdoor_hashes JSONB NOT NULL,          -- Array of evaluated PRF trapdoor hashes
    accessed_storage_keys JSONB NOT NULL,    -- Array of accessed index keys
    returned_ciphertext_hashes JSONB NOT NULL,-- Array of SHA-256 digests of returned blobs
    server_execution_ms NUMERIC(10, 3) NOT NULL
);
```

---

## 4. REST Network Protocol Specification

### 4.1. `POST /api/documents/upload`
Uploads encrypted document payloads to the server.
- **Request Body**:
```json
{
  "doc_id_hash": "a1b2c3d4e5f60718...",
  "nonce_iv": "BASE64_IV_12_BYTES",
  "ciphertext_payload": "BASE64_CIPHERTEXT",
  "auth_tag": "BASE64_TAG_16_BYTES"
}
```
- **Response**: `201 Created` `{"status": "STORED", "doc_id_hash": "a1b2c3d4..."}`

---

### 4.2. `POST /api/index/update`
Uploads dynamic blind inverted index entries.
- **Request Body**:
```json
{
  "updates": [
    {
      "blind_token_hash": "7f9a8b1c...",
      "entry_level": "LEVEL_1",
      "encrypted_value": "BASE64_ENCRYPTED_POSTINGS",
      "merkle_proof_digest": "4c8e102f..."
    }
  ]
}
```
- **Response**: `200 OK` `{"indexed_entries_count": 1}`

---

### 4.3. `POST /api/search/trapdoor`
Executes an exact or substring query using opaque cryptographic trapdoors.
- **Request Body**:
```json
{
  "query_type": "SINGLE_KEYWORD", // or "SUBSTRING_CONJUNCTIVE"
  "trapdoors": [
    {
      "token_key": "0x4a8f9b1c2d3e...",
      "counter_bound": 5
    }
  ]
}
```
- **Server Execution**:
  1. Computes addresses $L_i = F(token\_key, i)$ for $i \in [0, counter\_bound - 1]$.
  2. Retrieves matching records from `blind_inverted_index`.
  3. Reconstructs Merkle proof.
  4. Appends transaction to `untrusted_server_audit_log`.
- **Response Body**:
```json
{
  "status": "SUCCESS",
  "results_count": 3,
  "encrypted_postings": [
    "BASE64_ENCRYPTED_DOC_REF_1",
    "BASE64_ENCRYPTED_DOC_REF_2",
    "BASE64_ENCRYPTED_DOC_REF_3"
  ],
  "verification_proof": {
    "merkle_root": "0x5d41402abc4b...",
    "leaf_count": 3
  }
}
```

---

### 4.4. `GET /api/audit/logs`
Retrieves untrusted server audit records for inspection.
- **Response**: List of audit entries proving zero plaintext exposure.

---

## 5. Web Crypto API Porting Guide (Java/BouncyCastle $\to$ Web Crypto)

| Cryptographic Operation | Clusion (Java / Bouncy Castle) | Modern Web Crypto API (SubtleCrypto) |
| :--- | :--- | :--- |
| **Key Derivation (PBKDF2)** | `SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1")`<br>`PBEKeySpec(pass, salt, 100000, 256)` | `crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, baseKey, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"])` |
| **Search Trapdoor PRF** | `CMac cmac = new CMac(new AESFastEngine());`<br>`CryptoPrimitives.generateCmac(key, word)` | `crypto.subtle.sign({ name: "HMAC", hash: "SHA-256" }, hmacKey, new TextEncoder().encode(word))` |
| **Index Value Masking** | `HMac hmac = new HMac(new SHA256Digest());`<br>`CryptoPrimitives.generateHmac(...)` | `crypto.subtle.sign({ name: "HMAC", hash: "SHA-256" }, maskKey, dataBuffer)` |
| **Document Encryption** | `CryptoPrimitives.encryptAES_CTR_String(...)`<br>`auth_encrypt_AES_HMAC(...)` | `crypto.subtle.encrypt({ name: "AES-GCM", iv: randomIV }, encKey, plaintextBytes)` *(Authenticated IND-CCA2 security)* |
| **Secure Random** | `SecureRandom.nextBytes(iv)` | `crypto.getRandomValues(new Uint8Array(12))` |
| **Merkle Leaf Hash** | `HMac(new SHA256Digest())` | `crypto.subtle.digest("SHA-256", leafBuffer)` |
