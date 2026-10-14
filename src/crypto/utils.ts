/**
 * Cryptographic Utility Functions
 * Zero external dependencies. Uses W3C Web Crypto API.
 */

/**
 * Generate cryptographically secure random bytes
 */
export function randomBytes(length: number): Uint8Array {
  if (length <= 0) {
    return new Uint8Array(0);
  }
  const buffer = new Uint8Array(length);
  globalThis.crypto.getRandomValues(buffer);
  return buffer;
}

/**
 * Constant-time byte array equality comparison.
 * Prevents timing attacks on authentication tags and MACs.
 */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return diff === 0;
}

/**
 * Convert Uint8Array to lowercase hexadecimal string
 */
export function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += (bytes[i] ?? 0).toString(16).padStart(2, "0");
  }
  return hex;
}

/**
 * Convert hexadecimal string to Uint8Array with validation
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.trim().toLowerCase();
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string length: must be an even number of characters");
  }
  if (!/^[0-9a-f]*$/.test(cleanHex)) {
    throw new Error("Invalid hex string: contains non-hexadecimal characters");
  }
  const length = cleanHex.length / 2;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = parseInt(cleanHex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to standard Base64 string
 */
export function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to Uint8Array
 */
export function base64ToBytes(base64: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"));
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encode string to UTF-8 Uint8Array
 */
export function utf8Encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

/**
 * Decode UTF-8 Uint8Array to string
 */
export function utf8Decode(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

/**
 * Concatenate multiple Uint8Arrays into one
 */
export function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
