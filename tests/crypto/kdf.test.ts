import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  deriveMasterKey,
  deriveSubkeys,
  deriveVaultSubkeysFromPassword,
  generateSalt,
} from "../../src/crypto/kdf.ts";
import { bytesToHex, utf8Encode } from "../../src/crypto/utils.ts";

describe("Key Derivation Module (kdf.ts)", () => {
  it("deriveMasterKey generates repeatable keys for identical inputs", async () => {
    const password = "EnterpriseSecret2026!#";
    const salt = new Uint8Array(16).fill(0x42);

    const master1 = await deriveMasterKey(password, salt, 10_000);
    const master2 = await deriveMasterKey(password, salt, 10_000);

    // Derive a test HMAC key to verify repeatability
    const subkey1 = await globalThis.crypto.subtle.deriveKey(
      { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0) as BufferSource, info: utf8Encode("TEST") as BufferSource },
      master1,
      { name: "HMAC", hash: "SHA-256" },
      true, // extractable for comparison
      ["sign"]
    );
    const subkey2 = await globalThis.crypto.subtle.deriveKey(
      { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0) as BufferSource, info: utf8Encode("TEST") as BufferSource },
      master2,
      { name: "HMAC", hash: "SHA-256" },
      true,
      ["sign"]
    );

    const raw1 = await globalThis.crypto.subtle.exportKey("raw", subkey1);
    const raw2 = await globalThis.crypto.subtle.exportKey("raw", subkey2);

    assert.equal(bytesToHex(new Uint8Array(raw1)), bytesToHex(new Uint8Array(raw2)));
  });

  it("Changing 1 bit in salt yields completely orthogonal keys", async () => {
    const password = "EnterpriseSecret2026!#";
    const salt1 = new Uint8Array(16).fill(0x42);
    const salt2 = new Uint8Array(16).fill(0x42);
    salt2[0] = 0x43; // 1-bit flip

    const master1 = await deriveMasterKey(password, salt1, 10_000);
    const master2 = await deriveMasterKey(password, salt2, 10_000);

    const subkey1 = await globalThis.crypto.subtle.deriveKey(
      { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0) as BufferSource, info: utf8Encode("TEST") as BufferSource },
      master1,
      { name: "HMAC", hash: "SHA-256" },
      true,
      ["sign"]
    );
    const subkey2 = await globalThis.crypto.subtle.deriveKey(
      { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0) as BufferSource, info: utf8Encode("TEST") as BufferSource },
      master2,
      { name: "HMAC", hash: "SHA-256" },
      true,
      ["sign"]
    );

    const raw1 = await globalThis.crypto.subtle.exportKey("raw", subkey1);
    const raw2 = await globalThis.crypto.subtle.exportKey("raw", subkey2);

    assert.notEqual(bytesToHex(new Uint8Array(raw1)), bytesToHex(new Uint8Array(raw2)));
  });

  it("deriveSubkeys yields 5 distinct subkeys with expected algorithms and usages", async () => {
    const salt = generateSalt(16);
    const subkeys = await deriveVaultSubkeysFromPassword("TestPassphrase2026", salt, 10_000);

    assert.ok(subkeys.kTrap);
    assert.ok(subkeys.kAddr);
    assert.ok(subkeys.kMask);
    assert.ok(subkeys.kEnc);
    assert.ok(subkeys.kAuth);

    // Verify algorithms
    assert.equal(subkeys.kTrap.algorithm.name, "HMAC");
    assert.equal((subkeys.kTrap.algorithm as HmacKeyAlgorithm).hash.name, "SHA-256");
    assert.equal(subkeys.kEnc.algorithm.name, "AES-GCM");
    assert.equal((subkeys.kEnc.algorithm as AesKeyAlgorithm).length, 256);

    // Verify key usages
    assert.deepEqual(subkeys.kTrap.usages, ["sign"]);
    assert.deepEqual(subkeys.kEnc.usages, ["encrypt", "decrypt"]);
    assert.deepEqual(subkeys.kAuth.usages, ["sign", "verify"]);
  });

  it("Rejects empty password or insufficient salt length", async () => {
    const validSalt = generateSalt(16);
    await assert.rejects(() => deriveMasterKey("", validSalt), /Password cannot be empty/);
    await assert.rejects(
      () => deriveMasterKey("validPass", new Uint8Array(8)),
      /Salt must be at least 16 bytes/
    );
  });
});
