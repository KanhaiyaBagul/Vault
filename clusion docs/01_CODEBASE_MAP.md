# 01. Clusion Codebase Map

A comprehensive technical map of the Clusion codebase (`k:/Coding Projects/Vault/Clusion`), detailing its architecture, file structures, cryptographic primitives, schemes, data structures, and dependencies.

---

## 1. Directory Structure

```
Clusion/
├── pom.xml                                      # Maven build config (Java 1.8, Bouncy Castle, Lucene, POI, Hadoop)
├── README.md                                    # Upstream project overview and test instructions
├── LICENSE                                      # GNU General Public License v3 (GPLv3)
├── .gitignore
├── android/                                     # Android build and port of Clusion primitives
│   ├── build.gradle                             # Gradle configuration targeting Android SDK
│   ├── src/org/clusion/
│   │   ├── CryptoPrimitivesAndroid.java         # SpongyCastle-based crypto primitives for Android
│   │   └── DynRHAndroid.java                    # Dynamic SSE implementation for Android
│   └── test/org/clusion/
│       └── TestLocalDynRHAndroid.java           # Android dynamic SSE benchmark
└── src/
    ├── main/java/org/crypto/sse/                # Core SSE Library
    │   ├── CryptoPrimitives.java                # AES-CTR, CBC, HMAC, CMAC, PBKDF, HCB1 Online Cipher
    │   ├── RR2Lev.java                          # Response-Revealing 2-Level Multi-Map (Cash et al. 2014)
    │   ├── RH2Lev.java                          # Response-Hiding 2-Level Multi-Map (Cash et al. 2014)
    │   ├── EMM2Lev.java                         # Encrypted Multi-Map 2-Level (general structure)
    │   ├── TSet.java                            # Tuple-Set (TSet) Inverted Index Construction
    │   ├── TSetResultFormat.java                # Value container for TSet results (Doc ID + Bloom filter ID)
    │   ├── IEX2Lev.java                         # Boolean / Disjunctive SSE (Kamara & Moataz Eurocrypt 2017)
    │   ├── IEXRH2Lev.java                       # Response-Hiding Boolean / Disjunctive SSE
    │   ├── IEXZMF.java                          # Boolean SSE combined with Matryoshka Filters
    │   ├── IEX2LevAMAZON.java                   # Distributed MapReduce / Hadoop setup for IEX on AWS
    │   ├── DynRH.java                           # Dynamic Response-Hiding SSE with Forward Privacy
    │   ├── DynRH2Lev.java                       # Dynamic 2-Level SSE
    │   ├── DynRH_Disk.java                      # Disk-backed Dynamic SSE using MapDB
    │   ├── DlsD.java                            # Dual-Secure Structured Encryption (Amjad et al. S&P 2019)
    │   ├── ZMF.java                             # Bloom / Matryoshka Filter SSE scheme
    │   ├── ZMFFormat.java                       # Serialization helper for ZMF
    │   ├── TextProc.java                        # Text extraction and partition coordinator
    │   ├── TextExtractPar.java                  # Multi-threaded document parser (Lucene, POI, PDFBox)
    │   ├── Tokenizer.java                       # Apache Lucene standard/stop-word analyzer wrapper
    │   ├── Partition.java                       # Partitioning large inverted indexes
    │   ├── Token.java                           # Token container object
    │   ├── TokenDIS.java                        # Disjunctive query token container (Global + Local tokens)
    │   ├── Record.java                          # Key-Value Record tuple (label, value)
    │   ├── Serializer.java                      # Java object serialization utility
    │   └── Printer.java                         # Level-based logging and benchmark timing utility
    └── test/java/org/crypto/sse/                # Local CLI Test Drivers & Benchmarks
        ├── TestIndexing.java                    # Document parsing and inverted index test
        ├── TestLocalRR2Lev.java                 # Interactive CLI benchmark for RR-2Lev
        ├── TestLocalRH2Lev.java                 # Interactive CLI benchmark for RH-2Lev
        ├── TestLocalIEX2Lev.java                # Interactive CLI benchmark for IEX-2Lev (CNF Boolean queries)
        ├── TestLocalIEXRH2Lev.java              # Interactive CLI benchmark for IEX-RH-2Lev
        ├── TestLocalIEXZMF.java                 # Interactive CLI benchmark for IEX-ZMF
        ├── TestLocalDynRH.java                  # Interactive CLI benchmark for Dynamic SSE
        ├── TestLocalDynRH2Lev.java              # Interactive CLI benchmark for Dynamic 2Lev
        ├── TestLocalDynRH_DISK.java             # Interactive CLI benchmark for Disk-backed Dynamic SSE
        ├── TestLocalDlsD.java                   # Interactive CLI benchmark for Dual-Secure SSE
        └── TestLocalZMF.java                    # Interactive CLI benchmark for ZMF
```

---

## 2. Core Cryptographic Engine: `CryptoPrimitives.java`

