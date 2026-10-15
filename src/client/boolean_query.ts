/**
 * Boolean Query Evaluator (Kamara-Moataz IEX Formulation)
 * Decomposes complex user search queries into boolean clauses
 * (AND, OR, AND NOT) and computes set operations over verified candidate document references.
 * Zero external dependencies.
 */

export type BooleanOperator = "AND" | "OR" | "AND_NOT" | "TERM";

export interface ParsedBooleanQuery {
  rawQuery: string;
  operator: BooleanOperator;
  clauses: string[]; // Plaintext sub-queries
}

/**
 * Parses user input into a Boolean query clause structure.
 * Supports:
 * - Conjunction: "termA AND termB AND termC"
 * - Disjunction: "termA OR termB"
 * - Qualified Negation: "termA AND NOT termB"
 * - Single term or substring: "termA"
 */
export function parseBooleanQuery(rawQuery: string): ParsedBooleanQuery {
  const trimmed = rawQuery.trim();
  if (!trimmed) {
    return {
      rawQuery,
      operator: "TERM",
      clauses: [],
    };
  }

  // 1. Check for qualified negation: "termA AND NOT termB"
  if (trimmed.toUpperCase().includes(" AND NOT ")) {
    const parts = trimmed.split(/ AND NOT /i).map((p) => p.trim()).filter(Boolean);
    if (parts.length === 2) {
      return {
        rawQuery,
        operator: "AND_NOT",
        clauses: [parts[0], parts[1]],
      };
    }
  }

  // 2. Check for conjunction: "termA AND termB"
  if (trimmed.toUpperCase().includes(" AND ")) {
    const parts = trimmed.split(/ AND /i).map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      return {
        rawQuery,
        operator: "AND",
        clauses: parts,
      };
    }
  }

  // 3. Check for disjunction: "termA OR termB"
  if (trimmed.toUpperCase().includes(" OR ")) {
    const parts = trimmed.split(/ OR /i).map((p) => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      return {
        rawQuery,
        operator: "OR",
        clauses: parts,
      };
    }
  }

  // 4. Default single term / substring
  return {
    rawQuery,
    operator: "TERM",
    clauses: [trimmed],
  };
}

/**
 * Evaluates set operations over verified candidate document references.
 *
 * @param operator BooleanOperator (TERM, AND, OR, AND_NOT)
 * @param clauseResults Map of clause -> Set of document IDs verified for that clause
 */
export function evaluateBooleanResults(
  operator: BooleanOperator,
  clauseResults: Array<{ clause: string; docIds: Set<string> }>
): string[] {
  if (clauseResults.length === 0) {
    return [];
  }

  if (operator === "TERM" || clauseResults.length === 1) {
    return Array.from(clauseResults[0].docIds).sort();
  }

  if (operator === "AND") {
    // Intersect all clause result sets
    let current = new Set(clauseResults[0].docIds);
    for (let i = 1; i < clauseResults.length; i++) {
      const nextSet = new Set<string>();
      for (const id of current) {
        if (clauseResults[i].docIds.has(id)) {
          nextSet.add(id);
        }
      }
      current = nextSet;
      if (current.size === 0) break;
    }
    return Array.from(current).sort();
  }

  if (operator === "OR") {
    // Union all clause result sets
    const unionSet = new Set<string>();
    for (const res of clauseResults) {
      for (const id of res.docIds) {
        unionSet.add(id);
      }
    }
    return Array.from(unionSet).sort();
  }

  if (operator === "AND_NOT") {
    // Difference: clause 0 minus clause 1
    const setA = clauseResults[0]?.docIds ?? new Set();
    const setB = clauseResults[1]?.docIds ?? new Set();

    const diff = new Set<string>();
    for (const id of setA) {
      if (!setB.has(id)) {
        diff.add(id);
      }
    }
    return Array.from(diff).sort();
  }

  return [];
}
