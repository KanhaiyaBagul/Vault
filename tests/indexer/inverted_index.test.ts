import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PlaintextInvertedIndex } from "../../src/indexer/inverted_index.ts";

describe("Plaintext Inverted Index Engine (inverted_index.ts)", () => {
  it("addDocument builds inverted postings and forward mapping", () => {
    const index = new PlaintextInvertedIndex();

    index.addDocument("doc1", "Confidential financial audit report.");
    index.addDocument("doc2", "Company tax records and financial balance sheet.");

    assert.equal(index.documentCount, 2);
    assert.ok(index.tokenCount > 0);

    // Exact word postings
    const financialPostings = index.getPostings("financial");
    assert.deepEqual(Array.from(financialPostings).sort(), ["doc1", "doc2"]);

    const auditPostings = index.getPostings("audit");
    assert.deepEqual(Array.from(auditPostings), ["doc1"]);

    // Forward index check
    const doc1Tokens = index.getDocumentTokens("doc1");
    assert.ok(doc1Tokens.has("financial"));
    assert.ok(doc1Tokens.has("audit"));
    assert.ok(doc1Tokens.has("fin")); // 3-gram
  });

  it("searchSubstring executes conjunctive N-gram intersection", () => {
    const index = new PlaintextInvertedIndex();

    index.addDocument("doc1", "Confidential financial audit and tax records.");
    index.addDocument("doc2", "Auditor general review of company accounts.");
    index.addDocument("doc3", "Engineering roadmap and database architecture.");

    // Searching substring "audit"
    // Trigrams: "aud", "udi", "dit"
    // doc1 contains "audit"
    // doc2 contains "auditor" (which has "aud", "udi", "dit")
    // doc3 has none
    const results = index.searchSubstring("audit", 3);
    assert.deepEqual(results, ["doc1", "doc2"]);
  });

  it("searchSubstring returns empty array when no document matches all trigrams", () => {
    const index = new PlaintextInvertedIndex();
    index.addDocument("doc1", "Hello world");
    index.addDocument("doc2", "Sample document");

    const results = index.searchSubstring("cryptography", 3);
    assert.deepEqual(results, []);
  });

  it("removeDocument completely cleans up postings and forward entries", () => {
    const index = new PlaintextInvertedIndex();
    index.addDocument("doc1", "UniqueTokenXYZ sample text.");
    index.addDocument("doc2", "Sample text only.");

    assert.equal(index.getPostings("uniquetokenxyz").size, 1);

    index.removeDocument("doc1");
    assert.equal(index.documentCount, 1);
    assert.equal(index.getPostings("uniquetokenxyz").size, 0);

    // Common tokens still retain doc2
    assert.ok(index.getPostings("sample").has("doc2"));
    assert.ok(!index.getPostings("sample").has("doc1"));
  });

  it("Updating document replaces previous tokens", () => {
    const index = new PlaintextInvertedIndex();
    index.addDocument("doc1", "Initial content alpha");
    assert.ok(index.getPostings("alpha").has("doc1"));

    // Overwrite doc1 with beta
    index.addDocument("doc1", "Updated content beta");
    assert.ok(!index.getPostings("alpha").has("doc1"));
    assert.ok(index.getPostings("beta").has("doc1"));
  });

  it("stats calculates valid metrics", () => {
    const index = new PlaintextInvertedIndex();
    index.addDocument("doc1", "Alpha beta gamma");
    index.addDocument("doc2", "Beta gamma delta");

    const stats = index.stats();
    assert.equal(stats.documentCount, 2);
    assert.ok(stats.uniqueTokenCount > 0);
    assert.ok(stats.totalPostingsCount >= stats.uniqueTokenCount);
    assert.ok(stats.averagePostingsPerToken >= 1);
  });
});
