# Research: Phase 6 — Client Integration, Interactive Web UI & Verification

**Phase:** Phase 6  
**Target:** Client SDK, Boolean Query Engine, Interactive Web Dashboard, and Tamper Demonstrations  
**Directory:** `Vault_planing/06-client-integration-ui/`  
**Dependencies:** Phase 1 (`src/crypto/`), Phase 2 (`src/indexer/`), Phase 3 (`src/engine/`), Phase 4 (`src/verifiability/`), Phase 5 (`src/server/`)

---

## 1. Boolean SSE Query Mathematics (Kamara-Moataz IEX)

In Phase 3, we built single-keyword and substring conjunctive 3-gram evaluation.
In Phase 6, we extend this to arbitrary **Boolean Queries**:

### 1.1. Conjunction ($w_1 \text{ AND } w_2$)
- Client generates trapdoor tokens for both $w_1$ and $w_2$.
- Untrusted server evaluates postings and intersects on `opaqueDocRef`:
  $$\mathcal{R}_{\text{AND}} = \mathcal{R}(w_1) \cap \mathcal{R}(w_2)$$
- Client receives verifiable bundles for each term and proves completeness & soundness for both postings lists.

### 1.2. Disjunction ($w_1 \text{ OR } w_2$)
- Client generates trapdoors for $w_1$ and $w_2$.
- Server returns verifiable bundles for both terms.
- Client verifies both Merkle proofs independently.
- Client computes the set union of matching document references:
  $$\mathcal{R}_{\text{OR}} = \mathcal{R}(w_1) \cup \mathcal{R}(w_2)$$

### 1.3. Negation ($w_1 \text{ AND NOT } w_2$)
- In Searchable Symmetric Encryption, evaluating pure negation ($\neg w$) over ciphertext is information-theoretically insecure because it leaks the entire database complement.
- Hence, the standard academic approach (Cash et al., Kamara-Moataz IEX) evaluates **qualified negation**: $w_1 \text{ AND NOT } w_2$.
- Client evaluates postings for $w_1$, evaluates postings for $w_2$, and computes set difference:
  $$\mathcal{R}_{\text{DIFF}} = \mathcal{R}(w_1) \setminus \mathcal{R}(w_2)$$

---

## 2. Interactive Web Application Architecture

The web dashboard is served directly by `VaultServerApp` at `http://localhost:<port>/`:

```
┌────────────────────────────────────────────────────────┐
│             VAULT ZERO-KNOWLEDGE CLOUD DASHBOARD       │
├────────────────────────────────────────────────────────┤
│ [Key Derivation Bar]                                   │
│ Master Password: [ •••••••••••• ]  Status: 🟢 KDF 100k │
├──────────────────────────┬─────────────────────────────┤
│ 📂 CLIENT VIEW (Trusted) │ ☁️ CLOUD LENS (Untrusted)   │
│                          │                             │
│ 1. Drag & Drop Upload:   │ Raw Cloud Storage State:    │
│   • "Q3_Report.pdf"      │ • Total Opaque Rows: 142    │
│   • Instant AES-256-GCM  │ • Row L_0: 4a2b9f...        │
│                          │ • Row V_0: 89f02b... (AES)  │
│ 2. Search Box:           │ • opaqueDocRef: 01fa7b...   │
│   [ "tax AND audit" ] 🔍 │                             │
│                          │ Server Observations:        │
│ 3. Verified Results:     │ • Plaintext Words: 0        │
│   🟢 Verified 100% Sound │ • Plaintext Files: 0        │
│   📄 Q3_Report.pdf       │                             │
├──────────────────────────┴─────────────────────────────┤
│ 🛡️ ACTIVE ATTACKER SIMULATION PANEL                   │
│ [ Simulate Dropped Document ] [ Simulate Forged Doc ] │
│ Result: 🚨 Verifier Catches DROPPED_RECORDS (403)      │
├────────────────────────────────────────────────────────┤
│ 📜 IMMUTABLE AUDIT LOG (SHA-256 Hash Chain)           │
│ #0 SYSTEM_INIT (0000...0000 -> 3a9f...) 🟢 Valid       │
│ #1 INDEX_DOCUMENT (3a9f... -> 8b1c...) 🟢 Valid       │
│ #2 SEARCH_QUERY (8b1c... -> d4e2...) 🟢 Valid         │
└────────────────────────────────────────────────────────┘
```

---

## 3. UI Design Specifications

- **Palette**:
  - Background: `#0B0F19` (Deep Slate / Dark Void)
  - Card Surfaces: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(16px)` and border `rgba(255, 255, 255, 0.08)`
  - Accents: Neon Emerald (`#10B981`) for verified states, Cyber Cyan (`#06B6D4`) for cryptographic hashes, Crimson (`#EF4444`) for attacker tamper alerts
- **Typography**: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif. Monospace font for all 64-char hex digests (`ui-monospace`, `SFMono-Regular`, `Consolas`).
