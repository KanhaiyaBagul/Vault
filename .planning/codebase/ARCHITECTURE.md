# Architecture: Clusion Codebase

## High-Level Design Patterns

Clusion implements cryptographic Searchable Symmetric Encryption (SSE) constructions rooted in academic literature:
1. **Encrypted Multi-Map (EMM)**: Abstracts the searchable index as an encrypted key-value store mapping search trapdoors to encrypted collections of document identifiers.
2. **Two-Level Partitioning (`2Lev`)**:
   - Small lists ($t \le \text{smallBlock}$): Stored directly in the primary dictionary $\gamma$.
   - Medium lists ($\text{smallBlock} < t \le \text{bigBlock}$): Stored in secondary array $A$, pointed to by $\gamma$.
   - Large lists ($t > \text{bigBlock}$): Partitioned across multiple array blocks in $A$, pointed to by an array of indices in $\gamma$.
3. **Response-Revealing vs. Response-Hiding**:
   - `RR2Lev`: Server decrypts document IDs using $K_2$.
   - `RH2Lev`: Document IDs are doubly encrypted; server returns encrypted references $c_i$; client invokes `resolve()` to decrypt document IDs.
4. **Tuple-Set Inverted Index (`TSet`)**:
   - Fixed bucket count $B$ with sub-buckets $S$.
   - Postings masked via XOR with pseudorandom pads.
5. **Set-Difference Disjunctions (`IEX-2Lev`)**:
   - Decomposes $(w_1 \lor w_2 \lor \dots \lor w_m)$ into set differences using a Global Multi-Map and pairwise Local Multi-Maps.
6. **Stateful Dynamic Forward-Secure Updates (`DynRH`)**:
   - Client tracks keyword insertion counts $\Sigma[w]$.
   - Each update is tagged with $L = \text{CMAC}(K_w, c)$.

## Concurrency Architecture
- Multi-threaded parallel indexing via `java.util.concurrent.ExecutorService` and `Callable`/`Future` in `TextExtractPar.java`, `RR2Lev.java`, and `RH2Lev.java`.
- Guava `ConcurrentHashMap` and `ArrayListMultimap` for concurrent inverted index creation.
