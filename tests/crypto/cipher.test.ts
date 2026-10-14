import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveVaultSubkeysFromPassword, generateSalt } from "../../src/crypto/kdf.ts";
import {
  decryptPayload,
  decryptString,
  deserializeEncryptedBlob,
  encryptPayload,
  encryptString,
  generateIV,
  serializeEncryptedBlob,
} from "../../src/crypto/cipher.ts";
import { utf8Decode, utf8Encode } from "../../src/crypto/utils.ts";

describe("Authenticated Payload Cipher (cipher.ts)", async () => {
  const salt = generateSalt(16);
  const subkeys = await deriveVaultSubkeysFromPassword("VaultEnterpriseKey2026!", salt, 10_000);

  it("generateIV creates fresh 12-byte vectors", () => {
    const iv1 = generateIV(12);
    const iv2 = generateIV(12);
    assert.equal(iv1.length, 12);
    assert.equal(iv2.length, 12);
    assert.notDeepEqual(iv1, iv2);
  });

  it("Encrypt and decrypt roundtrip restores original plaintext", async () => {
    const originalText = "Top Secret Enterprise Strategy Document 2026 - Confidential";
    const plaintext = utf8Encode(originalText);

    const blob = await encryptPayload(subkeys.kEnc, plaintext);
    assert.equal(blob.iv.length, 12);
    // Ciphertext contains payload + 16 bytes auth tag
    assert.equal(blob.ciphertext.length, plaintext.length + 16);

    const decrypted = await decryptPayload(subkeys.kEnc, blob);
    assert.deepEqual(decrypted, plaintext);
    assert.equal(utf8Decode(decrypted), originalText);
  });

  it("Fresh IV rule: encrypting identical text twice yields distinct ciphertexts", async () => {
    const text = "Static Plaintext Data";
    const blob1 = await encryptPayload(subkeys.kEnc, utf8Encode(text));
    const blob2 = await encryptPayload(subkeys.kEnc, utf8Encode(text));

    assert.notDeepEqual(blob1.iv, blob2.iv);
    assert.notDeepEqual(blob1.ciphertext, blob2.ciphertext);

    // Both decrypt to the same original text
    const dec1 = await decryptPayload(subkeys.kEnc, blob1);
    const dec2 = await decryptPayload(subkeys.kEnc, blob2);
    assert.deepEqual(dec1, dec2);
  });

  it("Serialization and deserialization hex roundtrip works", async () => {
    const text = "JSON serializable payload";
    const serialized = await encryptString(subkeys.kEnc, text);

    assert.ok(typeof serialized.ivHex === "string");
    assert.ok(typeof serialized.ciphertextHex === "string");

    const deserialized = deserializeEncryptedBlob(serialized);
    const reserialized = serializeEncryptedBlob(deserialized);
    assert.deepEqual(reserialized, serialized);

    const decryptedText = await decryptString(subkeys.kEnc, serialized);
    assert.equal(decryptedText, text);
  });

  it("Additional Authenticated Data (AAD) integrity protection", async () => {
    const plaintext = utf8Encode("Protected data");
    const aad = utf8Encode("document-id:doc_99182");

    const blob = await encryptPayload(subkeys.kEnc, plaintext, aad);

    // Decrypt with matching AAD succeeds
    const decrypted = await decryptPayload(subkeys.kEnc, blob, aad);
    assert.deepEqual(decrypted, plaintext);

    // Decrypt with mismatched or tampered AAD fails
    const badAad = utf8Encode("document-id:doc_99999");
    await assert.rejects(
      () => decryptPayload(subkeys.kEnc, blob, badAad),
      /Cryptographic verification failed/
    );

    // Decrypt without AAD fails
    await assert.rejects(
      () => decryptPayload(subkeys.kEnc, blob),
      /Cryptographic verification failed/
    );
  });

  it("Active attacker bit-flip tamper resistance in ciphertext immediately fails", async () => {
    const plaintext = utf8Encode("Financial transaction: Transfer $1,000,000");
    const blob = await encryptPayload(subkeys.kEnc, plaintext);

    // Tamper with byte 5 of ciphertext (invert bit 0)
    const tamperedCiphertext = new Uint8Array(blob.ciphertext);
    tamperedCiphertext[5] ^= 0x01;

    const tamperedBlob = {
      ...blob,
      ciphertext: tamperedCiphertext,
    };

    await assert.rejects(
      () => decryptPayload(subkeys.kEnc, tamperedBlob),
      /Cryptographic verification failed/
    );
  });

  it("Active attacker bit-flip in IV immediately fails", async () => {
    const plaintext = utf8Encode("Financial transaction: Transfer $1,000,000");
    const blob = await encryptPayload(subkeys.kEnc, plaintext);

    // Tamper with byte 0 of IV
    const tamperedIv = new Uint8Array(blob.iv);
    tamperedIv[0] ^= 0x01;

    const tamperedBlob = {
      ...blob,
      iv: tamperedIv,
    };

    await assert.rejects(
      () => decryptPayload(subkeys.kEnc, tamperedBlob),
      /Cryptographic verification failed/
    );
  });

  it("Active attacker tag corruption immediately fails", async () => {
    const plaintext = utf8Encode("Financial transaction: Transfer $1,000,000");
    const blob = await encryptPayload(subkeys.kEnc, plaintext);

    // Tamper with the last byte (part of the 128-bit authentication tag)
    const tamperedTag = new Uint8Array(blob.ciphertext);
    tamperedTag[tamperedTag.length - 1] ^= 0xff;

    const tamperedBlob = {
      ...blob,
      ciphertext: tamperedTag,
    };

    await assert.rejects(
      () => decryptPayload(subkeys.kEnc, tamperedBlob),
      /Cryptographic verification failed/
    );
  });
});
