/**
 * Cryptographic Accumulator & Binary Merkle Tree Core
 * Implements deterministic leaf hashing, Merkle tree construction,
 * audit path generation, and constant-time inclusion proof verification.
 * Zero external dependencies.
 */

import { bytesToHex, constantTimeEqual, hexToBytes, utf8Encode } from "../crypto/utils.ts";

export interface MerkleProofStep {
  siblingHex: string;
  isLeft: boolean; // True if the sibling is the left child in the pair
}

export type MerkleProofPath = MerkleProofStep[];

export interface MerkleTree {
  rootHex: string;
  leaves: string[];
  levels: string[][]; // levels[0] = leaves, levels[levels.length - 1] = [root]
}

/**
 * Computes deterministic SHA-256 leaf hash for a blind index posting record.
 * Leaf format: SHA-256("VAULT:LEAF:" || addressHex || ":" || opaqueDocRef || ":" || counterIndex)
 *
 * @param addressHex 64-char row address label L_c
 * @param opaqueDocRef 64-char document pointer hash
 * @param counterIndex Chain index counter (0, 1, 2, ...)
 */
export async function computeLeafHash(
  addressHex: string,
  opaqueDocRef: string,
  counterIndex: number
): Promise<string> {
  const message = `VAULT:LEAF:${addressHex}:${opaqueDocRef}:${counterIndex}`;
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    utf8Encode(message) as BufferSource
  );
  return bytesToHex(new Uint8Array(digest));
}

/**
 * Computes deterministic SHA-256 parent node hash for two child hashes.
 * Node format: SHA-256("VAULT:NODE:" || leftHex || ":" || rightHex)
 */
export async function computeNodeHash(leftHex: string, rightHex: string): Promise<string> {
  const message = `VAULT:NODE:${leftHex}:${rightHex}`;
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    utf8Encode(message) as BufferSource
  );
  return bytesToHex(new Uint8Array(digest));
}

/**
 * Constructs a binary Merkle tree from an array of leaf hashes.
 * Follows RFC 6962 tree balancing for odd numbers of nodes at any level.
 *
 * @param leafHashes Array of 64-char hex leaf hashes
 */
export async function buildMerkleTree(leafHashes: string[]): Promise<MerkleTree> {
  if (leafHashes.length === 0) {
    const emptyDigest = await globalThis.crypto.subtle.digest(
      "SHA-256",
      utf8Encode("VAULT:EMPTY_TREE") as BufferSource
    );
    const emptyRoot = bytesToHex(new Uint8Array(emptyDigest));
    return {
      rootHex: emptyRoot,
      leaves: [],
      levels: [[]],
    };
  }

  const leaves = [...leafHashes];
  const levels: string[][] = [leaves];

  let currentLevel = leaves;

  while (currentLevel.length > 1) {
    const nextLevel: string[] = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        // Full pair
        const parent = await computeNodeHash(currentLevel[i], currentLevel[i + 1]);
        nextLevel.push(parent);
      } else {
        // Odd node at the boundary: duplicate with itself to balance
        const parent = await computeNodeHash(currentLevel[i], currentLevel[i]);
        nextLevel.push(parent);
      }
    }

    levels.push(nextLevel);
    currentLevel = nextLevel;
  }

  return {
    rootHex: levels[levels.length - 1][0],
    leaves,
    levels,
  };
}

/**
 * Generates an audit inclusion proof path for a specific leaf index.
 *
 * @param tree Built MerkleTree
 * @param leafIndex 0-indexed leaf position
 */
export function generateInclusionProof(tree: MerkleTree, leafIndex: number): MerkleProofPath {
  if (leafIndex < 0 || leafIndex >= tree.leaves.length) {
    throw new Error(`Leaf index ${leafIndex} out of bounds for tree with ${tree.leaves.length} leaves`);
  }

  const proof: MerkleProofPath = [];
  let currentIndex = leafIndex;

  for (let l = 0; l < tree.levels.length - 1; l++) {
    const level = tree.levels[l];
    const isRightChild = currentIndex % 2 === 1;
    const siblingIndex = isRightChild ? currentIndex - 1 : currentIndex + 1;

    let siblingHex: string;
    if (siblingIndex < level.length) {
      siblingHex = level[siblingIndex];
    } else {
      // Sibling was itself (odd boundary)
      siblingHex = level[currentIndex];
    }

    proof.push({
      siblingHex,
      isLeft: isRightChild, // If current is right, sibling is left
    });

    currentIndex = Math.floor(currentIndex / 2);
  }

  return proof;
}

/**
 * Verifies an inclusion proof path against an expected root hash using constant-time comparison.
 *
 * @param leafHashHex 64-char hex hash of the candidate leaf
 * @param proof Merkle proof path containing sibling hashes and directions
 * @param expectedRootHex Expected 64-char hex root hash
 */
export async function verifyInclusionProof(
  leafHashHex: string,
  proof: MerkleProofPath,
  expectedRootHex: string
): Promise<boolean> {
  let currentHash = leafHashHex;

  for (const step of proof) {
    if (step.isLeft) {
      currentHash = await computeNodeHash(step.siblingHex, currentHash);
    } else {
      currentHash = await computeNodeHash(currentHash, step.siblingHex);
    }
  }

  const computedBytes = hexToBytes(currentHash);
  const expectedBytes = hexToBytes(expectedRootHex);

  return constantTimeEqual(computedBytes, expectedBytes);
}
