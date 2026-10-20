# Context: Phase 7 — Linear UI/UX Redesign & Precision Accent Palette System

**Phase:** Phase 7  
**Target:** Transform the Web Application UI/UX to match DESIGN.md (true Linear near-black aesthetic) with user's custom palette as precision accents  
**Directory:** `Vault_planing/07-ui-ux-linear-redesign/`  
**Outputs Target:** `public/styles.css`, `public/index.html`, and `public/app.js`  
**References:** `DESIGN.md`, User Swatch Palette Image, User Discussion Decisions  

---

## 1. User Feedback & Design Decisions (GSD Discuss Phase)

### Problem Identified
The initial iteration used Coffee Bean (`#1A0706`) for the entire canvas, Black Cherry (`#55100D`) for all card borders and surfaces, and heavy red ambient glows. This resulted in an overwhelmingly red, heavily saturated interface that obscured the sleek, high-tech, precision engineering feel of Linear.

### Decisions Locked with User
1. **True Linear Near-Black Foundation:**
   - Canvas: `#08090A` (true Linear near-black base).
   - Layered Surfaces: Neutral charcoal `#121316` and `#181A20`.
   - Structural Hairlines: Low-contrast `#23252A` and subtle `#2E323B`.
   - Remove heavy red ambient blur overlays so the canvas is clean, dark, and sharp.
2. **Precision Accent Allocation:**
   - **Racing Red (`#DD0200`)**: High-impact precision accents — Primary pill CTAs ("Derive Subkeys", "Encrypt, Commit & Upload", "Search"), focus rings, active indicator dots, and security/tamper alert states.
   - **Black Cherry (`#55100D`)**: Active tab pill indicators, secondary button borders, and subtle elevated card highlights.
   - **Alabaster Grey (`#D9D9D9`)**: Crisp high-contrast typography, section titles, monospace cryptographic addresses, and data table values.
   - **Coffee Bean (`#1A0706`)**: Deep card inset backgrounds and subtle low-saturation hover states.

### Token Mapping:
| Linear Token Role | Token Value | Usage |
| :--- | :--- | :--- |
| **Canvas** | `#08090A` | Deepest neutral dark backdrop layer |
| **Canvas Subtle** | `#0D0E11` | Input fields, code containers, table bodies |
| **Surface** | `#121316` | Main panel backgrounds, split view cards |
| **Surface Raised** | `#181A20` | Inner cards, elevated modules |
| **Surface Hover** | `#20232B` | Interactive row and card hover |
| **Hairline** | `#23252A` | Ultra-clean neutral separation borders |
| **Border** | `#2E323B` | Card outlines and input borders |
| **Border Strong** | `#3E434F` | High-contrast structural dividers |
| **Primary (Racing Red)** | `#DD0200` | Primary action pill CTAs, focus highlights |
| **Primary Hover** | `#F81916` | Hover state on primary buttons |
| **Primary Glow** | `rgba(221, 2, 0, 0.2)` | Focus rings and subtle button glow |
| **Secondary (Black Cherry)** | `#55100D` | Active tab pill, secondary button accents |
| **Ink (Alabaster Grey)** | `#D9D9D9` | Headings, titles, main body text |
| **Ink Secondary** | `#A8B0BE` | Subtitles, labels, field descriptions |
| **Muted** | `#6E7684` | Placeholders, inactive captions |
| **Subtle** | `#454A54` | Faint borders, inactive indicators |
| **Success (Linear Emerald)** | `#27A644` | Cryptographic proof verified badges, honest status |
| **Danger (Racing Red)** | `#DD0200` | Attacker alerts, security violation badges |
| **Monospace / Code** | `JetBrains Mono, monospace` | Opaque addresses, trapdoors, hashes, ciphertexts |

---

## 2. In-Scope Deliverables

1. **`public/styles.css`**: Update CSS architecture to true Linear near-black with neutral charcoal surfaces, removing red canvas/card tinting while applying Racing Red & Black Cherry as crisp precision accents.
2. **`public/index.html`**: Ensure all badge classes, pill buttons, and layout containers reflect the clean Linear hierarchy.
3. **`public/app.js`**: Verify dynamic state classes render seamlessly with the new styling.
4. **Validation**: Run integration tests and full test regression (`npm test` 96/96 green).
