import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveVaultSubkeysFromPassword, generateSalt } from "../../src/crypto/kdf.ts";
import { encryptPayload, serializeEncryptedBlob } from "../../src/crypto/cipher.ts";
import { utf8Encode } from "../../src/crypto/utils.ts";
import { StateManager } from "../../src/engine/state_manager.ts";
import {
  buildBlindIndexEntries,
  computeOpaqueDocRef,
  unmaskAndDecryptDocId,
} from "../../src/engine/blind_index.ts";
import { generateSearchQueryPayload } from "../../src/engine/client_engine.ts";
import { VaultServerApp, type EncryptedBlobPayload } from "../../src/server/index.ts";

describe("Vault Cloud REST API & Audit Microservice (server_app.test.ts)", async () => {
  const salt = generateSalt(16);
  const subkeys = await deriveVaultSubkeysFromPassword("ServerAppMasterKey2026!", salt, 10_000);

  it("end-to-end HTTP integration: index, search, retrieve blob, and verify audit chain", async () => {
    const app = new VaultServerApp({ kAddr: subkeys.kAddr });
    const port = await app.listen(0);
    const baseUrl = `http://localhost:${port}`;

    try {
      // 1. Health check
      const healthRes = await fetch(`${baseUrl}/api/v1/health`);
      assert.equal(healthRes.status, 200);
      const healthData = (await healthRes.json()) as any;
      assert.equal(healthData.status, "healthy");

      // 2. Client prepares document
      const { extractAllTokens } = await import("../../src/indexer/ngrams.ts");
      const sm = new StateManager();
      const docId = "confidential_financial_q3.pdf";
      const docContent = "Quarterly financial earnings report and audit balance sheet.";
      const tokens = extractAllTokens(docContent, 3);

      // Client pre-encrypts document blob with AES-256-GCM
      const blobCipher = await encryptPayload(subkeys.kEnc, utf8Encode(docContent));
      const serialized = serializeEncryptedBlob(blobCipher);
      const opaqueDocRef = await computeOpaqueDocRef(subkeys.kAddr, docId);

      const blobPayload: EncryptedBlobPayload = {
        docRef: opaqueDocRef,
        ivHex: serialized.ivHex,
        ciphertextHex: serialized.ciphertextHex,
        sizeBytes: utf8Encode(docContent).length,
        uploadedAt: Date.now(),
      };

      const entries = await buildBlindIndexEntries(subkeys, sm, docId, tokens);

      // 3. Client uploads via HTTP: POST /api/v1/index
      const indexRes = await fetch(`${baseUrl}/api/v1/index`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docRef: opaqueDocRef,
          entries,
          encryptedBlob: blobPayload,
        }),
      });

      assert.equal(indexRes.status, 201);
      const indexData = (await indexRes.json()) as any;
      assert.ok(indexData.success);
      assert.equal(indexData.storedEntries, entries.length);

      // 4. Client searches via HTTP: POST /api/v1/search for exact word "financial"
      const queryPayload = await generateSearchQueryPayload(subkeys, sm, "financial", 3);
      const searchRes = await fetch(`${baseUrl}/api/v1/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queryType: queryPayload.queryType,
          tokens: queryPayload.tokens,
        }),
      });

      assert.equal(searchRes.status, 200);
      const searchData = (await searchRes.json()) as any;
      assert.ok(searchData.success);
      assert.equal(searchData.bundles.length, 1);

      const bundle = searchData.bundles[0];
      assert.equal(bundle.records.length, 1);
      assert.equal(bundle.rootHashHex.length, 64);

      // Decrypt returned record and verify it restores docId
      const primaryTag = queryPayload.tokens[0].trapdoorBytes;
      const decryptedDocId = await unmaskAndDecryptDocId(
        subkeys,
        primaryTag,
        bundle.records[0].counterIndex,
        bundle.records[0].encryptedValueHex
      );
      assert.equal(decryptedDocId, docId);

      // 5. Client downloads encrypted blob via HTTP: GET /api/v1/blobs/:ref
      const blobRes = await fetch(`${baseUrl}/api/v1/blobs/${opaqueDocRef}`);
      assert.equal(blobRes.status, 200);
      const blobData = (await blobRes.json()) as any;
      assert.deepEqual(blobData.blob.ciphertextHex, serialized.ciphertextHex);

      // 6. Auditor inspects zero-knowledge audit log: GET /api/v1/audit/log
      const auditLogRes = await fetch(`${baseUrl}/api/v1/audit/log`);
      assert.equal(auditLogRes.status, 200);
      const auditLogData = (await auditLogRes.json()) as any;

      // Operations: SYSTEM_INIT (0), INDEX_DOCUMENT (1), SEARCH_QUERY (2), RETRIEVE_BLOB (3)
      assert.equal(auditLogData.entries.length, 4);

      // Assert zero English plaintext words or filenames appear in audit log
      const logDump = JSON.stringify(auditLogData.entries).toLowerCase();
      const leakedWords = ["financial", "earnings", "audit balance", "confidential", "pdf"];
      for (const w of leakedWords) {
        assert.ok(
          !logDump.includes(w),
          `Plaintext term "${w}" leaked in audit log!`
        );
      }

      // 7. Auditor verifies cryptographic hash chain: GET /api/v1/audit/verify
      const verifyRes = await fetch(`${baseUrl}/api/v1/audit/verify`);
      assert.equal(verifyRes.status, 200);
      const verifyData = (await verifyRes.json()) as any;
      assert.ok(verifyData.isChainValid, "Hash chain must verify 100%");
      assert.equal(verifyData.totalEntries, 4);

      // 8. Active Attacker Simulation: Tamper with audit log in memory and verify failure
      app.auditLogger.getEntry(1)!.opaqueDetails = { hacked: true };
      const tamperedVerifyRes = await fetch(`${baseUrl}/api/v1/audit/verify`);
      const tamperedVerifyData = (await tamperedVerifyRes.json()) as any;
      assert.equal(tamperedVerifyData.isChainValid, false);
      assert.equal(tamperedVerifyData.brokenIndex, 1);
    } finally {
      await app.close();
    }
  });

  it("handles 404 for missing routes and missing blobs", async () => {
    const app = new VaultServerApp();
    const port = await app.listen(0);
    const baseUrl = `http://localhost:${port}`;

    try {
      const missingRouteRes = await fetch(`${baseUrl}/api/v1/non_existent`);
      assert.equal(missingRouteRes.status, 404);

      const missingBlobRes = await fetch(`${baseUrl}/api/v1/blobs/missing_hash_ref`);
      assert.equal(missingBlobRes.status, 404);
    } finally {
      await app.close();
    }
  });

  it("deletes stored blob via DELETE /api/v1/blobs/:ref and records in audit log", async () => {
    const app = new VaultServerApp();
    const port = await app.listen(0);
    const baseUrl = `http://localhost:${port}`;

    try {
      const docRef = "test_blob_to_delete_ref";
      app.blobStore.putBlob({
        docRef,
        ivHex: "11".repeat(12),
        ciphertextHex: "22".repeat(32),
        sizeBytes: 32,
        uploadedAt: Date.now(),
      });
      assert.ok(app.blobStore.hasBlob(docRef));

      const delRes = await fetch(`${baseUrl}/api/v1/blobs/${docRef}`, {
        method: "DELETE",
      });
      assert.equal(delRes.status, 200);
      const delData = (await delRes.json()) as any;
      assert.equal(delData.success, true);
      assert.equal(delData.deleted, true);
      assert.equal(app.blobStore.hasBlob(docRef), false);

      const secondDelRes = await fetch(`${baseUrl}/api/v1/blobs/${docRef}`, {
        method: "DELETE",
      });
      assert.equal(secondDelRes.status, 404);
    } finally {
      await app.close();
    }
  });
});
