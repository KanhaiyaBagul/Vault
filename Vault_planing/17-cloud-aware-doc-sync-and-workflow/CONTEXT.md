# Phase 17 Context: Cloud-Aware Document Synchronization, Provider-Isolated State & Full Lifecycle Working Flow

## 1. Problem Statement & User Observation
During testing, the user identified a fundamental flaw in the application's document state management:
> *"when we change the cloud provider it must load the documents that we have uploaded like not the whole document , only the doucment name , but in here when we change the cloud provider it still shows the previous cloud provider tings , i notice this kind of flow , , i reccomend remove this kind of flaws from out applicaiton plan a whole phase for that using gsd"*
> *"first of all i want to make a full working flow of the application , for now it is only a single page thiings"*

### Key Architectural Flaws Identified:
1. **Global Static `localStorage` Cache**:
   Currently, the React UI loads and stores documents from a single, static browser key (`VAULT_CLIENT_DOCS_STORE_V1`). When switching the active cloud provider (e.g. from Local Disk to Supabase, or Supabase to S3), the frontend continues displaying the previous provider's documents because it does not query or scope document lists to the active cloud provider.
2. **Missing Document Discovery Endpoint**:
   The backend storage providers have `listBlobs()`, but there is no lightweight document metadata discovery endpoint that lists stored document headers (`docRef`, `filename`, `fileSize`, `storedAt`, `provider`) without sending the entire encrypted ciphertext payload over the network.
3. **Disjointed Single-Page Stagnation**:
   The app feels like a static single-page interface rather than an interactive enterprise workflow. Users lack a clear visual journey connecting:
   - **Vault Status & Active Cloud Enclave**
   - **Cloud Switching with Auto-Sync**
   - **Live Ingestion Pipeline** (extracting tokens → encrypting → blind indexing → uploading)
   - **Verified Search & Decrypt** (trapdoor query → Merkle verification → cloud blob download → local browser decryption).

---

## 2. Core Requirements for Phase 17

### Requirement 1: Lightweight Cloud Document Discovery API
- Provide `GET /api/v1/cloud/documents`:
  - Inspects the active cloud provider (`this.blobStore.listDocRefs()` and provider-specific metadata).
  - Returns an array of document summary objects:
    ```json
    {
      "success": true,
      "provider": "supabase",
      "profileId": "prof_supabase_prod",
      "documents": [
        {
          "docRef": "doc_9a8f1b2c",
          "filename": "Q3_Financial_Audit.pdf",
          "fileSize": 145820,
          "storedAt": "2026-10-22T10:00:00.000Z",
          "keywordCount": 42,
          "provider": "supabase"
        }
      ]
    }
    ```
  - Fast and lightweight: Only transmits headers/metadata. Does **not** transmit full multi-megabyte ciphertext blobs until a document is selected for view or matched by search.

### Requirement 2: Provider-Isolated Client Document Management
- Document catalog in `VaultContext` must be scoped by active cloud `profileId` / `provider`:
  - Switching to Supabase loads Supabase's documents.
  - Switching to Local Disk loads Disk's documents.
  - If a provider has 0 documents, displays a contextual empty state for that specific provider.
  - Persists client metadata namespaces: `VAULT_DOCS_${activeProfileId}` to prevent cross-provider state leakage across reloads.

### Requirement 3: Live Cloud Provider Auto-Sync on Activation
- When activating a profile via `activateProfile(id)`:
  1. Activates provider on backend.
  2. Automatically triggers `syncCloudDocuments()` to hydrate the document catalog for that provider.
  3. Resets active search results and document viewer to avoid displaying orphaned cross-provider document content.
  4. Displays a smooth synchronization notification (e.g. `✓ Connected to Supabase (vault-encrypted-blobs) — 4 documents synced`).

### Requirement 4: End-to-End Enterprise Working Flow (Multi-Stage Journey)
- Transform the UX from a static page into a fluid working flow:
  - **Quick Provider Switcher**: Easily switch between cloud vaults directly from the Document Library header.
  - **Live 4-Step Ingestion Pipeline**: When dropping files, display real-time animated stepper badges:
    1. `Tokenize & N-grams`
    2. `AES-GCM-256 Encrypt`
    3. `Blind Trapdoors`
    4. `Cloud Storage Upload`
  - **Zero-Knowledge Search to Cloud Blob Retrieval**:
    Searching queries the blind index → verifies Merkle proof → fetches only matching encrypted blobs from the active cloud provider → decrypts in memory → highlights keywords.
