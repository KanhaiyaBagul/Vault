/**
 * Vault Server Backend & Zero-Knowledge Audit Logger (Phase 5 Entry Point)
 * Cloud storage REST microservice, encrypted blob store, and hash-chained audit logger.
 * Zero external dependencies.
 */

export {
  EncryptedBlobStore,
  type EncryptedBlobPayload,
} from "./blob_store.ts";

export {
  ZeroKnowledgeAuditLogger,
  computeDetailsHash,
  computeAuditEntryHash,
  type AuditOperationType,
  type AuditLogEntry,
  type AuditVerificationReport,
} from "./audit_logger.ts";

export { ServerSearchController } from "./search_controller.ts";

export {
  VaultServerApp,
  type VaultServerOptions,
} from "./server_app.ts";
