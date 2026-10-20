# Plan: Phase 7 — Linear UI/UX Redesign & Custom Color Palette System

**Phase:** Phase 7  
**Goal:** Restyle and re-architect the Vault Web UI according to `DESIGN.md` (Linear aesthetic) and the user's custom color palette (Coffee Bean, Black Cherry, Racing Red, Alabaster Grey).  
**Target Files:** `public/styles.css`, `public/index.html`, `public/app.js`  

---

## Waves Breakdown

### Wave 1: Design Tokens & CSS Architecture (`public/styles.css`)
- **Task 1.1**: Define CSS custom properties mapped to the palette:
  - `--canvas`: `#1A0706` (Coffee Bean)
  - `--surface`: `#230B0A`
  - `--surface-raised`: `#35100E`
  - `--border`: `rgba(85, 16, 13, 0.45)`
  - `--border-strong`: `#55100D` (Black Cherry)
  - `--primary`: `#DD0200` (Racing Red)
  - `--primary-hover`: `#FF1F1C`
  - `--primary-glow`: `rgba(221, 2, 0, 0.25)`
  - `--ink`: `#D9D9D9` (Alabaster Grey)
  - `--ink-secondary`: `#B8B0AF`
  - `--muted`: `#8C7D7C`
  - `--subtle`: `#5C4E4D`
  - `--success`: `#27A644`
  - `--danger`: `#DD0200`
- **Task 1.2**: Implement Linear typography:
  - Font families: `Inter`, system fallback; `JetBrains Mono` for crypto/hashes.
  - Headings with tight negative tracking (`letter-spacing: -0.02em` to `-0.04em`), weight 510–590.
- **Task 1.3**: Implement Linear component aesthetics:
  - Pill-shaped buttons (`rounded: 9999px`) with refined hover and focus rings.
  - Layered card surfaces with hairline borders (`#55100D45`).
  - Dark-tinted table headers and monospace cells.
  - Subtle glowing badges and status chips.

### Wave 2: Layout & HTML Component Polish (`public/index.html`)
- **Task 2.1**: Refine header with Linear-style minimalist branding, version tag, and status chips.
- **Task 2.2**: Clean up the Master Key Enclave bar with Linear input fields and pill CTAs.
- **Task 2.3**: Restructure split-screen panels (Client View & Untrusted Cloud Lens) with Linear card styling, tab navigation, and search console.
- **Task 2.4**: Align Attacker Simulator and Audit Chain visualizer with Linear control button styling.

### Wave 3: Interactive Polish & Full Verification
- **Task 3.1**: Verify `public/app.js` handles all dynamic states (proof badges, attack alerts, status dots) seamlessly.
- **Task 3.2**: Run `node --experimental-strip-types --test tests/client/ui_routes.test.ts` to ensure routes deliver valid assets.
- **Task 3.3**: Run `npm test` to verify zero regression across all 96 unit and integration tests.
- **Task 3.4**: Update `STATE.md` and `ROADMAP.md` marking Phase 7 completed.
