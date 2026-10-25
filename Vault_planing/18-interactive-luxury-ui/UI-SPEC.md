# Phase 18 UI Specification: Interactive Luxury Studio Design Contract

## 1. Design Tokens & Color System

```css
:root {
  /* Canvas & Foundations */
  --bg-canvas: #D9D9D9;
  --bg-subtle: #E5E5E5;
  --bg-sunken: #CBCBCB;
  --surface-card: #FFFFFF;
  --surface-hover: #F8F8F8;
  --surface-active: #F2F2F2;

  /* Ink & Typography (Coffee Bean) */
  --ink-primary: #1A0706;
  --ink-secondary: #4A3A39;
  --ink-muted: #736564;
  --ink-inverse: #FFFFFF;

  /* Primary Accent (Racing Red) */
  --accent-red: #DD0200;
  --accent-red-hover: #C20200;
  --accent-red-glow: rgba(221, 2, 0, 0.22);
  --accent-red-subtle: rgba(221, 2, 0, 0.08);
  --accent-red-border: rgba(221, 2, 0, 0.35);

  /* NEW: Luxury Cryptographic Accent (Burnished Amber Gold) */
  --accent-gold: #C5A059;
  --accent-gold-hover: #B48F48;
  --accent-gold-subtle: rgba(197, 160, 89, 0.12);
  --accent-gold-border: rgba(197, 160, 89, 0.40);
  --accent-gold-glow: rgba(197, 160, 89, 0.30);
  --shadow-gold-halo: 0 0 16px rgba(197, 160, 89, 0.25);

  /* Status Colors */
  --status-verified: #166534;
  --status-verified-bg: #DCFCE7;
  --status-warning: #854D0E;
  --status-warning-bg: #FEF9C3;
  --status-danger: #DD0200;
  --status-danger-bg: #FEE2E2;

  /* Radii & Shadows */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 9999px;
  --radius-btn: 9999px;
  --shadow-glass: 0 8px 32px rgba(26, 7, 6, 0.06);
}
```

---

## 2. Component Specifications

### 2.1 Glassmorphic Studio Header (`Header.tsx`)
* **Container:** Floating bar with `backdrop-filter: blur(16px)` and rounded bottom borders.
* **Brand Logo:** Coffee Bean mark with Racing Red icon and Burnished Gold key accent.
* **Hardware Enclave Status Indicator:**
  - Golden pulse ring (`--accent-gold`) that pulses softly at 2.4s intervals when initialized.
  - Hover tooltip displays derived key fingerprint with 1-click copy.
* **Quick Search Launcher Badge:** Displays `Ctrl + K` (or `⌘K` on Mac) pill in muted gold/coffee styling.
* **Navigation Tabs:** Rounded pill toggles (`Studio Workspace`, `Cloud Storage`, `Security & Audit`, `Diagnostics Lab`) with active red background and white text.

### 2.2 Ingested Document Vault Panel (`DocumentVaultPanel.tsx`)
* **Header Quick Cloud Switcher:** Burnished Gold/Coffee Bean select dropdown showing the active provider and connection health.
* **Upload Dropzone:**
  - Animated border glow upon file drag-over.
  - Interactive file type icons and real-time upload progress.
* **4-Step Cryptographic Stepper:**
  - Tokenize (`①`) → Encrypt AES (`②`) → Blind Trapdoors (`③`) → Cloud Sync (`④`).
  - Active step illuminated in Racing Red with completed steps in Emerald/Gold.
* **Document Cards:**
  - Hover lift with subtle gold/red edge glow.
  - Storage locality pill (`[SUPABASE]`, `[DISK]`, `[MEMORY]`, `[S3]`).
  - Cryptographic state badge (`[AES-256-GCM VERIFIED]` in Burnished Gold).

### 2.3 Search Panel (`SearchPanel.tsx`)
* **Search Input:**
  - Focus ring transitions into Racing Red with Amber Gold shadow.
  - Live token pill breakdown: as user types, chips indicate extracted 3-grams (`"sec"`, `"ecu"`, `"cur"`).
  - Merkle verification banner with 1-click proof expansion.

### 2.4 Live Decrypted Document Viewer (`DocumentViewer.tsx`)
* **Decryption Scramble Effect:**
  - Triggered whenever `selectedDoc` is opened or switched.
  - Runs for 240ms, cycling randomized cryptographic glyphs before resolving into high-contrast Coffee Bean typography.
* **Cryptographic Accordion & Proof Tree:**
  - Integrates `MerkleProofVisualizer.tsx`.
  - SVG tree showing search token -> leaf hash -> sibling hashes -> golden Merkle root.
  - Zero-knowledge soundness proof statement.

---

## 3. Micro-Animations & Tactile Feedback
1. **Pulse Animation:** Key enclave indicator gently breathes using `@keyframes goldPulse`.
2. **Card Hover Elevation:** `transform: translateY(-2px); box-shadow: var(--shadow-md);`
3. **Decryption Flash:** A brief 150ms gold/green highlight confirms decryption without obscuring text.
