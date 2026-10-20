# Plan: Phase 9 — Third-Party Cloud Storage Integration

**Phase:** Phase 9  
**Goal:** Implement a production-grade, zero-dependency, pluggable Third-Party Cloud Storage integration (AWS S3, Cloudflare R2, MinIO, Supabase Storage, and Local Disk Vault) where the untrusted cloud stores only opaque encrypted payloads (`AES-256-GCM`), and our client application independently retrieves, verifies, and decodes them locally.  
**Target Files:**
- `src/server/cloud/cloud_provider.ts` (Core Provider Interface & Types)
- `src/server/cloud/memory_provider.ts` (In-Memory Testing Provider)
- `src/server/cloud/disk_provider.ts` (Local Persistent Storage Provider)
- `src/server/cloud/s3_provider.ts` (S3 / Cloudflare R2 / MinIO REST Provider with native SigV4)
- `src/server/cloud/supabase_provider.ts` (Supabase Storage REST Provider)
- `src/server/cloud/cloud_factory.ts` (Provider Factory & Dynamic Manager)
- `src/server/blob_store.ts` (Refactor to use Pluggable Cloud Provider)
- `src/server/server_app.ts` (Cloud Status & Dynamic Configuration REST Endpoints)
- `public/index.html` (Cloud Storage Connector Panel & Topbar Security Chip)
- `public/app.js` (Cloud Provider Switching, Health Ping & Live Decryption Telemetry)
- `tests/server/cloud_providers.test.ts` (Comprehensive Cloud Unit Tests)
- `tests/server/cloud_api.test.ts` (Cloud REST API Integration Tests)

---

## Waves Breakdown

### Wave 1: Pluggable Cloud Storage Provider Architecture & Core Drivers
- **Task 1.1**: Define `ICloudStorageProvider` interface and types in `src/server/cloud/cloud_provider.ts`:
  - `putBlob(payload: EncryptedBlobPayload): Promise<{ success: boolean; storageKey: string; etag?: string }>`
  - `getBlob(docRef: string): Promise<EncryptedBlobPayload | undefined>`
  - `hasBlob(docRef: string): Promise<boolean>`
  - `deleteBlob(docRef: string): Promise<boolean>`
  - `listBlobs(): Promise<string[]>`
  - `healthCheck(): Promise<{ ok: boolean; provider: string; details: Record<string, unknown> }>`
- **Task 1.2**: Implement `InMemoryStorageProvider` in `src/server/cloud/memory_provider.ts` (preserves 100% backward compatibility for test suites).
- **Task 1.3**: Implement `DiskStorageProvider` in `src/server/cloud/disk_provider.ts` to persist encrypted JSON payloads under `.vault_storage/`.
- **Task 1.4**: Implement `S3CloudStorageProvider` in `src/server/cloud/s3_provider.ts`:
  - Zero external npm dependencies (no bloated AWS SDK).
  - Pure Web Crypto / Node `crypto` AWS Signature Version 4 (`AWS4-HMAC-SHA256`) request signer.
  - S3 REST endpoints: `PUT /{bucket}/{docRef}.enc`, `GET /{bucket}/{docRef}.enc`, `HEAD /{bucket}/{docRef}.enc`, `DELETE /{bucket}/{docRef}.enc`.
  - Supports custom endpoint URLs (enables AWS S3, Cloudflare R2, MinIO, and Wasabi).
- **Task 1.5**: Implement `SupabaseStorageProvider` in `src/server/cloud/supabase_provider.ts`:
  - Uses Supabase Storage REST API (`/storage/v1/object/{bucket}/{docRef}.enc`).
  - Bearer token / `apikey` authentication.
- **Task 1.6**: Author comprehensive unit tests in `tests/server/cloud_providers.test.ts`:
  - Test `InMemoryStorageProvider` CRUD and listing.
  - Test `DiskStorageProvider` file creation, retrieval, and deletion.
  - Test `S3CloudStorageProvider` SigV4 signature derivation and request structure with mock HTTP handlers.
  - Test `SupabaseStorageProvider` request formatting and error resilience.

### Wave 2: Server Backend Integration, REST Endpoints & Cloud Factory
- **Task 2.1**: Implement `CloudStorageFactory` in `src/server/cloud/cloud_factory.ts`:
  - Reads environment variables: `STORAGE_PROVIDER`, `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_BUCKET`.
  - Supports dynamic runtime switching between providers.
  - Provides graceful fallback to `InMemoryStorageProvider` if cloud credentials fail.
- **Task 2.2**: Update `src/server/blob_store.ts` to bridge `EncryptedBlobStore` to `ICloudStorageProvider`:
  - Maintain synchronous cache / asynchronous cloud sync guarantees.
  - Ensure zero regressions across existing unit and integration tests.
- **Task 2.3**: Expose Cloud REST Endpoints in `src/server/server_app.ts`:
  - `GET /api/v1/cloud/status`: Returns active provider, latency, bucket configuration, and stored blob count.
  - `POST /api/v1/cloud/config`: Allows runtime provider reconfiguration and credentials testing.
- **Task 2.4**: Wire `ZeroKnowledgeAuditLogger` to log all third-party cloud storage operations (`CLOUD_BLOB_PUT`, `CLOUD_BLOB_GET`) with zero plaintext leakage (recording only SHA-256 hashes of payloads).
- **Task 2.5**: Author integration tests in `tests/server/cloud_api.test.ts` verifying all cloud endpoints.

### Wave 3: Interactive Dashboard UI (Cloud Connector Drawer) & End-to-End Verification
- **Task 3.1**: Add "Cloud Storage & Third-Party Bucket Connector" panel in `public/index.html`:
  - Styled in Deep Rust `#22120E` / `#5A2E25` product chrome with Claude warm-editorial typography.
  - Dropdown selector for active cloud provider:
    - *Local Memory (Fast Simulation)*
    - *Local Disk Vault (`.vault_storage/`)*
    - *AWS S3 / Cloudflare R2 / MinIO (S3-Compatible)*
    - *Supabase Storage (REST)*
  - Configuration fields: Bucket Name, Region, Endpoint URL, Access Keys (stored locally).
  - "Ping & Test Cloud Connection" button with real-time latency readout.
- **Task 3.2**: Add Header Security Chip: `Storage: [S3-ACTIVE]` / `[SUPABASE-ACTIVE]` / `[LOCAL-SIM]` with live status indicator dot.
- **Task 3.3**: Update `public/app.js`:
  - Connect UI controls to `/api/v1/cloud/status` and `/api/v1/cloud/config`.
  - Display explicit visual telemetry when documents are encrypted locally and transferred to third-party cloud storage.
  - Display explicit visual telemetry when search results are retrieved from third-party cloud, verified via Merkle proofs, and decrypted locally.
- **Task 3.4**: Visual regression and browser testing using `browser_subagent` at `http://localhost:3000/`.
- **Task 3.5**: Full test suite regression verification (`npm test` 100% green across all existing and new tests).
- **Task 3.6**: Update `ROADMAP.md` and `STATE.md`, commit all changes to git, and summarize for the user.
