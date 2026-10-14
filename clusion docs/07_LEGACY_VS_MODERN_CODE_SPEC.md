# 07. Legacy Clusion (2014-2016) vs. Modern 2026 Production Engine

This document directly addresses the 10-year age gap in the **Clusion** reference library. It details exactly what mathematical logic is retained from academic literature versus the modern cryptographic and software engineering upgrades implemented for our **Verifiable Searchable Symmetric Encryption (SSE) Engine**.

---

## 1. Problem Statement Alignment Verification

Our engine solves the exact challenge stated in the specification:

> **2. Verifiable Searchable Symmetric Encryption (SSE) Engine**  
> **Domain:** Encrypted Databases / Cryptographic Engineering / Cloud Security  
> **Problem Statement:** Storing sensitive enterprise documents in third-party cloud storage leaves proprietary data exposed to insider attacks, while standard end-to-end encryption completely breaks server-side keyword indexing and full-text search capabilities.  
> **Objective:** Construct a cryptographic search engine from scratch implementing Searchable Symmetric Encryption (using cryptographic trapdoors, blind indexes, and inverted index token hashing) that enables an untrusted server to execute substring or boolean keyword queries over ciphertext.  
> **Expected Outcome:** A server-client architecture where the client uploads fully encrypted document payloads along with encrypted search tokens. The server returns exact matching document IDs for search queries without learning the underlying keywords, the query contents, or the plaintext files (proven via an untrusted server audit log showing only opaque hashes and ciphertexts).

---

## 2. Why Clusion's Raw Code Cannot Be Used Directly

Clusion is an academic artifact written between 2014 and 2016 to benchmark asymptotic paper complexities. If used directly today, it presents severe cryptographic, security, and architectural deficiencies:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      LEGACY CLUSION (2014-2016)                        │
│ ❌ Deprecated PBKDF2WithHmacSHA1 (Vulnerable to collision/brute-force) │
│ ❌ Malleable AES-CTR without authentication (Attacker can flip bits)   │
│ ❌ Fragile string-splitting hacks ("separator", "\t\t\t", "XX", "1")   │
│ ❌ Zero verifiability (Cannot detect if server drops or alters results)│
│ ❌ Exact-keyword only (Substring queries completely impossible)        │
│ ❌ Monolithic single-JVM CLI reading System.in (No network API)        │
│ ❌ Bloated legacy dependencies (Hadoop 2.7, AWS SDK 1.11, POI 3.15)    │
│ ❌ Raw debug console logs (No zero-knowledge audit trail)              │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │  UPGRADE & RE-ENGINEER
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   MODERN 2026 PRODUCTION ENGINE                        │
│ ✅ NIST PBKDF2-HMAC-SHA256 (100k iter) + HKDF-Expand Domain Separation │
│ ✅ Authenticated AES-256-GCM AEAD (IND-CCA2 secure with 128-bit tag)   │
│ ✅ Typed binary buffers (Uint8Array, length-prefixed frames)           │
│ ✅ Merkle Authenticated Inverted Index (Proof of Correctness/Complete) │
│ ✅ N-Gram sliding window blind indexing (Full substring search)        │
│ ✅ Server-Client REST/JSON architecture (React / Web Crypto + Node.js) │
│ ✅ Zero external runtime crypto dependencies (Native W3C Web Crypto)   │
│ ✅ Tamper-evident Audit Log (Proves zero plaintext exposure)           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Side-by-Side Code Modernization Matrix

### 3.1. Key Derivation & Domain Separation

#### ❌ Legacy Clusion (Java / Bouncy Castle — `CryptoPrimitives.java`)
```java
// 10-year-old code: SHA-1 is deprecated; single key reused for multiple schemes
public static byte[] keyGenSetM(String pass, byte[] salt, int icount, int keySize) {
    SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
    KeySpec spec = new PBEKeySpec(pass.toCharArray(), salt, icount, keySize);
    SecretKey tmp = factory.generateSecret(spec);
    return new SecretKeySpec(tmp.getEncoded(), "AES").getEncoded();
}
```

