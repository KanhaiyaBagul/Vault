/**
 * Verifiability Engine Entry Point (Phase 4)
 * Authenticated Inverted Indexes (AII), Merkle Accumulators, and Cryptographic Proofs.
 * Zero external dependencies.
 */

export {
  computeLeafHash,
  computeNodeHash,
  buildMerkleTree,
  generateInclusionProof,
  verifyInclusionProof,
  type MerkleProofStep,
  type MerkleProofPath,
  type MerkleTree,
} from "./merkle_tree.ts";

export {
  computeTokenCommitment,
  verifyTokenCommitment,
  AuthenticatedIndexManager,
  type TokenCommitment,
  type PostingLeafInput,
} from "./authenticated_index.ts";

export {
  buildVerifiableSearchBundle,
  type VerifiableSearchResultBundle,
} from "./server_prover.ts";

export {
  verifySearchResultBundle,
  type VerificationErrorCode,
  type VerificationResult,
} from "./client_verifier.ts";
