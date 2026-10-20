# Plan: Phase 7 — Linear UI/UX Redesign & Precision Accent Palette System

**Phase:** Phase 7 (Refinement)  
**Goal:** Restructure the Vault Web UI according to `DESIGN.md` (true Linear near-black aesthetic) with user's custom palette (Racing Red, Black Cherry, Alabaster Grey) used strictly as precision accents rather than global color tints.  
**Target Files:** `public/styles.css`, `public/index.html`, `public/app.js`  

---

## Waves Breakdown

### Wave 1: Design Tokens & CSS Architecture (`public/styles.css`)
- **Task 1.1**: Define true Linear near-black custom properties:
  - `--canvas`: `#08090A` (true near-black backdrop)
  - `--canvas-subtle`: `#0D0E11` (dark code/table/input backgrounds)
  - `--surface`: `#121316` (neutral charcoal panels)
  - `--surface-raised`: `#181A20` (elevated cards)
  - `--surface-hover`: `#20232B`
  - `--hairline`: `#23252A` (crisp neutral separation)
  - `--border`: `#2E323B`
  - `--border-strong`: `#3E434F`
  - `--primary`: `#DD0200` (Racing Red precision CTAs)
  - `--primary-hover`: `#F81916`
  - `--primary-glow`: `rgba(221, 2, 0, 0.2)`
  - `--black-cherry`: `#55100D` (active tab pill & secondary accents)
  - `--ink`: `#D9D9D9` (Alabaster Grey primary text)
  - `--ink-secondary`: `#A8B0BE`
  - `--muted`: `#6E7684`
  - `--subtle`: `#454A54`
  - `--success`: `#27A644` (Linear emerald for valid proofs)
  - `--danger`: `#DD0200` (Racing Red for tamper warnings)
- **Task 1.2**: Remove saturated red ambient glow overlays and heavy red borders from panels.
- **Task 1.3**: Refine Linear pill-shaped CTAs (`border-radius: 9999px`), inputs, and tabs.

### Wave 2: Layout & HTML Component Polish (`public/index.html`)
- **Task 2.1**: Update ambient glow containers to neutral subtle dark vignette.
- **Task 2.2**: Align badges, header tags, and panel borders with neutral charcoal and hairline styling.
- **Task 2.3**: Ensure active tabs, tables, and drop-zones render with clean neutral contrast.

### Wave 3: Regression Verification & State Update
- **Task 3.1**: Verify `tests/client/ui_routes.test.ts` passes.
- **Task 3.2**: Run `npm test` to verify all 96 unit and integration tests remain 100% green.
- **Task 3.3**: Update `Vault_planing/STATE.md` and commit to git.
