# Research: Phase 2 — Client Indexer & Substring N-Gram Engine

**Phase:** Phase 2  
**Target:** Client-Side Tokenization, Substring N-Gram Engine & Inverted Index  
**Directory:** `Vault_planing/02-indexer-and-substring/`  
**Standard:** Modern Native TypeScript (Node.js 18+ and Browser Web APIs)

---

## 1. Domain Problem & Requirements

### 1.1. The Substring Search Limitation in Traditional SSE
Traditional Searchable Symmetric Encryption schemes (including the academic Clusion library) rely on exact keyword matching:
- A document containing `"enterprise_financial_audit.pdf"` is tokenized into discrete words: `["enterprise", "financial", "audit", "pdf"]`.
- Each word $w$ is hashed with a PRF: $T_w = \text{PRF}(K_{trap}, w)$.
- If a user searches for the substring `"finan"` or `"audit"`, a search for `"finan"` computes $T_{\text{"finan"}} = \text{PRF}(K_{trap}, \text{"finan"})$.
- Under the cryptographic pseudorandomness property:
  $$T_{\text{"finan"}} \neq T_{\text{"financial"}}$$
- **Result:** The untrusted server cannot find `"financial"` when queried for `"finan"`! In Clusion, substring queries are mathematically impossible.

### 1.2. The Solution: N-Gram Blind Indexing over Ciphertext
To enable an untrusted server to execute substring queries over ciphertext without learning the underlying text or leaking excessive statistical information:
1. During indexing on the client, text is decomposed into **character N-grams** (sliding window of length $n$).
2. Every $n$-gram is treated as a discrete blind index token in the encrypted multi-map.
3. When searching for substring $Q$ (where $|Q| \ge n$):
   - The client decomposes $Q$ into its constituent $n$-grams: $\{g_1, g_2, \dots, g_k\}$.
   - The client emits conjunctive search trapdoors: $\{T_{g_1}, T_{g_2}, \dots, T_{g_k}\}$.
   - The server computes the set intersection of matching document IDs: $\bigcap_{i=1}^k \text{EDB}[T_{g_i}]$.
   - The server returns matching candidate document references without knowing what letters or words were searched!

---

## 2. Parameter Analysis: Selecting $n$ for N-Grams

| $n$-gram Size | Minimum Searchable Substring | Storage Overhead | False Positive Candidate Rate | Verdict |
| :---: | :---: | :---: | :---: | :--- |
| **$n = 2$ (Bigrams)** | 2 characters (`"in"`, `"at"`) | Low | **Very High** (almost all documents contain common bigrams like `"th"`, `"er"`, `"on"`). Server returns huge candidate sets. | **Rejected** due to excessive false positives. |
| **$n = 3$ (Trigrams)** | 3 characters (`"sec"`, `"fin"`, `"tax"`) | Moderate ($\approx 2.5\times$ index size) | **Low** (combination of 3-grams is highly selective in enterprise text). | **SELECTED as Primary Standard.** |
| **$n = 4$ (4-grams)** | 4 characters (`"secu"`, `"fina"`) | High | Extremely Low | Useful as an optional higher-selectivity configuration, but cannot search 3-letter terms. |

**Standard Selection**: $n = 3$ (Trigrams) with support for full word tokens.

---

## 3. Tokenization & Normalization Strategy

To ensure deterministic matching between client indexing and search queries:
1. **Case Folding**: Convert all text to lowercase via Unicode standard `toLowerCase()`.
2. **Whitespace & Control Character Stripping**: Normalize tabs, newlines, and non-printable bytes into uniform whitespace.
3. **Punctuation & Word Delimitation**:
   - Extract discrete words (`/[a-z0-9_-]+/g`) for exact keyword indexing.
   - Extract continuous character sliding windows across alphanumeric tokens for $n$-gram indexing.
4. **Deduplication**: In a single document, duplicate occurrences of the same token only need to link to that document once in the basic set index (or track occurrence count for ranking).

---

## 4. Query Decomposition & False Positive Pruning

### 4.1. Substring Query Decomposition Algorithm
For a query string $Q$ of length $L = |Q|$:
- If $L < 3$: Exact match against short word tokens.
- If $L \ge 3$: Decompose into $L - 3 + 1$ overlapping 3-grams:
  $$g_i = Q[i \dots i+2] \quad \text{for } i \in [0, L - 3]$$
  Example for $Q = \text{"audit"}$:
  $$g_0 = \text{"aud"}, \quad g_1 = \text{"udi"}, \quad g_2 = \text{"dit"}$$
- Output: Unique set of 3-grams: `["aud", "udi", "dit"]`.

### 4.2. Local False Positive Pruning
- **The N-Gram Intersection Property**: If a document contains `"audiophile"` and `"credit"`, it contains `"aud"` and `"dit"`. If $Q = \text{"audit"}$, it might match all individual 3-grams if `"udi"` is also present elsewhere in the file.
- **Client Verification**: Because the client decrypts candidate documents locally with $K_{enc}$, the client executes a final exact string check (`documentContent.includes(Q)`) to prune any false positive candidates in $O(1)$ client time. The untrusted server never learns about this pruning.
