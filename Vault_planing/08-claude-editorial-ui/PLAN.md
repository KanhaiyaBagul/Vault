# Plan: Phase 8 — Claude Warm-Editorial UI/UX with Luxury Swatch Palette

**Phase:** Phase 8  
**Goal:** Implement the Claude warm-editorial design system from the specification, rendered in the user's luxury color swatch: Soft Limestone (`#F0E6D8`), Terracotta Clay (`#B5543A`), Deep Rust (`#5A2E25`), and Olive Accent (`#6F7F5F`).  
**Target Files:** `public/styles.css`, `public/index.html`, `public/app.js`, `tests/client/ui_routes.test.ts`  

---

## Waves Breakdown

### Wave 1: Design Tokens & Editorial CSS Architecture (`public/styles.css`)
- **Task 1.1**: Define CSS custom properties mapped to Claude design roles & user swatch:
  - `--canvas`: `#FAF8F5` (Warm tinted cream)
  - `--surface-card`: `#F0E6D8` (Soft Limestone)
  - `--surface-soft`: `#F5EFE6`
  - `--surface-dark`: `#22120E` (Deep Rust Base for product chrome)
  - `--surface-dark-elevated`: `#301A15`
  - `--surface-dark-accent`: `#5A2E25` (Deep Rust)
  - `--primary`: `#B5543A` (Terracotta Clay CTA)
  - `--primary-active`: `#96422C`
  - `--ink`: `#1A1715` (Warm editorial ink)
  - `--body`: `#3E3A36`
  - `--muted`: `#736D66`
  - `--hairline`: `#E0D6C8` (Soft 1px cream border)
  - `--on-dark`: `#FAF8F5` (Cream text on dark product chrome)
  - `--on-dark-muted`: `#A69E96`
  - `--accent-olive`: `#6F7F5F` (Olive Accent for verified proofs & audit health)
  - `--error`: `#B53A3A`
- **Task 1.2**: Implement Editorial Typography:
  - Display Serif: `Cormorant Garamond, Tiempos Headline, serif` at weight 400 with negative tracking (`-0.02em` to `-0.03em`).
  - Humanist Sans: `Inter, -apple-system, sans-serif` at weight 400/500 for UI labels, buttons, and navigation.
  - Monospace: `JetBrains Mono, monospace` for cryptographic addresses and ciphertexts.
- **Task 1.3**: Implement Component Styling:
  - Primary button: Terracotta Clay `#B5543A` background, white text, 8px radius, height 40px, padding 12px 20px.
  - Secondary button: Soft Limestone `#F0E6D8` background, warm ink text, 1px `#E0D6C8` border.
  - Content Cards: Soft Limestone `#F0E6D8` with 12px radius and 1px hairline border.
  - Product Chrome Cards: Deep Rust dark surface (`#22120E` / `#5A2E25`) for the Untrusted Cloud Lens, Blind Multi-Map store, and Cryptographic Audit Chain.
  - Badges: Pill-shaped (`rounded.pill`) with Olive Accent `#6F7F5F` for cryptographically verified status.

### Wave 2: Layout & Markup Refinement (`public/index.html`)
- **Task 2.1**: Import Google Fonts: `Cormorant Garamond:wght@400;500;600` + `Inter:wght@400;500;600` + `JetBrains Mono`.
- **Task 2.2**: Update header with Anthropic-inspired 4-spoke radial spark mark, editorial serif brand title, and cream-tinted status chips.
- **Task 2.3**: Format Master Key Enclave, Document Ingestion, and Search Console as warm Soft Limestone feature cards.
- **Task 2.4**: Format Untrusted Cloud Lens, Attacker Simulator, and Audit Chain as Deep Rust dark product chrome cards.
- **Task 2.5**: Ensure 100% preservation of all existing DOM IDs used by `app.js`.

### Wave 3: Integration, Regression Verification & Execution
- **Task 3.1**: Verify `public/app.js` dynamic states render cleanly with new styling.
- **Task 3.2**: Update and run `node --experimental-strip-types --test tests/client/ui_routes.test.ts`.
- **Task 3.3**: Run `npm test` to ensure all 96 unit and integration tests remain 100% green.
- **Task 3.4**: Visual inspection using the browser subagent at `http://localhost:3000/`.
- **Task 3.5**: Update `ROADMAP.md` and `STATE.md`, then commit to git.
