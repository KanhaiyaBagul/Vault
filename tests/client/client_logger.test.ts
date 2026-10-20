import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ClientSecurityLogger,
  computeEntryHash,
  sanitizeLogDetails,
} from "../../src/client/client_logger.ts";

describe("Client Security & Activity Logger (client_logger.ts)", () => {
  it("initializes Genesis entry with 64-zero prevHash and chains subsequent operations", async () => {
    const logger = new ClientSecurityLogger();
    assert.equal(logger.size(), 0);
    assert.equal(logger.getHeadHash(), "0".repeat(64));

    const e1 = await logger.logEvent(
      "KEY_MANAGEMENT",
      "KEY_DERIVATION",
      { iterations: 100000, saltHex: "aabbcc112233" },
      "SUCCESS"
    );

    assert.equal(e1.seq, 1);
    assert.equal(e1.prevHash, "0".repeat(64));
    assert.equal(e1.entryHash.length, 64);
    assert.equal(logger.getHeadHash(), e1.entryHash);

    const e2 = await logger.logEvent(
      "INGESTION",
      "DOC_ENCRYPTED",
      { sizeBytes: 1024, ivHex: "0102030405060708090a0b0c", tokenCount: 42 },
      "SUCCESS",
      { docRef: "d0c0ref0".repeat(8), docId: "report.pdf" }
    );

    assert.equal(e2.seq, 2);
    assert.equal(e2.prevHash, e1.entryHash);
    assert.equal(logger.size(), 2);

    const report = await logger.verifyLogChain();
    assert.ok(report.isValid);
    assert.equal(report.verifiedCount, 2);
  });

  it("strictly enforces zero plaintext leakage and rejects forbidden fields", () => {
    // 1. Password field rejected
    assert.throws(
      () => sanitizeLogDetails({ password: "MySecretPassword123!" }),
      /Security Violation: Attempted to log forbidden sensitive field 'password'/
    );

    // 2. Plaintext field rejected
    assert.throws(
      () => sanitizeLogDetails({ plaintext: "Confidential financial data" }),
      /Security Violation: Attempted to log forbidden sensitive field 'plaintext'/
    );

    // 3. Raw secret rejected
    assert.throws(
      () => sanitizeLogDetails({ clientSecret: "super-secret-token" }),
      /Security Violation: Attempted to log forbidden sensitive field 'clientSecret'/
    );

    // 4. Excessively long unhashed string (>512 non-hex chars) rejected
    const longString = "This is raw unencrypted text from a document. ".repeat(20);
    assert.throws(
      () => sanitizeLogDetails({ summary: longString }),
      /Security Violation: Field 'summary' contains unhashed plaintext data/
    );

    // 5. Allowed cryptographic telemetry accepted
    const clean = sanitizeLogDetails({
      ivHex: "1234567890abcdef12345678",
      sizeBytes: 4096,
      tokensCount: 55,
      isVerified: true,
      merkleRoot: "a".repeat(64),
    });
    assert.equal(clean.sizeBytes, 4096);
    assert.equal(clean.isVerified, true);
  });

  it("detects tampering when an entry's details are modified", async () => {
    const logger = new ClientSecurityLogger();
    await logger.logEvent("KEY_MANAGEMENT", "KEY_DERIVATION", { iterations: 100000 });
    const e2 = await logger.logEvent("INGESTION", "DOC_ENCRYPTED", { sizeBytes: 2048 });
    await logger.logEvent("SEARCH", "SSE_SEARCH_QUERY", { query: "audit" });

    // Attacker modifies details of entry #2 in memory
    e2.details.sizeBytes = 99999;

    const report = await logger.verifyLogChain();
    assert.equal(report.isValid, false);
    assert.equal(report.tamperedSeq, 2);
    assert.match(report.error || "", /log entry has been tampered with/);
  });

  it("detects tampering when prevHash pointer is altered", async () => {
    const logger = new ClientSecurityLogger();
    await logger.logEvent("KEY_MANAGEMENT", "KEY_DERIVATION", { iterations: 100000 });
    const e2 = await logger.logEvent("INGESTION", "DOC_ENCRYPTED", { sizeBytes: 2048 });

    // Attacker corrupts hash pointer
    e2.prevHash = "f".repeat(64);

    const report = await logger.verifyLogChain();
    assert.equal(report.isValid, false);
    assert.equal(report.tamperedSeq, 2);
    assert.match(report.error || "", /Broken hash chain pointer/);
  });

  it("supports category filtering and log rotation", async () => {
    const logger = new ClientSecurityLogger(5); // max 5 entries

    await logger.logEvent("INGESTION", "DOC_1", { n: 1 });
    await logger.logEvent("SEARCH", "SEARCH_1", { n: 2 });
    await logger.logEvent("INGESTION", "DOC_2", { n: 3 });
    await logger.logEvent("CLOUD", "SWITCH_1", { n: 4 });
    await logger.logEvent("SEARCH", "SEARCH_2", { n: 5 });

    assert.equal(logger.size(), 5);
    assert.equal(logger.getEntries("INGESTION").length, 2);
    assert.equal(logger.getEntries("SEARCH").length, 2);
    assert.equal(logger.getEntries("CLOUD").length, 1);

    // Add 2 more entries to trigger rotation
    await logger.logEvent("SECURITY", "TAMPER_DEFENSE", { n: 6 });
    await logger.logEvent("SEARCH", "SEARCH_3", { n: 7 });

    assert.equal(logger.size(), 5); // Kept within max 5
  });

  it("exports verifiable audit log JSON and supports state export/import", async () => {
    const logger = new ClientSecurityLogger();
    await logger.logEvent("KEY_MANAGEMENT", "KEY_DERIVATION", { iterations: 10000 });
    await logger.logEvent("INGESTION", "DOC_ENCRYPTED", { sizeBytes: 512 });

    const jsonStr = await logger.exportAuditLogJson();
    assert.ok(typeof jsonStr === "string");
    const parsed = JSON.parse(jsonStr);

    assert.equal(parsed.generator, "VAULT W3C WebCrypto Native Client");
    assert.equal(parsed.integrity.isValid, true);
    assert.equal(parsed.integrity.verifiedCount, 2);
    assert.equal(parsed.entries.length, 2);

    // State export and import
    const exportedState = logger.exportState();
    const newLogger = new ClientSecurityLogger();
    newLogger.importState(exportedState);

    assert.equal(newLogger.size(), 2);
    assert.equal(newLogger.getHeadHash(), logger.getHeadHash());
    const newReport = await newLogger.verifyLogChain();
    assert.ok(newReport.isValid);
  });
});
