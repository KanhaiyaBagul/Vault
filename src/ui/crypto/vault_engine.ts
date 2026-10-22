/**
 * Vault Browser Cryptographic Engine & Zero-Knowledge Client
 * Uses native window.crypto.subtle (W3C Web Crypto API). Zero external dependencies.
 */

export interface VaultKeys {
  kTrap: CryptoKey;
  kAddr: CryptoKey;
  kMask: CryptoKey;
  kEnc: CryptoKey;
  kAuth: CryptoKey;
}

export interface EncryptedDocumentRecord {
  id: string;
  name: string;
  size: number;
  type: string;
  plaintext: string;
  docRef: string;
  ingestedAt: number;
  keywordCount: number;
  encryptedBlobRef: string;
  ivHex: string;
  ciphertextHex: string;
}

export interface SearchMatchResult {
  docRef: string;
  document?: EncryptedDocumentRecord;
  decryptedContent: string;
  matchedKeywords: string[];
  latencyMs: number;
  merkleVerified: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string length");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

export function utf8Encode(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function utf8Decode(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function escapeRegex(str: string): string {
  if (!str) return "";
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightText(content: string, queryStr: string): string {
  if (!content) return "";
  let safeContent = escapeHtml(content);

  const terms = (queryStr || "")
    .split(/\s+(?:AND|OR|NOT)\s+|\s+/i)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 1);

  if (terms.length === 0) return safeContent;

  for (const term of terms) {
    const safeTerm = escapeRegex(escapeHtml(term));
    if (!safeTerm) continue;
    try {
      const regex = new RegExp(`(${safeTerm})`, "gi");
      safeContent = safeContent.replace(regex, "<mark>$1</mark>");
    } catch {
      // Ignore regex edge cases
    }
  }
  return safeContent;
}

// ---------------------------------------------------------------------------
// Cryptographic Key Derivation (PBKDF2 + HKDF-Expand)
// ---------------------------------------------------------------------------

export async function deriveVaultKeys(
  passphrase = "vault-production-hardware-enclave-key-2026",
  saltStr = "vault-salt-static-01"
): Promise<{ keys: VaultKeys; keyFingerprint: string }> {
  const subtle = window.crypto.subtle;
  const pwBytes = utf8Encode(passphrase);
  const saltBytes = utf8Encode(saltStr);

  const baseKey = await subtle.importKey("raw", pwBytes, "PBKDF2", false, ["deriveBits"]);
  const derivedBits = await subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 100_000,
      hash: "SHA-256",
    },
    baseKey,
    256
  );

  const hkdfPrk = await subtle.importKey("raw", derivedBits, "HKDF", false, ["deriveKey"]);

  const kTrap = await subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(), info: utf8Encode("VAULT:DOM:TRAPDOOR:01") },
    hkdfPrk,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    true,
    ["sign", "verify"]
  );

  const kAddr = await subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(), info: utf8Encode("VAULT:DOM:ADDRESS:02") },
    hkdfPrk,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    true,
    ["sign", "verify"]
  );

  const kMask = await subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(), info: utf8Encode("VAULT:DOM:MASKING:03") },
    hkdfPrk,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    true,
    ["sign", "verify"]
  );

  const kEnc = await subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(), info: utf8Encode("VAULT:DOM:PAYLOAD:04") },
    hkdfPrk,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const kAuth = await subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(), info: utf8Encode("VAULT:DOM:VERIFY:05") },
    hkdfPrk,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    true,
    ["sign", "verify"]
  );

  // Compute a 16-character fingerprint for Enclave UI indicator
  const fpDigest = await subtle.digest("SHA-256", derivedBits);
  const keyFingerprint = bytesToHex(new Uint8Array(fpDigest)).substring(0, 16);

  return {
    keys: { kTrap, kAddr, kMask, kEnc, kAuth },
    keyFingerprint,
  };
}

// ---------------------------------------------------------------------------
// Encryption & Decryption (AES-256-GCM)
// ---------------------------------------------------------------------------

export async function encryptPayload(
  plaintext: string,
  kEnc: CryptoKey
): Promise<{ ciphertextHex: string; ivHex: string }> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = utf8Encode(plaintext);
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    kEnc,
    encoded
  );
  return {
    ciphertextHex: bytesToHex(new Uint8Array(ciphertextBuffer)),
    ivHex: bytesToHex(iv),
  };
}

export async function decryptPayload(
  ciphertextHex: string,
  ivHex: string,
  kEnc: CryptoKey
): Promise<string> {
  const ciphertextBytes = hexToBytes(ciphertextHex);
  const ivBytes = hexToBytes(ivHex);
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    kEnc,
    ciphertextBytes
  );
  return utf8Decode(new Uint8Array(decryptedBuffer));
}

// ---------------------------------------------------------------------------
// Keyword & 3-Gram Extraction
// ---------------------------------------------------------------------------

export function extractKeywords(text: string): string[] {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2);

  const keywordSet = new Set<string>(words);

  // Add 3-gram substrings for partial search
  for (const word of words) {
    if (word.length >= 3) {
      for (let i = 0; i <= word.length - 3; i++) {
        keywordSet.add(word.substring(i, i + 3));
      }
    }
  }

  return Array.from(keywordSet);
}

// ---------------------------------------------------------------------------
// Trapdoors & Blind Index Generation
// ---------------------------------------------------------------------------

export async function generateSearchTrapdoor(keyword: string, kTrap: CryptoKey): Promise<string> {
  const norm = keyword.trim().toLowerCase();
  const signature = await window.crypto.subtle.sign("HMAC", kTrap, utf8Encode(norm));
  return bytesToHex(new Uint8Array(signature));
}

export interface BlindIndexEntryPayload {
  addressHex: string;
  encryptedValueHex: string;
  opaqueDocRef: string;
}

export async function buildClientBlindIndexEntries(
  docRef: string,
  keywords: string[],
  kAddr: CryptoKey,
  kMask: CryptoKey
): Promise<BlindIndexEntryPayload[]> {
  const entries: BlindIndexEntryPayload[] = [];
  const docRefBytes = utf8Encode(docRef);

  // Compute opaque document reference for server-side set intersections
  const opaqueSig = await window.crypto.subtle.sign(
    "HMAC",
    kAddr,
    utf8Encode(`VAULT:DOCREF:${docRef}`)
  );
  const opaqueDocRef = bytesToHex(new Uint8Array(opaqueSig));

  for (const kw of keywords) {
    const norm = kw.trim().toLowerCase();
    if (!norm) continue;

    const addrSig = await window.crypto.subtle.sign("HMAC", kAddr, utf8Encode(norm));
    const addressHex = bytesToHex(new Uint8Array(addrSig));

    const maskSig = await window.crypto.subtle.sign("HMAC", kMask, utf8Encode(norm));
    const maskBytes = new Uint8Array(maskSig);

    // XOR docRefBytes with maskBytes
    const masked = new Uint8Array(docRefBytes.length);
    for (let i = 0; i < docRefBytes.length; i++) {
      masked[i] = docRefBytes[i] ^ maskBytes[i % maskBytes.length];
    }
    const encryptedValueHex = bytesToHex(masked);

    entries.push({ addressHex, encryptedValueHex, opaqueDocRef });
  }

  return entries;
}
