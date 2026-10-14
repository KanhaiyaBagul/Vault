import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractAllTokens, generateNgrams } from "../../src/indexer/ngrams.ts";

describe("N-Gram Sliding Window Engine (ngrams.ts)", () => {
  it("generateNgrams creates correct 3-grams for single word", () => {
    const ngrams = generateNgrams("vault", 3);
    assert.deepEqual(ngrams, ["aul", "ult", "vau"]); // Sorted alphabetically: "aul", "ult", "vau"
  });

  it("generateNgrams handles multi-word sentences and deduplicates", () => {
    const text = "Audit the financial auditor";
    const ngrams = generateNgrams(text, 3);

    // "audit" -> "aud", "udi", "dit"
    // "auditor" -> "aud", "udi", "dit", "ito", "tor"
    assert.ok(ngrams.includes("aud"));
    assert.ok(ngrams.includes("udi"));
    assert.ok(ngrams.includes("dit"));
    assert.ok(ngrams.includes("ito"));
    assert.ok(ngrams.includes("tor"));

    // Check no duplicate entries
    const set = new Set(ngrams);
    assert.equal(set.size, ngrams.length);
  });

  it("generateNgrams ignores words shorter than n", () => {
    const text = "go to it";
    const ngrams = generateNgrams(text, 3);
    assert.deepEqual(ngrams, []);
  });

  it("extractAllTokens returns both words and ngrams", () => {
    const text = "crypto cipher";
    const tokens = extractAllTokens(text, 3);

    assert.ok(tokens.words.includes("crypto"));
    assert.ok(tokens.words.includes("cipher"));
    assert.ok(tokens.ngrams.includes("cry"));
    assert.ok(tokens.ngrams.includes("ryp"));
    assert.ok(tokens.ngrams.includes("cip"));
    assert.ok(tokens.allTokens.length >= tokens.words.length + tokens.ngrams.length - 2);
  });
});
