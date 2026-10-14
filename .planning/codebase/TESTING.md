# Testing & Benchmarks: Clusion Codebase

## Test Architecture
Tests in `src/test/java/org/crypto/sse/` are **interactive CLI benchmarks and validation harnesses** rather than automated unit test assertions. Each test driver contains a `main(String[] args)` method reading from `System.in`.

## Key Test Drivers
1. **`TestLocalRR2Lev.java`**:
   - Prompts for user password and a folder containing plaintext files.
   - Parses documents, builds encrypted multimap, records build time.
   - Enters an interactive search loop prompting for keyword queries and printing matching document IDs.
2. **`TestLocalRH2Lev.java`**:
   - Benchmarks Response-Hiding 2Lev; executes server-side query followed by client-side `resolve()`.
3. **`TestLocalIEX2Lev.java`**:
   - Benchmarks Kamara-Moataz Eurocrypt 2017 Boolean SSE.
   - Evaluates disjunctive and CNF boolean expressions; logs performance stats to `logs.txt`.
4. **`TestLocalIEXRH2Lev.java`**:
   - Response-hiding variant of the Boolean IEX benchmark.
5. **`TestLocalDynRH.java` & `TestLocalDynRH2Lev.java`**:
   - Tests dynamic additions, deletions, forward-secure token generation, and keyword state tracking.
6. **`TestLocalDynRH_DISK.java`**:
   - Validates MapDB disk persistence during dynamic updates.
7. **`TestLocalDlsD.java`**:
   - Tests dual-secure structured encryption and deamortized restructuring.
8. **`TestLocalZMF.java` & `TestLocalIEXZMF.java`**:
   - Tests Bloom filter and Matryoshka filter single-keyword and disjunctive queries.

## Running Tests
Tests require compiling via Maven and exporting `CLASSPATH`:
```bash
cd Clusion
mvn clean test-compile
export CLASSPATH=$CLASSPATH:$(pwd)/target/classes:$(pwd)/target/test-classes
java org.crypto.sse.TestLocalRR2Lev
```
