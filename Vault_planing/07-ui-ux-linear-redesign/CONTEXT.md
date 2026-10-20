# Context: Phase 7 — Linear UI/UX Redesign & Custom Color Palette System

**Phase:** Phase 7  
**Target:** Transform the Web Application UI/UX to match DESIGN.md (Linear aesthetic) infused with the user's custom palette  
**Directory:** `Vault_planing/07-ui-ux-linear-redesign/`  
**Outputs Target:** `public/styles.css`, `public/index.html`, and `public/app.js`  
**References:** `DESIGN.md`, User Swatch Palette Image  

---

## 1. Palette Synthesis: Linear System & User Custom Colors

The user provided 4 specific swatches from the reference image:
- **Alabaster Grey**: `#D9D9D9`
- **Racing Red**: `#DD0200`
- **Black Cherry**: `#55100D`
- **Coffee Bean**: `#1A0706`

In `DESIGN.md`, Linear prescribes:
- Near-black / precision-engineered product aesthetic.
- Inter Variable typography with negative tracking on headings.
- Pill-shaped CTAs (`rounded: 9999px`), tight 4–12px radii on cards, chips, and inputs.
- Layered surfaces separated by low-contrast hairlines.

### Token Mapping:
| Linear Token Role | Base Linear Spec | Phase 7 Custom Value | Usage |
| :--- | :--- | :--- | :--- |
| **Canvas / Background** | `#08090A` | `#1A0706` (Coffee Bean) | Global page background, deepest backdrop layer |
| **Surface (Cards/Panels)** | `#121414` | `#230B0A` | Card bodies, panel backgrounds, layered surfaces |
| **Surface-Raised** | `#1C1C1F` | `#35100E` | Elevated cards, dropdowns, input backgrounds |
| **Border / Hairline** | `#23252A` | `rgba(85, 16, 13, 0.45)` | Subtle structural division lines |
| **Border Strong** | `#34343A` | `#55100D` (Black Cherry) | Focused borders, active tabs, panel dividers |
| **Primary Accent / CTA** | `#5E6AD2` | `#DD0200` (Racing Red) | High-contrast action buttons, active indicators |
| **Primary Accent Hover** | `#6872D9` | `#FF1F1C` | Hover state for buttons and interactive items |
| **Primary Accent Glow** | Tinted shadow | `rgba(221, 2, 0, 0.25)` | Subtle focus rings and glow shadows |
| **Ink (Primary Text)** | `#F7F8F8` | `#D9D9D9` (Alabaster Grey) | Headings, titles, main body text |
| **Ink Secondary** | `#D0D6E0` | `#B8B0AF` | Subtitles, labels, secondary text |
| **Muted** | `#8A8F98` | `#8C7D7C` | Captions, hints, placeholders |
| **Subtle / Faint** | `#62666D` | `#5C4E4D` | Inactive elements, disabled borders |
| **Danger / Alarm** | `#EB5757` | `#DD0200` (Racing Red) | Attacker alerts, security violation badges |
| **Success / Verified** | `#27A644` | `#27A644` / `#22C55E` | Cryptographic proof verified badges, honest status |
| **Monospace / Code** | Berkeley/Inter | `JetBrains Mono, Consolas, monospace` | Opaque addresses, trapdoors, hashes, ciphertexts |

---

## 2. In-Scope Deliverables

1. **`public/styles.css`**: Full CSS overhaul with Linear design tokens, pill CTAs, low-contrast hairlines, and custom palette.
2. **`public/index.html`**: Clean semantic refinement aligning with Linear header, card hierarchy, and input aesthetics.
3. **`public/app.js`**: Verify dynamic class applications, status dot updates, and proof card styles.
4. **Validation**: Test full UI rendering, interactive workflows (derive keys, load sample data, search, attacker simulation, audit chain), and run automated tests.
