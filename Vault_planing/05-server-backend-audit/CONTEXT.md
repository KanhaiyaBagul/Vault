# Context: Phase 5 — Untrusted Server Backend & Zero-Knowledge Audit Logger

**Phase:** Phase 5  
**Target:** Cloud Storage REST Microservice & Cryptographic Hash-Chained Audit Logger  
**Directory:** `Vault_planing/05-server-backend-audit/`  
**Outputs Target:** `src/server/` and `tests/server/`  
**Dependencies:** Phase 1 (`src/crypto/`), Phase 3 (`src/engine/`), Phase 4 (`src/verifiability/`)

---

## 1. Domain Problem & Scope

The core security premise of Verifiable Searchable Symmetric Encryption is that cloud storage is hosted by an **untrusted third party**:
1. **Encrypted Blob Storage**: The cloud server must store documents strictly as opaque AES-256-GCM ciphertexts without ever learning document contents, plaintext filenames, or user metadata.
2. **Blind Trapdoor Search API**: The server must expose a search interface accepting opaque trapdoors, executing sub-linear lookups over the blind multi-map (`ServerBlindStore`), and attaching Merkle proofs (`buildVerifiableSearchBundle`).
3. **Zero-Knowledge Audit Trail**:
   - Compliance standards (HIPAA, SOC2, GDPR, ISO 27001) require comprehensive audit logging of all data access and modifications.
   - Traditional logs leak plaintexts (e.g. `User searched for "Alice cancer diagnosis"` or `Stored file "Q3_payroll.xlsx"`).
   - **Zero-Knowledge Audit Logging Requirement**: The log must record every index, search, and retrieval operation using **only opaque hashes, trapdoor tags, and ciphertexts**.
   - **Tamper-Evident Hash Chain**: Each audit log entry is linked to the previous entry via SHA-256 hash pointers, making history immutable. An external auditor can verify the chain's integrity mathematically without learning any plaintext information.

---

## 2. Technology Choices & Rationale

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **HTTP Server & Routing** | Native Node.js `node:http` | Zero external dependencies; avoids npm supply chain risks; ultra-fast startup and execution; runs portably across any environment. |
| **Object / Blob Storage** | In-Memory Key-Value with Opaque Keys | Simulated cloud bucket (S3-compatible semantics) keyed by `opaqueDocRef`. |
| **Audit Log Hash Chain** | SHA-256 Block/Log Chaining | Append-only ledger where $\text{Hash}_n = \text{SHA-256}(\text{Index}_n \parallel \text{Timestamp}_n \parallel \text{OpType}_n \parallel \text{PayloadHash}_n \parallel \text{Hash}_{n-1})$. |
| **Cryptographic Primitives** | W3C Web Crypto API (`globalThis.crypto.subtle`) | Unifies client and server cryptographic implementations with native C++ acceleration. |

---

## 3. In-Scope Deliverables

1. **Encrypted Blob Object Store (`src/server/blob_store.ts`)**:
   - Stores and retrieves encrypted payloads by `opaqueDocRef`.
2. **Tamper-Evident Zero-Knowledge Audit Logger (`src/server/audit_logger.ts`)**:
   - Maintains cryptographic hash chain of all system events.
   - Independent verification method `verifyAuditChain()`.
3. **Search & Proof Controller (`src/server/search_controller.ts`)**:
   - Coordinates `ServerBlindStore` lookups and Merkle bundle generation.
4. **REST API Microservice (`src/server/server_app.ts`)**:
   - Complete HTTP request router for indexing, searching, blob retrieval, and audit inspection.
5. **Automated Test Suite (`tests/server/`)**:
   - Validates REST endpoints, zero-knowledge logging properties, and hash chain tamper resistance.
