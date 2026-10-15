/**
 * Client Proof Verifier
 * Mathematically validates the Completeness, Soundness, and Freshness
 * of search results returned by an untrusted cloud server.
 * Zero external dependencies.
 */

import type { VaultSubkeys } from "../crypto/kdf.ts";
import { constantTimeEqual, hexToBytes } from "../crypto/utils.ts";
import { computeKeywordTrapdoor } from "../crypto/trapdoors.ts";
import { buildMerkleTree, computeLeafHash, verifyInclusionProof } from "./merkle_tree.ts";
import { verifyTokenCommitment, type TokenCommitment } from "./authenticated_index.ts";
import type { VerifiableSearchResultBundle } from "./server_prover.ts";

export type VerificationErrorCode =
  | "DROPPED_RECORDS"
  | "FABRICATED_RECORDS"
  | "COUNTER_INDEX_CORRUPTED"
  | "ROOT_MISMATCH"
  | "COMMITMENT_INVALID"
  | "INCLUSION_PROOF_FAILED";

export interface VerificationResult {
  isValid: boolean;
  errorCode?: VerificationErrorCode;
  errorMessage?: string;
  verifiedRecordCount: number;
  rootHashHex?: string;
}

/**
 * Validates a verifiable search bundle against client's local cryptographic token commitment.
 *
 * Guarantees:
 * 1. Completeness: Server cannot drop/omit records without detection (record count must equal commitment.count).
 * 2. Soundness: Server cannot inject forged or modified records (recomputed Merkle root must match commitment).
 * 3. Freshness: Server cannot replay stale states (commitment is signed over client's current count and root).
 *
 * @param subkeys Client cryptographic subkey set (specifically K_auth and K_trap)
 * @param commitment Client-side commitment for the queried token
 * @param bundle Verifiable search bundle returned by the untrusted server
 */
export async function verifySearchResultBundle(
  subkeys: VaultSubkeys,
  commitment: TokenCommitment,
  bundle: VerifiableSearchResultBundle
): Promise<VerificationResult> {
  // Step 1: Completeness verification (cardinality check)
  if (bundle.records.length < commitment.count) {
    return {
      isValid: false,
      errorCode: "DROPPED_RECORDS",
      errorMessage: `Completeness violation: untrusted server returned ${bundle.records.length} records, but commitment expects ${commitment.count}`,
      verifiedRecordCount: bundle.records.length,
    };
  }

  if (bundle.records.length > commitment.count) {
    return {
      isValid: false,
      errorCode: "FABRICATED_RECORDS",
      errorMessage: `Soundness violation: untrusted server returned ${bundle.records.length} records, exceeding committed count of ${commitment.count}`,
      verifiedRecordCount: bundle.records.length,
    };
  }

  // Step 2: Verify counter indices are strictly contiguous (0, 1, ..., count - 1)
  for (let i = 0; i < bundle.records.length; i++) {
    if (bundle.records[i].counterIndex !== i) {
      return {
        isValid: false,
        errorCode: "COUNTER_INDEX_CORRUPTED",
        errorMessage: `Sequence violation: expected counterIndex ${i}, found ${bundle.records[i].counterIndex}`,
        verifiedRecordCount: 0,
      };
    }
  }

  // Step 3: Recompute canonical leaf hashes from returned records
  const recomputedLeaves: string[] = [];
  for (const record of bundle.records) {
    const leaf = await computeLeafHash(
      record.addressHex,
      record.opaqueDocRef,
      record.counterIndex
    );
    recomputedLeaves.push(leaf);
  }

  // Step 4: Recompute Merkle root from leaves
  const recomputedTree = await buildMerkleTree(recomputedLeaves);

  // Verify recomputed root matches the bundle root
  if (
    !constantTimeEqual(
      hexToBytes(recomputedTree.rootHex),
      hexToBytes(bundle.rootHashHex)
    )
  ) {
    return {
      isValid: false,
      errorCode: "ROOT_MISMATCH",
      errorMessage: "Soundness violation: recomputed Merkle root does not match the server-provided bundle root",
      verifiedRecordCount: 0,
    };
  }

  // Verify recomputed root matches client's trusted committed root
  if (
    !constantTimeEqual(
      hexToBytes(recomputedTree.rootHex),
      hexToBytes(commitment.rootHashHex)
    )
  ) {
    return {
      isValid: false,
      errorCode: "ROOT_MISMATCH",
      errorMessage: "Soundness violation: recomputed Merkle root does not match client's authenticated committed root",
      verifiedRecordCount: 0,
    };
  }

  // Step 5: Verify HMAC commitment using K_auth
  const tagBytes = await computeKeywordTrapdoor(subkeys.kTrap, commitment.tokenNormalized);
  const isCommitmentAuthentic = await verifyTokenCommitment(
    subkeys.kAuth,
    tagBytes,
    commitment.count,
    recomputedTree.rootHex,
    commitment.commitmentHex
  );

  if (!isCommitmentAuthentic) {
    return {
      isValid: false,
      errorCode: "COMMITMENT_INVALID",
      errorMessage: "Security violation: token commitment HMAC-SHA256 signature verification failed under K_auth",
      verifiedRecordCount: 0,
    };
  }

  // Step 6: Verify individual inclusion proof paths if provided
  if (bundle.proofPaths && bundle.proofPaths.length === recomputedLeaves.length) {
    for (let i = 0; i < recomputedLeaves.length; i++) {
      const isPathValid = await verifyInclusionProof(
        recomputedLeaves[i],
        bundle.proofPaths[i],
        recomputedTree.rootHex
      );
      if (!isPathValid) {
        return {
          isValid: false,
          errorCode: "INCLUSION_PROOF_FAILED",
          errorMessage: `Inclusion proof verification failed for leaf index ${i}`,
          verifiedRecordCount: 0,
        };
      }
    }
  }

  // All cryptographic checks passed!
  return {
    isValid: true,
    verifiedRecordCount: bundle.records.length,
    rootHashHex: recomputedTree.rootHex,
  };
}
