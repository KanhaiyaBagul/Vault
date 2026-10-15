/**
 * Blind Inverted Index & Dynamic Multi-Map Engine (Phase 3 Entry Point)
 * Modernized Searchable Symmetric Encryption (SSE) engine.
 * Zero external dependencies.
 */

export { StateManager } from "./state_manager.ts";

export {
  buildBlindIndexEntries,
  unmaskAndDecryptDocId,
  computeOpaqueDocRef,
  type BlindIndexEntry,
} from "./blind_index.ts";

export {
  ServerBlindStore,
  type EncryptedPostingRecord,
  type SearchTrapdoorToken,
  type SearchQueryPayload,
} from "./server_store.ts";

export {
  generateSearchQueryPayload,
  resolveSearchResults,
  executeClientSearch,
} from "./client_engine.ts";
