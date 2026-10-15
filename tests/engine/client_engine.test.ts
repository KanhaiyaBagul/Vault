import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveVaultSubkeysFromPassword, generateSalt } from "../../src/crypto/kdf.ts";
import { StateManager } from "../../src/engine/state_manager.ts";
import { ServerBlindStore } from "../../src/engine/server_store.ts";
import { buildBlindIndexEntries } from "../../src/engine/blind_index.ts";
import {
  generateSearchQueryPayload,
  resolveSearchResults,
  executeClientSearch,
} from "../../src/engine/client_engine.ts";

describe("Client SSE Engine (client_engine.ts)", async () => {
  const salt = generateSalt(16);
  const subkeys = await deriveVaultSubkeysFromPassword("ClientEngineTest2026!", salt, 10_000);

  it("generateSearchQueryPayload constructs EXACT_WORD payload for short queries", async () => {
    const sm = new StateManager();
    sm.incrementCount("ai");

    const payload = await generateSearchQueryPayload(subkeys, sm, "ai", 3);
    assert.equal(payload.queryType, "EXACT_WORD");
    assert.equal(payload.tokens.length, 1);
    assert.equal(payload.tokens[0].count, 1);
    assert.equal(payload.tokens[0].addressHexList?.length, 1);
    assert.equal(payload.tokens[0].trapdoorHex.length, 64);
  });

  it("generateSearchQueryPayload constructs SUBSTRING_CONJUNCTIVE payload for queries >= n", async () => {
    const sm = new StateManager();
    // Index 3-grams for "vault" -> "vau", "aul", "ult"
    sm.incrementCount("vau");
    sm.incrementCount("aul");
    sm.incrementCount("ult");

    const payload = await generateSearchQueryPayload(subkeys, sm, "vault", 3);
    assert.equal(payload.queryType, "SUBSTRING_CONJUNCTIVE");
    assert.equal(payload.tokens.length, 3);

    for (const token of payload.tokens) {
      assert.equal(token.count, 1);
      assert.equal(token.addressHexList?.length, 1);
      assert.equal(token.trapdoorHex.length, 64);
    }
  });

  it("executeClientSearch returns empty array early if a required token count is zero", async () => {
    const sm = new StateManager();
    const store = new ServerBlindStore();

    // Query for a term that was never indexed
    const results = await executeClientSearch(subkeys, sm, store, "unindexed_word");
    assert.deepEqual(results, []);
  });

  it("executeClientSearch performs end-to-end client search with false positive pruning", async () => {
    const sm = new StateManager();
    const store = new ServerBlindStore();

    const doc1 = "The quick brown fox jumps over the lazy dog";
    const doc2 = "A brown box containing confidential financial papers";
    const doc3 = "The fox and the hound";

    const docContents = new Map<string, string>([
      ["doc1.txt", doc1],
      ["doc2.txt", doc2],
      ["doc3.txt", doc3],
    ]);

    // Index all 3-grams and words from doc1, doc2, doc3
    const { extractAllTokens } = await import("../../src/indexer/ngrams.ts");
    const tokens1 = extractAllTokens(doc1, 3);
    const tokens2 = extractAllTokens(doc2, 3);
    const tokens3 = extractAllTokens(doc3, 3);

    const entries1 = await buildBlindIndexEntries(subkeys, sm, "doc1.txt", tokens1);
    const entries2 = await buildBlindIndexEntries(subkeys, sm, "doc2.txt", tokens2);
    const entries3 = await buildBlindIndexEntries(subkeys, sm, "doc3.txt", tokens3);

    store.insertEntries([...entries1, ...entries2, ...entries3]);

    // Search for "fox" -> matches doc1 and doc3
    const foxResults = await executeClientSearch(subkeys, sm, store, "fox", docContents);
    foxResults.sort();
    assert.deepEqual(foxResults, ["doc1.txt", "doc3.txt"]);

    // Search for "financial" -> matches only doc2
    const finResults = await executeClientSearch(subkeys, sm, store, "financial", docContents);
    assert.deepEqual(finResults, ["doc2.txt"]);

    // Search for substring "confid" -> matches doc2
    const confidResults = await executeClientSearch(subkeys, sm, store, "confid", docContents);
    assert.deepEqual(confidResults, ["doc2.txt"]);
  });
});
