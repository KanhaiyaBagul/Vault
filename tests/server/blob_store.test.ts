import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EncryptedBlobStore, type EncryptedBlobPayload } from "../../src/server/blob_store.ts";

describe("Encrypted Blob Store (blob_store.ts)", () => {
  it("putBlob stores and getBlob retrieves encrypted payloads by opaqueDocRef", () => {
    const store = new EncryptedBlobStore();
    const docRef = "docref_001_1234567890abcdef1234567890abcdef";

    const payload: EncryptedBlobPayload = {
      docRef,
      ivHex: "123456789012345678901234",
      ciphertextHex: "abcdef0123456789abcdef0123456789",
      sizeBytes: 16,
      uploadedAt: Date.now(),
    };

    store.putBlob(payload);
    assert.equal(store.size(), 1);
    assert.ok(store.hasBlob(docRef));

    const retrieved = store.getBlob(docRef);
    assert.deepEqual(retrieved, payload);
    assert.equal(store.totalBytes(), 16);
  });

  it("deleteBlob removes stored blob", () => {
    const store = new EncryptedBlobStore();
    const docRef = "docref_to_delete";

    store.putBlob({
      docRef,
      ivHex: "111111111111111111111111",
      ciphertextHex: "222222222222222222222222",
      sizeBytes: 12,
      uploadedAt: Date.now(),
    });

    assert.equal(store.size(), 1);
    const deleted = store.deleteBlob(docRef);
    assert.ok(deleted);
    assert.equal(store.size(), 0);
    assert.equal(store.getBlob(docRef), undefined);
  });

  it("listDocRefs enumerates all stored references", () => {
    const store = new EncryptedBlobStore();
    store.putBlob({
      docRef: "refA",
      ivHex: "ivA",
      ciphertextHex: "cipherA",
      sizeBytes: 10,
      uploadedAt: Date.now(),
    });
    store.putBlob({
      docRef: "refB",
      ivHex: "ivB",
      ciphertextHex: "cipherB",
      sizeBytes: 20,
      uploadedAt: Date.now(),
    });

    const refs = store.listDocRefs();
    refs.sort();
    assert.deepEqual(refs, ["refA", "refB"]);
    assert.equal(store.totalBytes(), 30);
  });
});
