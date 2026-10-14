/**
 * Deterministic PRF Trapdoor & Blind Inverted Index Addressing Engine
 * Implements Cash et al. (NDSS 2014) and DynRH (Eurocrypt 2017) PRF formulations
 * using standard Web Crypto API HMAC-SHA256.
 * Zero external dependencies.
 */

import { bytesToHex, concatBytes, utf8Encode } from "./utils.ts";

/**
 * Normalizes keyword for indexing and search: lowercase and trimmed.
 */
export function normalizeKeyword(keyword: string): string {
  return keyword.trim().toLowerCase();
}

/**
 * Computes deterministic search trapdoor for a keyword: tag_w = PRF(K_trap, keyword)
 * @param kTrap Dedicated HMAC-SHA256 trapdoor key
 * @param keyword Plaintext keyword to search
 * @returns 32-byte raw HMAC token
 */
export async function computeKeywordTrapdoor(
  kTrap: CryptoKey,
  keyword: string
): Promise<Uint8Array> {
  const normalized = normalizeKeyword(keyword);
  const data = utf8Encode(normalized);
  const signature = await globalThis.crypto.subtle.sign(
    { name: "HMAC" },
    kTrap,
    data as BufferSource
  );
  return new Uint8Array(signature);
}

/**
 * Convenience helper returning hex string of keyword trapdoor
 */
export async function computeKeywordTrapdoorHex(
  kTrap: CryptoKey,
  keyword: string
): Promise<string> {
  const bytes = await computeKeywordTrapdoor(kTrap, keyword);
  return bytesToHex(bytes);
}

/**
 * Computes deterministic blind inverted index address label:
 * L_c = PRF(K_addr, tag_w || counter)
 * @param kAddr Dedicated HMAC-SHA256 address key
 * @param tag Keyword trapdoor bytes (32 bytes)
 * @param counter Postings list index counter (0, 1, 2, ...)
 * @returns Hex-encoded row address for untrusted server lookup
 */
export async function computeIndexAddress(
  kAddr: CryptoKey,
  tag: Uint8Array,
  counter: number
): Promise<string> {
  if (counter < 0) {
    throw new Error("Counter must be a non-negative integer");
  }

  // 4-byte big-endian representation of counter
  const counterBuffer = new Uint8Array(4);
  const view = new DataView(counterBuffer.buffer);
  view.setUint32(0, counter, false);

  const payload = concatBytes(tag, counterBuffer);
  const signature = await globalThis.crypto.subtle.sign(
    { name: "HMAC" },
    kAddr,
    payload as BufferSource
  );
  return bytesToHex(new Uint8Array(signature));
}

/**
 * Generates pseudorandom keystream mask for blinding postings lists:
 * M_c = PRF(K_mask, tag_w || counter || "MASK")
 * @param kMask Dedicated HMAC-SHA256 masking key
 * @param tag Keyword trapdoor bytes
 * @param counter Postings list index counter
 * @param length Desired mask byte length (defaults to 32 bytes)
 */
export async function computeMask(
  kMask: CryptoKey,
  tag: Uint8Array,
  counter: number,
  length = 32
): Promise<Uint8Array> {
  const counterBuffer = new Uint8Array(4);
  new DataView(counterBuffer.buffer).setUint32(0, counter, false);

  const payload = concatBytes(tag, counterBuffer, utf8Encode("MASK"));
  const rawMask = new Uint8Array(
    await globalThis.crypto.subtle.sign({ name: "HMAC" }, kMask, payload as BufferSource)
  );

  if (length <= rawMask.length) {
    return rawMask.slice(0, length);
  }

  // If longer mask requested, extend via counter chain
  const result = new Uint8Array(length);
  result.set(rawMask, 0);
  let filled = rawMask.length;
  let chain = 1;

  while (filled < length) {
    const chainBuf = new Uint8Array(4);
    new DataView(chainBuf.buffer).setUint32(0, chain++, false);
    const ext = new Uint8Array(
      await globalThis.crypto.subtle.sign(
        { name: "HMAC" },
        kMask,
        concatBytes(payload, chainBuf) as BufferSource
      )
    );
    const toCopy = Math.min(ext.length, length - filled);
    result.set(ext.slice(0, toCopy), filled);
    filled += toCopy;
  }

  return result;
}

/**
 * XOR mask bytes with data bytes
 */
export function xorBytes(data: Uint8Array, mask: Uint8Array): Uint8Array {
  const output = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    output[i] = (data[i] ?? 0) ^ (mask[i % mask.length] ?? 0);
  }
  return output;
}
