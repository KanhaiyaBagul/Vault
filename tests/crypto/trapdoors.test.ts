import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveVaultSubkeysFromPassword, generateSalt } from "../../src/crypto/kdf.ts";
import {
  computeIndexAddress,
  computeKeywordTrapdoor,
  computeKeywordTrapdoorHex,
  computeMask,
  normalizeKeyword,
  xorBytes,
} from "../../src/crypto/trapdoors.ts";
import { bytesToHex } from "../../src/crypto/utils.ts";

describe("PRF Trapdoors & Blind Addressing (trapdoors.ts)", async () => {
  const salt = generateSalt(16);
  const subkeys = await deriveVaultSubkeysFromPassword("EnterprisePassword2026", salt, 10_000);

  it("normalizeKeyword trims and lowercases input", () => {
    assert.equal(normalizeKeyword("  Cryptographic-Engine "), "cryptographic-engine");
    assert.equal(normalizeKeyword("FINANCIAL"), "financial");
  });

  it("computeKeywordTrapdoor produces deterministic output for identical keywords", async () => {
    const t1 = await computeKeywordTrapdoor(subkeys.kTrap, "financial-report");
    const t2 = await computeKeywordTrapdoor(subkeys.kTrap, "  Financial-Report  ");
    assert.equal(bytesToHex(t1), bytesToHex(t2));
  });

  it("computeKeywordTrapdoor produces distinct tokens for different keywords", async () => {
    const t1 = await computeKeywordTrapdoor(subkeys.kTrap, "financial-report");
    const t2 = await computeKeywordTrapdoor(subkeys.kTrap, "financial-reports");
    assert.notEqual(bytesToHex(t1), bytesToHex(t2));
  });

  it("computeIndexAddress generates unique addresses for incrementing counters", async () => {
    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "blockchain");
    const addr0 = await computeIndexAddress(subkeys.kAddr, tag, 0);
    const addr1 = await computeIndexAddress(subkeys.kAddr, tag, 1);
    const addr2 = await computeIndexAddress(subkeys.kAddr, tag, 2);

    assert.notEqual(addr0, addr1);
    assert.notEqual(addr1, addr2);
    assert.notEqual(addr0, addr2);

    // Verify determinism
    const addr0Again = await computeIndexAddress(subkeys.kAddr, tag, 0);
    assert.equal(addr0, addr0Again);
  });

  it("computeMask generates consistent XOR keystream", async () => {
    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "audit");
    const mask = await computeMask(subkeys.kMask, tag, 0, 64);
    assert.equal(mask.length, 64);

    const data = new Uint8Array([10, 20, 30, 40, 50]);
    const masked = xorBytes(data, mask);
    const unmasked = xorBytes(masked, mask);

    assert.deepEqual(unmasked, data);
    assert.notDeepEqual(masked, data);
  });
});
