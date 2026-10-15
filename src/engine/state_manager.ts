/**
 * Client-Side State Manager for Forward-Secure Dynamic SSE
 * Tracks per-token insertion counters Σ[w] = count to enforce forward privacy (DynRH).
 * Zero external dependencies.
 */

import { normalizeText } from "../indexer/tokenizer.ts";

export class StateManager {
  // Mapping of normalized token -> current insertion counter c
  private state = new Map<string, number>();

  /**
   * Retrieves the current count for a given token (defaults to 0 if not yet seen)
   */
  public getCount(token: string): number {
    const normalized = normalizeText(token);
    return this.state.get(normalized) ?? 0;
  }

  /**
   * Increments the count for a token and returns the PRE-INCREMENT counter c.
   * This counter c is used to derive the unique index address L_c for the new insertion.
   * @param token Token to increment
   * @returns The counter c before incrementing (e.g., 0 for first insertion)
   */
  public incrementCount(token: string): number {
    const normalized = normalizeText(token);
    const current = this.state.get(normalized) ?? 0;
    this.state.set(normalized, current + 1);
    return current;
  }

  /**
   * Explicitly sets the counter for a token
   */
  public setCount(token: string, count: number): void {
    if (count < 0) {
      throw new Error("Counter must be a non-negative integer");
    }
    const normalized = normalizeText(token);
    this.state.set(normalized, count);
  }

  /**
   * Returns a list of all indexed tokens currently tracked in the state
   */
  public getAllTokens(): string[] {
    return Array.from(this.state.keys()).sort();
  }

  /**
   * Number of unique tokens tracked
   */
  public get tokenCount(): number {
    return this.state.size;
  }

  /**
   * Serializes the state table into a JSON-compatible record
   */
  public exportState(): Record<string, number> {
    const result: Record<string, number> = {};
    for (const [token, count] of this.state.entries()) {
      result[token] = count;
    }
    return result;
  }

  /**
   * Imports a state table from a JSON-compatible record
   */
  public importState(data: Record<string, number>): void {
    this.state.clear();
    for (const [token, count] of Object.entries(data)) {
      if (typeof count === "number" && count >= 0) {
        this.state.set(normalizeText(token), count);
      }
    }
  }

  /**
   * Clears all state counters
   */
  public clear(): void {
    this.state.clear();
  }
}
