# Phase 14: Client-Side Security Logging, Encrypted State Persistence & Ingested Document Vault

**Phase:** Phase 14  
**Title:** Real-World Client Cryptographic Logging, Encrypted State Management & Document Vault  
**Goal:** Implement a production-grade, zero-knowledge client telemetry architecture that captures detailed cryptographic lifecycle logs without plaintext leakage, persists client indexes securely across browser refreshes via encrypted storage, provides an interactive Document Vault Manager with 1-click on-demand decryption, and presents an interactive Client Security Activity Log Console with JSON export.

---

## 1. Context & Architectural Rationale

In zero-knowledge Searchable Symmetric Encryption (SSE), the client browser acts as a trusted cryptographic enclave interacting with an untrusted server and third-party cloud storage (Supabase, AWS S3, Disk, Memory).

### Current Limitations Identified
1. **Zero Client-Side Audit History:** While the backend maintains an untrusted server audit log, the frontend records zero client telemetry. The client cannot review its own key derivations, AES-GCM IVs, blind token generation, cloud commit latencies, or proof verification histories.
2. **Ephemeral In-Memory State Loss:** Document mappings, keyword counters, and Merkle accumulator commitments are stored strictly in JavaScript `Map()` objects in memory. Refreshing or navigating away wipes the client state completely.
3. **Missing Document Inventory / Management:** The client UI lacks an "Ingested Document Vault" table showing which files have been uploaded, their encrypted payload sizes, their target cloud providers, and timestamps. Users cannot inspect their files or decrypt specific documents on demand.
4. **Compliance & Export Gaps:** Real-world enterprise environments require verifiable client-side security audit trails (SIEM / compliance audit logs) that can be verified for hash-chain integrity and exported as JSON.

---

## 2. Invariants & Security Boundaries

1. **Zero Plaintext Leakage Invariant:**
   - Raw document text, user passwords, and raw cryptographic subkeys (`K_enc`, `K_trap`, `K_addr`, `K_mask`, `K_auth`) must **NEVER** appear in client logs, telemetry events, console outputs, or unencrypted storage.
   - All client-side log details must be strictly restricted to cryptographic metadata (hashes, IVs, byte sizes, token counts, elapsed latencies, provider names, and verification booleans).
2. **Zero Plaintext at Rest on Client Storage:**
   - Any client persistence (`localStorage` / `sessionStorage` / `IndexedDB`) must be encrypted using authenticated `AES-256-GCM` with `K_enc`. If the vault is locked or the browser is inspected, only opaque ciphertext is visible.
3. **Chained Integrity on Client Logs:**
   - Every client log entry must be chained with `SHA-256(prevHash || eventData)` so any client-side tampering is immediately detectable.
4. **W3C Web Crypto Native:**
   - Zero external npm dependencies. All client encryption and hashing must use standard `window.crypto.subtle`.

---

## 3. Wave Breakdown

### Wave 1: Core Client Logging & Encrypted Persistence Engine
- **Task 1.1:** Build `src/client/client_logger.ts` (`ClientSecurityLogger` class with zero-plaintext guards, category filters, chained SHA-256 integrity, rotation, and JSON export).
- **Task 1.2:** Build `src/client/client_storage.ts` (`ClientVaultStorage` class providing AES-256-GCM encrypted persistence for document manifests, keyword counters, auth commitments, and client logs).
- **Task 1.3:** Add `DELETE /api/v1/blobs/:ref` in `src/server/server_app.ts` to allow document deletion from the active cloud provider.
- **Task 1.4:** Re-export new modules in `src/client/index.ts`.

### Wave 2: Frontend Integration & Interactive UI Components
- **Task 2.1:** Implement **Ingested Document Vault Manager** in `public/index.html` & `public/app.js`:
  - Interactive table showing Document Name, Storage Provider, Ciphertext Size, Indexed 3-Grams, and Ingestion Time.
  - Action buttons: "Decrypt & View Plaintext" (with secure modal / preview drawer), "Download Plaintext", and "Delete".
- **Task 2.2:** Implement **Client Security & Audit Activity Log Console** in `public/index.html` & `public/app.js`:
  - Real-time cryptographic telemetry feed for `KEY_DERIVATION`, `DOC_ENCRYPTED`, `CLOUD_BLOB_COMMIT`, `MERKLE_ROOT_UPDATED`, `SSE_SEARCH_QUERY`, `PROOF_VERIFIED`, and `TAMPER_DEFENSE`.
  - Filter tabs: `[ALL]`, `[INGESTION]`, `[SEARCH]`, `[SECURITY]`, `[CLOUD]`.
  - 1-Click "Export Audit Log (JSON)" and "Clear Logs".
  - Chained integrity status indicator ("CHAIN INTEGRITY: VERIFIED").
- **Task 2.3:** Wire encrypted state auto-save and auto-restore into `handleDeriveKeys`, `indexDocumentLocal`, `handleSearch`, and cloud switching.

### Wave 3: Automated Testing, Regression & Browser Walkthrough
- **Task 3.1:** Write unit tests in `tests/client/client_logger.test.ts` (zero-plaintext assertion, hash chain verification, log rotation, export).
- **Task 3.2:** Write unit tests in `tests/client/client_storage.test.ts` (AES-256-GCM encrypted persistence, tamper detection, round-trip restoration).
- **Task 3.3:** Run full project test suite (`npm test`) ensuring 100% pass across all test suites.
- **Task 3.4:** Execute browser walkthrough via subagent (upload a document, verify Document Vault table update, verify live client security logs, test on-demand decryption, test JSON log export).
