import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { extractWords, normalizeText } from "../../src/indexer/tokenizer.ts";

describe("Text Tokenizer (tokenizer.ts)", () => {
  it("normalizeText converts casing and cleans whitespace", () => {
    const raw = "  Confidential\tFinancial   REPORT \n\r #2026!  ";
    const normalized = normalizeText(raw);
    assert.equal(normalized, "confidential financial report #2026!");
  });

  it("extractWords extracts alphanumeric tokens and strips punctuation", () => {
    const raw = "Enterprise financial-audit & tax_records: $1,000,000 for Q3-2026!";
    const words = extractWords(raw, 2);

    assert.ok(words.includes("enterprise"));
    assert.ok(words.includes("financial-audit"));
    assert.ok(words.includes("tax_records"));
    assert.ok(words.includes("q3-2026"));
  });

  it("extractWords filters out single-character noise when minLength is 2", () => {
    const raw = "a big cat in a hat";
    const words = extractWords(raw, 2);
    assert.deepEqual(words, ["big", "cat", "hat", "in"]);
  });

  it("Handles empty, null-like, or whitespace-only inputs gracefully", () => {
    assert.deepEqual(extractWords(""), []);
    assert.deepEqual(extractWords("   \t\n   "), []);
    assert.equal(normalizeText(""), "");
  });
});
