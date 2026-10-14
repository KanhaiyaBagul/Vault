/**
 * Master Key Derivation & Domain-Separated Subkey Engine
 * Implements PBKDF2-HMAC-SHA256 (100,000 iterations) + HKDF-Expand (RFC 5869).
 * Zero external dependencies. Uses W3C Web Crypto API.
 */

import { randomBytes, utf8Encode } from "./utils.ts";

export interface VaultSubkeys {
  kTrap: CryptoKey; // PRF key for keyword search trapdoors (HMAC-SHA256)
  kAddr: CryptoKey; // PRF key for blind index row addressing (HMAC-SHA256)
  kMask: CryptoKey; // Masking key for blinding postings lists (HMAC-SHA256)
  kEnc: CryptoKey;  // Symmetric cipher key for file payloads (AES-256-GCM)
  kAuth: CryptoKey; // Authentication key for Merkle leaf proofs (HMAC-SHA256)
}

export const KeyDomain = {
  TRAPDOOR: "VAULT:DOM:TRAPDOOR:01",
  ADDRESS:  "VAULT:DOM:ADDRESS:02",
  MASKING:  "VAULT:DOM:MASKING:03",
  PAYLOAD:  "VAULT:DOM:PAYLOAD:04",
  VERIFY:   "VAULT:DOM:VERIFY:05",
} as const;

export type KeyDomain = typeof KeyDomain[keyof typeof KeyDomain];

/**
 * Generate a cryptographically secure random salt for PBKDF2
 */
export function generateSalt(length = 16): Uint8Array {
  return randomBytes(length);
}

/**
 * Derive an intermediate HKDF Master Key from a user password and salt using PBKDF2-HMAC-SHA256
 * @param password Master passphrase
 * @param salt High-entropy 128-bit salt
 * @param iterations Iteration count (defaults to 100,000 as recommended by NIST)
 */
export async function deriveMasterKey(
  password: string,
  salt: Uint8Array,
  iterations = 100_000
): Promise<CryptoKey> {
  if (!password || password.length === 0) {
    throw new Error("Password cannot be empty");
  }
  if (!salt || salt.length < 16) {
    throw new Error("Salt must be at least 16 bytes (128 bits)");
  }

  const passwordBytes = utf8Encode(password);

  // 1. Import raw password as key material for PBKDF2
  const baseKey = await globalThis.crypto.subtle.importKey(
    "raw",
    passwordBytes as BufferSource,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  // 2. Derive 256 bits (32 bytes) of pseudorandom entropy via PBKDF2
  const masterBits = await globalThis.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    256 // 256 bits
  );

  // 3. Import high-entropy bytes as an HKDF master key
  const masterKey = await globalThis.crypto.subtle.importKey(
    "raw",
    masterBits,
    "HKDF",
    false,
    ["deriveKey", "deriveBits"]
  );

  return masterKey;
}

/**
 * Derive 5 mathematically orthogonal, domain-separated subkeys from the master HKDF key
 */
export async function deriveSubkeys(masterKey: CryptoKey): Promise<VaultSubkeys> {
  const derive = async (
    domain: string,
    algorithm: HmacKeyGenParams | AesKeyGenParams,
    usages: KeyUsage[]
  ): Promise<CryptoKey> => {
    return globalThis.crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: new Uint8Array(0) as BufferSource,
        info: utf8Encode(domain) as BufferSource,
      },
      masterKey,
      algorithm,
      false,
      usages
    );
  };

  const [kTrap, kAddr, kMask, kEnc, kAuth] = await Promise.all([
    derive(KeyDomain.TRAPDOOR, { name: "HMAC", hash: "SHA-256" }, ["sign"]),
    derive(KeyDomain.ADDRESS,  { name: "HMAC", hash: "SHA-256" }, ["sign"]),
    derive(KeyDomain.MASKING,  { name: "HMAC", hash: "SHA-256" }, ["sign"]),
    derive(KeyDomain.PAYLOAD,  { name: "AES-GCM", length: 256 }, ["encrypt", "decrypt"]),
    derive(KeyDomain.VERIFY,   { name: "HMAC", hash: "SHA-256" }, ["sign", "verify"]),
  ]);

  return { kTrap, kAddr, kMask, kEnc, kAuth };
}

/**
 * Convenience helper: Derive all 5 subkeys directly from password and salt
 */
export async function deriveVaultSubkeysFromPassword(
  password: string,
  salt: Uint8Array,
  iterations = 100_000
): Promise<VaultSubkeys> {
  const masterKey = await deriveMasterKey(password, salt, iterations);
  return deriveSubkeys(masterKey);
}
