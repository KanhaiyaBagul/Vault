import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeSupabaseUrl, translateCloudError } from "../../public/app.js";

describe("Cloud UI Helpers (cloud_ui_helpers.test.ts)", () => {
  describe("normalizeSupabaseUrl", () => {
    it("normalizes Supabase dashboard URLs into standard REST URLs", () => {
      const dashboardUrl = "https://supabase.com/dashboard/project/ryfafenurtpwediiurjx";
      assert.equal(
        normalizeSupabaseUrl(dashboardUrl),
        "https://ryfafenurtpwediiurjx.supabase.co"
      );
    });

    it("normalizes raw project references into standard REST URLs", () => {
      assert.equal(
        normalizeSupabaseUrl("ryfafenurtpwediiurjx"),
        "https://ryfafenurtpwediiurjx.supabase.co"
      );
    });

    it("strips trailing slashes from valid Supabase URLs", () => {
      assert.equal(
        normalizeSupabaseUrl("https://ryfafenurtpwediiurjx.supabase.co/"),
        "https://ryfafenurtpwediiurjx.supabase.co"
      );
    });

    it("adds https protocol to naked domains", () => {
      assert.equal(
        normalizeSupabaseUrl("ryfafenurtpwediiurjx.supabase.co"),
        "https://ryfafenurtpwediiurjx.supabase.co"
      );
    });

    it("handles null, empty, or whitespace inputs gracefully", () => {
      assert.equal(normalizeSupabaseUrl(""), "");
      assert.equal(normalizeSupabaseUrl("   "), "");
      assert.equal(normalizeSupabaseUrl(null as any), "");
    });
  });

  describe("translateCloudError", () => {
    it("translates 401 / invalid JWT / API key errors with clear dashboard guidance", () => {
      const res = translateCloudError("HTTP 401 Unauthorized: Invalid API key", "supabase");
      assert.equal(res.title, "Authentication Failed (401)");
      assert.ok(res.message.includes("service_role"));
      assert.ok(res.action.includes("Project Settings"));
    });

    it("translates 404 / bucket not found errors with creation advice", () => {
      const res = translateCloudError("NoSuchBucket: The specified bucket does not exist", "s3", {
        bucket: "my-test-vault",
      });
      assert.equal(res.title, "Storage Bucket Not Found (404)");
      assert.ok(res.message.includes("my-test-vault"));
      assert.ok(res.action.includes("Create 'my-test-vault'"));
    });

    it("translates AWS S3 signature and IAM permission errors", () => {
      const res = translateCloudError("SignatureDoesNotMatch: The request signature does not match", "s3", {
        region: "eu-west-1",
      });
      assert.equal(res.title, "S3 Authorization Rejected");
      assert.ok(res.message.includes("Secret Access Key"));
      assert.ok(res.message.includes("eu-west-1"));
    });

    it("translates network and host unreachable errors", () => {
      const res = translateCloudError("TypeError: Failed to fetch (ENOTFOUND)", "supabase");
      assert.equal(res.title, "Network / Endpoint Unreachable");
      assert.ok(res.message.includes("network allows outgoing"));
    });

    it("translates local disk storage permission errors", () => {
      const res = translateCloudError("EACCES: permission denied, open '/root/.vault'", "disk", {
        diskPath: "/root/.vault",
      });
      assert.equal(res.title, "Disk Storage Error");
      assert.ok(res.message.includes("/root/.vault"));
      assert.ok(res.action.includes("write permissions"));
    });

    it("returns clean fallback for unknown errors", () => {
      const res = translateCloudError("Unexpected service disruption", "general");
      assert.equal(res.title, "Cloud Connection Error");
      assert.equal(res.message, "Unexpected service disruption");
    });
  });
});
