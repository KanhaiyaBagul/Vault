# Context: Phase 8 — Claude Warm-Editorial UI/UX with Luxury Swatch Palette

**Phase:** Phase 8  
**Design Reference:** Anthropic Claude Warm-Editorial Product Interface System (`Claude-design-analysis`)  
**Color Palette Source:** User-Uploaded Luxury Swatch Palette:
- **Soft Limestone**: `HEX #F0E6D8`
- **Terracotta Clay**: `HEX #B5543A`
- **Deep Rust**: `HEX #5A2E25`
- **Olive Accent**: `HEX #6F7F5F`

---

## 1. Design System Philosophy & Translation

The user explicitly requested:
> *"just use the UI UX of this prompt don't try and use colors of this do this plan in detial , i don't want the ai generated UI , find in detial inhere"*

### Core Aesthetic Translation
Where typical AI and crypto products default to cold blue-gray dark modes or generic cyberpunk themes, Claude’s signature design philosophy anchors on a **warm, humanist, editorial atmosphere**:
1. **The Cream Canvas Foundation**: A warm-tinted cream floor (`#FAF8F5`) paired with **Soft Limestone (`#F0E6D8`)** feature cards. It reads like a literary publication or precision journal rather than a SaaS dashboard.
2. **The Cream-to-Dark Pacing Rhythm**: As detailed in the Claude spec:
   > *"The dark surfaces are where Claude shows its product chrome — code blocks, terminal output, model comparison tables, agentic-flow diagrams. The cream-to-dark contrast is the page's pacing rhythm."*
   In Vault, the **Deep Rust (`#5A2E25`)** dark surfaces will house the cryptographic product chrome: the Untrusted Cloud Lens, Blind Multi-Map store (`L_c, V_c`), AES-256 ciphertexts, and SHA-256 Audit Chain!
3. **Terracotta Clay as Primary Voltage**: Replacing the default Claude coral with **Terracotta Clay (`#B5543A`)**, reserved strictly for primary action CTAs (*Unlock Vault*, *Encrypt & Upload*, *Search*), focused input rings, and brand highlights.
4. **Olive Accent for Cryptographic Truth**: **Olive Accent (`#6F7F5F`)** provides a natural, grounded verification tone for Merkle tree proofs, completeness badges, and healthy audit integrity indicators.

---

## 2. Token Architecture & Color Mapping

| Token Role | Claude Spec Role | Swatch Color & Hex | Purpose in Vault SSE |
| :--- | :--- | :--- | :--- |
| **`--canvas`** | `colors.canvas` | `#FAF8F5` (Warm Cream Tint) | Default page floor; warm, literary atmosphere |
| **`--surface-card`** | `colors.surface-card` | `#F0E6D8` (**Soft Limestone**) | Document Ingestion card, Search Console card, Key Enclave |
| **`--surface-cream-soft`** | `colors.surface-soft` | `#F5EFE6` | Secondary panels, subtle inner containers |
| **`--surface-dark`** | `colors.surface-dark` | `#22120E` (Deep Rust Base) | Untrusted Cloud Lens, Terminal code windows, Dark cards |
| **`--surface-dark-elevated`**| `colors.surface-dark-elevated`| `#301A15` | Elevated settings and tables inside dark product chrome |
| **`--surface-dark-accent`** | `colors.surface-dark-soft` | `#5A2E25` (**Deep Rust**) | Table headers in dark lens, dark card borders, code header |
| **`--primary`** | `colors.primary` | `#B5543A` (**Terracotta Clay**) | Signature primary CTA button background, focused rings |
| **`--primary-active`** | `colors.primary-active` | `#96422C` | Press/hover darkened variant for Terracotta CTAs |
| **`--primary-disabled`** | `colors.primary-disabled`| `#E5DDD4` | Disabled button background on cream |
| **`--ink`** | `colors.ink` | `#1A1715` (Warm Ink) | Display serif headlines, primary text on cream |
| **`--body`** | `colors.body` | `#3E3A36` (Warm Dark Body) | Paragraphs, documentation, field labels |
| **`--muted`** | `colors.muted` | `#736D66` | Placeholders, inactive hints, subtle captions |
| **`--hairline`** | `colors.hairline` | `#E0D6C8` | 1px border tone on cream surfaces; feels like elevation |
| **`--on-dark`** | `colors.on-dark` | `#FAF8F5` | Cream text on dark rust product chrome |
| **`--on-dark-muted`** | `colors.on-dark-soft` | `#A69E96` | Secondary labels, line numbers, hashes on dark |
| **`--accent-olive`** | `colors.accent-teal` | `#6F7F5F` (**Olive Accent**) | Cryptographic proof pass badges, valid audit chain dot |
| **`--danger`** | `colors.error` | `#B53A3A` | Active attacker simulation alert |

---

## 3. Editorial Typography System

1. **Display Serif Headlines**:
   - Google Font: **Cormorant Garamond** (Open-source substitute for Copernicus / Tiempos Headline).
   - Weights: Regular 400 (never 700 bold).
   - Letter Spacing: Negative tracking (`-0.02em` to `-0.03em`).
   - Line Height: Tight `1.1` to `1.2`.
   - Used for: Brand title, section titles (`h1`, `h2`, `h3`, card headers).
2. **Humanist Sans Body & UI**:
   - Font: **Inter** (Humanist sans proportions matching StyreneB).
   - Weights: 400 for running text, 500 for buttons, category tabs, and field labels.
   - Used for: Body text, buttons, navigation pills, status chips, input text.
3. **Cryptographic Monospace**:
   - Font: **JetBrains Mono**.
   - Used for: Hex addresses (`L_c`), opaque references (`DocRef`), ciphertexts, Merkle roots, and hash chain entries.

---

## 4. Geometric & Elevation Standards

- **Border Radius Scale**:
  - Buttons & Inputs: `8px` (`rounded.md`) — Height 40px, padding 12px 20px.
  - Content Cards: `12px` (`rounded.lg`) — Generous padding (24px–32px).
  - Badges & Pills: `9999px` (`rounded.pill`) — Padding 4px 12px.
- **Elevation Philosophy**:
  - **Color-block first, shadow rare**. No heavy glow drop shadows.
  - 1px soft hairline borders (`#E0D6C8`) separating cream layers.
  - Deep Rust dark chrome uses internal product depth (line numbers, code styling, dark table headers) rather than heavy 3D skeuomorphism.
