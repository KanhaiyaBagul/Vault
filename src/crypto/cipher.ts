/**
 * Authenticated Payload Cipher Engine
 * Implements IND-CCA2 Authenticated Encryption with Associated Data (AEAD)
 * via AES-256-GCM using standard W3C Web Crypto API.
 * Guarantees that any unauthorized ciphertext tampering is detected immediately.
 */

import {
  bytesToHex,
  hexToBytes,
  randomBytes,
  utf8Decode,
  utf8Encode,
} from "./utils.ts";

export interface EncryptedBlob {
  iv: Uint8Array;         // Exactly 12 bytes (96 bits) fresh random nonce
  ciphertext: Uint8Array; // Ciphertext bytes (includes 128-bit authentication tag appended by Web Crypto)
  tagLengthBits: number;  // Fixed at 128
}

export interface SerializedEncryptedBlob {
  ivHex: string;
  ciphertextHex: string;
}

/**
 * Generate a fresh 96-bit (12-byte) initialization vector (IV) for AES-GCM
 */
export function generateIV(length = 12): Uint8Array {
  if (length < 12) {
    throw new Error("GCM initialization vector must be at least 12 bytes (96 bits)");
  }
  return randomBytes(length);
}

/**
 * Encrypt plaintext payload with AES-256-GCM authenticated cipher
 * @param kEnc AES-256-GCM CryptoKey
 * @param plaintext Unencrypted payload bytes
 * @param additionalData Optional unencrypted authenticated data (AAD)
 */
export async function encryptPayload(
  kEnc: CryptoKey,
  plaintext: Uint8Array,
  additionalData?: Uint8Array
): Promise<EncryptedBlob> {
  const iv = generateIV(12);

  const params: AesGcmParams = {
    name: "AES-GCM",
    iv: iv as BufferSource,
    tagLength: 128,
  };

  if (additionalData && additionalData.length > 0) {
    params.additionalData = additionalData as BufferSource;
  }

  const ciphertextBuffer = await globalThis.crypto.subtle.encrypt(
    params,
    kEnc,
    plaintext as BufferSource
  );

  return {
    iv,
    ciphertext: new Uint8Array(ciphertextBuffer),
    tagLengthBits: 128,
  };
}

/**
 * Decrypt authenticated payload and verify cryptographic integrity tag
 * Throws an error immediately if the ciphertext, IV, or tag was tampered with.
 * @param kEnc AES-256-GCM CryptoKey
 * @param blob Encrypted blob with IV and ciphertext+tag
 * @param additionalData Optional unencrypted authenticated data (AAD)
 */
export async function decryptPayload(
  kEnc: CryptoKey,
  blob: EncryptedBlob,
  additionalData?: Uint8Array
): Promise<Uint8Array> {
  if (!blob.iv || blob.iv.length < 12) {
    throw new Error("Invalid IV: must be at least 12 bytes");
  }
  if (!blob.ciphertext || blob.ciphertext.length < 16) {
    throw new Error("Invalid ciphertext: must be at least 16 bytes to contain the 128-bit auth tag");
  }

  const params: AesGcmParams = {
    name: "AES-GCM",
    iv: blob.iv as BufferSource,
    tagLength: blob.tagLengthBits || 128,
  };

  if (additionalData && additionalData.length > 0) {
    params.additionalData = additionalData as BufferSource;
  }

  try {
    const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
      params,
      kEnc,
      blob.ciphertext as BufferSource
    );
    return new Uint8Array(decryptedBuffer);
  } catch {
    throw new Error("Cryptographic verification failed: Ciphertext or authentication tag has been tampered with or corrupted.");
  }
}

/**
 * Serialize an EncryptedBlob to a JSON-compatible hex structure
 */
export function serializeEncryptedBlob(blob: EncryptedBlob): SerializedEncryptedBlob {
  return {
    ivHex: bytesToHex(blob.iv),
    ciphertextHex: bytesToHex(blob.ciphertext),
  };
}

/**
 * Deserialize an EncryptedBlob from a hex structure
 */
export function deserializeEncryptedBlob(serialized: SerializedEncryptedBlob): EncryptedBlob {
  return {
    iv: hexToBytes(serialized.ivHex),
    ciphertext: hexToBytes(serialized.ciphertextHex),
    tagLengthBits: 128,
  };
}

/**
 * High-level helper: Encrypt UTF-8 string to serialized hex container
 */
export async function encryptString(
  kEnc: CryptoKey,
  text: string,
  additionalData?: Uint8Array
): Promise<SerializedEncryptedBlob> {
  const blob = await encryptPayload(kEnc, utf8Encode(text), additionalData);
  return serializeEncryptedBlob(blob);
}

/**
 * High-level helper: Decrypt serialized hex container to UTF-8 string
 */
export async function decryptString(
  kEnc: CryptoKey,
  serialized: SerializedEncryptedBlob,
  additionalData?: Uint8Array
): Promise<string> {
  const blob = deserializeEncryptedBlob(serialized);
  const decryptedBytes = await decryptPayload(kEnc, blob, additionalData);
  return utf8Decode(decryptedBytes);
}
