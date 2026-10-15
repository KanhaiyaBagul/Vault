/**
 * Authenticated Inverted Index (AII) & Token Commitment Engine
 * Implements cryptographic commitments over Merkle accumulator roots
 * using the dedicated authentication subkey (K_auth) via HMAC-SHA256.
 * Zero external dependencies.
 */

import { bytesToHex, concatBytes, constantTimeEqual, hexToBytes } from "../crypto/utils.ts";
import { normalizeKeyword } from "../crypto/trapdoors.ts";
import { buildMerkleTree, computeLeafHash } from "./merkle_tree.ts";

export interface TokenCommitment {
  tokenNormalized: string;
  count: number;
  rootHashHex: string;
  commitmentHex: string; // HMAC-SHA256(K_auth, tag_w || count || rootHash)
}

export interface PostingLeafInput {
  addressHex: string;
  opaqueDocRef: string;
  counterIndex: number;
}

/**
 * Computes deterministic HMAC-SHA256 commitment for a token postings list:
 * Commit_w = HMAC(K_auth, tag_w || 4-byte BE count || rootHashBytes)
 *
 * @param kAuth Dedicated HMAC-SHA256 authentication key
 * @param tagBytes 32-byte PRF keyword trapdoor
 * @param count Total number of postings in the list
 * @param rootHashHex 64-char hex Merkle root hash of the postings list
 */
export async function computeTokenCommitment(
  kAuth: CryptoKey,
  tagBytes: Uint8Array,
  count: number,
  rootHashHex: string
): Promise<string> {
  const countBuffer = new Uint8Array(4);
  new DataView(countBuffer.buffer).setUint32(0, count, false);

  const rootBytes = hexToBytes(rootHashHex);
  const payload = concatBytes(tagBytes, countBuffer, rootBytes);

  const signature = await globalThis.crypto.subtle.sign(
    { name: "HMAC" },
    kAuth,
    payload as BufferSource
  );

  return bytesToHex(new Uint8Array(signature));
}

/**
 * Constant-time verification of an expected token commitment against recomputed signature.
 */
export async function verifyTokenCommitment(
  kAuth: CryptoKey,
  tagBytes: Uint8Array,
  count: number,
  rootHashHex: string,
  expectedCommitmentHex: string
): Promise<boolean> {
  const recomputed = await computeTokenCommitment(kAuth, tagBytes, count, rootHashHex);
  return constantTimeEqual(hexToBytes(recomputed), hexToBytes(expectedCommitmentHex));
}

/**
 * Client-Side Authenticated Index State Tracker
 * Maintains cryptographic accumulator roots and commitments for every indexed token.
 */
export class AuthenticatedIndexManager {
  private readonly commitments: Map<string, TokenCommitment> = new Map();

  /**
   * Retrieves the current commitment for a normalized token.
   */
  public getCommitment(token: string): TokenCommitment | undefined {
    return this.commitments.get(normalizeKeyword(token));
  }

  /**
   * Updates the accumulator state for a token with all its current postings.
   * Constructs the Merkle tree over leaves, derives root, and signs the commitment.
   *
   * @param kAuth Dedicated authentication key
   * @param token Plaintext token or N-gram
   * @param tagBytes Keyword trapdoor bytes
   * @param postings Ordered list of posting leaf inputs (from index 0 to count - 1)
   */
  public async updateTokenPostings(
    kAuth: CryptoKey,
    token: string,
    tagBytes: Uint8Array,
    postings: PostingLeafInput[]
  ): Promise<TokenCommitment> {
    const normalized = normalizeKeyword(token);

    // Compute canonical leaf hashes in counterIndex order
    const sortedPostings = [...postings].sort((a, b) => a.counterIndex - b.counterIndex);
    const leafHashes: string[] = [];
    for (const p of sortedPostings) {
      const leaf = await computeLeafHash(p.addressHex, p.opaqueDocRef, p.counterIndex);
      leafHashes.push(leaf);
    }

    // Build Merkle accumulator tree
    const tree = await buildMerkleTree(leafHashes);

    // Compute cryptographic commitment
    const commitmentHex = await computeTokenCommitment(
      kAuth,
      tagBytes,
      postings.length,
      tree.rootHex
    );

    const commitment: TokenCommitment = {
      tokenNormalized: normalized,
      count: postings.length,
      rootHashHex: tree.rootHex,
      commitmentHex,
    };

    this.commitments.set(normalized, commitment);
    return commitment;
  }

  /**
   * Exports full authenticated index state for client storage.
   */
  public exportState(): Record<string, TokenCommitment> {
    const obj: Record<string, TokenCommitment> = {};
    for (const [token, commitment] of this.commitments.entries()) {
      obj[token] = commitment;
    }
    return obj;
  }

  /**
   * Imports authenticated index state.
   */
  public importState(data: Record<string, TokenCommitment>): void {
    this.commitments.clear();
    for (const [token, commitment] of Object.entries(data)) {
      this.commitments.set(normalizeKeyword(token), commitment);
    }
  }

  /**
   * Returns total number of tracked tokens in the authenticated index.
   */
  public size(): number {
    return this.commitments.size;
  }
}
