/**
 * Cloud Profile Manager & Storage Durability Tests
 * Validates profile CRUD, secret masking, 1-click activation, disk persistence,
 * and ServerBlindStore durability across re-instantiation.
 */

import { describe, it, before, after } from "node:test";
import * as assert from "node:assert";
import * as fs from "node:fs";
import * as path from "node:path";
import { CloudProfileManager } from "../../src/server/cloud/profile_manager.ts";
import { CloudStorageFactory } from "../../src/server/cloud/cloud_factory.ts";
import { ServerBlindStore } from "../../src/engine/server_store.ts";
import { VaultServerApp } from "../../src/server/server_app.ts";

describe("Cloud Profile Manager & Storage Durability (Wave 1)", () => {
  const testDir = path.resolve(process.cwd(), ".tmp_test_storage_" + Date.now());
  const profilesPath = path.join(testDir, "test_profiles.json");
  const blindIndexPath = path.join(testDir, "test_blind_index.json");

  before(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  after(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("seeds default disk and memory profiles when file does not exist", () => {
    const manager = new CloudProfileManager(profilesPath);
    const { activeProfileId, profiles } = manager.listProfilesMasked();

    assert.strictEqual(profiles.length >= 2, true);
    assert.strictEqual(activeProfileId, "profile_memory_default");
    const mem = profiles.find((p) => p.id === "profile_memory_default");
    assert.ok(mem);
    assert.strictEqual(mem.provider, "memory");
    assert.strictEqual(mem.isActive, true);
  });

  it("creates a new Supabase profile and masks secrets in listing", () => {
    const manager = new CloudProfileManager(profilesPath);
    const saved = manager.saveProfile({
      name: "Production Supabase Vault",
      provider: "supabase",
      config: {
        provider: "supabase",
        supabase: {
          supabaseUrl: "https://ryfafenurtpwediiurjx.supabase.co",
          apiKey: "super-secret-service-role-key-12345",
          bucket: "vault-encrypted-blobs",
        },
      },
    });

    assert.ok(saved.id);
    assert.strictEqual(saved.name, "Production Supabase Vault");

    // Check masked list
    const { profiles } = manager.listProfilesMasked();
    const found = profiles.find((p) => p.id === saved.id);
    assert.ok(found);
    assert.strictEqual(found.config.supabase?.apiKey, "********");

    // Check raw profile retains real secret
    const raw = manager.getProfileRaw(saved.id);
    assert.strictEqual(raw?.config.supabase?.apiKey, "super-secret-service-role-key-12345");
  });

  it("preserves existing secret when updating profile with masked placeholder", () => {
    const manager = new CloudProfileManager(profilesPath);
    const profiles = manager.listProfilesMasked().profiles;
    const supabaseProf = profiles.find((p) => p.name === "Production Supabase Vault");
    assert.ok(supabaseProf);

    // Update name and bucket with apiKey set to "********"
    const updated = manager.saveProfile({
      id: supabaseProf.id,
      name: "Renamed Supabase Primary",
      provider: "supabase",
      config: {
        provider: "supabase",
        supabase: {
          supabaseUrl: "https://ryfafenurtpwediiurjx.supabase.co",
          apiKey: "********",
          bucket: "updated-bucket-name",
        },
      },
    });

    assert.strictEqual(updated.name, "Renamed Supabase Primary");
    const raw = manager.getProfileRaw(supabaseProf.id);
    assert.strictEqual(raw?.config.supabase?.apiKey, "super-secret-service-role-key-12345");
    assert.strictEqual(raw?.config.supabase?.bucket, "updated-bucket-name");
  });

  it("activates profile, switches provider, and marks active in persistent state", async () => {
    const manager = new CloudProfileManager(profilesPath);
    const factory = new CloudStorageFactory({ provider: "memory" });

    // Activate the default memory profile
    const result = await manager.activateProfile("profile_memory_default", factory);
    assert.strictEqual(result.profile.id, "profile_memory_default");
    assert.strictEqual(result.profile.isActive, true);
    assert.strictEqual(factory.getProvider().providerName, "memory");

    const listing = manager.listProfilesMasked();
    assert.strictEqual(listing.activeProfileId, "profile_memory_default");
  });

  it("prevents deleting currently active profile, but allows deleting inactive profile", () => {
    const manager = new CloudProfileManager(profilesPath);
    const activeId = manager.listProfilesMasked().activeProfileId;

    const failDelete = manager.deleteProfile(activeId);
    assert.strictEqual(failDelete.success, false);
    assert.ok(failDelete.error?.includes("Cannot delete the currently active"));

    // Create a temporary profile to delete
    const temp = manager.saveProfile({
      name: "Temporary Profile",
      provider: "memory",
      config: { provider: "memory" },
    });

    const successDelete = manager.deleteProfile(temp.id);
    assert.strictEqual(successDelete.success, true);
    assert.strictEqual(manager.getProfileRaw(temp.id), undefined);
  });

  it("persists and restores all profiles and active state upon new manager instantiation", () => {
    const manager1 = new CloudProfileManager(profilesPath);
    const p1List = manager1.listProfilesMasked();

    // Re-instantiate manager with same file path
    const manager2 = new CloudProfileManager(profilesPath);
    const p2List = manager2.listProfilesMasked();

    assert.strictEqual(p2List.activeProfileId, p1List.activeProfileId);
    assert.strictEqual(p2List.profiles.length, p1List.profiles.length);
  });

  it("ServerBlindStore persists entries to disk and restores them upon restart", () => {
    const store1 = new ServerBlindStore(blindIndexPath);
    store1.insertEntries([
      {
        addressHex: "aabbcc112233",
        encryptedValueHex: "ddeeff445566",
        opaqueDocRef: "doc-ref-1",
      },
      {
        addressHex: "112233445566",
        encryptedValueHex: "778899aabbcc",
        opaqueDocRef: "doc-ref-2",
      },
    ]);

    // Query on store1
    const res1 = store1.searchByAddresses(["aabbcc112233", "112233445566"]);
    assert.strictEqual(res1.length, 2);

    // Re-instantiate store2 with same file
    const store2 = new ServerBlindStore(blindIndexPath);
    const res2 = store2.searchByAddresses(["aabbcc112233", "112233445566"]);
    assert.strictEqual(res2.length, 2);
    assert.strictEqual(res2[0].opaqueDocRef, "doc-ref-1");
    assert.strictEqual(res2[1].opaqueDocRef, "doc-ref-2");
  });

  it("VaultServerApp auto-hydrates active profile and exposes profile REST endpoints", async () => {
    const app = new VaultServerApp({
      storageDir: testDir,
      cloudConfig: { provider: "memory" }, // in-memory for fast test
    });
    const port = await app.listen(0);
    const baseUrl = `http://localhost:${port}`;

    try {
      // 1. GET /api/v1/cloud/profiles
      const listRes = await fetch(`${baseUrl}/api/v1/cloud/profiles`);
      assert.strictEqual(listRes.status, 200);
      const listData = await listRes.json();
      assert.strictEqual(listData.success, true);
      assert.ok(Array.isArray(listData.profiles));

      // 2. POST /api/v1/cloud/profiles (create)
      const createRes = await fetch(`${baseUrl}/api/v1/cloud/profiles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "API Test Memory Profile",
          provider: "memory",
          config: { provider: "memory" },
          makeActive: false,
        }),
      });
      assert.strictEqual(createRes.status, 200);
      const createData = await createRes.json();
      assert.strictEqual(createData.success, true);
      assert.strictEqual(createData.profile.name, "API Test Memory Profile");
      const createdId = createData.profile.id;

      // 3. POST /api/v1/cloud/profiles/:id/activate
      const activateRes = await fetch(`${baseUrl}/api/v1/cloud/profiles/${createdId}/activate`, {
        method: "POST",
      });
      assert.strictEqual(activateRes.status, 200);
      const activateData = await activateRes.json();
      assert.strictEqual(activateData.success, true);
      assert.strictEqual(activateData.activeProfileId, createdId);

      // 4. POST /api/v1/cloud/profiles/:id/test
      const testRes = await fetch(`${baseUrl}/api/v1/cloud/profiles/${createdId}/test`, {
        method: "POST",
      });
      assert.strictEqual(testRes.status, 200);
      const testData = await testRes.json();
      assert.strictEqual(testData.success, true);
      assert.strictEqual(testData.health.ok, true);

      // 5. Switch active back to memory default before delete
      await fetch(`${baseUrl}/api/v1/cloud/profiles/profile_memory_default/activate`, {
        method: "POST",
      });

      // 6. DELETE /api/v1/cloud/profiles/:id
      const delRes = await fetch(`${baseUrl}/api/v1/cloud/profiles/${createdId}`, {
        method: "DELETE",
      });
      assert.strictEqual(delRes.status, 200);
      const delData = await delRes.json();
      assert.strictEqual(delData.success, true);
      assert.strictEqual(delData.deletedId, createdId);
    } finally {
      await app.close();
    }
  });
});
