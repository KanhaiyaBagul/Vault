/**
 * Server Proof Generator (Server Prover)
 * Constructs verifiable search bundles containing matching encrypted records,
 * the postings list Merkle accumulator root, and inclusion audit paths.
 * Zero external dependencies.
 */

import type { EncryptedPostingRecord } from "../engine/server_store.ts";
import {
  buildMerkleTree,
  computeLeafHash,
  generateInclusionProof,
  type MerkleProofPath,
} from "./merkle_tree.ts";

export interface VerifiableSearchResultBundle {
  tokenNormalized: string;
  records: EncryptedPostingRecord[];
  rootHashHex: string;
  leafHashes: string[];
  proofPaths: MerkleProofPath[];
}

/**
 * Builds a verifiable search result bundle from matching encrypted posting records.
 *
 * @param tokenNormalized Normalized search token string
 * @param records Matching EncryptedPostingRecords retrieved by the server
 */
export async function buildVerifiableSearchBundle(
  tokenNormalized: string,
  records: EncryptedPostingRecord[]
): Promise<VerifiableSearchResultBundle> {
  // 1. Sort records deterministically by counterIndex
  const sortedRecords = [...records].sort((a, b) => a.counterIndex - b.counterIndex);

  // 2. Compute canonical leaf hashes for each record
  const leafHashes: string[] = [];
  for (const record of sortedRecords) {
    const leaf = await computeLeafHash(
      record.addressHex,
      record.opaqueDocRef,
      record.counterIndex
    );
    leafHashes.push(leaf);
  }

  // 3. Build Merkle accumulator tree
  const tree = await buildMerkleTree(leafHashes);

  // 4. Generate inclusion proof paths for each leaf
  const proofPaths: MerkleProofPath[] = [];
  for (let i = 0; i < leafHashes.length; i++) {
    proofPaths.push(generateInclusionProof(tree, i));
  }

  return {
    tokenNormalized,
    records: sortedRecords,
    rootHashHex: tree.rootHex,
    leafHashes,
    proofPaths,
  };
}
