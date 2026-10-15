# Research: Phase 5 — Untrusted Server Backend & Zero-Knowledge Audit Logger

**Phase:** Phase 5  
**Target:** Cloud Storage REST Microservice & Cryptographic Hash-Chained Audit Logger  
**Directory:** `Vault_planing/05-server-backend-audit/`  
**Dependencies:** Phase 1 (`src/crypto/`), Phase 3 (`src/engine/`), Phase 4 (`src/verifiability/`)

---

## 1. Zero-Knowledge Audit Logging Mechanics

### 1.1. The Privacy Paradox in Compliance Logging
Standard enterprise security frameworks require auditing all data operations. However:
- Logging `SEARCH: query="tax evasion" user=104` destroys user privacy.
- Logging `DOCUMENT_STORED: filename="patient_hiv_record.pdf"` violates HIPAA.

### 1.2. The Zero-Knowledge Solution
Every event is recorded using **blinded identifiers**:
1. When indexing a document:
   - Record operation: `"INDEX_DOCUMENT"`
   - Target reference: `opaqueDocRef = HMAC(K_addr, "VAULT:DOCREF:" || docId)` (64-char hex)
   - Stored metrics: `entryCount: number`, `sizeBytes: number`
   - Opaque addresses: `addressHashes: string[]` (64-char hex strings)
2. When searching:
   - Record operation: `"SEARCH_QUERY"`
   - Query representation: `trapdoorHashes: string[]` (64-char hex PRF hashes)
   - Results: `matchCount: number`, `merkleRootHex: string`
3. When downloading:
   - Record operation: `"RETRIEVE_BLOB"`
   - Target reference: `opaqueDocRef`

An auditor or regulator observing the audit log can verify:
- Exactly when documents were added.
- The volume and frequency of searches.
- The Merkle root commitments generated for every search.
- **WITHOUT learning a single plaintext keyword, document title, or document text.**

---

## 2. Tamper-Evident Hash Chain Specification

To ensure audit logs cannot be altered, forged, or pruned retroactively by a malicious cloud provider:

### 2.1. Chain Structure
```
Genesis Entry (0)
┌─────────────────────────────────┐
│ index: 0                        │
│ timestamp: 1776200000000        │
│ opType: "SYSTEM_INIT"           │
│ detailsHash: SHA-256(...)       │
│ prevHash: "0000...0000"         │
│ entryHash: H_0                  │
└────────────────┬────────────────┘
                 │
                 ▼
Entry 1
┌─────────────────────────────────┐
│ index: 1                        │
│ timestamp: 1776200001000        │
│ opType: "INDEX_DOCUMENT"        │
│ detailsHash: SHA-256(...)       │
│ prevHash: H_0                   │◄── Cryptographically bound to Entry 0
│ entryHash: H_1                  │
└────────────────┬────────────────┘
                 │
                 ▼
Entry 2
┌─────────────────────────────────┐
│ index: 2                        │
│ timestamp: 1776200002000        │
│ opType: "SEARCH_QUERY"          │
│ detailsHash: SHA-256(...)       │
│ prevHash: H_1                   │◄── Cryptographically bound to Entry 1
│ entryHash: H_2                  │
└─────────────────────────────────┘
```

### 2.2. Mathematical Invariant
For any entry $i > 0$:
$$\text{entryHash}_i = \text{SHA-256}\left(\text{"VAULT:AUDIT:"} \parallel i \parallel \text{":"} \parallel \text{timestamp}_i \parallel \text{":"} \parallel \text{opType}_i \parallel \text{":"} \parallel \text{detailsHash}_i \parallel \text{":"} \parallel \text{prevHash}_i\right)$$

If an attacker flips a single bit in Entry 1 or removes an entry:
- Entry 2's `prevHash` will not match Entry 1's recomputed hash.
- Verification algorithm immediately halts and pinpoints the exact tampered index.

---

## 3. REST API Interface Specification

The microservice runs an HTTP/1.1 REST server with standard JSON endpoints:

### Endpoints
1. `POST /api/v1/index`
   - Body: `{ entries: BlindIndexEntry[], docRef: string, encryptedBlob: EncryptedBlobPayload }`
   - Inserts blind index records, stores encrypted blob, appends `"INDEX_DOCUMENT"` audit record.
   - Response: `201 Created` -> `{ success: true, docRef: string, storedEntries: number }`

2. `POST /api/v1/search`
   - Body: `{ queryType: "EXACT_WORD" | "SUBSTRING_CONJUNCTIVE", tokens: SearchTrapdoorToken[] }`
   - Executes blind search, builds Merkle proof bundle, appends `"SEARCH_QUERY"` audit record.
   - Response: `200 OK` -> `{ success: true, bundles: VerifiableSearchResultBundle[] }`

3. `GET /api/v1/blobs/:docRef`
   - Retrieves encrypted document payload.
   - Appends `"RETRIEVE_BLOB"` audit record.
   - Response: `200 OK` -> `{ success: true, blob: EncryptedBlobPayload }`

4. `GET /api/v1/audit/log`
   - Returns array of all audit entries.
   - Response: `200 OK` -> `{ success: true, entries: AuditLogEntry[] }`

5. `GET /api/v1/audit/verify`
   - Audits the entire cryptographic hash chain.
   - Response: `200 OK` -> `{ success: true, isChainValid: boolean, entryCount: number, latestHash: string }`

6. `GET /api/v1/health`
   - Health check, uptime, memory, and storage metrics.
