# Phase 18 Context: Interactive Luxury Studio UI/UX, Burnished Gold Palette & Cryptographic Visualizers

## Objective
Transform the Vault SSE application into an ultra-premium, interactive cryptographic studio. Introduce **Burnished Amber Gold (`#C5A059`)** into the design system alongside Alabaster Grey (`#D9D9D9`), Coffee Bean (`#1A0706`), and Racing Red (`#DD0200`). Elevate the user experience with tactile micro-interactions: a glassmorphic top studio bar with live enclave pulse, an interactive visual Merkle proof tree visualizer, and a live ciphertext-to-plaintext scramble decryption animation.

---

## 1. Palette Extension: The Luxury 4-Tone Identity

| Role | Color Name | Hex Code | Visual Application & Metaphor |
| :--- | :--- | :--- | :--- |
| **Canvas** | Alabaster Grey | `#D9D9D9` | High-clarity editorial background, soft ambient lighting |
| **Ink & Structure** | Coffee Bean | `#1A0706` | Deep espresso typography, high-contrast borders, structural cards |
| **Primary Action** | Racing Red | `#DD0200` | Full pill CTAs, active highlights, action buttons, alert indicators |
| **Cryptographic Accent** | **Burnished Amber Gold** | **`#C5A059`** | **Hardware Enclave keys, Merkle tree root hashes, cryptographic verification seals, golden status rings, and authentication halos** |

### CSS Token Mapping (`src/ui/styles/theme.css`)
```css
:root {
  /* Burnished Amber Gold — Cryptographic Luxury & Enclave Seals */
  --accent-gold: #C5A059;
  --accent-gold-hover: #B48F48;
  --accent-gold-subtle: rgba(197, 160, 89, 0.12);
  --accent-gold-border: rgba(197, 160, 89, 0.45);
  --accent-gold-glow: rgba(197, 160, 89, 0.35);
  --shadow-gold-halo: 0 0 16px rgba(197, 160, 89, 0.30);
}
```

---

## 2. Interactive Structural Enhancements

### A. Glassmorphic Studio Header & Quick Launcher
* **Glassmorphism:** Floating studio bar with `backdrop-filter: blur(16px)`, translucent white background (`rgba(255, 255, 255, 0.85)`), and hairline border.
* **Enclave Pulse Ring:** Hardware Enclave status chip with an animated golden halo (`#C5A059`) that breathes smoothly when keys are initialized and flashes upon key derivation.
* **Global Quick Launcher (`Ctrl + K` / `Cmd + K`):** Global keyboard shortcut immediately focuses the zero-knowledge search bar from any view mode.

### B. Live Ciphertext Scramble Decryption Animation
* **Decryption Theater:** When a document is clicked or searched, text does not simply appear; it undergoes a 250ms cyber scramble animation where randomized cryptographic glyphs (`01?#&%*`) rapidly resolve character-by-character into the decrypted plaintext.
* **Psychological Impact:** Visually proves to the user that data was stored as opaque ciphertext and was decrypted directly within the local browser runtime.

### C. Interactive Visual Merkle Proof Tree
* **Zero-Dependency SVG Tree:** A dynamic, responsive tree diagram rendered inside the cryptographic proof accordion in `DocumentViewer.tsx`.
* **Path Illumination:** Renders:
  $$\text{Search Token (3-Gram)} \longrightarrow \text{Document Leaf Hash} \longrightarrow \text{Sibling Hashes} \longrightarrow \text{Golden Merkle Root Hash (\#C5A059)}$$
* **Verification Cascade:** Nodes illuminate in sequence from leaf to root, ending in an authenticated Burnished Gold badge verifying 100% mathematical soundness.

---

## 3. Scope & Non-Goals
* **In Scope:**
  - Token additions in `src/ui/styles/theme.css` and component styling in `src/ui/styles/components.css`.
  - Glassmorphic header polish with keyboard shortcut handler in `src/ui/components/layout/Header.tsx`.
  - Scramble decryption hook and animation in `src/ui/components/workspace/DocumentViewer.tsx`.
  - Visual Merkle Proof Tree component in `src/ui/components/workspace/MerkleProofVisualizer.tsx`.
  - Retain 100% test passing rate (158/158 tests green).
* **Out of Scope:**
  - Modifying underlying cryptographic algorithms (AES-256-GCM, PBKDF2, HMAC-SHA256, Merkle accumulator remain untouched).
  - External heavy charting libraries (pure SVG / React zero-dependency).
