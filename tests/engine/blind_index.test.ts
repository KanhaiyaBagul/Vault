import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deriveVaultSubkeysFromPassword, generateSalt } from "../../src/crypto/kdf.ts";
import { computeKeywordTrapdoor } from "../../src/crypto/trapdoors.ts";
import { StateManager } from "../../src/engine/state_manager.ts";
import {
  buildBlindIndexEntries,
  computeOpaqueDocRef,
  unmaskAndDecryptDocId,
} from "../../src/engine/blind_index.ts";

describe("Blind Index Record Builder (blind_index.ts)", async () => {
  const salt = generateSalt(16);
  const subkeys = await deriveVaultSubkeysFromPassword("MasterVault2026!", salt, 10_000);

  it("buildBlindIndexEntries produces opaque entries without plaintext leakage", async () => {
    const sm = new StateManager();
    const docId = "confidential_memo_007.pdf";
    const tokens = ["secret", "budget", "finance"];

    const entries = await buildBlindIndexEntries(subkeys, sm, docId, tokens);
    assert.equal(entries.length, 3);

    const json = JSON.stringify(entries);
    // Plaintext document ID or keywords must NEVER appear in the emitted entry payload
    assert.ok(!json.includes(docId));
    assert.ok(!json.includes("secret"));
    assert.ok(!json.includes("budget"));

    for (const entry of entries) {
      assert.equal(entry.addressHex.length, 64); // 256-bit hex
      assert.ok(entry.encryptedValueHex.length > 0);
      assert.equal(entry.opaqueDocRef.length, 64);
    }
  });

  it("unmaskAndDecryptDocId correctly recovers original document ID", async () => {
    const sm = new StateManager();
    const docId = "payroll_q3_report.xlsx";
    const tokens = ["payroll"];

    const entries = await buildBlindIndexEntries(subkeys, sm, docId, tokens);
    assert.equal(entries.length, 1);

    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "payroll");
    const recovered = await unmaskAndDecryptDocId(
      subkeys,
      tag,
      0, // Counter was 0 for first insertion
      entries[0].encryptedValueHex
    );

    assert.equal(recovered, docId);
  });

  it("computeOpaqueDocRef is deterministic for identical document IDs", async () => {
    const ref1 = await computeOpaqueDocRef(subkeys.kAddr, "doc_42");
    const ref2 = await computeOpaqueDocRef(subkeys.kAddr, "doc_42");
    const ref3 = await computeOpaqueDocRef(subkeys.kAddr, "doc_43");

    assert.equal(ref1, ref2);
    assert.notEqual(ref1, ref3);
  });

  it("Tampering with masked payload causes unmasking to throw", async () => {
    const sm = new StateManager();
    const docId = "financial_statement.pdf";
    const entries = await buildBlindIndexEntries(subkeys, sm, docId, ["finance"]);

    const tag = await computeKeywordTrapdoor(subkeys.kTrap, "finance");

    // Corrupt one hex character
    const tamperedHex = "ff" + entries[0].encryptedValueHex.slice(2);

    await assert.rejects(
      () => unmaskAndDecryptDocId(subkeys, tag, 0, tamperedHex),
      /failed|tampered|JSON/
    );
  });
});
