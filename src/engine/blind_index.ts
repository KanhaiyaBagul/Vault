/**
 * Blind Index Record Builder
 * Implements Cash et al. (NDSS 2014) and DynRH (Eurocrypt 2017) Blind Inverted Indexing
 * with Response-Hiding AES-256-GCM authenticated document encryption.
 * Zero external dependencies.
 */

import type { VaultSubkeys } from "../crypto/kdf.ts";
import {
  computeIndexAddress,
  computeKeywordTrapdoor,
  computeMask,
  xorBytes,
} from "../crypto/trapdoors.ts";
import {
  decryptPayload,
  deserializeEncryptedBlob,
  encryptPayload,
  serializeEncryptedBlob,
} from "../crypto/cipher.ts";
import { bytesToHex, hexToBytes, utf8Decode, utf8Encode } from "../crypto/utils.ts";
import { StateManager } from "./state_manager.ts";
import { normalizeText } from "../indexer/tokenizer.ts";

export interface BlindIndexEntry {
  addressHex: string;        // L_c: Opaque 64-char row address
  encryptedValueHex: string; // V_c: Masked AES-GCM encrypted document payload
  opaqueDocRef: string;      // Opaque 64-char hash for server-side conjunctive intersections
}

/**
 * Derives a deterministic opaque document reference hash:
 * opaqueDocRef = HMAC(K_addr, "DOCREF:" || docId)
 * Enables untrusted server to perform set intersection across N-grams without learning document IDs.
 */
export async function computeOpaqueDocRef(
  kAddr: CryptoKey,
  docId: string
): Promise<string> {
  const data = utf8Encode(`VAULT:DOCREF:${docId}`);
  const signature = await globalThis.crypto.subtle.sign(
    { name: "HMAC" },
    kAddr,
    data as BufferSource
  );
  return bytesToHex(new Uint8Array(signature));
}

/**
 * Builds blind inverted index entries for a given document and its token set.
 * Enforces forward privacy via the client StateManager.
 * @param subkeys Client cryptographic subkey set
 * @param stateManager Client keyword counter state
 * @param docId Unique document identifier
 * @param tokens Unique set of words and n-grams from the document
 */
export async function buildBlindIndexEntries(
  subkeys: VaultSubkeys,
  stateManager: StateManager,
  docId: string,
  tokens: string[] | { allTokens: string[] }
): Promise<BlindIndexEntry[]> {
  if (!docId) {
    throw new Error("Document ID cannot be empty");
  }

  const rawList = Array.isArray(tokens) ? tokens : (tokens?.allTokens ?? []);

  // Pre-encrypt document ID using AES-256-GCM
  const docBlob = await encryptPayload(subkeys.kEnc, utf8Encode(docId));
  const serializedBlob = serializeEncryptedBlob(docBlob);
  // Encode payload as JSON: {"i":"ivHex","c":"ciphertextHex"}
  const payloadBytes = utf8Encode(JSON.stringify({ i: serializedBlob.ivHex, c: serializedBlob.ciphertextHex }));

  // Compute opaque document reference for server-side set intersections
  const opaqueDocRef = await computeOpaqueDocRef(subkeys.kAddr, docId);

  const entries: BlindIndexEntry[] = [];
  const uniqueTokens = Array.from(new Set(rawList.map(t => normalizeText(t)).filter(t => t.length > 0)));

  for (const token of uniqueTokens) {
    // 1. Get pre-increment counter c and increment state
    const c = stateManager.incrementCount(token);

    // 2. Keyword trapdoor tag_w
    const tag = await computeKeywordTrapdoor(subkeys.kTrap, token);

    // 3. Blind index address L_c = PRF(K_addr, tag_w || c)
    const addressHex = await computeIndexAddress(subkeys.kAddr, tag, c);

    // 4. Keystream mask M_c = PRF(K_mask, tag_w || c || "MASK")
    const mask = await computeMask(subkeys.kMask, tag, c, payloadBytes.length);

    // 5. Value masking: V_c = payload XOR M_c
    const maskedValue = xorBytes(payloadBytes, mask);

    entries.push({
      addressHex,
      encryptedValueHex: bytesToHex(maskedValue),
      opaqueDocRef,
    });
  }

  return entries;
}

/**
 * Unmasks and decrypts a document ID from an encrypted posting record
 * @param subkeys Client cryptographic subkey set
 * @param tag Keyword trapdoor bytes
 * @param counter Postings list index counter
 * @param encryptedValueHex Hex-encoded masked payload
 */
export async function unmaskAndDecryptDocId(
  subkeys: VaultSubkeys,
  tag: Uint8Array,
  counter: number,
  encryptedValueHex: string
): Promise<string> {
  const maskedBytes = hexToBytes(encryptedValueHex);

  // 1. Recompute mask M_c
  const mask = await computeMask(subkeys.kMask, tag, counter, maskedBytes.length);

  // 2. Unmask payload
  const payloadBytes = xorBytes(maskedBytes, mask);
  const payloadJson = utf8Decode(payloadBytes);

  const parsed = JSON.parse(payloadJson) as { i: string; c: string };
  const blob = deserializeEncryptedBlob({ ivHex: parsed.i, ciphertextHex: parsed.c });

  // 3. Authenticated AES-GCM decryption
  const docIdBytes = await decryptPayload(subkeys.kEnc, blob);
  return utf8Decode(docIdBytes);
}
