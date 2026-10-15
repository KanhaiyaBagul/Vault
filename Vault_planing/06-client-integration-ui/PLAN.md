# Plan: Phase 6 — Client Integration, Interactive Web UI & Verification

**Phase:** Phase 6  
**Target:** Client SDK, Boolean Query Engine, Interactive Web Dashboard, and Tamper Demonstrations  
**Directory:** `Vault_planing/06-client-integration-ui/`  
**Outputs Target:** `src/client/`, `public/`, and `tests/client/`

---

## 1. Wave-Based Execution Strategy

```
┌────────────────────────────────────────────────────────┐
│ WAVE 1: Boolean Query Engine & Unified Client SDK      │
│ Task 1.1: Boolean Query Evaluator (boolean_query.ts)   │
│ Task 1.2: Unified Client SDK (vault_client.ts)         │
│ Task 1.3: Unit tests for Boolean logic & Client SDK    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 2: Interactive Web Application Dashboard          │
│ Task 2.1: Semantic HTML5 Dashboard (public/index.html) │
│ Task 2.2: Cyber Dark-Mode Styling (public/styles.css)  │
│ Task 2.3: Frontend Controller (public/app.js)          │
│ Task 2.4: Static file serving in VaultServerApp        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ WAVE 3: End-to-End Verification & Demonstration        │
│ Task 3.1: Full HTTP UI & SDK integration tests         │
│ Task 3.2: Active cloud attacker simulation tests       │
│ Task 3.3: Full project regression run (100% green)     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Task Breakdown

### Wave 1: Boolean Query Engine & Unified Client SDK

#### Task 1.1: Boolean Query Evaluator (`src/client/boolean_query.ts`)
- Parses queries containing boolean operators (`AND`, `OR`, `NOT`).
- Evaluates:
  - Exact words & substrings via 3-grams.
  - Conjunctions: set intersection across verified document ID sets.
  - Disjunctions: set union across verified document ID sets.
  - Negations: set difference across verified document ID sets.

#### Task 1.2: Unified Client SDK (`src/client/vault_client.ts`)
- Class `VaultClient`:
  - `initialize(password: string, salt?: Uint8Array): Promise<void>`
  - `indexDocument(filename: string, content: string): Promise<IndexResult>`
  - `search(query: string): Promise<SearchResultWithVerification>`
  - `verifyCloudAuditLog(): Promise<AuditVerificationReport>`
  - `simulateCloudTamper(attack: "drop" | "fabricate" | "modify", query: string): Promise<VerificationResult>`

#### Task 1.3: Unit Tests (`tests/client/boolean_query.test.ts`, `tests/client/vault_client.test.ts`)

---

### Wave 2: Interactive Web Application Dashboard

#### Task 2.1: Single-Page Dashboard (`public/index.html`)
- Semantic structure:
  - Header: Master password key derivation bar with live entropy indicator.
  - Dual Split-Screen View:
    - **Client View (Left)**: Upload zone with drag-and-drop, search bar, decrypted document list with text viewer.
    - **Cloud Lens (Right)**: Untrusted server perspective showing opaque 256-bit hash addresses, encrypted blobs, and proof verification badges.
  - Attacker Demonstration Controls: Interactive buttons to trigger simulated dropped or fabricated records.
  - Live Audit Log Viewer: Visual table of the SHA-256 hash chain with instant verification indicator.

#### Task 2.2: Dark-Mode Styling (`public/styles.css`)
- Premium design system:
  - Deep dark background (`#0B0F19`), translucent glass cards, neon green (`#10B981`) and cyan (`#06B6D4`) badges.
  - Responsive layout, clean typography, smooth transitions, and accessible contrast.

#### Task 2.3: Frontend Controller (`public/app.js`)
- Connects the browser UI to the Web Crypto API and REST endpoints.
- Manages client state, handles file uploads, queries the server, checks Merkle proofs, and updates the dual-view display.

#### Task 2.4: Static Asset Serving in `VaultServerApp` (`src/server/server_app.ts`)
- Serves `/`, `/styles.css`, `/app.js` directly from the `public/` directory.

---

### Wave 3: End-to-End Verification & Demonstration

#### Task 3.1: Full System Integration Tests (`tests/client/`)
- Tests end-to-end client SDK against live HTTP server.
- Verifies boolean search, client-side decryption, and proof verifications.
- Verifies static web assets serve with `200 OK`.

#### Task 3.2: Full Project Regression Run
- Runs `npm test` across all 6 phases.

---

## 3. Success Criteria Checklist

- [ ] Boolean queries (`AND`, `OR`, `NOT`) evaluate correctly over encrypted indexes.
- [ ] `VaultClient` coordinates key derivation, indexing, search, verification, and decryption.
- [ ] Web dashboard provides split-screen "Untrusted Cloud Lens" demonstrating zero leakage.
- [ ] Attacker simulation controls visually demonstrate proof rejection when records are dropped or forged.
- [ ] Audit log visualizer validates the cryptographic hash chain in real-time.
- [ ] All automated tests pass with 100% green status.
