import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { VaultServerApp } from "../../src/server/index.ts";
import { VaultClient } from "../../src/client/vault_client.ts";

describe("Vault Client Unified SDK (vault_client.ts)", async () => {
  it("executes full client lifecycle: initialization, indexing, search, boolean queries, and tamper defense", async () => {
    // 1. Boot cloud server
    const app = new VaultServerApp();
    const port = await app.listen(0);
    const serverUrl = `http://localhost:${port}`;

    try {
      // 2. Initialize client
      const client = new VaultClient(serverUrl);
      const saltHex = await client.initialize("EnterpriseMasterPassword2026!", undefined, 10_000);
      assert.equal(saltHex.length, 32);

      // 3. Index sample enterprise documents
      const doc1 = await client.indexDocument(
        "doc_audit_2026.pdf",
        "Internal corporate audit report: compliance and tax assessment."
      );
      assert.ok(doc1.entryCount > 0);

      const doc2 = await client.indexDocument(
        "doc_tax_q3.pdf",
        "Quarterly corporate tax filing and deductions."
      );
      assert.ok(doc2.entryCount > 0);

      const doc3 = await client.indexDocument(
        "doc_hr_payroll.docx",
        "Executive payroll and compensation report."
      );
      assert.ok(doc3.entryCount > 0);

      // 4. Single keyword search: "payroll"
      const payrollRes = await client.search("payroll");
      assert.ok(payrollRes.verified);
      assert.equal(payrollRes.results.length, 1);
      assert.equal(payrollRes.results[0].docId, "doc_hr_payroll.docx");
      assert.ok(payrollRes.results[0].content.includes("Executive payroll"));

      // 5. Substring search over ciphertext: "audit"
      const auditRes = await client.search("audit");
      assert.ok(auditRes.verified);
      assert.equal(auditRes.results.length, 1);
      assert.equal(auditRes.results[0].docId, "doc_audit_2026.pdf");

      // 6. Boolean Conjunction search: "audit AND tax"
      const conjRes = await client.search("audit AND tax");
      assert.ok(conjRes.verified);
      assert.equal(conjRes.results.length, 1);
      assert.equal(conjRes.results[0].docId, "doc_audit_2026.pdf");

      // 7. Boolean Disjunction search: "tax OR payroll"
      const disjRes = await client.search("tax OR payroll");
      assert.ok(disjRes.verified);
      const disjIds = disjRes.results.map((r) => r.docId).sort();
      // "tax" matches doc1 and doc2, "payroll" matches doc3
      assert.deepEqual(disjIds, [
        "doc_audit_2026.pdf",
        "doc_hr_payroll.docx",
        "doc_tax_q3.pdf",
      ]);

      // 8. Boolean Negation search: "tax AND NOT audit"
      const negRes = await client.search("tax AND NOT audit");
      assert.ok(negRes.verified);
      // "tax" is in doc1 and doc2, "audit" is in doc1 -> doc2 survives!
      assert.equal(negRes.results.length, 1);
      assert.equal(negRes.results[0].docId, "doc_tax_q3.pdf");

      // 9. Attacker Tamper Defense: simulate cloud dropping a document
      const tamperReport = await client.simulateCloudTamper("drop", "audit");
      assert.equal(tamperReport.isValid, false);
      assert.equal(tamperReport.errorCode, "DROPPED_RECORDS");

      // 10. Audit Chain Verification
      const auditReport = await client.verifyAuditChain();
      assert.ok(auditReport.isChainValid);
      assert.ok(auditReport.totalEntries >= 4);
    } finally {
      await app.close();
    }
  });
});
