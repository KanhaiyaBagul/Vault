/**
 * Server Search & Prover Controller
 * Coordinates blind multi-map lookups, set intersections, and Merkle proof generation.
 * Zero external dependencies.
 */

import { hexToBytes } from "../crypto/utils.ts";
import type { BlindIndexEntry } from "../engine/blind_index.ts";
import {
  ServerBlindStore,
  type EncryptedPostingRecord,
  type SearchTrapdoorToken,
} from "../engine/server_store.ts";
import {
  buildVerifiableSearchBundle,
  type VerifiableSearchResultBundle,
} from "../verifiability/server_prover.ts";

export class ServerSearchController {
  private readonly blindStore: ServerBlindStore;

  constructor(blindStore: ServerBlindStore) {
    this.blindStore = blindStore;
  }

  /**
   * Bulk inserts blind index records into the server store.
   */
  public indexEntries(entries: BlindIndexEntry[]): void {
    this.blindStore.insertEntries(entries);
  }

  /**
   * Executes a search for one or more trapdoor tokens and returns verifiable search bundles.
   *
   * @param kAddr Dedicated HMAC-SHA256 address key (if client relies on server evaluation)
   * @param queryType "EXACT_WORD" | "SUBSTRING_CONJUNCTIVE"
   * @param tokens Array of SearchTrapdoorTokens
   */
  public async executeSearch(
    kAddr: CryptoKey | undefined,
    queryType: "EXACT_WORD" | "SUBSTRING_CONJUNCTIVE",
    tokens: SearchTrapdoorToken[]
  ): Promise<VerifiableSearchResultBundle[]> {
    if (tokens.length === 0) {
      return [];
    }

    // Normalize tokens: ensure trapdoorBytes is Uint8Array if coming from JSON
    const normalizedTokens: SearchTrapdoorToken[] = tokens.map((t) => ({
      ...t,
      trapdoorBytes:
        t.trapdoorBytes instanceof Uint8Array
          ? t.trapdoorBytes
          : t.trapdoorHex
          ? hexToBytes(t.trapdoorHex)
          : new Uint8Array(),
    }));

    const bundles: VerifiableSearchResultBundle[] = [];

    if (queryType === "EXACT_WORD" || normalizedTokens.length === 1) {
      const token = normalizedTokens[0];
      let records: EncryptedPostingRecord[] = [];

      if (token.addressHexList && token.addressHexList.length > 0) {
        records = this.blindStore.searchByAddresses(token.addressHexList);
      } else if (kAddr) {
        records = await this.blindStore.searchSingleTrapdoor(
          kAddr,
          token.trapdoorBytes,
          token.count
        );
      }

      const bundle = await buildVerifiableSearchBundle(token.trapdoorHex, records);
      bundles.push(bundle);
    } else {
      // Conjunctive query across multiple N-grams
      let intersectingRecords: EncryptedPostingRecord[] = [];

      // Check if all tokens have client-supplied addresses
      const hasAllAddresses = normalizedTokens.every(
        (t) => t.addressHexList && t.addressHexList.length > 0
      );

      if (hasAllAddresses) {
        const addressLists = normalizedTokens.map((t) => t.addressHexList!);
        intersectingRecords = this.blindStore.searchConjunctiveByAddresses(addressLists);
      } else if (kAddr) {
        intersectingRecords = await this.blindStore.searchConjunctiveTrapdoors(kAddr, normalizedTokens);
      }

      // Build primary bundle with surviving intersecting document records
      const primaryToken = normalizedTokens[0];
      const bundle = await buildVerifiableSearchBundle(
        primaryToken.trapdoorHex,
        intersectingRecords
      );
      bundles.push(bundle);
    }

    return bundles;
  }
}
