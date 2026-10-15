import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveVaultSubkeysFromPassword, generateSalt } from "../../src/crypto/kdf.ts";
import { computeKeywordTrapdoor } from "../../src/crypto/trapdoors.ts";
import { StateManager } from "../../src/engine/state_manager.ts";
import { buildBlindIndexEntries, unmaskAndDecryptDocId } from "../../src/engine/blind_index.ts";
import { ServerBlindStore, type SearchTrapdoorToken } from "../../src/engine/server_store.ts";

describe("Server Blind Multi-Map Store (server_store.ts)", async () => {
  const salt = generateSalt(16);
  const subkeys = await deriveVaultSubkeysFromPassword("ServerStoreSecret2026!", salt, 10_000);

  it("insertEntries stores records and reports correct size", async () => {
    const store = new ServerBlindStore();
    const sm = new StateManager();

    const entries1 = await buildBlindIndexEntries(subkeys, sm, "docA.txt", ["finance", "audit"]);
    const entries2 = await buildBlindIndexEntries(subkeys, sm, "docB.txt", ["finance", "tax"]);

    store.insertEntries(entries1);
    store.insertEntries(entries2);

    // docA had 2 tokens, docB had 2 tokens -> 4 entries
    assert.equal(store.size(), 4);
  });

  it("searchSingleTrapdoor retrieves all postings for a keyword", async () => {
    const store = new ServerBlindStore();
    const sm = new StateManager();

    const entries1 = await buildBlindIndexEntries(subkeys, sm, "doc1.pdf", ["cybersecurity", "encryption"]);
    const entries2 = await buildBlindIndexEntries(subkeys, sm, "doc2.pdf", ["cybersecurity", "firewall"]);
    const entries3 = await buildBlindIndexEntries(subkeys, sm, "doc3.pdf", ["marketing", "sales"]);

    store.insertEntries([...entries1, ...entries2, ...entries3]);

    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "cybersecurity");
    const count = sm.getCount("cybersecurity");
    assert.equal(count, 2);

    const records = await store.searchSingleTrapdoor(subkeys.kAddr, tag, count);
    assert.equal(records.length, 2);

    // Decrypt and verify recovered document IDs
    const docIds: string[] = [];
    for (const record of records) {
      const docId = await unmaskAndDecryptDocId(subkeys, tag, record.counterIndex, record.encryptedValueHex);
      docIds.push(docId);
    }
    docIds.sort();
    assert.deepEqual(docIds, ["doc1.pdf", "doc2.pdf"]);
  });

  it("searchConjunctiveTrapdoors computes set intersection over opaqueDocRef", async () => {
    const store = new ServerBlindStore();
    const sm = new StateManager();

    // docA has both "quantum" and "cryptography"
    const entriesA = await buildBlindIndexEntries(subkeys, sm, "docA.pdf", ["quantum", "cryptography"]);
    // docB has only "quantum"
    const entriesB = await buildBlindIndexEntries(subkeys, sm, "docB.pdf", ["quantum", "physics"]);
    // docC has only "cryptography"
    const entriesC = await buildBlindIndexEntries(subkeys, sm, "docC.pdf", ["classical", "cryptography"]);

    store.insertEntries([...entriesA, ...entriesB, ...entriesC]);

    const tagQuantum = await computeKeywordTrapdoor(subkeys.kTrap, "quantum");
    const tagCrypto = await computeKeywordTrapdoor(subkeys.kTrap, "cryptography");

    const tokens: SearchTrapdoorToken[] = [
      {
        trapdoorHex: "tagQuantumHex",
        trapdoorBytes: tagQuantum,
        count: sm.getCount("quantum"),
      },
      {
        trapdoorHex: "tagCryptoHex",
        trapdoorBytes: tagCrypto,
        count: sm.getCount("cryptography"),
      },
    ];

    const results = await store.searchConjunctiveTrapdoors(subkeys.kAddr, tokens);
    // Only docA matches both tokens!
    assert.equal(results.length, 1);

    const docId = await unmaskAndDecryptDocId(
      subkeys,
      tagQuantum,
      results[0].counterIndex,
      results[0].encryptedValueHex
    );
    assert.equal(docId, "docA.pdf");
  });

  it("searchConjunctiveTrapdoors returns empty array when intersection is disjoint", async () => {
    const store = new ServerBlindStore();
    const sm = new StateManager();

    const entriesA = await buildBlindIndexEntries(subkeys, sm, "docA.pdf", ["alpha"]);
    const entriesB = await buildBlindIndexEntries(subkeys, sm, "docB.pdf", ["beta"]);
    store.insertEntries([...entriesA, ...entriesB]);

    const tagAlpha = await computeKeywordTrapdoor(subkeys.kTrap, "alpha");
    const tagBeta = await computeKeywordTrapdoor(subkeys.kTrap, "beta");

    const tokens: SearchTrapdoorToken[] = [
      { trapdoorHex: "", trapdoorBytes: tagAlpha, count: sm.getCount("alpha") },
      { trapdoorHex: "", trapdoorBytes: tagBeta, count: sm.getCount("beta") },
    ];

    const results = await store.searchConjunctiveTrapdoors(subkeys.kAddr, tokens);
    assert.equal(results.length, 0);
  });

  it("searchConjunctiveByAddresses performs zero-crypto intersection using client precomputed addresses", async () => {
    const store = new ServerBlindStore();
    const sm = new StateManager();

    const entriesA = await buildBlindIndexEntries(subkeys, sm, "docA.pdf", ["sec", "ecu", "cur"]);
    const entriesB = await buildBlindIndexEntries(subkeys, sm, "docB.pdf", ["sec", "ecu"]);
    store.insertEntries([...entriesA, ...entriesB]);

    // Build precomputed address lists for each 3-gram
    const trigrams = ["sec", "ecu", "cur"];
    const addressLists: string[][] = [];

    for (const tri of trigrams) {
      const tag = await computeKeywordTrapdoor(subkeys.kTrap, tri);
      const count = sm.getCount(tri);
      const list: string[] = [];
      for (let i = 0; i < count; i++) {
        // compute address
        const { computeIndexAddress } = await import("../../src/crypto/trapdoors.ts");
        const addr = await computeIndexAddress(subkeys.kAddr, tag, i);
        list.push(addr);
      }
      addressLists.push(list);
    }

    const results = store.searchConjunctiveByAddresses(addressLists);
    assert.equal(results.length, 1);

    const tagSec = await computeKeywordTrapdoor(subkeys.kTrap, "sec");
    const docId = await unmaskAndDecryptDocId(
      subkeys,
      tagSec,
      results[0].counterIndex,
      results[0].encryptedValueHex
    );
    assert.equal(docId, "docA.pdf");
  });
});
