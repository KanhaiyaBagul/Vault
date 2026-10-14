import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as Indexer from "../../src/indexer/index.ts";

describe("Indexer Module Re-Exports (index.ts)", () => {
  it("Exports all core indexing classes and functions", () => {
    assert.equal(typeof Indexer.normalizeText, "function");
    assert.equal(typeof Indexer.extractWords, "function");
    assert.equal(typeof Indexer.generateNgrams, "function");
    assert.equal(typeof Indexer.extractAllTokens, "function");
    assert.equal(typeof Indexer.parseSearchQuery, "function");
    assert.equal(typeof Indexer.pruneFalsePositiveCandidates, "function");
    assert.equal(typeof Indexer.PlaintextInvertedIndex, "function");
  });
});
