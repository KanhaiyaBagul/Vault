# Phase 16: React Modular Architecture, Side-by-Side Studio Workspace & Custom Color System

## Executive Summary
In this phase, we modernize the Vault frontend by replacing the legacy 2,800-line monolithic imperative script (`public/app.js`) with a high-performance **React 18 + Vite + TypeScript** application. 

We resolve all UI confusion by discarding the academic 50/50 JSON dump and replacing it with a production-ready **Side-by-Side Vault Workspace**:
1. **Left Panel (Vault Library)**: Real-time list of all encrypted files in the vault, file size, ingestion timestamps, keyword counts, quick-action dropzone, and 1-click preview triggers.
2. **Right Panel (Search & Live Decrypted Viewer)**: High-visibility zero-knowledge search bar with term highlighting, Merkle verification badge, and side-by-side decrypted document reader so users never lose context.
3. **Dedicated 4-View Navigation**:
   - 📁 **Vault Workspace** (Primary daily document storage, search & reading)
   - ☁️ **Cloud Storage Profiles** (Multi-cloud manager: Supabase, S3, Disk, Memory)
   - 🛡️ **Security & Tamper Audit** (Unified client & server audit trails, Merkle & SHA-256 verification)
   - 🔬 **Diagnostics & Attack Lab** (Isolated adversary simulation & blind token inspector)
4. **Custom Color System**:
   - **Alabaster Grey (`#D9D9D9`)**: Foundational background canvas.
   - **Racing Red (`#DD0200`)**: Used with surgical restraint for search keyword highlights, active enclave pulses, focus rings, and verification badges (never overwhelming).
   - **Black Cherry (`#55100D`)**: Deep rich accents, active tabs, header borders, and contrast badges.
   - **Coffee Bean (`#1A0706`)**: High-contrast, crystal-clear typography, card borders, and primary headings.
   - **Crisp White (`#FFFFFF`)**: Elevated card surfaces ensuring 100% visibility for all UI elements.

---

## Architecture & Visual Layout

### Visual Layout: Side-by-Side Studio Workspace
```
+-------------------------------------------------------------------------------------------------------+
|  VAULT // Zero-Knowledge SSE Engine        [🔴 Enclave: Active (AES-256)]   [☁️ Supabase: Connected]    |
|  Tabs:  [📁 Vault Workspace]   [☁️ Cloud Storage]   [🛡️ Security Audit]   [🔬 Diagnostics Lab]         |
+-------------------------------------------------------------------------------------------------------+
|                                                                                                       |
|  LEFT PANEL (42% width)                         RIGHT PANEL (58% width)                              |
|  DOCUMENT VAULT & INGESTION                     ZERO-KNOWLEDGE SEARCH & LIVE VIEWER                   |
|                                                                                                       |
|  +-------------------------------------------+  +--------------------------------------------------+  |
|  | 📤 Quick Upload & Dropzone                |  | 🔍 [ Search encrypted vault... (e.g. tax AND 2025) ] |
|  | "Drag & drop files or click to encrypt"   |  +--------------------------------------------------+  |
|  +-------------------------------------------+  | Found 3 matches in 14ms  • [✓ Merkle Proof Valid]|  |
|                                                 +--------------------------------------------------+  |
|  Vault Library (12 documents • 2.4 MB)          |  LIVE DECRYPTED PREVIEW & SEARCH RESULTS          |
|  [🔍 Filter documents...                   ]    |                                                  |
|                                                 |  Document: annual_financial_report_2025.txt      |
|  +-----------------------------------------+    |  DocRef: doc_a8f93... • Size: 24.8 KB • Ingested |
|  | 📄 Q4_Financials.pdf          [24.5 KB] |    |  +--------------------------------------------+  |
|  | 38 keywords • Ingested 2h ago           |    |  | Plaintext preview with highlighted terms:  |  |
|  | [View / Decrypt] [Copy Ref] [Delete]    |    |  | "...revenue showed strong growth in <mark> |  |
|  +-----------------------------------------+    |  | quarterly</mark> earnings across all..."   |  |
|  | 📄 Patient_Records_Sample.csv  [18.2 KB] |    |  |                                            |  |
|  | 142 keywords • Ingested yesterday       |    |  +--------------------------------------------+  |
|  | [View / Decrypt] [Copy Ref] [Delete]    |    |  [Download Decrypted]   [Inspect Merkle Proof]   |
|  +-----------------------------------------+    +--------------------------------------------------+  |
|                                                                                                       |
+-------------------------------------------------------------------------------------------------------+
```

### Color Palette Token Mapping
```css
:root {
  /* Alabaster Grey Background */
  --bg-canvas: #D9D9D9;
  --bg-subtle: #E8E8E8;
  --surface-card: #FFFFFF;
  --surface-hover: #F8F8F8;

  /* Coffee Bean Typography & High Contrast */
  --ink-primary: #1A0706;
  --ink-secondary: #4A3E3D;
  --ink-muted: #736867;
  --border-strong: #1A0706;
  --border-subtle: #C8C8C8;

  /* Black Cherry Header & Active Tone */
  --accent-cherry: #55100D;
  --accent-cherry-subtle: rgba(85, 16, 13, 0.08);

  /* Racing Red - Restrained Surgical Accent */
  --accent-red: #DD0200;
  --accent-red-glow: rgba(221, 2, 0, 0.15);
  --accent-red-subtle: rgba(221, 2, 0, 0.08);

  /* Status Tokens */
  --status-verified: #1E6B37;
  --status-danger: #DD0200;
}
```

