# Concerns, Technical Debt & Architectural Gaps: Clusion Codebase

## 1. Lack of Verifiability (Critical Security Gap)
- **Issue**: Clusion assumes an honest-but-curious server model. In enterprise cloud deployments, an untrusted or compromised cloud server could drop records (censor search results), return fabricated results, or replay stale index states.
- **Remediation**: Must construct an Authenticated Inverted Index (AII) with Merkle Trees or Cryptographic Accumulators to cryptographically verify search completeness and soundness on the client.

## 2. No Substring Search Support
- **Issue**: Clusion indexes discrete stemmed words via Lucene analyzers. Substring queries (e.g., finding `"bank"` within `"databank"` or `"banking"`) fail because cryptographic trapdoors are exact PRF evaluations: $F(K, \text{"bank"}) \neq F(K, \text{"databank"})$.
- **Remediation**: Implement client-side N-Gram decomposition (3-grams/4-grams) and conjunctive blind index evaluations.

## 3. Monolithic In-Memory Architecture
- **Issue**: Clusion runs both client encryption and server search routines within a single JVM process in memory. There is no network protocol, REST API, WebSocket transport, or client-server boundary.
- **Remediation**: Separate into a standalone trusted Client (Web Crypto API / Node.js) and an untrusted Server (REST / PostgreSQL).

## 4. Heavyweight Legacy Dependencies
- **Issue**: Dependencies include Apache Lucene 7.4.0, POI 3.15, PDFBox 2.0, Hadoop 2.7.1, and AWS SDK 1.11.19. Many of these contain known CVEs, are deprecated, and inflate the build artifact to hundreds of megabytes.
- **Remediation**: Eliminate Hadoop/AWS dependencies; replace document extractors with modern, secure parsing libraries.

## 5. Fragile String-Splitting and Padding
- **Issue**: Code uses string concatenation with fixed delimiters like `\t\t\t`, `seperator`, and magic constants (`"1"`, `"2"`, `"3"`, `"XX"`) to pack pointers and IDs into byte arrays. If document IDs contain spaces or delimiters, parsing fails.
- **Remediation**: Use structured binary framing (e.g., Protocol Buffers, CBOR, or well-defined typed byte buffers with length prefixes).

## 6. Deprecated Cryptographic Primitives
- **Issue**: `CryptoPrimitives.java` hardcodes `PBKDF2WithHmacSHA1` and uses AES in CTR mode without MAC verification in several internal methods.
- **Remediation**: Upgrade to `PBKDF2WithHmacSHA256` or `HKDF-SHA256`, and standardize on AES-256-GCM for authenticated encryption.

## 7. Zero Untrusted Server Audit Logging
- **Issue**: Clusion outputs debug messages to `logs.txt`, which lacks cryptographic audit guarantees.
- **Remediation**: Implement a tamper-evident audit log that records only non-invertible hashes, opaque trapdoors, and ciphertexts to verify zero plaintext exposure.
