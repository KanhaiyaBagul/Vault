import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as CryptoEngine from "../../src/crypto/index.ts";

describe("Crypto Engine Index Exports (index.ts)", () => {
  it("Exports all core cryptographic functions and types", () => {
    assert.equal(typeof CryptoEngine.deriveMasterKey, "function");
    assert.equal(typeof CryptoEngine.deriveSubkeys, "function");
    assert.equal(typeof CryptoEngine.computeKeywordTrapdoor, "function");
    assert.equal(typeof CryptoEngine.computeIndexAddress, "function");
    assert.equal(typeof CryptoEngine.computeMask, "function");
    assert.equal(typeof CryptoEngine.encryptPayload, "function");
    assert.equal(typeof CryptoEngine.decryptPayload, "function");
    assert.equal(typeof CryptoEngine.constantTimeEqual, "function");
    assert.equal(typeof CryptoEngine.bytesToHex, "function");
    assert.equal(typeof CryptoEngine.hexToBytes, "function");
  });
});
