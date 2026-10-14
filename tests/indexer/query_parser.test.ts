import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseSearchQuery,
  pruneFalsePositiveCandidates,
} from "../../src/indexer/query_parser.ts";

describe("Substring Query Parser & Candidate Pruner (query_parser.ts)", () => {
  it("Short query (< 3 chars) is classified as EXACT_WORD", () => {
    const parsed = parseSearchQuery("ai", 3);
    assert.equal(parsed.queryType, "EXACT_WORD");
    assert.deepEqual(parsed.requiredTokens, ["ai"]);
  });

  it("Query >= 3 characters is decomposed into sorted overlapping 3-grams", () => {
    const parsed = parseSearchQuery("audit", 3);
    assert.equal(parsed.queryType, "SUBSTRING_CONJUNCTIVE");
    assert.deepEqual(parsed.requiredTokens, ["aud", "dit", "udi"]);
  });

  it("Query decomposition scales with length: L - n + 1 trigrams", () => {
    const parsed = parseSearchQuery("security", 3);
    // "security" has 8 letters -> 8 - 3 + 1 = 6 trigrams: "sec", "ecu", "cur", "uri", "rit", "ity"
    assert.equal(parsed.queryType, "SUBSTRING_CONJUNCTIVE");
    assert.equal(parsed.requiredTokens.length, 6);
    assert.ok(parsed.requiredTokens.includes("sec"));
    assert.ok(parsed.requiredTokens.includes("ity"));
  });

  it("pruneFalsePositiveCandidates retains genuine matches and eliminates false positives", () => {
    const query = "audit";
    const candidates = [
      { id: "doc1", content: "The quarterly financial audit completed successfully." }, // True positive
      { id: "doc2", content: "Auditor reviewed company tax liabilities." },              // True positive ("audit" inside "auditor")
      { id: "doc3", content: "An applaud for the credit." },                             // False positive (has "aud" & "dit", but not "audit")
      { id: "doc4", content: "Completely unrelated engineering documents." },            // True negative
    ];

    const verified = pruneFalsePositiveCandidates(query, candidates);
    assert.deepEqual(verified, ["doc1", "doc2"]);
  });

  it("pruneFalsePositiveCandidates normalizes casing and whitespace", () => {
    const query = "financial report";
    const candidates = [
      { id: "docA", content: "Reviewing the FINANCIAL\nREPORT for 2026." },
      { id: "docB", content: "Financial statements only." },
    ];

    const verified = pruneFalsePositiveCandidates(query, candidates);
    assert.deepEqual(verified, ["docA"]);
  });
});
