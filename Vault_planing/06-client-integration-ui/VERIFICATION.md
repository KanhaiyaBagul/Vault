# Verification: Phase 6 — Client Integration, Interactive Web UI & Verification

**Phase:** Phase 6  
**Target:** Client SDK, Boolean Query Engine, Interactive Web Dashboard, and Tamper Demonstrations  
**Directory:** `Vault_planing/06-client-integration-ui/`

---

## 1. Automated Verification Commands

```bash
# Run all project unit and integration tests
npm test

# Run Phase 6 specific client tests
node --experimental-strip-types --test tests/client/*.test.ts
```

---

## 2. Test Scenarios & Acceptance Criteria

### Test Scenario 1: Boolean Conjunction (`AND`)
- **Given**:
  - Doc1 contains `"audit"` and `"tax"`.
  - Doc2 contains `"audit"` and `"legal"`.
  - Doc3 contains `"legal"` and `"hr"`.
- **When**: Client queries `"audit AND tax"`.
- **Then**: Returns exclusively `["Doc1"]`. Proofs for both terms are verified.

### Test Scenario 2: Boolean Disjunction (`OR`)
- **When**: Client queries `"tax OR hr"`.
- **Then**: Returns `["Doc1", "Doc3"]`.

### Test Scenario 3: Boolean Negation (`AND NOT`)
- **When**: Client queries `"audit AND NOT tax"`.
- **Then**: Returns `["Doc2"]`.

### Test Scenario 4: End-to-End VaultClient SDK over HTTP
- **Given**: Live `VaultServerApp` running on ephemeral port.
- **When**:
  - `client.initialize("MasterPassword2026!")`.
  - `client.indexDocument("test.txt", "Secret financial content")`.
  - `client.search("financial")`.
- **Then**:
  - Restores plaintext `"Secret financial content"`.
  - Verifies Merkle completeness and soundness.

### Test Scenario 5: Active Attacker Tamper Demonstration
- **When**:
  - `client.simulateCloudTamper("drop", "audit")` triggers a dropped document attack.
- **Then**:
  - Client verifier returns `{ isValid: false, errorCode: "DROPPED_RECORDS" }`.

### Test Scenario 6: Web Dashboard Static Asset Serving
- **When**:
  - HTTP `GET /` requests index dashboard.
  - HTTP `GET /styles.css` requests stylesheet.
  - HTTP `GET /app.js` requests client application script.
- **Then**:
  - Returns `200 OK` with appropriate `Content-Type` headers (`text/html`, `text/css`, `application/javascript`).
