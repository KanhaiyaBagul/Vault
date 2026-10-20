import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveVaultSubkeysFromPassword, generateSalt } from "../../src/crypto/kdf.ts";
import {
  ClientVaultStorage,
  type IngestedDocumentMeta,
} from "../../src/client/client_storage.ts";

describe("Client Vault Encrypted Storage (client_storage.ts)", () => {
  it("encrypts client state with AES-256-GCM and guarantees zero plaintext at rest", async () => {
    const memoryMap = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => memoryMap.get(k) || null,
      setItem: (k: string, v: string) => memoryMap.set(k, v),
      removeItem: (k: string) => memoryMap.delete(k),
    };

    const storage = new ClientVaultStorage("test_vault_key", mockStorage);
    assert.equal(storage.hasSavedState(), false);

    // Derive K_enc from test password
    const salt = generateSalt(16);
    const subkeys = await deriveVaultSubkeysFromPassword("TestEnterpriseSecret123!", salt, 10_000);

    const testDocs: IngestedDocumentMeta[] = [
      {
        docId: "confidential_financials_2026.pdf",
        docRef: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        sizeBytes: 15420,
        tokenCount: 88,
        uploadedAt: 1776543210000,
        provider: "SUPABASE",
      },
      {
        docId: "internal_audit_notes.md",
        docRef: "a".repeat(64),
        sizeBytes: 3200,
        tokenCount: 45,
        uploadedAt: 1776543220000,
        provider: "S3",
      },
    ];

    const keywordCounters = {
      financials: 1,
      compliance: 2,
      audit: 3,
    };

    const authCommitments = {
      financials: {
        tokenNormalized: "financials",
        count: 1,
        rootHashHex: "b".repeat(64),
        commitmentHex: "c".repeat(64),
      },
    };

    // 1. Save encrypted state
    const savedBlob = await storage.saveEncryptedState(subkeys.kEnc, {
      documents: testDocs,
      keywordCounters,
      authCommitments,
    });

    assert.equal(storage.hasSavedState(), true);
    assert.equal(savedBlob.ivHex.length, 24); // 12-byte IV = 24 hex chars
    assert.ok(savedBlob.ciphertextHex.length > 0);

    // 2. Verify zero plaintext at rest: check raw stored string
    const rawStored = memoryMap.get("test_vault_key")!;
    assert.ok(rawStored);
    assert.equal(rawStored.includes("confidential_financials"), false);
    assert.equal(rawStored.includes("internal_audit_notes"), false);
    assert.equal(rawStored.includes("SUPABASE"), false);
    assert.equal(rawStored.includes("financials"), false);
    assert.ok(rawStored.includes("encryptedBlob"));
    assert.ok(rawStored.includes("ivHex"));
    assert.ok(rawStored.includes("ciphertextHex"));

    // 3. Load and restore encrypted state
    const restored = await storage.loadEncryptedState(subkeys.kEnc);
    assert.ok(restored);
    assert.equal(restored.documents.length, 2);
    assert.equal(restored.documents[0].docId, "confidential_financials_2026.pdf");
    assert.equal(restored.documents[0].provider, "SUPABASE");
    assert.equal(restored.documents[1].docId, "internal_audit_notes.md");
    assert.equal(restored.keywordCounters.compliance, 2);
    assert.equal(restored.authCommitments.financials.rootHashHex, "b".repeat(64));

    // 4. Decryption fails when wrong password / key is supplied
    const wrongSubkeys = await deriveVaultSubkeysFromPassword("WrongPassword456!", salt, 10_000);
    await assert.rejects(
      async () => {
        await storage.loadEncryptedState(wrongSubkeys.kEnc);
      },
      /Cryptographic verification failed/
    );

    // 5. Decryption fails when ciphertext is tampered with
    const envelope = JSON.parse(rawStored);
    // Alter last char of ciphertext
    const tamperedHex = envelope.encryptedBlob.ciphertextHex.slice(0, -2) + "ff";
    envelope.encryptedBlob.ciphertextHex = tamperedHex;
    memoryMap.set("test_vault_key", JSON.stringify(envelope));

    await assert.rejects(
      async () => {
        await storage.loadEncryptedState(subkeys.kEnc);
      },
      /Cryptographic verification failed/
    );

    // 6. Clear removes state
    storage.clear();
    assert.equal(storage.hasSavedState(), false);
    assert.equal(await storage.loadEncryptedState(subkeys.kEnc), null);
  });
});
