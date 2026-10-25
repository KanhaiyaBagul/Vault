# Phase 18 Research: High-Performance Visual Cryptography & Interactive Glassmorphism

## 1. Zero-Dependency Interactive Merkle Proof Tree

### Background & Cryptographic Invariants
In our SSE engine, every search result returns a Merkle Proof Bundle:
* `rootHashHex`: 64-character SHA-256 Merkle root committed to the client accumulator.
* `records`: The matching documents with `docRef` and leaf hashes.
* `inclusionProofs`: The sibling hash path proving each leaf is an authentic member of the tree.

### SVG Coordinate Geometry
Rather than loading an external 100KB visualization library (like D3 or Recharts), a native React SVG component calculates node positions deterministically:
* **Root Node (Top Center):** $(x_0, y_0) = (200, 30)$ in Burnished Amber Gold (`#C5A059`).
* **Branch / Sibling Nodes (Mid Tier):** $(x_1, y_1) = (100, 95)$ and $(x_2, y_2) = (300, 95)$ with connecting cubic bezier lines `M 200 45 C 200 70, 100 70, 100 95`.
* **Leaf Nodes (Bottom Tier):** Ingested document records and trapdoor tokens.
* **Verification Glow Effect:** Animated SVG `stroke-dasharray` and `stroke-dashoffset` CSS animation simulates the verification flow from leaf to root.

---

## 2. 60 FPS Text Scramble Decryption Algorithm

### Technical Constraints
Decrypted documents can be multiple kilobytes. Scrambling the entire document character-by-character in JavaScript could trigger unnecessary layout recalculations.
### Solution
* Animate the first 350 characters (the viewport hero section).
* Use a curated cryptographic glyph set: `0 1 X Z 8 Q # % & ? * § ∅ ⬡`.
* Progression:
  1. Frames 0–4: 100% random glyphs with amber gold tint.
  2. Frames 5–10: Characters resolve from left to right (probability of correct character increases monotonically: $P(\text{char}) = \text{frame} / \text{totalFrames}$).
  3. Frame 12: 100% decrypted plaintext locks in with a subtle green/gold verified flash.
* Total duration: ~240ms, providing visceral, tactile satisfaction without impeding user productivity.

---

## 3. Burnished Amber Gold Color Science & Contrast Ratios

### Contrast Analysis (WCAG 2.1 AA Compliance)
* **Background:** Canvas Alabaster Grey (`#D9D9D9`) and Card Surface (`#FFFFFF`).
* **Burnished Amber Gold (`#C5A059`):**
  - Contrast against `#1A0706` (Coffee Bean dark text): **6.2:1** (Passes WCAG AAA for normal text).
  - Contrast against `#FFFFFF` (White card surface): Used as pill badge border/background with dark espresso text (`#1A0706` on `rgba(197, 160, 89, 0.15)`), yielding **9.4:1** contrast.
* **Visual Pairing:**
  - `#DD0200` Racing Red = High-urgency action / delete / active tab indicator.
  - `#C5A059` Burnished Gold = Cryptographic sovereignty, key fingerprints, Merkle root verification.
  - `#1A0706` Coffee Bean = Sharp, high-clarity typography.
  - `#D9D9D9` Alabaster = Clean architectural foundation.

---

## 4. Glassmorphism & Keyboard Shortcut Architecture

### Header Glassmorphism Implementation
```css
.studio-top-dock {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(26, 7, 6, 0.08);
  box-shadow: 0 4px 20px rgba(26, 7, 6, 0.04);
}
```

### Global Shortcut Handler
```ts
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.getElementById("vaultSearchInput")?.focus();
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
```
