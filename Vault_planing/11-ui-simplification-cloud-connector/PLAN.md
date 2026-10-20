# Plan: Phase 11 — UI Simplification & Cloud Connector Overhaul (Case Study)

**Phase:** Phase 11  
**Goal:** Overhaul the Cloud Storage Connector as a universal, accessible drawer/modal from any view mode, make the topbar Cloud Chip interactive, add password show/hide eye toggles, eliminate invisible whitespace bugs with automatic trimming, add human-actionable error translation, and provide persistent data locality guidance.  
**Target Files:**
- `public/index.html` (Interactive topbar chip, password eye toggles, global cloud drawer/modal markup, data locality notice)
- `public/styles.css` (Interactive chip styling, password toggle styling, modal/drawer slide-in animations, actionable error banners)
- `public/app.js` (Topbar chip click handler, modal open/close logic, password visibility toggles, credential `.trim()`, human-actionable error translation)
- `tests/client/cloud_ui_helpers.test.ts` (Automated tests for error translation, URL normalization, and credential sanitization)

---

## Tasks Breakdown

### Wave 1: Interactive Topbar Chip & Universal Cloud Drawer / Modal
- **Task 1.1**: Update `#cloudStorageChip` in `public/index.html` with `role="button"`, `tabindex="0"`, interactive tooltip, and a gear/settings SVG icon.
- **Task 1.2**: Implement interactive styling in `public/styles.css` for `#cloudStorageChip`:
  - Hover background, cursor pointer, active press effect, and subtle outline glow.
- **Task 1.3**: Provide a global Cloud Configuration Modal/Drawer (`#cloudConfigModal` with `#cloudModalBackdrop`) accessible from ANY view mode (Client Vault, Split View, Cloud Lab):
  - Accessible via clicking `#cloudStorageChip`, clicking `btnToggleCloudConfig`, or pressing `Escape` to close.
  - Smooth slide-in / fade transition.

### Wave 2: Credential Visibility (Eye Toggle) & Whitespace Sanitization
- **Task 2.1**: Wrap password inputs (`#masterPasswordInput`, `#inputSupabaseKey`, `#inputS3SecretKey`) in `.input-password-wrap` with `.btn-toggle-pw`.
- **Task 2.2**: Implement password show/hide toggle in `public/app.js` with dynamic SVG eye/eye-off swap.
- **Task 2.3**: Ensure all credential retrieval in `getCloudConfigPayload()` strictly `.trim()` all strings (API keys, project URLs, endpoints, secrets, and bucket names).

### Wave 3: Human-Actionable Error Messages & Data Locality Guidance
- **Task 3.1**: Implement `translateCloudError(rawError, provider)` in `public/app.js`:
  - Translate Supabase 401/403/invalid JWT into step-by-step instructions (Dashboard -> Project Settings -> API -> service_role secret).
  - Translate 404 / bucket missing into advice on creating the bucket and setting public/authenticated policies.
  - Translate AWS S3 signature and key errors into specific credential/region checks.
  - Translate network/CORS failures with endpoint guidance.
- **Task 3.2**: Add persistent Data Locality & Multi-Cloud guidance banner to the cloud drawer.
- **Task 3.3**: Display friendly formatted error boxes in `#cloudFeedbackMsg` and send contextual toasts.

### Wave 4: View Mode Simplification & Automated Verification
- **Task 4.1**: Enhance view mode tabs with clear descriptive badges and intuitive labels.
- **Task 4.2**: Create `tests/client/cloud_ui_helpers.test.ts` testing error translation and URL normalization.
- **Task 4.3**: Run `npm test` across all suites (target: 100% passing).
- **Task 4.4**: Browser subagent verification of interactive chip, drawer opening in all 3 view modes, eye toggles, and responsive styling.
