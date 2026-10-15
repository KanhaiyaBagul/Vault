import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { StateManager } from "../../src/engine/state_manager.ts";

describe("State Manager (state_manager.ts)", () => {
  it("incrementCount returns pre-increment count and updates state", () => {
    const sm = new StateManager();

    assert.equal(sm.getCount("crypto"), 0);

    const c0 = sm.incrementCount("crypto");
    assert.equal(c0, 0);
    assert.equal(sm.getCount("crypto"), 1);

    const c1 = sm.incrementCount("crypto");
    assert.equal(c1, 1);
    assert.equal(sm.getCount("crypto"), 2);

    const c2 = sm.incrementCount("crypto");
    assert.equal(c2, 2);
    assert.equal(sm.getCount("crypto"), 3);
  });

  it("Normalizes token casing and whitespace automatically", () => {
    const sm = new StateManager();

    sm.incrementCount("  Financial-Report ");
    assert.equal(sm.getCount("financial-report"), 1);
    assert.equal(sm.getCount("FINANCIAL-REPORT"), 1);
  });

  it("exportState and importState preserve full counter table", () => {
    const sm1 = new StateManager();
    sm1.incrementCount("alpha");
    sm1.incrementCount("alpha");
    sm1.incrementCount("beta");

    const exported = sm1.exportState();
    assert.deepEqual(exported, { alpha: 2, beta: 1 });

    const sm2 = new StateManager();
    sm2.importState(exported);

    assert.equal(sm2.getCount("alpha"), 2);
    assert.equal(sm2.getCount("beta"), 1);
    assert.equal(sm2.getCount("gamma"), 0);
  });

  it("getAllTokens returns sorted unique tokens", () => {
    const sm = new StateManager();
    sm.incrementCount("zebra");
    sm.incrementCount("apple");
    sm.incrementCount("mango");

    assert.deepEqual(sm.getAllTokens(), ["apple", "mango", "zebra"]);
    assert.equal(sm.tokenCount, 3);
  });
});
