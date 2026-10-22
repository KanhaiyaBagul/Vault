/**
 * Cloud Storage REST API Integration Test Suite
 * Tests /api/v1/cloud/status, /api/v1/cloud/config, dynamic provider switching,
 * and zero-knowledge cloud blob storage and retrieval flows.
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { VaultServerApp } from "../../src/server/server_app.ts";
import type { EncryptedBlobPayload } from "../../src/server/cloud/index.ts";

describe("Cloud REST API & Dynamic Provider Switching", () => {
  let app: VaultServerApp;
  let baseUrl: string;
  const testDiskDir = path.resolve("./tests/.temp_api_vault_storage");

  const sampleBlob: EncryptedBlobPayload = {
    docRef: "11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
    ivHex: "0102030405060708090a0b0c",
    ciphertextHex: "cafebabedeadbeef0011223344556677",
    sizeBytes: 16,
    uploadedAt: Date.now(),
  };

  before(async () => {
    app = new VaultServerApp({ disablePersistence: true, cloudConfig: { provider: "memory" } });
    const port = await app.listen(0); // Ephemeral test port
    baseUrl = `http://localhost:${port}`;
  });

  after(async () => {
    await app.close();
    try {
      await fs.rm(testDiskDir, { recursive: true, force: true });
    } catch {}
  });

  it("GET /api/v1/health returns active cloudProvider", async () => {
    const res = await fetch(`${baseUrl}/api/v1/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.cloudProvider, "memory");
  });

  it("GET /api/v1/cloud/status returns health and provider details", async () => {
    const res = await fetch(`${baseUrl}/api/v1/cloud/status`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.provider, "memory");
    assert.equal(data.health.ok, true);
  });

  it("POST /api/v1/cloud/config dynamically switches to disk provider", async () => {
    const switchRes = await fetch(`${baseUrl}/api/v1/cloud/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "disk",
        diskPath: testDiskDir,
      }),
    });

    assert.equal(switchRes.status, 200);
    const data = await switchRes.json();
    assert.equal(data.success, true);
    assert.equal(data.provider, "disk");
    assert.equal(data.health.ok, true);

    // Verify status endpoint reflects new provider
    const statusRes = await fetch(`${baseUrl}/api/v1/cloud/status`);
    const statusData = await statusRes.json();
    assert.equal(statusData.provider, "disk");
  });

  it("POST /api/v1/index stores blob through active cloud provider and GET retrieves it", async () => {
    const indexRes = await fetch(`${baseUrl}/api/v1/index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        docRef: sampleBlob.docRef,
        entries: [],
        encryptedBlob: sampleBlob,
      }),
    });

    assert.equal(indexRes.status, 201);

    // Retrieve blob via REST
    const getRes = await fetch(`${baseUrl}/api/v1/blobs/${sampleBlob.docRef}`);
    assert.equal(getRes.status, 200);
    const getData = await getRes.json();
    assert.equal(getData.success, true);
    assert.equal(getData.blob.docRef, sampleBlob.docRef);
    assert.equal(getData.blob.ciphertextHex, sampleBlob.ciphertextHex);

    // Verify it was stored on disk
    const diskFile = path.join(testDiskDir, `${sampleBlob.docRef}.json`);
    const fileExists = await fs.access(diskFile).then(() => true).catch(() => false);
    assert.equal(fileExists, true);
  });

  it("POST /api/v1/cloud/config rejects invalid provider types", async () => {
    const badRes = await fetch(`${baseUrl}/api/v1/cloud/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "",
      }),
    });
    assert.equal(badRes.status, 400);
  });

  it("POST /api/v1/cloud/test validates provider credentials without switching", async () => {
    // Current provider is disk
    const testRes = await fetch(`${baseUrl}/api/v1/cloud/test`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "memory",
      }),
    });
    assert.equal(testRes.status, 200);
    const testData = await testRes.json();
    assert.equal(testData.success, true);
    assert.equal(testData.provider, "memory");

    // Verify active provider was NOT switched by test endpoint
    const statusRes = await fetch(`${baseUrl}/api/v1/cloud/status`);
    const statusData = await statusRes.json();
    assert.equal(statusData.provider, "disk");
  });

  it("POST /api/v1/cloud/config switches back to memory provider cleanly", async () => {
    const switchRes = await fetch(`${baseUrl}/api/v1/cloud/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "memory",
      }),
    });
    assert.equal(switchRes.status, 200);
    const data = await switchRes.json();
    assert.equal(data.provider, "memory");
  });

  it("GET /api/v1/cloud/documents returns lightweight headers isolated by active provider", async () => {
    // 1. Memory provider is currently active and empty
    const initialRes = await fetch(`${baseUrl}/api/v1/cloud/documents`);
    assert.equal(initialRes.status, 200);
    const initialData = await initialRes.json();
    assert.equal(initialData.success, true);
    assert.equal(initialData.provider, "memory");
    assert.equal(initialData.count, 0);

    // 2. Index a document into memory provider
    const memDocRef = "aa11bb22cc33dd44ee55ff660011223344556677889900aabbccddeeff001122";
    const indexMemRes = await fetch(`${baseUrl}/api/v1/index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        docRef: memDocRef,
        filename: "confidential_audit.pdf",
        fileSize: 1024,
        keywordCount: 15,
        entries: [],
        encryptedBlob: {
          docRef: memDocRef,
          ivHex: "0102030405060708090a0b0c",
          ciphertextHex: "abcdef1234567890",
          sizeBytes: 1024,
          uploadedAt: Date.now(),
        },
      }),
    });
    assert.equal(indexMemRes.status, 201);

    // 3. GET /api/v1/cloud/documents shows document in memory provider
    const memDocsRes = await fetch(`${baseUrl}/api/v1/cloud/documents`);
    assert.equal(memDocsRes.status, 200);
    const memDocsData = await memDocsRes.json();
    assert.equal(memDocsData.count, 1);
    assert.equal(memDocsData.documents[0].docRef, memDocRef);
    assert.equal(memDocsData.documents[0].filename, "confidential_audit.pdf");
    assert.equal(memDocsData.documents[0].provider, "memory");
    // Verify ciphertext is NOT returned in lightweight header listing
    assert.equal((memDocsData.documents[0] as any).ciphertextHex, undefined);

    // 4. Switch to Disk provider
    await fetch(`${baseUrl}/api/v1/cloud/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "disk",
        diskPath: testDiskDir,
      }),
    });

    // 5. Verify Disk provider does NOT leak memory documents
    const diskDocsRes = await fetch(`${baseUrl}/api/v1/cloud/documents`);
    assert.equal(diskDocsRes.status, 200);
    const diskDocsData = await diskDocsRes.json();
    assert.equal(diskDocsData.provider, "disk");
    // Memory docRef should not appear in disk documents
    assert.equal(diskDocsData.documents.some((d: any) => d.docRef === memDocRef), false);

    // 6. Index a document into Disk provider
    const diskDocRef = "ffeeddccbbaa99887766554433221100ffeeddccbbaa99887766554433221100";
    await fetch(`${baseUrl}/api/v1/index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        docRef: diskDocRef,
        filename: "disk_backup.tar.gz",
        fileSize: 2048,
        keywordCount: 8,
        entries: [],
        encryptedBlob: {
          docRef: diskDocRef,
          ivHex: "0102030405060708090a0b0c",
          ciphertextHex: "deadbeefcafe",
          sizeBytes: 2048,
          uploadedAt: Date.now(),
        },
      }),
    });

    const updatedDiskRes = await fetch(`${baseUrl}/api/v1/cloud/documents`);
    const updatedDiskData = await updatedDiskRes.json();
    assert.equal(updatedDiskData.count >= 1, true);
    const diskDoc = updatedDiskData.documents.find((d: any) => d.docRef === diskDocRef);
    assert.ok(diskDoc);
    assert.equal(diskDoc.filename, "disk_backup.tar.gz");
    assert.equal(diskDoc.provider, "disk");

    // 7. Delete document from Disk and verify it is removed from discovery
    const delRes = await fetch(`${baseUrl}/api/v1/blobs/${diskDocRef}`, { method: "DELETE" });
    assert.equal(delRes.status, 200);

    const postDelRes = await fetch(`${baseUrl}/api/v1/cloud/documents`);
    const postDelData = await postDelRes.json();
    assert.equal(postDelData.documents.some((d: any) => d.docRef === diskDocRef), false);
  });
});

