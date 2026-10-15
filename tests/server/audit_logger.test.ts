import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ZeroKnowledgeAuditLogger,
  computeAuditEntryHash,
  computeDetailsHash,
} from "../../src/server/audit_logger.ts";

describe("Tamper-Evident Zero-Knowledge Audit Logger (audit_logger.ts)", async () => {
  it("initializes Genesis entry with 64-zero prevHash", async () => {
    const logger = new ZeroKnowledgeAuditLogger();
    await logger.ensureGenesis();

    assert.equal(logger.size(), 1);
    const genesis = logger.getEntry(0)!;
    assert.equal(genesis.index, 0);
    assert.equal(genesis.prevHash, "0".repeat(64));
    assert.equal(genesis.operationType, "SYSTEM_INIT");
    assert.equal(genesis.entryHash.length, 64);

    const report = await logger.verifyAuditChain();
    assert.ok(report.isChainValid);
    assert.equal(report.totalEntries, 1);
  });

  it("appends multiple operations and verifies hash chain integrity", async () => {
    const logger = new ZeroKnowledgeAuditLogger();

    // 1. Index document
    await logger.logOperation("INDEX_DOCUMENT", {
      docRef: "docref_hash_001",
      entryCount: 15,
      sizeBytes: 1024,
    });

    // 2. Search query
    await logger.logOperation("SEARCH_QUERY", {
      queryType: "SUBSTRING_CONJUNCTIVE",
      trapdoors: ["tag1_hex", "tag2_hex"],
      matchCount: 2,
      merkleRootHex: "root_hex_001",
    });

    // 3. Retrieve blob
    await logger.logOperation("RETRIEVE_BLOB", {
      docRef: "docref_hash_001",
    });

    // Genesis + 3 operations = 4 entries
    assert.equal(logger.size(), 4);

    // Verify hash link continuity
    const entries = logger.getEntries();
    for (let i = 1; i < entries.length; i++) {
      assert.equal(entries[i].prevHash, entries[i - 1].entryHash);
      assert.equal(entries[i].index, i);
    }

    const report = await logger.verifyAuditChain();
    assert.ok(report.isChainValid);
    assert.equal(report.totalEntries, 4);
  });

  it("detects tampering when opaqueDetails are modified", async () => {
    const logger = new ZeroKnowledgeAuditLogger();
    await logger.logOperation("INDEX_DOCUMENT", { docRef: "ref_1", count: 5 });
    await logger.logOperation("SEARCH_QUERY", { matchCount: 1 });

    // Attacker modifies details of entry 1
    const entry1 = logger.getEntry(1)!;
    entry1.opaqueDetails = { docRef: "ref_1", count: 999 }; // altered metric

    const report = await logger.verifyAuditChain();
    assert.equal(report.isChainValid, false);
    assert.equal(report.brokenIndex, 1);
    assert.ok(report.reason?.includes("Tampered opaqueDetails"));
  });

  it("detects tampering when prevHash pointer is altered", async () => {
    const logger = new ZeroKnowledgeAuditLogger();
    await logger.logOperation("INDEX_DOCUMENT", { docRef: "ref_1" });
    await logger.logOperation("INDEX_DOCUMENT", { docRef: "ref_2" });

    // Attacker modifies prevHash of entry 2
    const entry2 = logger.getEntry(2)!;
    entry2.prevHash = "a".repeat(64);

    const report = await logger.verifyAuditChain();
    assert.equal(report.isChainValid, false);
    assert.equal(report.brokenIndex, 2);
    assert.ok(report.reason?.includes("Broken hash pointer"));
  });

  it("detects tampering when entryHash is forged", async () => {
    const logger = new ZeroKnowledgeAuditLogger();
    await logger.logOperation("INDEX_DOCUMENT", { docRef: "ref_1" });

    const entry1 = logger.getEntry(1)!;
    entry1.entryHash = "b".repeat(64);

    const report = await logger.verifyAuditChain();
    assert.equal(report.isChainValid, false);
    assert.equal(report.brokenIndex, 1);
    assert.ok(report.reason?.includes("Tampered entryHash"));
  });

  it("zero-knowledge audit inspection: log exposes zero plaintexts", async () => {
    const logger = new ZeroKnowledgeAuditLogger();

    await logger.logOperation("INDEX_DOCUMENT", {
      docRef: "4a2b9f0e1c3d5a7b9e0f2a4b6c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d",
      entryCount: 42,
      addresses: ["1111222233334444", "5555666677778888"],
    });

    await logger.logOperation("SEARCH_QUERY", {
      queryType: "SUBSTRING_CONJUNCTIVE",
      trapdoors: ["aabbccddeeff00112233445566778899"],
      matchCount: 1,
      merkleRootHex: "99887766554433221100ffeeddccbbaa",
    });

    const jsonDump = JSON.stringify(logger.getEntries());

    // Assert zero English keywords or document filenames exist
    const forbiddenWords = ["audit", "payroll", "financial", "secret", "pdf", "docx"];
    for (const w of forbiddenWords) {
      assert.ok(
        !jsonDump.toLowerCase().includes(w),
        `Plaintext term "${w}" must not appear in audit log!`
      );
    }
  });
});
