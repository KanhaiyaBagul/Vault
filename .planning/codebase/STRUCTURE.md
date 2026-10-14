# Structure: Clusion Codebase

## Package Layout
All core production classes belong to package `org.crypto.sse`:

| Class | Role | Asymptotic Complexity |
| :--- | :--- | :--- |
| `CryptoPrimitives` | Central cryptographic engine (AES, HMAC, CMAC, KDF, Online Cipher) | $O(1)$ per block |
| `RR2Lev` | Response-Revealing 2-Level Multi-Map (Cash et al. 2014) | $O(\|DB(w)\|)$ search |
| `RH2Lev` | Response-Hiding 2-Level Multi-Map (Cash et al. 2014) | $O(\|DB(w)\|)$ search |
| `EMM2Lev` | Generic 2-Level Encrypted Multi-Map | $O(\|DB(w)\|)$ search |
| `TSet` | Tuple Set inverted index implementation | $O(1)$ I/O per tuple |
| `TSetResultFormat` | Container for document ID and Bloom filter index | — |
| `IEX2Lev` | Boolean / Disjunctive SSE scheme (Kamara & Moataz 2017) | Worst-case sub-linear |
| `IEXRH2Lev` | Response-Hiding Boolean / Disjunctive SSE scheme | Worst-case sub-linear |
| `IEXZMF` | Boolean SSE using Matryoshka Bloom filters | $O(\|DB(w)\|)$ search |
| `IEX2LevAMAZON` | Distributed MapReduce / Hadoop setup for IEX on AWS | Distributed $O(N)$ |
| `DynRH` | Dynamic Response-Hiding SSE with Forward Privacy | $O(\|DB(w)\|)$ search |
| `DynRH2Lev` | Dynamic 2-Level SSE | $O(\|DB(w)\|)$ search |
| `DynRH_Disk` | Disk-backed Dynamic SSE using MapDB | Disk-backed $O(\|DB(w)\|)$ |
| `DlsD` | Dual-Secure SSE with Forward Privacy & Breach Resistance (Amjad et al. 2019) | $O(\|DB(w)\|)$ amortized |
| `ZMF` | Bloom filter / Matryoshka filter single keyword search | $O(\|DB\|)$ linear |
| `ZMFFormat` | Serialization formatter for ZMF | — |
| `TextProc` | Inverted index pipeline coordinator | $O(N)$ files |
| `TextExtractPar` | Multi-threaded document parser (Lucene, POI, PDFBox) | $O(N)$ documents |
| `Tokenizer` | Apache Lucene Analyzer wrapper | $O(\text{text length})$ |
| `Partition` | Partitioning large inverted indexes into chunks | — |
| `Token` | Search token container | — |
| `TokenDIS` | Disjunctive query token container (Global + Local tokens) | — |
| `Record` | Key-value record tuple `(label, value)` | — |
| `Serializer` | Object serialization utility | — |
| `Printer` | Multi-level benchmark timing and logging output | — |

## Android Subproject (`android/`)
- `android/src/org/clusion/CryptoPrimitivesAndroid.java`: SpongyCastle crypto port.
- `android/src/org/clusion/DynRHAndroid.java`: Android dynamic SSE implementation.
- `android/test/org/clusion/TestLocalDynRHAndroid.java`: Android benchmark harness.