#### ✅ Modern 2026 Engine (TypeScript / Web Crypto API — `src/crypto/kdf.ts`)
```typescript
// Modern standard: PBKDF2-HMAC-SHA256 (100,000 iterations) + HKDF-Expand domain separation
export async function deriveMasterKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    { name: "HKDF" },
    false,
    ["deriveKey", "deriveBits"]
  );
}

// 5 cryptographically orthogonal subkeys derived via HKDF-Expand
export async function deriveSubkeys(masterKey: CryptoKey): Promise<VaultSubkeys> {
  const derive = async (domain: string, algo: AlgorithmIdentifier, usages: KeyUsage[]) => {
    return crypto.subtle.deriveKey(
      { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(), info: new TextEncoder().encode(domain) },
      masterKey,
      algo,
      false,
      usages
    );
  };

  return {
    kTrap: await derive("VAULT:DOM:TRAPDOOR:01", { name: "HMAC", hash: "SHA-256" }, ["sign"]),
    kAddr: await derive("VAULT:DOM:ADDRESS:02",  { name: "HMAC", hash: "SHA-256" }, ["sign"]),
    kMask: await derive("VAULT:DOM:MASKING:03",  { name: "HMAC", hash: "SHA-256" }, ["sign"]),
    kEnc:  await derive("VAULT:DOM:PAYLOAD:04",  { name: "AES-GCM", length: 256 }, ["encrypt", "decrypt"]),
    kAuth: await derive("VAULT:DOM:VERIFY:05",   { name: "HMAC", hash: "SHA-256" }, ["sign", "verify"]),
  };
}
```

---

### 3.2. Search Trapdoor & Addressing PRF

#### ❌ Legacy Clusion (`RR2Lev.java` & `CryptoPrimitives.java`)
```java
// Uses Bouncy Castle AES-CMAC which is NOT supported in standard Web Crypto browsers
public static byte[] generateCmac(byte[] key, String msg) {
    CMac cmac = new CMac(new AESFastEngine());
    byte[] data = msg.getBytes("UTF-8");
    byte[] output = new byte[cmac.getMacSize()];
    cmac.init(new KeyParameter(key));
    cmac.update(data, 0, data.length);
    cmac.doFinal(output, 0);
    return output;
}

public static byte[][] token(byte[] key, String word) {
    byte[][] keys = new byte[2][];
    keys[0] = CryptoPrimitives.generateCmac(key, 1 + word); // String concatenation hack
    keys[1] = CryptoPrimitives.generateCmac(key, 2 + word);
    return keys;
}
```

#### ✅ Modern 2026 Engine (`src/crypto/trapdoors.ts`)
```typescript
// Universal Web Crypto HMAC-SHA256 PRF (Hardware-accelerated on Chrome, Safari, Node.js)
export async function computeKeywordTrapdoor(kTrap: CryptoKey, keyword: string): Promise<Uint8Array> {
  const normalized = keyword.trim().toLowerCase();
  const signature = await crypto.subtle.sign(
    { name: "HMAC" },
    kTrap,
    new TextEncoder().encode(normalized)
  );
  return new Uint8Array(signature);
}

// Deterministic counter address for blind inverted index rows
export async function computeIndexAddress(
  kAddr: CryptoKey,
  tag: Uint8Array,
  counter: number
): Promise<string> {
  const counterBuffer = new Uint8Array(4);
  new DataView(counterBuffer.buffer).setUint32(0, counter, false); // Big-endian
  const payload = new Uint8Array(tag.length + counterBuffer.length);
  payload.set(tag, 0);
  payload.set(counterBuffer, tag.length);

  const addressBytes = await crypto.subtle.sign({ name: "HMAC" }, kAddr, payload);
  return Buffer.from(addressBytes).toString("hex");
}
```

---

### 3.3. Document Payload Encryption & Tamper Resistance

