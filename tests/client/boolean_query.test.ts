import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateBooleanResults,
  parseBooleanQuery,
} from "../../src/client/boolean_query.ts";

describe("Boolean Query Evaluator (boolean_query.ts)", () => {
  it("parseBooleanQuery correctly classifies operators and extracts sub-clauses", () => {
    // Single term
    const q1 = parseBooleanQuery("financial");
    assert.equal(q1.operator, "TERM");
    assert.deepEqual(q1.clauses, ["financial"]);

    // Conjunction
    const q2 = parseBooleanQuery("audit AND compliance AND tax");
    assert.equal(q2.operator, "AND");
    assert.deepEqual(q2.clauses, ["audit", "compliance", "tax"]);

    // Disjunction
    const q3 = parseBooleanQuery("payroll OR executive");
    assert.equal(q3.operator, "OR");
    assert.deepEqual(q3.clauses, ["payroll", "executive"]);

    // Qualified Negation
    const q4 = parseBooleanQuery("audit AND NOT draft");
    assert.equal(q4.operator, "AND_NOT");
    assert.deepEqual(q4.clauses, ["audit", "draft"]);
  });

  it("evaluateBooleanResults computes set intersection for AND", () => {
    const clauseResults = [
      { clause: "audit", docIds: new Set(["doc1.pdf", "doc2.pdf", "doc3.pdf"]) },
      { clause: "tax", docIds: new Set(["doc2.pdf", "doc3.pdf", "doc4.pdf"]) },
      { clause: "finance", docIds: new Set(["doc3.pdf", "doc5.pdf"]) },
    ];

    const results = evaluateBooleanResults("AND", clauseResults);
    // Only doc3 is in all three
    assert.deepEqual(results, ["doc3.pdf"]);
  });

  it("evaluateBooleanResults computes set union for OR", () => {
    const clauseResults = [
      { clause: "payroll", docIds: new Set(["docA.txt"]) },
      { clause: "executive", docIds: new Set(["docB.txt", "docC.txt"]) },
    ];

    const results = evaluateBooleanResults("OR", clauseResults);
    assert.deepEqual(results, ["docA.txt", "docB.txt", "docC.txt"]);
  });

  it("evaluateBooleanResults computes set difference for AND_NOT", () => {
    const clauseResults = [
      { clause: "audit", docIds: new Set(["doc1.pdf", "doc2.pdf", "doc3.pdf"]) },
      { clause: "draft", docIds: new Set(["doc2.pdf"]) },
    ];

    const results = evaluateBooleanResults("AND_NOT", clauseResults);
    assert.deepEqual(results, ["doc1.pdf", "doc3.pdf"]);
  });
});