---

## Detailed Task Breakdown

### Wave 1: React 18, Vite & Color System Setup
- [ ] **Task 1.1: Project Tooling & Dependencies**
  - Install `react`, `react-dom`, `@types/react`, `@types/react-dom`, `vite`, `@vitejs/plugin-react`.
  - Create `vite.config.ts` configuring:
    - Root at `src/ui/`.
    - Build output directory targeting `../../public` so existing `npm start` serves the React bundle.
    - Development proxy forwarding `/api` to `http://localhost:3000`.
  - Add `npm run dev` and `npm run build` scripts to `package.json`.
- [ ] **Task 1.2: Design Tokens & Typography in `src/ui/styles/theme.css`**
  - Declare custom CSS variables for Alabaster Grey (`#D9D9D9`), Racing Red (`#DD0200`), Black Cherry (`#55100D`), and Coffee Bean (`#1A0706`).
  - Implement full-visibility styling rules: spacious padding, high contrast (WCAG AAA), crisp border radius (6–10px), no hidden/clipped text.
  - Setup Inter & Outfit typography for readable modern UI.
- [ ] **Task 1.3: Cryptographic & Client State Hooks in `src/ui/context/VaultContext.tsx`**
  - Wrap Web Crypto enclave: master key generation, PBKDF2/HKDF derivation, AES-256-GCM encryption/decryption.
  - Reactive document store: list of stored vault documents, upload handler, delete handler.
  - Reactive search controller: query state, search execution, latency timer, Merkle proof validator.
  - Reactive cloud state: active profile sync, provider switcher.

### Wave 2: Side-by-Side Vault Workspace Components
- [ ] **Task 2.1: Navigation Header (`src/ui/components/layout/Header.tsx`)**
  - Logo with subtitle "Zero-Knowledge SSE Engine".
  - Enclave status badge (`[🔴 Enclave Active: AES-256]`) with master key info modal.
  - Active Cloud connection pill (`[☁️ Supabase: Connected (24ms)]`).
  - Mode switcher tabs: `[📁 Vault Workspace]`, `[☁️ Cloud Storage]`, `[🛡️ Security Audit]`, `[🔬 Diagnostics Lab]`.
- [ ] **Task 2.2: Document Vault Panel (Left Side - `src/ui/components/workspace/DocumentVaultPanel.tsx`)**
  - Quick Upload dropzone supporting drag-and-drop & file picker.
  - Filter bar to instantly filter local documents by filename or extension.
  - Document cards displaying: filename, format icon, file size, keyword count, ingestion date, and quick action buttons (`[View / Decrypt]`, `[Copy ID]`, `[Delete]`).
  - Visual indicator showing currently selected/active document.
- [ ] **Task 2.3: Search & Live Decrypted Viewer (Right Side - `src/ui/components/workspace/SearchPanel.tsx` & `DocumentViewer.tsx`)**
  - Search input with Boolean operators (`AND`, `OR`, `NOT`) and 1-click sample query pills (`tax`, `financial AND audit`, `payroll`).
  - Search telemetry bar: result count, query latency (ms), and zero-knowledge verification badge.
  - Live Decrypted Viewer:
    - Display document title, metadata, cloud storage blob reference, and SHA-256 integrity hash.
    - Formatted plaintext reader with search keyword highlights (using soft red highlight tint `<mark>` with zero XSS risk).
    - Download decrypted file button and raw cryptographic Merkle proof inspector accordion.

### Wave 3: Cloud Profiles, Security Audit & Diagnostics Views
- [ ] **Task 3.1: Cloud Storage View (`src/ui/components/cloud/CloudStorageView.tsx`)**
  - Grid of cloud provider connection cards (Supabase, AWS S3, Local Disk, Memory).
  - 1-click activation, latency ping test button, connection editor form with password show/hide eye toggles.
  - Auto-persists to backend without resetting on server restart.
- [ ] **Task 3.2: Security & Tamper Audit View (`src/ui/components/security/SecurityAuditView.tsx`)**
  - Unified audit console: toggle between Client Security Hash-Chain and Server Zero-Knowledge Audit Log.
  - Live tamper verification button: audits SHA-256 hash chains and Merkle roots with instant green/red status.
  - Export audit trail as structured JSON.
- [ ] **Task 3.3: Diagnostics & Attack Lab (`src/ui/components/lab/DiagnosticsLabView.tsx`)**
  - Isolated from daily search: adversary query simulation (simulate eavesdropper intercepting trapdoor token).
  - Demonstrates cryptographic theorem: untrusted server / attacker learns zero plaintext keywords from token.
  - Blind index raw token inspector.

### Wave 4: Integration, Verification & Automated Testing
- [ ] **Task 4.1: Vite Build & Backend Serving Verification**
  - Compile React bundle via `npm run build` into `public/`.
  - Verify that `VaultServerApp` serves the React application seamlessly at `http://localhost:3000/`.
- [ ] **Task 4.2: Full Automated Test Suite Regression**
  - Run `npm test` ensuring all 157 automated tests across 37 test suites continue to pass 100% green.
- [ ] **Task 4.3: End-to-End Browser Verification via Browser Subagent**
  - Open `http://localhost:3000/` in browser subagent.
  - Verify side-by-side layout: document list on left, search and live decrypted reader on right.
  - Verify color scheme: Alabaster Grey background, Coffee Bean typography, Black Cherry accents, and subtle Racing Red highlights.
  - Test file upload, instant indexing, searching with term highlights, and profile switching.
