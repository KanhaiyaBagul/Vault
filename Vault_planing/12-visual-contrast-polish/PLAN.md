# Plan: Phase 12 — Visual Consistency, Typography & WCAG AA Contrast

**Phase:** Phase 12  
**Goal:** Enhance contrast and readability to exceed WCAG AA standards, refine typography and visual hierarchy, eliminate visual noise, add interactive empty states with 1-click query suggestions, and polish responsive layouts for all device breakpoints.  
**Target Files:**
- `public/styles.css` (Update `--muted` and `--muted-soft` tokens for WCAG AA >= 4.5:1 contrast, style interactive empty states, chips, and responsive breakpoints)
- `public/index.html` (Initial search empty state with suggestion chips, clean badges and header subtext)
- `public/app.js` (Dynamic empty state rendering with suggestion chips, event delegation for 1-click suggested searches)
- `tests/client/contrast_tokens.test.ts` (Automated verification that color tokens and contrast ratios meet accessibility standards)

---

## Tasks Breakdown

### Wave 1: WCAG AA Contrast & Token Refinement
- **Task 1.1**: Update `--muted` from `#736D66` to `#5A544E` (contrast ratio increases from 4.1:1 to > 5.5:1 on Soft Limestone canvas `#F0E6D8`, comfortably exceeding WCAG AA 4.5:1 minimum).
- **Task 1.2**: Update `--muted-soft` from `#918B82` to `#736D66` for enhanced fine-print readability.
- **Task 1.3**: Verify all input placeholders, labels, and hint text meet readable luminance across both light canvas and dark product chrome.

### Wave 2: Interactive Empty States & 1-Click Suggestions
- **Task 2.1**: Update initial `#resultsContainer` in `public/index.html` with an inviting icon, title, description, and interactive suggestion chips (`tax`, `audit AND compliance`, `payroll`, `quarter`).
- **Task 2.2**: Update dynamic empty search state in `public/app.js` (`renderResults`) to offer the same 1-click suggestion chips when no documents match.
- **Task 2.3**: Add click delegation in `attachEventListeners` for `.btn-chip-suggest` to populate `#searchInput` and immediately execute the search.
- **Task 2.4**: Style `.empty-state`, `.empty-suggestions`, and `.btn-chip-suggest` with Claude editorial aesthetics (soft borders, subtle hover lift, terracotta accents).

### Wave 3: Responsive Polish & Layout Refinement
- **Task 3.1**: Refine `@media (max-width: 900px)` and `@media (max-width: 600px)` in `public/styles.css`:
  - Ensure the modal scales smoothly on mobile viewports.
  - Stack topbar badges and view switcher on smaller screens.
  - Wrap button groups without overlapping or clipping.
- **Task 3.2**: Add `tests/client/contrast_tokens.test.ts` to assert that CSS tokens exist and meet contrast expectations.
- **Task 3.3**: Run `npm test` and verify 100% green across all test suites.
- **Task 3.4**: Visual verification with browser subagent.