`CryptoPrimitives.java` (848 lines, 31 KB) is the central cryptographic engine in Clusion. It leverages **Bouncy Castle (`org.bouncycastle`)** to implement:

| Function Category | Method Signature | Underlying Primitive | Usage in SSE |
| :--- | :--- | :--- | :--- |
| **Key Derivation** | `keyGenSetM(pass, salt, icount, keySize)` | `PBKDF2WithHmacSHA1` (suggests SHA256 in comments) | Derives master symmetric keys from user passwords. |
| **Trapdoor / PRF** | `generateCmac(key, msg)` | `AESFastEngine` in `CMac` mode (128-bit output) | Computes deterministic pseudorandom tokens for keywords and addresses. |
| **MAC / Hashing** | `generateHmac(key, msg)`<br>`generateHmac512(key, msg)` | `HMac` over `SHA256Digest` and `SHA512Digest` | Mask generation, TSet bucket location hashing, and index obfuscation. |
| **Payload Encryption** | `encryptAES_CTR_String(key, iv, id, size)`<br>`decryptAES_CTR_String(input, key)` | AES in CTR mode with explicit padding | Encrypts document IDs and payload values with fixed-width padding to prevent length leakage. |
| **Authenticated Encryption** | `auth_encrypt_AES_HMAC(...)`<br>`auth_decrypt_AES_HMAC(...)` | AES-CBC + HMAC-SHA256 (Encrypt-then-MAC) | Authenticated ciphertext construction. |
| **Online Cipher** | `onlineCipher(...)`<br>`onlineCipherOWF(...)` | HCB1 online cipher construction (Bellare et al. 2007) | Used in ZMF schemes for incremental prefix-preserving encryption of Bloom filters. |
| **RNG & Bit Ops** | `randomBytes(size)`, `randomSeed(size)`, `getIntFromByte(...)`, `concat(a, b)` | `SecureRandom`, `ThreadedSeedGenerator` | High-entropy IV generation, bucket index bit unpacking, byte array concatenation. |

---

## 3. Implemented SSE Schemes & Core Mechanisms

### 3.1. Cash et al. 2-Level Multi-Maps (`RR2Lev.java` & `RH2Lev.java`)
Implements the landmark NDSS 2014 paper *"Dynamic Searchable Encryption in Very-Large Databases"*.
- **Data Structure**: Consists of two layers:
  1. A primary **Dictionary** (hash table/multimap) mapping masked labels $L$ to encrypted blocks $V$.
  2. A secondary **Array** storing oversized postings lists that exceed small-block limits.
- **Two-Level Partitioning Strategy**:
  - **Small case** ($t \le \text{smallBlock}$): Posting list of document IDs fits directly in the dictionary entry: $V = \text{Enc}_{K_2}(\text{"1"} \parallel \text{DocIDs})$.
  - **Medium case** ($\text{smallBlock} < t \le \text{bigBlock}$): Document IDs are stored in a chunk of the secondary array; dictionary entry points to the array index: $V = \text{Enc}_{K_2}(\text{"2"} \parallel \text{ArrayIndex})$.
  - **Large case** ($t > \text{bigBlock}$): Document IDs are partitioned across multiple array blocks; dictionary entry contains an array of pointers: $V = \text{Enc}_{K_2}(\text{"3"} \parallel [\text{Index}_1, \text{Index}_2, \dots])$.
- **Response-Revealing (RR2Lev)**: The server receives token keys $K_1 = \text{CMAC}(K, "1" + w)$ and $K_2 = \text{CMAC}(K, "2" + w)$. The server decrypts $V$ using $K_2$ and returns the plaintext document IDs.
- **Response-Hiding (RH2Lev)**: Document IDs are pre-encrypted with an additional client secret key $K_{enc}$. When the server decrypts $V$ using $K_2$, it only recovers *encrypted document references*. The server transmits these ciphertexts to the client, and the client invokes `resolve(K_{enc}, ciphertexts)` to obtain plaintext document IDs. The server learns zero document IDs!

### 3.2. Tuple Set (`TSet.java`)
Implements the Cash et al. TSet:
- Organizes the inverted index into $B$ primary buckets with $S$ sub-buckets.
- For each keyword $w$ and index counter $c = 0, 1, \dots$:
  - A pseudo-random bucket address is computed: $b = \text{HMAC}(K_{hash}, \text{CMAC}(tag, c)) \pmod B$.
  - Label and value mask: $(label, mask) = \text{HMAC}(tag, c)$.
  - Record value: $V = mask \oplus (\beta \parallel \text{DocID})$, where $\beta$ is a 1-bit flag indicating if more records follow ($\beta=1$) or if this is the end of the keyword's posting list ($\beta=0$).
- Guarantees $O(1)$ worst-case I/O per result tuple.

