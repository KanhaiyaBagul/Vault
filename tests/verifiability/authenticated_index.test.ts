import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveVaultSubkeysFromPassword, generateSalt } from "../../src/crypto/kdf.ts";
import { computeKeywordTrapdoor } from "../../src/crypto/trapdoors.ts";
import {
  AuthenticatedIndexManager,
  computeTokenCommitment,
  verifyTokenCommitment,
} from "../../src/verifiability/authenticated_index.ts";

describe("Authenticated Index & Token Commitments (authenticated_index.ts)", async () => {
  const salt = generateSalt(16);
  const subkeys = await deriveVaultSubkeysFromPassword("AuthIndexSecret2026!", salt, 10_000);

  it("computeTokenCommitment produces deterministic 64-char HMAC signatures", async () => {
    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "financial");
    const rootHex = "a".repeat(64);

    const commit1 = await computeTokenCommitment(subkeys.kAuth, tag, 3, rootHex);
    const commit2 = await computeTokenCommitment(subkeys.kAuth, tag, 3, rootHex);
    assert.equal(commit1.length, 64);
    assert.equal(commit1, commit2);

    // Changing count changes commitment
    const commitDifferentCount = await computeTokenCommitment(subkeys.kAuth, tag, 4, rootHex);
    assert.notEqual(commit1, commitDifferentCount);

    // Changing root changes commitment
    const commitDifferentRoot = await computeTokenCommitment(subkeys.kAuth, tag, 3, "b".repeat(64));
    assert.notEqual(commit1, commitDifferentRoot);
  });

  it("verifyTokenCommitment validates authentic signatures and rejects tampering", async () => {
    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "audit");
    const rootHex = "c".repeat(64);
    const validCommit = await computeTokenCommitment(subkeys.kAuth, tag, 5, rootHex);

    const isValid = await verifyTokenCommitment(subkeys.kAuth, tag, 5, rootHex, validCommit);
    assert.ok(isValid);

    // Tampered commitment string fails (guaranteed bit flip)
    const tamperedCommit = (validCommit[0] === "0" ? "1" : "0") + validCommit.slice(1);
    const isTamperedValid = await verifyTokenCommitment(subkeys.kAuth, tag, 5, rootHex, tamperedCommit);
    assert.equal(isTamperedValid, false);

    // Mismatched count fails
    const isMismatchedCountValid = await verifyTokenCommitment(subkeys.kAuth, tag, 4, rootHex, validCommit);
    assert.equal(isMismatchedCountValid, false);
  });

  it("AuthenticatedIndexManager tracks, updates, exports, and imports commitments", async () => {
    const manager = new AuthenticatedIndexManager();
    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "compliance");

    const postings = [
      { addressHex: "addr_0", opaqueDocRef: "ref_0", counterIndex: 0 },
      { addressHex: "addr_1", opaqueDocRef: "ref_1", counterIndex: 1 },
    ];

    const commitment = await manager.updateTokenPostings(subkeys.kAuth, "compliance", tag, postings);
    assert.equal(commitment.count, 2);
    assert.equal(commitment.rootHashHex.length, 64);
    assert.equal(commitment.commitmentHex.length, 64);

    const retrieved = manager.getCommitment("compliance");
    assert.deepEqual(retrieved, commitment);

    // Export and import
    const exported = manager.exportState();
    const restoredManager = new AuthenticatedIndexManager();
    restoredManager.importState(exported);

    assert.equal(restoredManager.size(), 1);
    assert.deepEqual(restoredManager.getCommitment("COMPLIANCE"), commitment);
  });
});
