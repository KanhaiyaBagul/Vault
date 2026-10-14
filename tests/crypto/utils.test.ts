import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  randomBytes,
  constantTimeEqual,
  bytesToHex,
  hexToBytes,
  bytesToBase64,
  base64ToBytes,
  utf8Encode,
  utf8Decode,
  concatBytes,
} from "../../src/crypto/utils.ts";

describe("Cryptographic Utilities (utils.ts)", () => {
  it("randomBytes generates correct length and non-zero entropy", () => {
    const bytes1 = randomBytes(16);
    const bytes2 = randomBytes(16);
    assert.equal(bytes1.length, 16);
    assert.equal(bytes2.length, 16);
    assert.notDeepEqual(bytes1, bytes2, "Consecutive random byte arrays must be unique");
  });

  it("constantTimeEqual compares correctly", () => {
    const a = new Uint8Array([1, 2, 3, 4]);
    const b = new Uint8Array([1, 2, 3, 4]);
    const c = new Uint8Array([1, 2, 3, 5]);
    const d = new Uint8Array([1, 2, 3]);

    assert.equal(constantTimeEqual(a, b), true);
    assert.equal(constantTimeEqual(a, c), false);
    assert.equal(constantTimeEqual(a, d), false);
  });

  it("Hex serialization roundtrip matches", () => {
    const original = new Uint8Array([0x00, 0x0f, 0xa5, 0xff, 0x42]);
    const hex = bytesToHex(original);
    assert.equal(hex, "000fa5ff42");
    const parsed = hexToBytes(hex);
    assert.deepEqual(parsed, original);
  });

  it("Hex parsing rejects invalid characters or odd lengths", () => {
    assert.throws(() => hexToBytes("123"), /length/);
    assert.throws(() => hexToBytes("123g"), /non-hexadecimal/);
  });

  it("Base64 serialization roundtrip matches", () => {
    const original = utf8Encode("Searchable Symmetric Encryption 2026!");
    const b64 = bytesToBase64(original);
    const decoded = base64ToBytes(b64);
    assert.deepEqual(decoded, original);
    assert.equal(utf8Decode(decoded), "Searchable Symmetric Encryption 2026!");
  });

  it("concatBytes correctly joins multiple byte arrays", () => {
    const b1 = new Uint8Array([1, 2]);
    const b2 = new Uint8Array([3, 4, 5]);
    const b3 = new Uint8Array([6]);
    const joined = concatBytes(b1, b2, b3);
    assert.deepEqual(joined, new Uint8Array([1, 2, 3, 4, 5, 6]));
  });
});
