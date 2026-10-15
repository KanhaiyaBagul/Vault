import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveVaultSubkeysFromPassword, generateSalt } from "../../src/crypto/kdf.ts";
import { extractAllTokens } from "../../src/indexer/ngrams.ts";
import { StateManager } from "../../src/engine/state_manager.ts";
import { ServerBlindStore } from "../../src/engine/server_store.ts";
import { buildBlindIndexEntries } from "../../src/engine/blind_index.ts";
import {
  executeClientSearch,
  generateSearchQueryPayload,
} from "../../src/engine/client_engine.ts";

describe("End-to-End Blind SSE Search & Forward Privacy (e2e_search.test.ts)", async () => {
  const salt = generateSalt(16);
  const subkeys = await deriveVaultSubkeysFromPassword("EnterpriseVaultKey2026!", salt, 10_000);

  const corpus: Record<string, string> = {
    "doc_audit_q1.pdf": "Internal Audit Report Q1: Financial compliance and balance sheet verification.",
    "doc_tax_filing.pdf": "Annual Corporate Tax Filing: Auditing expenses, revenue, and deductions.",
    "doc_engineering_spec.pdf": "Verifiable SSE Architecture: Cryptographic trapdoors, HMAC-SHA256, and AES-GCM cipher.",
    "doc_hr_payroll.docx": "HR Department Payroll: Executive compensation, salary bands, and benefits.",
    "doc_security_advisory.txt": "Security Advisory: Vulnerability assessment of legacy cryptographic implementations.",
  };

  const docLookup = new Map<string, string>(Object.entries(corpus));

  it("indexes corpus and executes exact keyword search over ciphertext", async () => {
    const sm = new StateManager();
    const serverStore = new ServerBlindStore();

    // 1. Client indexes all 5 documents
    for (const [docId, text] of Object.entries(corpus)) {
      const tokens = extractAllTokens(text, 3);
      const entries = await buildBlindIndexEntries(subkeys, sm, docId, tokens);
      serverStore.insertEntries(entries);
    }

    assert.ok(serverStore.size() > 50, "Server store should contain blind index entries");

    // 2. Exact keyword query for 'payroll'
    const payrollResults = await executeClientSearch(subkeys, sm, serverStore, "payroll", docLookup);
    assert.deepEqual(payrollResults, ["doc_hr_payroll.docx"]);

    // 3. Exact keyword query for 'vulnerability'
    const vulnResults = await executeClientSearch(subkeys, sm, serverStore, "vulnerability", docLookup);
    assert.deepEqual(vulnResults, ["doc_security_advisory.txt"]);
  });

  it("executes substring search over ciphertext via conjunctive 3-grams", async () => {
    const sm = new StateManager();
    const serverStore = new ServerBlindStore();

    for (const [docId, text] of Object.entries(corpus)) {
      const tokens = extractAllTokens(text, 3);
      const entries = await buildBlindIndexEntries(subkeys, sm, docId, tokens);
      serverStore.insertEntries(entries);
    }

    // Substring query: 'audit'
    // Matches 'doc_audit_q1.pdf' (contains 'Audit') and 'doc_tax_filing.pdf' (contains 'Auditing')
    const auditResults = await executeClientSearch(subkeys, sm, serverStore, "audit", docLookup);
    auditResults.sort();
    assert.deepEqual(auditResults, ["doc_audit_q1.pdf", "doc_tax_filing.pdf"]);

    // Substring query: 'crypto'
    // Matches 'doc_engineering_spec.pdf' (Cryptographic) and 'doc_security_advisory.txt' (cryptographic)
    const cryptoResults = await executeClientSearch(subkeys, sm, serverStore, "crypto", docLookup);
    cryptoResults.sort();
    assert.deepEqual(cryptoResults, ["doc_engineering_spec.pdf", "doc_security_advisory.txt"]);
  });

  it("verifies DynRH forward privacy: new uploads are unlinkable to past queries", async () => {
    const sm = new StateManager();
    const serverStore = new ServerBlindStore();

    // 1. Initial indexing of doc1 (audit q1)
    const tokensQ1 = extractAllTokens(corpus["doc_audit_q1.pdf"], 3);
    const entriesQ1 = await buildBlindIndexEntries(subkeys, sm, "doc_audit_q1.pdf", tokensQ1);
    serverStore.insertEntries(entriesQ1);

    // 2. Client executes search query for 'audit'
    const pastQueryPayload = await generateSearchQueryPayload(subkeys, sm, "audit", 3);
    // Server evaluates query and finds doc_audit_q1.pdf
    const initialMatches = await serverStore.searchConjunctiveTrapdoors(subkeys.kAddr, pastQueryPayload.tokens);
    assert.equal(initialMatches.length, 1);

    // 3. Later: Client uploads a brand new document doc_audit_q2.pdf
    const docQ2 = "doc_audit_q2.pdf";
    const contentQ2 = "Internal Audit Report Q2: Supplementary auditing findings.";
    const tokensQ2 = extractAllTokens(contentQ2, 3);
    const entriesQ2 = await buildBlindIndexEntries(subkeys, sm, docQ2, tokensQ2);
    serverStore.insertEntries(entriesQ2);

    // 4. FORWARD PRIVACY PROOF:
    // The server using the OLD / PAST search trapdoors MUST NOT find the new document!
    // The past query tokens only covered counter index 0.
    const staleMatches = await serverStore.searchConjunctiveTrapdoors(subkeys.kAddr, pastQueryPayload.tokens);
    assert.equal(staleMatches.length, 1, "Stale trapdoor must not match newly added document");

    // 5. When the client issues a FRESH search query, the counter includes the new upload
    const updatedLookup = new Map(docLookup);
    updatedLookup.set(docQ2, contentQ2);

    const freshResults = await executeClientSearch(subkeys, sm, serverStore, "audit", updatedLookup);
    freshResults.sort();
    assert.deepEqual(freshResults, ["doc_audit_q1.pdf", "doc_audit_q2.pdf"]);
  });

  it("response-hiding zero leakage test: server store contains zero plaintext words or filenames", async () => {
    const sm = new StateManager();
    const serverStore = new ServerBlindStore();

    for (const [docId, text] of Object.entries(corpus)) {
      const tokens = extractAllTokens(text, 3);
      const entries = await buildBlindIndexEntries(subkeys, sm, docId, tokens);
      serverStore.insertEntries(entries);
    }

    // Dump all stored entries as raw JSON to simulate an untrusted cloud server or attacker memory dump
    const storeSnapshot: unknown[] = [];
    // Access internal entries by precomputed search or inspection
    const { computeIndexAddress, computeKeywordTrapdoor } = await import("../../src/crypto/trapdoors.ts");

    for (const token of sm.getAllTokens()) {
      const tag = await computeKeywordTrapdoor(subkeys.kTrap, token);
      const count = sm.getCount(token);
      for (let i = 0; i < count; i++) {
        const addr = await computeIndexAddress(subkeys.kAddr, tag, i);
        const record = serverStore.searchByAddresses([addr]);
        if (record.length > 0) {
          storeSnapshot.push(record[0]);
        }
      }
    }

    const rawDump = JSON.stringify(storeSnapshot);

    // Assert that NO sensitive keywords, terms, or document filenames exist anywhere in the dump
    const sensitiveTerms = [
      "audit", "financial", "compliance", "tax", "expenses",
      "architecture", "payroll", "executive", "vulnerability",
      "doc_audit_q1.pdf", "doc_tax_filing.pdf", "doc_engineering_spec.pdf",
      "doc_hr_payroll.docx", "doc_security_advisory.txt"
    ];

    for (const term of sensitiveTerms) {
      assert.ok(
        !rawDump.toLowerCase().includes(term.toLowerCase()),
        `Leaked plaintext term "${term}" in server store!`
      );
    }
  });
});
