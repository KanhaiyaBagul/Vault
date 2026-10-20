# Plan: Phase 10 — Feedback Architecture & Input Sanitization

**Phase:** Phase 10  
**Goal:** Build a native, non-blocking toast notification system, eliminate all browser `alert()` popups with inline validation and error banners, sanitize search query highlighting against regex metacharacters and DOM-based XSS, and add button loading/double-submission guards.  
**Target Files:**
- `public/index.html` (Toast container `<div id="toastContainer">`, inline field error holders)
- `public/styles.css` (Toast styling, keyframe slide-in/out, inline validation styles, button loading spinners)
- `public/app.js` (Toast manager, inline form validation, replace 8 `alert()` calls, regex/HTML escaping in `highlightTerms`, double-submission guards)
- `tests/client/sanitization.test.ts` (Automated tests for search highlighting regex escaping & XSS sanitization)

---

## Tasks Breakdown

### Wave 1: Accessible Toast Notification System
- **Task 1.1**: Add `<div class="toast-container" id="toastContainer" aria-live="polite"></div>` to `public/index.html`.
- **Task 1.2**: Implement toast styling in `public/styles.css` with Claude Warm-Editorial colors:
  - Success (Olive Accent `#6F7F5F` border/icon, Soft Limestone surface)
  - Error (Terracotta/Crimson `#B53A3A` border/icon)
  - Warning (Amber `#D4A017`)
  - Info (Deep Rust `#5A2E25`)
  - Smooth translateY + opacity keyframes, progress bar or auto-dismiss (4.5s), and close button (`&times;`).
- **Task 1.3**: Implement `showToast(message, type, duration)` in `public/app.js`:
  - Dynamically creates toast card with icon, title/message, and close handler.
  - Automatically handles queueing and clean removal.

### Wave 2: Replace Browser `alert()` with Inline Validation & Non-Blocking Error Banners
- **Task 2.1**: Replace `alert("Please enter a master password")` with inline field error `.field-error-msg` below the input and red focus border.
- **Task 2.2**: Replace `alert("Key derivation failed: ...")` with toast and error banner.
- **Task 2.3**: Replace `alert("Please derive cryptographic subkeys first...")` in indexing and search with non-blocking toast + auto-scrolling to unlock panel with pulse highlight.
- **Task 2.4**: Replace `alert("Please provide both document ID and document content")` with inline field errors on the missing inputs.
- **Task 2.5**: Replace `alert("Indexing failed: ...")`, `alert("Sample data failed: ...")`, and `alert("Search error: ...")` with actionable error toasts and inline error banners.

### Wave 3: Secure Search Highlighter (XSS & Regex Metacharacters Guard)
- **Task 3.1**: Create `escapeHtml(str)` utility to safely convert `&`, `<`, `>`, `"`, `'` into safe HTML entities before injecting into `.innerHTML`.
- **Task 3.2**: Create `escapeRegex(str)` utility to escape all regex metacharacters (`.*+?^${}()|[]\`) so queries like `*`, `(tax)`, `[A]` do not crash the RegExp engine.
- **Task 3.3**: Refactor `highlightTerms` in `public/app.js` to escape content and terms properly.
- **Task 3.4**: Create `tests/client/sanitization.test.ts` to assert that special characters and malicious script payloads are safely sanitized and highlighted without errors.

### Wave 4: Action Loading States & Double-Submission Guards
- **Task 4.1**: Add loading state (`.is-loading` / spinner) and disable buttons during async operations:
  - Key derivation (`btnDeriveKeys`)
  - Sample corpus loading (`btnLoadSampleData`)
  - Document indexing & cloud commit (`btnEncryptIndex`)
  - SSE Search execution (`btnSearch`)
  - Cloud connection test (`btnTestCloudPing`)
  - Cloud save & switch (`btnSaveCloudConfig`)
  - Audit chain verification (`btnVerifyAuditChain`)
- **Task 4.2**: Verify full test suite passes with `npm test`.
