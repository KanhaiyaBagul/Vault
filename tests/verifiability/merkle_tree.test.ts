import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildMerkleTree,
  computeLeafHash,
  computeNodeHash,
  generateInclusionProof,
  verifyInclusionProof,
} from "../../src/verifiability/merkle_tree.ts";

describe("Cryptographic Accumulator & Merkle Tree Core (merkle_tree.ts)", async () => {
  it("computeLeafHash produces deterministic 64-char hex digests", async () => {
    const hash1 = await computeLeafHash("addr_1234567890abcdef", "docref_001", 0);
    const hash2 = await computeLeafHash("addr_1234567890abcdef", "docref_001", 0);
    const hash3 = await computeLeafHash("addr_1234567890abcdef", "docref_001", 1);

    assert.equal(hash1.length, 64);
    assert.equal(hash1, hash2);
    assert.notEqual(hash1, hash3);
  });

  it("buildMerkleTree handles empty and single-leaf trees", async () => {
    const emptyTree = await buildMerkleTree([]);
    assert.equal(emptyTree.rootHex.length, 64);
    assert.equal(emptyTree.leaves.length, 0);

    const singleHash = await computeLeafHash("addr_single", "docref_single", 0);
    const singleTree = await buildMerkleTree([singleHash]);
    assert.equal(singleTree.rootHex, singleHash);
    assert.equal(singleTree.leaves.length, 1);
  });

  it("buildMerkleTree and inclusion proofs work for power-of-2 trees", async () => {
    const leafCount = 8;
    const leafHashes: string[] = [];
    for (let i = 0; i < leafCount; i++) {
      leafHashes.push(await computeLeafHash(`addr_${i}`, `docref_${i}`, i));
    }

    const tree = await buildMerkleTree(leafHashes);
    assert.equal(tree.rootHex.length, 64);
    assert.equal(tree.levels.length, 4); // 8 -> 4 -> 2 -> 1 (4 levels)

    // Verify inclusion proof for every single leaf
    for (let i = 0; i < leafCount; i++) {
      const proof = generateInclusionProof(tree, i);
      assert.equal(proof.length, 3); // log2(8) = 3 steps
      const isValid = await verifyInclusionProof(leafHashes[i], proof, tree.rootHex);
      assert.ok(isValid, `Proof for leaf ${i} must verify against root`);
    }
  });

  it("buildMerkleTree and inclusion proofs work for odd-numbered leaf counts", async () => {
    const leafCount = 5;
    const leafHashes: string[] = [];
    for (let i = 0; i < leafCount; i++) {
      leafHashes.push(await computeLeafHash(`addr_odd_${i}`, `docref_odd_${i}`, i));
    }

    const tree = await buildMerkleTree(leafHashes);
    assert.equal(tree.rootHex.length, 64);

    for (let i = 0; i < leafCount; i++) {
      const proof = generateInclusionProof(tree, i);
      const isValid = await verifyInclusionProof(leafHashes[i], proof, tree.rootHex);
      assert.ok(isValid, `Odd-count tree proof for leaf ${i} must verify`);
    }
  });

  it("verifyInclusionProof fails when leaf or proof is tampered with", async () => {
    const leafHashes = [
      await computeLeafHash("addr_A", "refA", 0),
      await computeLeafHash("addr_B", "refB", 1),
      await computeLeafHash("addr_C", "refC", 2),
      await computeLeafHash("addr_D", "refD", 3),
    ];

    const tree = await buildMerkleTree(leafHashes);
    const proof = generateInclusionProof(tree, 2);

    // 1. Bit-flip in the leaf
    const tamperedLeaf = "f" + leafHashes[2].slice(1);
    const validWithTamperedLeaf = await verifyInclusionProof(tamperedLeaf, proof, tree.rootHex);
    assert.equal(validWithTamperedLeaf, false);

    // 2. Corrupting a sibling in the proof
    const tamperedProof = [...proof];
    tamperedProof[0] = {
      ...tamperedProof[0],
      siblingHex: "0000000000000000000000000000000000000000000000000000000000000000",
    };
    const validWithTamperedSibling = await verifyInclusionProof(leafHashes[2], tamperedProof, tree.rootHex);
    assert.equal(validWithTamperedSibling, false);

    // 3. Corrupting the expected root
    const tamperedRoot = "e" + tree.rootHex.slice(1);
    const validWithTamperedRoot = await verifyInclusionProof(leafHashes[2], proof, tamperedRoot);
    assert.equal(validWithTamperedRoot, false);
  });
});
