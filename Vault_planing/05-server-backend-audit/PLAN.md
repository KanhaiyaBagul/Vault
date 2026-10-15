# Plan: Phase 5 — Untrusted Server Backend & Zero-Knowledge Audit Logger

**Phase:** Phase 5  
**Target:** Cloud Storage REST Microservice & Cryptographic Hash-Chained Audit Logger  
**Directory:** `Vault_planing/05-server-backend-audit/`  
**Outputs Target:** `src/server/` and `tests/server/`

---

## 1. Wave-Based Execution Strategy

```
┌────────────────────────────────────────────────────────┐
│ WAVE 1: Storage & Hash-Chained Audit Logger            │
│ Task 1.1: Encrypted Blob Object Store (blob_store.ts)  │
│ Task 1.2: Zero-Knowledge Audit Logger (audit_logger.ts)│
│ Task 1.3: Unit tests for store & audit chain integrity │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 2: Search Controller & REST API Microservice      │
│ Task 2.1: Search & Prover Controller (search_controller│
│ Task 2.2: Native Node.js REST API Server (server_app.ts│
│ Task 2.3: Module entry point (src/server/index.ts)     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 3: End-to-End REST Integration & Full Regression  │
│ Task 3.1: Full REST API integration tests              │
│ Task 3.2: Tamper-evident log verification tests        │
│ Task 3.3: Full project regression verification         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Task Breakdown

### Wave 1: Storage & Hash-Chained Audit Logger

#### Task 1.1: Encrypted Blob Object Store (`src/server/blob_store.ts`)
- Keyed by `opaqueDocRef`.
- Stores `EncryptedBlobPayload`:
  - `docRef: string`
  - `ivHex: string`
  - `ciphertextHex: string`
  - `sizeBytes: number`
  - `uploadedAt: number`
- Methods: `putBlob`, `getBlob`, `hasBlob`, `deleteBlob`, `listDocRefs`, `size`.
- Zero plaintext knowledge: only stores ciphertexts.

#### Task 1.2: Zero-Knowledge Audit Logger (`src/server/audit_logger.ts`)
- Cryptographic hash-chained append-only log.
- `AuditLogEntry`:
  - `index: number`
  - `timestamp: number`
  - `operationType: "SYSTEM_INIT" | "INDEX_DOCUMENT" | "SEARCH_QUERY" | "RETRIEVE_BLOB"`
  - `opaqueDetails: Record<string, unknown>`
  - `detailsHash: string`
  - `prevHash: string`
  - `entryHash: string`
- Methods:
  - `logOperation(opType, opaqueDetails): Promise<AuditLogEntry>`
  - `getEntries(): AuditLogEntry[]`
  - `verifyAuditChain(): Promise<{ isChainValid: boolean; brokenIndex?: number; reason?: string }>`
  - `latestHash(): string`

---

### Wave 2: Search Controller & REST API Microservice

#### Task 2.1: Search & Prover Controller (`src/server/search_controller.ts`)
- Integrates `ServerBlindStore` (Phase 3) and `buildVerifiableSearchBundle` (Phase 4).
- Methods:
  - `indexDocument(docRef, entries): void`
  - `search(queryType, tokens): Promise<VerifiableSearchResultBundle[]>`

#### Task 2.2: REST API Server (`src/server/server_app.ts`)
- Zero-dependency HTTP router built on Node.js `node:http`.
- Routes:
  - `POST /api/v1/index`: Indexes document & stores blob.
  - `POST /api/v1/search`: Evaluates blind query & returns Merkle proof bundle.
  - `GET /api/v1/blobs/:ref`: Retrieves encrypted document payload.
  - `GET /api/v1/audit/log`: Retrieves audit entries.
  - `GET /api/v1/audit/verify`: Validates hash chain integrity.
  - `GET /api/v1/health`: Server health & statistics.
- Supports graceful shutdown and dynamic port listening.

#### Task 2.3: Module Entry Point (`src/server/index.ts`)
- Re-exports all Phase 5 classes and functions.

---

### Wave 3: End-to-End REST Integration & Regression

#### Task 3.1: Integration Tests (`tests/server/server_app.test.ts`)
- Boots test HTTP server on ephemeral port (port 0).
- Executes real HTTP requests using native `fetch`.
- Uploads documents, performs blind searches, downloads ciphertexts, inspects audit logs.
- Simulates log tampering and proves `verifyAuditChain` catches modifications.

#### Task 3.2: Full Regression Run
- Verifies all suites pass together (`npm test`).

---

## 3. Success Criteria Checklist

- [ ] Encrypted blob store safely persists and isolates document ciphertexts.
- [ ] Audit logger builds tamper-evident SHA-256 hash chains.
- [ ] Modifying an audit log entry immediately breaks chain verification.
- [ ] REST API routes index, search, and blob downloads without errors.
- [ ] Server log exposes zero plaintext keywords, document titles, or contents.
- [ ] All automated tests pass with 100% green status.