#### ❌ Legacy Clusion (`CryptoPrimitives.java`)
```java
// Malleable AES-CTR without authentication: Bit-flip attacks succeed silently!
public static byte[] encryptAES_CTR_String(byte[] keyBytes, byte[] ivBytes, String identifier, int size) {
    Cipher cipher = Cipher.getInstance("AES/CTR/NoPadding");
    cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(keyBytes, "AES"), new IvParameterSpec(ivBytes));
    // Fixed string padding with tab stops
    while (identifier.length() < size) identifier += "\t\t\t";
    return cipher.doFinal(identifier.getBytes());
}
```

#### ✅ Modern 2026 Engine (`src/crypto/cipher.ts`)
```typescript
// Authenticated AES-256-GCM (IND-CCA2 secure) with 96-bit random IV & 128-bit integrity tag
export async function encryptPayload(kEnc: CryptoKey, plaintext: Uint8Array): Promise<EncryptedBlob> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Fresh 96-bit nonce
  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    kEnc,
    plaintext
  );

  return {
    iv,
    ciphertext: new Uint8Array(ciphertextBuffer),
    tagLengthBits: 128
  };
}

// Any bit-flip or alteration immediately rejects!
export async function decryptPayload(kEnc: CryptoKey, blob: EncryptedBlob): Promise<Uint8Array> {
  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: blob.iv, tagLength: blob.tagLengthBits },
      kEnc,
      blob.ciphertext
    );
    return new Uint8Array(decrypted);
  } catch (err) {
    throw new Error("Cryptographic verification failed: Ciphertext has been tampered with or corrupted.");
  }
}
```

---

### 3.4. Index Representation: String Delimiters vs. Typed Binary Framing

#### ❌ Legacy Clusion (`RH2Lev.java`)
```java
// Fragile string concatenations that break if document IDs contain commas or spaces
temp2 = temp2.replaceAll("\\s", "");
temp2 = temp2.replaceAll(",XX", "");
temp2 = temp2.replace("[", "");
temp2 = temp2.replace("]", "");
String[] result3 = temp2.split(separator);
```

#### ✅ Modern 2026 Engine
```typescript
// Typed binary length-prefixed framing or structured JSON payloads
export interface PostingsBlock {
  blockLevel: "SMALL" | "MEDIUM" | "LARGE";
  encryptedDocRefs: string[];  // Hex-encoded AES-GCM ciphertexts
  merkleLeafDigests: string[]; // Sha-256 leaf digests for verification
}
```

---

## 4. What Mathematical Logic We RETAIN from Clusion

We keep the sound academic breakthroughs while completely replacing the outdated implementation:

1. **Cash et al. (NDSS 2014) 2-Level Multi-Map Logic**: The concept of sub-linear partition thresholds ($S$ for small block inline storage, $B$ for large secondary array pointer blocks) is mathematically preserved.
2. **Kamara-Moataz (Eurocrypt 2017) IEX Boolean Logic**: The set-difference decomposition $DB(w_1) \cup (DB(w_2) \setminus DB(w_1))$ using Global and Local Multi-Maps is mathematically preserved.
3. **DynRH Forward Privacy Logic**: The counter-based state table $\Sigma[w]$ and forward-secure token derivation is mathematically preserved.
4. **Response-Hiding Confidentiality**: Pre-encrypting document references under $K_{enc}$ before inserting into the index so the server learns zero plaintext IDs is preserved.

---

## 5. Summary Checklist of Modernization

- [x] Replaced deprecated SHA-1 with modern SHA-256.
- [x] Upgraded malleable AES-CTR to authenticated AES-256-GCM.
- [x] Replaced Bouncy Castle Java dependencies with standard W3C Web Crypto API.
- [x] Replaced string-splitting delimiter hacks with structured typed buffers.
- [x] Added Merkle Authenticated Inverted Indexes (AII) for verifiable search results.
- [x] Added N-Gram blind indexing for arbitrary substring search.
- [x] Added untrusted server tamper-evident audit logging for zero-knowledge verification.
- [x] Designed real REST Client-Server architecture (React Client + Node.js Server).
