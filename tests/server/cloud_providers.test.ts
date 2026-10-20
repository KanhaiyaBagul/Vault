/**
 * Cloud Storage Providers Unit & Integration Test Suite
 * Tests InMemoryStorageProvider, DiskStorageProvider, S3CloudStorageProvider (SigV4), and SupabaseStorageProvider.
 */

import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import {
  InMemoryStorageProvider,
  DiskStorageProvider,
  S3CloudStorageProvider,
  SupabaseStorageProvider,
  type EncryptedBlobPayload,
} from "../../src/server/cloud/index.ts";

const samplePayload1: EncryptedBlobPayload = {
  docRef: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  ivHex: "0102030405060708090a0b0c",
  ciphertextHex: "deadbeefcafebabe1234567890abcdef0102030405060708",
  sizeBytes: 24,
  uploadedAt: 1774000000000,
};

const samplePayload2: EncryptedBlobPayload = {
  docRef: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
  ivHex: "aabbccddeeff001122334455",
  ciphertextHex: "fedcba98765432100123456789abcdef",
  sizeBytes: 16,
  uploadedAt: 1774000010000,
};

describe("Cloud Storage: InMemoryStorageProvider", () => {
  const provider = new InMemoryStorageProvider();

  it("stores and retrieves encrypted blobs accurately", async () => {
    const putRes = await provider.putBlob(samplePayload1);
    assert.equal(putRes.success, true);
    assert.equal(putRes.docRef, samplePayload1.docRef);
    assert.equal(putRes.provider, "memory");

    const retrieved = await provider.getBlob(samplePayload1.docRef);
    assert.ok(retrieved);
    assert.equal(retrieved.docRef, samplePayload1.docRef);
    assert.equal(retrieved.ciphertextHex, samplePayload1.ciphertextHex);
  });

  it("hasBlob and listBlobs reflect stored state", async () => {
    assert.equal(await provider.hasBlob(samplePayload1.docRef), true);
    assert.equal(await provider.hasBlob("0000000000000000000000000000000000000000000000000000000000000000"), false);

    await provider.putBlob(samplePayload2);
    const list = await provider.listBlobs();
    assert.equal(list.length, 2);
    assert.ok(list.includes(samplePayload1.docRef));
    assert.ok(list.includes(samplePayload2.docRef));
  });

  it("deletes blobs correctly", async () => {
    const deleted = await provider.deleteBlob(samplePayload1.docRef);
    assert.equal(deleted, true);
    assert.equal(await provider.hasBlob(samplePayload1.docRef), false);
    assert.equal(await provider.getBlob(samplePayload1.docRef), undefined);
  });

  it("healthCheck returns valid status", async () => {
    const health = await provider.healthCheck();
    assert.equal(health.ok, true);
    assert.equal(health.provider, "memory");
    assert.equal(health.totalBlobs, 1);
  });
});

describe("Cloud Storage: DiskStorageProvider", () => {
  const testDir = path.resolve("./tests/.temp_vault_storage");
  const provider = new DiskStorageProvider(testDir);

  after(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {}
  });

  it("stores and reads encrypted JSON payloads from disk", async () => {
    const putRes = await provider.putBlob(samplePayload1);
    assert.equal(putRes.success, true);
    assert.equal(putRes.provider, "disk");

    const retrieved = await provider.getBlob(samplePayload1.docRef);
    assert.ok(retrieved);
    assert.equal(retrieved.docRef, samplePayload1.docRef);
    assert.equal(retrieved.ciphertextHex, samplePayload1.ciphertextHex);
  });

  it("lists and checks existence on disk", async () => {
    assert.equal(await provider.hasBlob(samplePayload1.docRef), true);
    const list = await provider.listBlobs();
    assert.ok(list.includes(samplePayload1.docRef));
  });

  it("deletes file on disk", async () => {
    const deleted = await provider.deleteBlob(samplePayload1.docRef);
    assert.equal(deleted, true);
    assert.equal(await provider.hasBlob(samplePayload1.docRef), false);
  });

  it("reports disk health check", async () => {
    const health = await provider.healthCheck();
    assert.equal(health.ok, true);
    assert.equal(health.provider, "disk");
  });
});

