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
    app = new VaultServerApp();
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
});
