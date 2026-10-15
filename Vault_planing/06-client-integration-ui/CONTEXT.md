# Context: Phase 6 — Client Integration, Interactive Web UI & Verification

**Phase:** Phase 6  
**Target:** Client SDK, Boolean Query Engine, Interactive Web Dashboard, and Tamper Demonstrations  
**Directory:** `Vault_planing/06-client-integration-ui/`  
**Outputs Target:** `src/client/`, `public/`, and `tests/client/`  
**Dependencies:** Phase 1 (`src/crypto/`), Phase 2 (`src/indexer/`), Phase 3 (`src/engine/`), Phase 4 (`src/verifiability/`), Phase 5 (`src/server/`)

---

## 1. Domain Problem & Scope

With the cryptographic primitives, blind index multi-map, Merkle verifiability engine, and REST API microservice completed, Phase 6 ties the entire platform together into a cohesive, user-facing product:
1. **Client Unified SDK**: High-level `VaultClient` that handles the complete client workflow: password derivation, client-side encryption, blind indexing, verifiable search, blob retrieval, and client-side decryption.
2. **Boolean Search Queries (Kamara-Moataz IEX)**:
   - Single keyword search (`"finance"`).
   - Substring search (`"audit*"`).
   - Conjunctive boolean search (`"compliance AND tax"`).
   - Disjunctive boolean search (`"payroll OR executive"`).
   - Negative boolean search (`"audit AND NOT draft"`).
3. **Interactive Web UI Dashboard**:
   - Visual dashboard allowing users to:
     - Log in with Master Password.
     - Upload sensitive documents with live client-side encryption indicator.
     - Search with instantaneous sub-linear response times.
     - **"Untrusted Cloud Lens"**: Split-screen view contrasting what the cloud server/eavesdropper sees (random hex tokens, opaque addresses, ciphertexts) vs what the client sees (decrypted files).
     - **Cryptographic Verifiability Badge**: Displays real-time Merkle proof status (100% Sound & Complete).
     - **Active Cloud Attacker Simulator**: Interactive buttons allowing users to simulate cloud tampering (dropping a file, forging a result) and watching the client mathematically catch and reject the attack in real-time.
     - **Zero-Knowledge Audit Log Viewer**: Visual timeline of the immutable SHA-256 hash chain with instant verification badge.

---

## 2. Technology Choices & Design System

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Architecture** | Modern Vanilla HTML5 + CSS3 + ES6 Modules | Zero external build tools; zero npm dependencies; instant hot reloading; maximum performance and portability. |
| **Styling & Aesthetics** | Custom Dark-Mode Design System | Sleek cyber-vault aesthetic: deep slate background (`#0B0F19`), translucent glassmorphism cards (`rgba(255,255,255,0.03)` with backdrop blur), glowing neon green/cyan cryptographic accents (`#10B981`, `#06B6D4`), and Inter typography. |
| **Static File Serving** | Integrated in `VaultServerApp` | Native Node.js `node:http` static file streaming without Express. |
| **Crypto in Browser** | Native W3C Web Crypto API (`window.crypto.subtle`) | Identical cryptographic algorithms running natively in the browser without server leakage. |

---

## 3. In-Scope Deliverables

1. **Boolean Query Engine (`src/client/boolean_query.ts`)**:
   - Parses and evaluates AND, OR, NOT operations over verified postings.
2. **Unified Client SDK (`src/client/vault_client.ts`)**:
   - Complete client coordinator interfacing with `VaultServerApp` over HTTP.
3. **Web Dashboard UI (`public/`)**:
   - `public/index.html`: Complete single-page enterprise dashboard.
   - `public/styles.css`: Premium dark-mode glassmorphic styling.
   - `public/app.js`: Browser client controller running Web Crypto client-side.
4. **Server Static Serving Integration**:
   - Updates `VaultServerApp` to serve the dashboard at `http://localhost:<port>/`.
5. **Comprehensive Integration Test Suite (`tests/client/`)**:
   - Validates Boolean queries, SDK flows, and HTTP UI endpoints.
