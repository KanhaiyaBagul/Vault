# Tech Stack: Clusion Codebase

## Languages & Platforms
- **Java**: Java 1.8 (compatible with Java 7 and 8).
- **Android**: Android SDK port with Gradle (`android/build.gradle`), targeting legacy Android.

## Build Systems & Tools
- **Apache Maven**: `pom.xml` (Maven 3.3.9+).
  - `maven-compiler-plugin`: 3.2 (Java 1.8 source and target).
  - `maven-assembly-plugin`: Bundles `jar-with-dependencies` with main class `org.crypto.sse.IEX2LevAMAZON`.
- **Gradle**: 9.2.0 wrapper in `android/`.

## Cryptographic Engines
- **Bouncy Castle**: `org.bouncycastle:bcprov-jdk15on:1.54`
  - AES in CTR and CBC mode
  - AES-CMAC (`AESFastEngine` + `CMac`)
  - HMAC-SHA256 & HMAC-SHA512 (`HMac` + `SHA256Digest` / `SHA512Digest`)
  - PBKDF2 with HMAC-SHA1 (`PBKDF2WithHmacSHA1`)
  - HCB1 Online Cipher implementation (Bellare et al. 2007)
  - `SecureRandom` & `ThreadedSeedGenerator`
- **Spongy Castle**: `org.spongycastle` used for the Android port.

## Text Extraction & Search Indexing
- **Apache Lucene**: `lucene-core:7.4.0`, `lucene-analyzers-common:7.4.0` (standard and English analyzers, stop-word elimination).
- **Apache PDFBox**: `pdfbox:[2.0.15,)` (PDF text extraction).
- **Apache POI**: `poi:3.15-beta1`, `poi-ooxml`, `poi-scratchpad` (Microsoft Word .doc/.docx, Excel .xls/.xlsx, PowerPoint .ppt/.pptx text extraction).

## Collections & Storage
- **Google Guava**: `guava:19.0` (`ArrayListMultimap`, `TreeMultimap`, `Multimaps`, `Sets`).
- **MapDB**: `mapdb:3.0.4` (off-heap and disk-backed key-value store for `DynRH_Disk`).
- **Java SizeOf**: `com.carrotsearch:java-sizeof:0.0.5` (memory profiling).

## Distributed & Cloud (Legacy / Upstream)
- **Apache Hadoop**: `hadoop-common:2.7.1`, `hadoop-core:1.2.1` (MapReduce indexing for IEX-2Lev).
- **AWS Java SDK**: `aws-java-sdk:1.11.19` (EMR / S3 integration).
