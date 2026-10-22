# Phase 17 Plan: Cloud-Aware Document Synchronization, Provider-Isolated State & Full Lifecycle Working Flow

## Objective
Eliminate cross-provider document leakage and transform the single-page application into a fluid, enterprise-grade working flow. When switching cloud providers (Supabase, S3, Disk, Memory), dynamically query and hydrate the document catalog for that specific active provider (names/metadata only, lazy-loading encrypted payloads on demand). Provide provider-isolated client state, lightweight document discovery REST API (`GET /api/v1/cloud/documents`), real-time 4-step cryptographic upload pipeline status, and an intuitive end-to-end lifecycle flow from cloud connection to verified zero-knowledge retrieval.

---

## Wave Breakdown

### Wave 1: Backend Lightweight Document Discovery & Header Indexing
- **Task 1.1**: Maintain lightweight document headers on the server:
  - When blobs are stored (`POST /api/v1/index`) or deleted (`DELETE /api/v1/blobs/:ref`), track header metadata: `docRef`, `filename`, `fileSize`, `storedAt`, `keywordCount`, and `provider`.
  - Persist header index to `.vault_storage/doc_headers.json`.
- **Task 1.2**: Implement `GET /api/v1/cloud/documents`:
  - Enumerate the active cloud provider's stored references.
  - Return lightweight metadata array (`docRef`, `filename`, `fileSize`, `storedAt`, `provider`).
  - Guarantee fast execution (< 20ms) without transmitting full ciphertext payloads.
- **Task 1.3**: Automated integration test in `tests/server/cloud_api.test.ts` verifying `GET /api/v1/cloud/documents` filters by active cloud provider and reflects additions/deletions.

### Wave 2: Provider-Scoped Client State & Dynamic Auto-Sync
- **Task 2.1**: Namespace client document records by active cloud profile ID in `VaultContext.tsx` (`VAULT_DOCS_${profileId}`).
- **Task 2.2**: Implement `syncCloudDocuments()` in `VaultContext.tsx`:
  - Call `GET /api/v1/cloud/documents` whenever a profile is activated or on initial load.
  - Reconcile cloud headers with client decryption metadata.
  - Clear stale search results and viewer state when provider changes.
- **Task 2.3**: Implement lazy payload loading:
  - When user clicks a document card or when a search matches, fetch the encrypted blob from `/api/v1/blobs/:docRef` on demand and decrypt with `keys.encryptionKey`.

### Wave 3: Fluid Working Flow UI Enhancements
- **Task 3.1**: Document Vault Panel Header Quick Cloud Switcher:
  - Display active cloud connection badge directly in the left panel header.
  - Allow 1-click switching between configured cloud connections without leaving the workspace.
- **Task 3.2**: Real-Time 4-Step Cryptographic Ingestion Stepper:
  - When dragging or uploading files, show animated stepper badges:
    `① Tokenize` → `② Encrypt AES-GCM` → `③ Blind Trapdoors` → `④ Cloud Upload`.
- **Task 3.3**: Contextual Provider Empty State:
  - If the active provider has 0 documents, display:
    `[Cloud Provider Name] Bucket is Empty. Drop files to encrypt and store in [Provider Name].`
- **Task 3.4**: Document Cards Cloud Badges:
  - Display subtle pill badges on each document card indicating the storage locality (`SUPABASE`, `AWS S3`, `DISK`, `MEMORY`).

### Wave 4: Integration, Verification & Automated Testing
- **Task 4.1**: Build frontend bundle with `npm run build`.
- **Task 4.2**: Execute automated regression test suite (`npm test`) ensuring all 157+ tests pass.
- **Task 4.3**: End-to-end browser walkthrough:
  - Upload document to Local Disk.
  - Switch to Supabase: verify document list clears/switches to Supabase's bucket.
  - Upload document to Supabase: verify document appears with `[SUPABASE]` badge.
  - Switch back to Local Disk: verify Disk documents reappear without data bleeding.
