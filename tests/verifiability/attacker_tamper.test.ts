import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveVaultSubkeysFromPassword, generateSalt } from "../../src/crypto/kdf.ts";
import { computeKeywordTrapdoor } from "../../src/crypto/trapdoors.ts";
import { StateManager } from "../../src/engine/state_manager.ts";
import { ServerBlindStore, type EncryptedPostingRecord } from "../../src/engine/server_store.ts";
import { buildBlindIndexEntries } from "../../src/engine/blind_index.ts";
import {
  AuthenticatedIndexManager,
  buildVerifiableSearchBundle,
  verifySearchResultBundle,
} from "../../src/verifiability/index.ts";

describe("Active Attacker Defense & Tamper Soundness (attacker_tamper.test.ts)", async () => {
  const salt = generateSalt(16);
  const subkeys = await deriveVaultSubkeysFromPassword("VerifiableMaster2026!", salt, 10_000);

  /**
   * Helper: Sets up a realistic scenario where client indexes documents,
   * stores blind entries on untrusted server, and updates client AuthenticatedIndexManager.
   */
  async function setupScenario() {
    const sm = new StateManager();
    const serverStore = new ServerBlindStore();
    const authManager = new AuthenticatedIndexManager();

    const docs = [
      { id: "audit_doc_1.pdf", tokens: ["audit", "finance", "compliance"] },
      { id: "audit_doc_2.pdf", tokens: ["audit", "tax", "risk"] },
      { id: "audit_doc_3.pdf", tokens: ["audit", "legal", "hr"] },
    ];

    // Track postings per token on client during indexing to compute authenticated commitments
    const tokenPostingsMap = new Map<
      string,
      Array<{ addressHex: string; opaqueDocRef: string; counterIndex: number }>
    >();

    for (const doc of docs) {
      const entries = await buildBlindIndexEntries(subkeys, sm, doc.id, doc.tokens);
      serverStore.insertEntries(entries);

      // Record leaf inputs for client commitment
      for (let i = 0; i < doc.tokens.length; i++) {
        const token = doc.tokens[i].toLowerCase();
        const entry = entries[i];
        const counterIndex = sm.getCount(token) - 1;

        if (!tokenPostingsMap.has(token)) {
          tokenPostingsMap.set(token, []);
        }
        tokenPostingsMap.get(token)!.push({
          addressHex: entry.addressHex,
          opaqueDocRef: entry.opaqueDocRef,
          counterIndex,
        });
      }
    }

    // Build client commitments for all tokens
    for (const [token, postings] of tokenPostingsMap.entries()) {
      const tag = await computeKeywordTrapdoor(subkeys.kTrap, token);
      await authManager.updateTokenPostings(subkeys.kAuth, token, tag, postings);
    }

    return { sm, serverStore, authManager };
  }

  it("honest server: search result bundle passes verification with 100% fidelity", async () => {
    const { sm, serverStore, authManager } = await setupScenario();

    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "audit");
    const count = sm.getCount("audit");
    assert.equal(count, 3);

    // Untrusted server retrieves records and builds proof bundle
    const records = await serverStore.searchSingleTrapdoor(subkeys.kAddr, tag, count);
    const bundle = await buildVerifiableSearchBundle("audit", records);

    // Client verifies proof against local commitment
    const commitment = authManager.getCommitment("audit")!;
    assert.ok(commitment, "Commitment must exist for 'audit'");

    const result = await verifySearchResultBundle(subkeys, commitment, bundle);
    assert.ok(result.isValid, "Honest search result must verify");
    assert.equal(result.verifiedRecordCount, 3);
    assert.equal(result.errorCode, undefined);
  });

  it("omission attack: cloud drops 1 document -> client detects DROPPED_RECORDS", async () => {
    const { sm, serverStore, authManager } = await setupScenario();

    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "audit");
    const count = sm.getCount("audit");

    const records = await serverStore.searchSingleTrapdoor(subkeys.kAddr, tag, count);

    // MALICIOUS ATTACK: Cloud suppresses/drops the 3rd document (returns only 2)
    const droppedRecords = [records[0], records[1]];
    const bundle = await buildVerifiableSearchBundle("audit", droppedRecords);

    const commitment = authManager.getCommitment("audit")!;
    const result = await verifySearchResultBundle(subkeys, commitment, bundle);

    // Verification MUST FAIL with DROPPED_RECORDS
    assert.equal(result.isValid, false);
    assert.equal(result.errorCode, "DROPPED_RECORDS");
  });

  it("fabrication attack: cloud injects a forged document -> client detects FABRICATED_RECORDS", async () => {
    const { sm, serverStore, authManager } = await setupScenario();

    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "audit");
    const count = sm.getCount("audit");

    const records = await serverStore.searchSingleTrapdoor(subkeys.kAddr, tag, count);

    // MALICIOUS ATTACK: Cloud injects a forged 4th record
    const forgedRecord: EncryptedPostingRecord = {
      addressHex: "f".repeat(64),
      encryptedValueHex: "deadbeef",
      opaqueDocRef: "bad_doc_pointer",
      counterIndex: 3,
    };
    const inflatedRecords = [...records, forgedRecord];
    const bundle = await buildVerifiableSearchBundle("audit", inflatedRecords);

    const commitment = authManager.getCommitment("audit")!;
    const result = await verifySearchResultBundle(subkeys, commitment, bundle);

    assert.equal(result.isValid, false);
    assert.equal(result.errorCode, "FABRICATED_RECORDS");
  });

  it("modification attack: cloud alters an opaqueDocRef -> client detects ROOT_MISMATCH", async () => {
    const { sm, serverStore, authManager } = await setupScenario();

    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "audit");
    const count = sm.getCount("audit");

    const records = await serverStore.searchSingleTrapdoor(subkeys.kAddr, tag, count);

    // MALICIOUS ATTACK: Cloud tampers with opaqueDocRef of record 1
    const tamperedRecords: EncryptedPostingRecord[] = [
      records[0],
      {
        ...records[1],
        opaqueDocRef: "e".repeat(64), // Altered pointer
      },
      records[2],
    ];

    const bundle = await buildVerifiableSearchBundle("audit", tamperedRecords);
    const commitment = authManager.getCommitment("audit")!;
    const result = await verifySearchResultBundle(subkeys, commitment, bundle);

    assert.equal(result.isValid, false);
    assert.equal(result.errorCode, "ROOT_MISMATCH");
  });

  it("replay attack: cloud returns stale search results from earlier version -> detected", async () => {
    const { sm, serverStore, authManager } = await setupScenario();

    // Take snapshot of bundle when count was 3
    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "audit");
    const oldRecords = await serverStore.searchSingleTrapdoor(subkeys.kAddr, tag, 3);
    const staleBundle = await buildVerifiableSearchBundle("audit", oldRecords);

    // Later: Client indexes a 4th audit document
    const doc4Entries = await buildBlindIndexEntries(subkeys, sm, "audit_doc_4.pdf", ["audit"]);
    serverStore.insertEntries(doc4Entries);

    // Client updates local commitment to count = 4
    const newPostings = [
      ...oldRecords.map((r) => ({
        addressHex: r.addressHex,
        opaqueDocRef: r.opaqueDocRef,
        counterIndex: r.counterIndex,
      })),
      {
        addressHex: doc4Entries[0].addressHex,
        opaqueDocRef: doc4Entries[0].opaqueDocRef,
        counterIndex: 3,
      },
    ];
    await authManager.updateTokenPostings(subkeys.kAuth, "audit", tag, newPostings);

    const updatedCommitment = authManager.getCommitment("audit")!;
    assert.equal(updatedCommitment.count, 4);

    // MALICIOUS ATTACK: Cloud tries to serve the old 3-document bundle from earlier!
    const result = await verifySearchResultBundle(subkeys, updatedCommitment, staleBundle);

    // Caught because count is 3 instead of committed 4!
    assert.equal(result.isValid, false);
    assert.equal(result.errorCode, "DROPPED_RECORDS");
  });

  it("sequence corruption: cloud swaps counterIndex order -> client detects COUNTER_INDEX_CORRUPTED", async () => {
    const { sm, serverStore, authManager } = await setupScenario();

    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "audit");
    const count = sm.getCount("audit");

    const records = await serverStore.searchSingleTrapdoor(subkeys.kAddr, tag, count);

    // MALICIOUS ATTACK: Cloud presents records with out-of-order counterIndex
    const corruptedSequence: EncryptedPostingRecord[] = [
      { ...records[0], counterIndex: 1 },
      { ...records[1], counterIndex: 0 },
      records[2],
    ];

    const bundle: any = {
      tokenNormalized: "audit",
      records: corruptedSequence,
      rootHashHex: "dummy",
      leafHashes: [],
      proofPaths: [],
    };

    const commitment = authManager.getCommitment("audit")!;
    const result = await verifySearchResultBundle(subkeys, commitment, bundle);

    assert.equal(result.isValid, false);
    assert.equal(result.errorCode, "COUNTER_INDEX_CORRUPTED");
  });
});
