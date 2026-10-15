import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { VaultServerApp } from "../../src/server/index.ts";

describe("Web UI Static Asset Serving (ui_routes.test.ts)", async () => {
  it("serves HTML dashboard, CSS styles, and client JavaScript with valid MIME types", async () => {
    const app = new VaultServerApp();
    const port = await app.listen(0);
    const baseUrl = `http://localhost:${port}`;

    try {
      // 1. GET / -> index.html
      const htmlRes = await fetch(`${baseUrl}/`);
      assert.equal(htmlRes.status, 200);
      assert.ok(htmlRes.headers.get("content-type")?.includes("text/html"));
      const htmlText = await htmlRes.text();
      assert.ok(htmlText.includes("VAULT // SSE ENGINE"));
      assert.ok(htmlText.includes("Untrusted Cloud Lens"));
      assert.ok(htmlText.includes("Master Key Enclave"));

      // 2. GET /styles.css -> styles.css
      const cssRes = await fetch(`${baseUrl}/styles.css`);
      assert.equal(cssRes.status, 200);
      assert.ok(cssRes.headers.get("content-type")?.includes("text/css"));
      const cssText = await cssRes.text();
      assert.ok(cssText.includes("--bg-dark"));
      assert.ok(cssText.includes("--neon-cyan"));

      // 3. GET /app.js -> app.js
      const jsRes = await fetch(`${baseUrl}/app.js`);
      assert.equal(jsRes.status, 200);
      assert.ok(jsRes.headers.get("content-type")?.includes("javascript"));
      const jsText = await jsRes.text();
      assert.ok(jsText.includes("VaultAppController"));
      assert.ok(jsText.includes("deriveVaultSubkeys"));
    } finally {
      await app.close();
    }
  });
});
