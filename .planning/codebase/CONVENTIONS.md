# Conventions: Clusion Codebase

## Code Style & Patterns
- **Static Cryptographic Utility Pattern**: Most cryptographic schemes expose static methods:
  - `keyGen(...)`: Derives symmetric keys using PBKDF or SecureRandom.
  - `setup(...)`: Takes plaintext database multimaps and outputs encrypted structures (`gamma`, `array`).
  - `token(...)`: Generates search trapdoors for a given query keyword or list.
  - `query(...)`: Evaluates trapdoors against the encrypted structure on behalf of the server.
  - `resolve(...)`: (In response-hiding schemes) Decrypts returned ciphertexts on the client.
- **Multimap Postings Storage**:
  - Uses Google Guava `ArrayListMultimap` and `TreeMultimap` to represent $(w, id)$ relationships.
- **Data Padding**:
  - Document IDs and filenames are fixed-size padded (e.g., `sizeOfFileIdentifier = 40` or `100` bytes) with tab delimiters (`\t\t\t`) or separator strings (`"seperator"`) to prevent size leakage through ciphertext lengths.
- **Error Handling**:
  - Broad throws signatures (`throws Exception` or explicit cryptographic checked exceptions: `NoSuchAlgorithmException`, `InvalidKeyException`, `NoSuchPaddingException`).
- **Logging**:
  - Custom `Printer.java` singleton with log levels (`Printer.LEVEL.EXTRA`, `Printer.LEVEL.DEBUG`, `Printer.LEVEL.NORMAL`).
