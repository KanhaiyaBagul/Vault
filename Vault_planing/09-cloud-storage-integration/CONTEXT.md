# Context: Phase 9 — Third-Party Cloud Storage Integration

**Phase:** Phase 9  
**Domain:** Third-Party Cloud Storage / Encrypted Object Store / Zero-Knowledge Integration  
**Problem Statement Reference:** Problem 2 (Official Problem Statement)  
> *"Storing sensitive enterprise documents in **third-party cloud storage** leaves proprietary data exposed to insider attacks, while standard end-to-end encryption completely breaks server-side keyword indexing and full-text search capabilities."*

---

## 1. Architectural Motivation & Security Invariants

In our initial implementation through Phase 8, the Untrusted Cloud Server was implemented as a local Node.js microservice (`src/server/server_app.ts`) utilizing an in-memory key-value dictionary (`EncryptedBlobStore`).

While this established the exact cryptographic and HTTP REST API boundary (`POST /api/v1/documents`, `POST /api/v1/search`), it lacked real-world connectivity to **actual third-party cloud infrastructure** (such as AWS S3, Cloudflare R2, MinIO, or Supabase Object Storage).

### The Zero-Trust Cloud Security Invariants:
1. **Zero Key Knowledge**: The third-party cloud provider NEVER receives master passwords, subkeys, or encryption keys ($K_{enc}, K_{trap}, K_{addr}, K_{mask}, K_{auth}$). All keys reside exclusively in the client's local volatile memory.
2. **Zero Plaintext Knowledge**: The third-party cloud receives ONLY:
   - `opaqueDocRef`: A 64-character SHA-256 hash or HMAC of the document reference.
   - `ivHex`: The 12-byte initialization vector (96-bit).
   - `ciphertextHex`: The AES-256-GCM encrypted payload and 16-byte authentication tag.
   - `sizeBytes`: Byte length.
   - Blind Inverted Index key-value pairs (opaque HMAC addresses to masked XOR postings).
3. **Local Client Decoding**: Search candidates returned by the cloud are verified for completeness and authenticity via Merkle inclusion proofs $\Pi_w$. Once verified, document payloads are retrieved from the third-party cloud and decrypted *locally* within the user's browser using `SubtleCrypto.decrypt`.
4. **Third-Party Insider Attack Immunity**: Even if an administrator, malicious cloud insider, or attacker gains full root access to the AWS S3 bucket or Supabase project, they obtain only opaque, unlinkable, authenticated ciphertexts and blind index hashes.

---

## 2. Technology Stack & Provider Ecosystem

To avoid the bloat of Clusion (which pulled in a 100MB+ legacy AWS SDK and Hadoop dependencies), Vault will implement a **zero-dependency, lightweight, pluggable cloud storage architecture**:

| Technology | Role | Implementation Detail |
| :--- | :--- | :--- |
| **Pluggable Interface** | Storage Abstraction | `ICloudStorageProvider` interface standardizing CRUD, listing, and health checks |
| **AWS S3 / Cloudflare R2 / MinIO** | S3-Compatible Object Store | Native REST client using standard Web/Node `fetch` + pure Web Crypto AWS SigV4 request signing |
| **Supabase Storage** | Cloud REST Object Store | Supabase Storage v1 REST API (`/storage/v1/object/`) |
| **Local Disk Vault** | Persistent Local Fallback | Local filesystem storage under `.vault_storage/` for offline/air-gapped persistence |
| **In-Memory Store** | Ephemeral / Test Store | High-speed memory store for automated tests (`npm test`) and zero-config local dev |

---

## 3. Threat Model & Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            TRUSTED CLIENT (Browser)                          │
│                                                                              │
│  [Plaintext Doc] ──> AES-256-GCM ──> [Encrypted Payload + opaqueDocRef]      │
│  [Keywords]      ──> HMAC-SHA256 ──> [Blind Index Entries + Merkle Proofs]   │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │ HTTPS (Zero Plaintext Transmitted)
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    UNTRUSTED PROXY & CLOUD COORDINATOR                       │
│                         (`src/server/server_app.ts`)                         │
│                                                                              │
│  - Evaluates blind trapdoors & filters candidate posting lists               │
│  - Coordinates storage operations via `CloudStorageFactory`                  │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │
                ┌──────────────────────┴──────────────────────┐
                ▼                                             ▼
┌──────────────────────────────┐               ┌──────────────────────────────┐
│   THIRD-PARTY CLOUD BUCKET   │               │    UNTRUSTED SEARCH STORE    │
│  (AWS S3 / Cloudflare R2 /   │               │   (Blind Multi-Map Key-Value │
│      Supabase Storage)       │               │      & Tamper Audit Chain)   │
│                              │               │                              │
│  Stores:                     │               │  Stores:                     │
│  - opaqueDocRef.enc          │               │  - blind_token_hash          │
│  - Nonce IV (12 bytes)       │               │  - masked_posting_array      │
│  - Auth Tag (16 bytes)       │               │  - Merkle accumulator roots  │
│  - Upload epoch & size       │               │  - Zero-knowledge audit log  │
│                              │               │                              │
│  * Learns ZERO Plaintext *   │               │  * Learns ZERO Plaintext *   │
└──────────────────────────────┘               └──────────────────────────────┘
```

---

## 4. Architectural Boundaries & Backward Compatibility

- **100% Backward Compatibility**: All 96 existing automated tests must continue to pass using the default `InMemoryStorageProvider`.
- **Runtime Provider Switching**: The application will support switching storage providers on the fly via environment variables (`STORAGE_PROVIDER`) or through the UI Cloud Connector Drawer.
- **Fail-Safe Fallbacks**: If third-party cloud credentials fail or network connectivity drops, the system gracefully reports connection errors in the audit log without crashing the server.
