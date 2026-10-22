# Phase 17 Research: Cloud Document Discovery, Provider-Isolated State & Fluid SSE Working Flow

## 1. Current Architecture vs. Desired Architecture

### Current State (The Flaw)
```
[User Browser (React)]
   └── Single Static localStorage ("VAULT_CLIENT_DOCS_STORE_V1")
           ▲
           │ (No cloud sync on provider switch)
           ▼
   [Cloud Switch: Memory -> Supabase]
           │
           ├── Backend switches provider internally
           └── Client keeps displaying previous provider's documents! (BUG)
```

### Desired State (Provider-Isolated & Cloud-Synced)
```
[User Browser (React)]
   ├── Active Profile: "profile_supabase_prod"
   ├── Client Storage: "VAULT_DOCS_profile_supabase_prod"
   │       ▲
   │       │ On Cloud Switch: activateProfile("profile_supabase_prod")
   │       ▼
   ├── Step 1: Backend switches to Supabase Storage Provider
   ├── Step 2: Client calls GET /api/v1/cloud/documents
   │       │   └── Returns lightweight headers only: [{ docRef, filename, fileSize, storedAt }]
   │       └── Hydrates Document Vault with Supabase's actual documents
   └── Step 3: Lazy-loads encrypted payload ONLY when user views or searches
```

---

## 2. Technical Findings & Implementation Strategy

### 2.1 Backend Lightweight Document Discovery Endpoint
- **Route**: `GET /api/v1/cloud/documents`
- **Controller in `server_app.ts`**:
  1. Retrieves active provider from `cloudFactory.getProvider()`.
  2. Enumerates stored document references via `blobStore.listDocRefs()`.
  3. Returns a lightweight document summary list:
     ```ts
     interface DocumentSummary {
       docRef: string;
       filename: string;
       fileSize: number;
       storedAt: string;
       keywordCount: number;
       provider: CloudProviderType;
     }
     ```
  4. **Performance Guarantee**:
     - Fast response (< 20ms) by retaining a lightweight header cache on the server (`.vault_storage/doc_headers.json`), auto-updated on `POST /api/v1/index` and `DELETE /api/v1/blobs/:ref`.
     - Zero multi-megabyte ciphertext payloads sent during document catalog browsing.

### 2.2 Client State Namespacing & Auto-Sync
- **Namespaced Storage**:
  - `localStorage.getItem("VAULT_DOCS_" + activeProfile.id)`
  - Switching to Supabase loads Supabase's records.
  - Switching to Disk loads Disk's records.
- **Auto-Sync Hook**:
  - When `activateProfile(id)` succeeds:
    1. Clear current document list.
    2. Set `isSyncingDocs(true)`.
    3. Fetch `/api/v1/cloud/documents`.
    4. Reconcile with local client decryption metadata.
    5. Reset `selectedDocId` and `searchResults` to clear stale cross-provider content.
    6. Set `isSyncingDocs(false)`.

### 2.3 Fluid Enterprise Working Flow Architecture
- **Stage 1: Enclave & Provider Status Bar**:
  - Display active cloud badge (e.g. `[SUPABASE PRODUCTION]` or `[LOCAL DISK]`) directly in the Document Library header with a 1-click switcher menu.
- **Stage 2: Live Ingestion Pipeline**:
  - When a file is dropped into the vault:
    - Display a live 4-step stepper badge:
      `① Extract 3-Grams` → `② Encrypt AES-256-GCM` → `③ Hash Blind Trapdoors` → `④ Upload to [Active Provider]`.
- **Stage 3: Verified Search & Lazy Cloud Retrieval**:
  - User submits search term.
  - Untrusted server queries blind index and returns matching `docRefs` + Merkle inclusion proofs.
  - Client verifies proof integrity.
  - Client fetches only the matching encrypted payload from `/api/v1/blobs/:ref`.
  - Client decrypts ciphertext locally in browser with AES-GCM and highlights search terms.

---

## 3. Security & Cryptographic Invariants
1. **Zero-Knowledge Cloud Isolation**: Cloud providers only ever store `.enc.json` blobs. File names can be obfuscated or encrypted if configured.
2. **Untrusted Server Invariant**: The server never sees plaintext keywords or document contents during listing or searching.
3. **Data Integrity**: Deleting a document removes its encrypted blob from the active cloud provider AND prunes its blind postings from the server blind index.