### 3.3. Boolean & Disjunctive SSE (`IEX2Lev.java` & `TokenDIS.java`)
Implements Kamara & Moataz (Eurocrypt 2017) *"Boolean Searchable Symmetric Encryption with Worst-Case Sub-Linear Complexity"*:
- Handles arbitrary disjunctions $(w_1 \lor w_2 \lor \dots \lor w_m)$ and CNF expressions.
- **Mechanism**:
  - Uses the set identity: $DB(w_1) \cup DB(w_2) = DB(w_1) \cup (DB(w_2) \setminus DB(w_1))$.
  - Stores a **Global Multi-Map** for primary keyword postings lists $DB(w)$.
  - Stores a collection of **Local Multi-Maps** for every keyword $w_i$, indexing pairs $(w_j, DB(w_i) \cap DB(w_j))$.
  - The search token `TokenDIS` contains:
    - `tokenMMGlobal`: Trapdoor for $w_1$ in the global multimap.
    - `tokenDIC`: Trapdoor locating $w_1$'s local multimap.
    - `tokenMMLocal`: List of trapdoors for each $w_j$ within $w_1$'s local multimap.
  - Server executes $DB(w_1)$, then looks up $DB(w_1) \cap DB(w_j)$ in the local multimap, and evaluates the set difference without learning extraneous records!

### 3.4. Dynamic SSE with Forward Privacy (`DynRH.java` & `DlsD.java`)
- **`DynRH.java`**: Implements dynamic insertions and deletions with forward security.
  - Client maintains a local counter $\text{state}[w]$ for each keyword $w$.
  - When inserting document $id$ for keyword $w$:
    - $c = \text{state}[w]++;$
    - $label = \text{CMAC}(K_2, c)$; $value = \text{Enc}_{K_1}(id)$.
    - Server stores $(label, value)$ in an encrypted hash map.
  - Search token `genToken(K, w)` passes $K_2 = \text{CMAC}(K, "2" + w)$ and the current count $c$.
  - The server reconstructs $label_0, label_1, \dots, label_{c-1}$ and retrieves all values in $O(|DB(w)|)$.
  - **Forward Privacy**: In forward-secure mode (`genTokenFS`), keys are ratcheted so that subsequent updates cannot be tied to previous queries.
- **`DlsD.java`**: Implements Amjad, Kamara, Moataz (IEEE S&P 2019) Dual-Secure Structured Encryption.
  - Achieves both **breach resistance** (server snapshot leak reveals nothing about inactive items) and **forward privacy**.
  - Employs deamortized restructuring to maintain optimal access bounds across continuous updates.

### 3.5. Bloom Filter SSE (`ZMF.java`)
- Uses Matryoshka Filters (nested Bloom filters) and HCB1 online ciphers to evaluate keyword membership in documents with compact index footprints.

---

## 4. Text Processing & Inverted Index Generation

Files: `TextExtractPar.java`, `TextProc.java`, `Tokenizer.java`
- **Supported Formats**: `.txt`, `.html`, `.pdf` (via Apache PDFBox), `.doc`/`.docx`, `.ppt`, `.xls` (via Apache POI).
- **Tokenization**: Uses Apache Lucene `StandardAnalyzer` and `EnglishAnalyzer` with stop-word elimination.
- **Output Data Structures**:
  - `lp1`: `Multimap<String, String>` mapping Keyword $\to$ Document IDs.
  - `lp2`: `Multimap<String, String>` mapping Document ID $\to$ Keywords.

---

## 5. Dependencies and Build Environment

From `pom.xml`:
- **Java Compatibility**: Target 1.8 (compatible with Java 7 and 8).
- **Crypto Provider**: `org.bouncycastle:bcprov-jdk15on:1.54`.
- **Text Analysis**: `org.apache.lucene:lucene-core:7.4.0`, `lucene-analyzers-common:7.4.0`.
- **Document Extractors**: `org.apache.pdfbox:pdfbox:[2.0.15,)`, `org.apache.poi:poi:3.15-beta1`, `poi-ooxml`, `poi-scratchpad`.
- **Collections & Memory**: `com.google.guava:guava:19.0`, `org.mapdb:mapdb:3.0.4`, `com.carrotsearch:java-sizeof:0.0.5`.
- **Legacy Distributed / Cloud**: `org.apache.hadoop:hadoop-common:2.7.1`, `hadoop-core:1.2.1`, `com.amazonaws:aws-java-sdk:1.11.19`.

---

## 6. Execution Model and Limitations

1. **Local Test Drivers**: The test files (`TestLocal*.java`) are CLI console apps reading from `System.in`. They run client and server simulation logic within the same JVM memory space.
2. **Missing Network Stack**: Clusion has no HTTP server, WebSocket daemon, gRPC service, or remote protocol.
3. **Missing Authentication/Verification**: Search results are trusted implicitly. If an untrusted server omits matching documents or returns invalid data, the client has no way to detect it.
4. **Keyword-Only Matching**: Indexing extracts discrete stemmed words. Substring search (e.g., searching `"sec"` to find `"security"`) is impossible without prefix/n-gram index expansion.