describe("Cloud Storage: S3CloudStorageProvider (SigV4 & S3 REST)", () => {
  const mockS3Store = new Map<string, string>();

  // Mock fetch handler to test S3 REST calls without real AWS credentials
  const mockS3Fetch: typeof fetch = async (input, init) => {
    const urlStr = typeof input === "string" ? input : input.toString();
    const url = new URL(urlStr);
    const method = init?.method || "GET";
    const headers = (init?.headers as Record<string, string>) || {};

    // Verify AWS SigV4 authorization header format
    const authHeader = headers["Authorization"] || headers["authorization"];
    if (!authHeader || !authHeader.startsWith("AWS4-HMAC-SHA256")) {
      return new Response("Missing or invalid AWS SigV4 Auth header", { status: 403 });
    }

    if (method === "PUT") {
      const body = init?.body as string;
      mockS3Store.set(url.pathname, body);
      return new Response("", { status: 200, headers: { etag: '"mock-etag-12345"' } });
    }

    if (method === "GET") {
      if (url.searchParams.get("list-type") === "2") {
        // Mock ListObjectsV2 XML response
        const keysXml = Array.from(mockS3Store.keys())
          .map((k) => `<Contents><Key>${path.basename(k)}</Key></Contents>`)
          .join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><ListBucketResult>${keysXml}</ListBucketResult>`;
        return new Response(xml, { status: 200, headers: { "content-type": "application/xml" } });
      }

      const body = mockS3Store.get(url.pathname);
      if (!body) return new Response("Not Found", { status: 404 });
      return new Response(body, { status: 200, headers: { "content-type": "application/json" } });
    }

    if (method === "HEAD") {
      const exists = mockS3Store.has(url.pathname);
      return new Response(null, { status: exists ? 200 : 404 });
    }

    if (method === "DELETE") {
      mockS3Store.delete(url.pathname);
      return new Response(null, { status: 204 });
    }

    return new Response("Method Not Allowed", { status: 405 });
  };

  const provider = new S3CloudStorageProvider({
    bucket: "test-vault-bucket",
    region: "us-west-2",
    accessKeyId: "AKIAIOSFODNN7EXAMPLE",
    secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    endpoint: "https://s3.us-west-2.amazonaws.com",
    customFetch: mockS3Fetch,
  });

  it("generates valid AWS SigV4 signature headers", () => {
    const testUrl = new URL("https://test-vault-bucket.s3.us-west-2.amazonaws.com/test-key");
    const signed = provider.signRequest("PUT", testUrl, { "content-type": "application/json" }, "test-body");

    assert.ok(signed["Authorization"]);
    assert.ok(signed["Authorization"].includes("AWS4-HMAC-SHA256"));
    assert.ok(signed["Authorization"].includes("AKIAIOSFODNN7EXAMPLE"));
    assert.ok(signed["Authorization"].includes("us-west-2/s3/aws4_request"));
    assert.ok(signed["x-amz-date"]);
    assert.ok(signed["x-amz-content-sha256"]);
  });

  it("performs S3 putBlob, getBlob, and hasBlob via mock S3 fetch", async () => {
    const res = await provider.putBlob(samplePayload1);
    assert.equal(res.success, true);
    assert.equal(res.provider, "s3");
    assert.equal(res.etag, "mock-etag-12345");

    const retrieved = await provider.getBlob(samplePayload1.docRef);
    assert.ok(retrieved);
    assert.equal(retrieved.docRef, samplePayload1.docRef);
    assert.equal(retrieved.ciphertextHex, samplePayload1.ciphertextHex);

    assert.equal(await provider.hasBlob(samplePayload1.docRef), true);
  });

  it("lists objects in S3 bucket", async () => {
    const list = await provider.listBlobs();
    assert.ok(list.includes(samplePayload1.docRef));
  });

  it("deletes object from S3", async () => {
    const deleted = await provider.deleteBlob(samplePayload1.docRef);
    assert.equal(deleted, true);
    assert.equal(await provider.hasBlob(samplePayload1.docRef), false);
  });

  it("checks S3 health via ListObjectsV2 max-keys=1", async () => {
    const health = await provider.healthCheck();
    assert.equal(health.ok, true);
    assert.equal(health.provider, "s3");
    assert.equal(health.bucket, "test-vault-bucket");
  });
});

describe("Cloud Storage: SupabaseStorageProvider (REST v1)", () => {
  const mockSupabaseStore = new Map<string, string>();

  const mockSupabaseFetch: typeof fetch = async (input, init) => {
    const urlStr = typeof input === "string" ? input : input.toString();
    const url = new URL(urlStr);
    const method = init?.method || "GET";
    const headers = (init?.headers as Record<string, string>) || {};

    // Verify Supabase apikey & Bearer auth
    if (!headers["apikey"] || !headers["Authorization"]?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (method === "POST" && url.pathname.includes("/object/list/")) {
      const items = Array.from(mockSupabaseStore.keys()).map((k) => ({
        name: path.basename(k),
      }));
      return new Response(JSON.stringify(items), { status: 200, headers: { "content-type": "application/json" } });
    }

    if (method === "POST" && url.pathname.includes("/object/")) {
      const body = init?.body as string;
      mockSupabaseStore.set(url.pathname, body);
      return new Response(JSON.stringify({ Key: url.pathname }), { status: 200 });
    }

    if (method === "GET" && url.pathname.includes("/object/authenticated/")) {
      const pathKey = url.pathname.replace("/authenticated", "");
      const body = mockSupabaseStore.get(pathKey);
      if (!body) return new Response("Not Found", { status: 404 });
      return new Response(body, { status: 200, headers: { "content-type": "application/json" } });
    }

    if (method === "GET" && url.pathname.includes("/object/info/")) {
      const pathKey = url.pathname.replace("/info", "");
      return new Response(null, { status: mockSupabaseStore.has(pathKey) ? 200 : 404 });
    }

    if (method === "DELETE" && url.pathname.includes("/object/")) {
      mockSupabaseStore.clear();
      return new Response(JSON.stringify([{ message: "Successfully deleted" }]), { status: 200 });
    }

    if (method === "GET" && url.pathname.includes("/bucket/")) {
      return new Response(JSON.stringify({ id: "vault-encrypted-blobs", name: "vault-encrypted-blobs" }), { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  };

  const provider = new SupabaseStorageProvider({
    supabaseUrl: "https://testproject.supabase.co",
    apiKey: "sb_test_service_role_key_12345",
    bucket: "vault-encrypted-blobs",
    customFetch: mockSupabaseFetch,
  });

  it("stores and fetches encrypted blobs via Supabase REST API", async () => {
    const res = await provider.putBlob(samplePayload1);
    assert.equal(res.success, true);
    assert.equal(res.provider, "supabase");

    const retrieved = await provider.getBlob(samplePayload1.docRef);
    assert.ok(retrieved);
    assert.equal(retrieved.docRef, samplePayload1.docRef);
    assert.equal(retrieved.ciphertextHex, samplePayload1.ciphertextHex);

    assert.equal(await provider.hasBlob(samplePayload1.docRef), true);
  });

  it("lists objects in Supabase bucket", async () => {
    const list = await provider.listBlobs();
    assert.ok(list.includes(samplePayload1.docRef));
  });

  it("checks Supabase bucket health", async () => {
    const health = await provider.healthCheck();
    assert.equal(health.ok, true);
    assert.equal(health.provider, "supabase");
  });
});
