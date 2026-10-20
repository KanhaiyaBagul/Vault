/**
 * Vault Client Encrypted Storage Manager
 * Zero-plaintext-at-rest persistence for client document inventory,
 * keyword counters, Merkle commitments, and client audit logs.
 * 
 * Uses authenticated AES-256-GCM encryption with K_enc before saving
 * to browser localStorage or disk.
 * If the vault is locked or browser storage is inspected, only opaque
 * ciphertext (IV + ciphertext bytes) is present.
 */

import {
  decryptString,
  encryptPayload,
  type SerializedEncryptedBlob,
} from "../crypto/cipher.ts";
import { bytesToHex, hexToBytes, utf8Decode, utf8Encode } from "../crypto/utils.ts";

export interface IngestedDocumentMeta {
  docId: string;
  docRef: string;
  sizeBytes: number;
  tokenCount: number;
  uploadedAt: number;
  provider: string;
}

export interface ClientPersistedVaultState {
  version: number;
  savedAt: number;
  documents: IngestedDocumentMeta[];
  keywordCounters: Record<string, number>;
  authCommitments: Record<
    string,
    {
      tokenNormalized: string;
      count: number;
      rootHashHex: string;
      commitmentHex: string;
    }
  >;
  logs?: {
    entries: any[];
    latestHash: string;
  };
}

export const STORAGE_KEY_DEFAULT = "vault_client_encrypted_state";

export class ClientVaultStorage {
  private readonly storageKey: string;
  private readonly storageProvider: Storage | { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void };

  constructor(
    storageKey = STORAGE_KEY_DEFAULT,
    storageProvider?: Storage | { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }
  ) {
    this.storageKey = storageKey;
    if (storageProvider) {
      this.storageProvider = storageProvider;
    } else if (typeof localStorage !== "undefined") {
      this.storageProvider = localStorage;
    } else {
      // In-memory mock storage fallback for headless Node.js tests
      const map = new Map<string, string>();
      this.storageProvider = {
        getItem: (k: string) => map.get(k) || null,
        setItem: (k: string, v: string) => map.set(k, v),
        removeItem: (k: string) => map.delete(k),
      };
    }
  }

  /**
   * Checks whether encrypted vault state exists in storage.
   */
  public hasSavedState(): boolean {
    const raw = this.storageProvider.getItem(this.storageKey);
    return Boolean(raw && raw.trim().length > 0);
  }

  /**
   * Encrypts and saves client vault state using authenticated AES-256-GCM.
   *
   * @param kEnc AES-256-GCM encryption key derived in client enclave
   * @param state State object to serialize and encrypt
   */
  public async saveEncryptedState(
    kEnc: CryptoKey,
    state: Omit<ClientPersistedVaultState, "version" | "savedAt">
  ): Promise<SerializedEncryptedBlob> {
    const payload: ClientPersistedVaultState = {
      version: 1,
      savedAt: Date.now(),
      documents: state.documents,
      keywordCounters: state.keywordCounters,
      authCommitments: state.authCommitments,
      logs: state.logs,
    };

    const jsonStr = JSON.stringify(payload);
    const plaintextBytes = utf8Encode(jsonStr);

    const blob = await encryptPayload(kEnc, plaintextBytes);
    const serialized: SerializedEncryptedBlob = {
      ivHex: bytesToHex(blob.iv),
      ciphertextHex: bytesToHex(blob.ciphertext),
    };

    const envelope = {
      version: 1,
      savedAt: payload.savedAt,
      encryptedBlob: serialized,
    };

    this.storageProvider.setItem(this.storageKey, JSON.stringify(envelope));
    return serialized;
  }

  /**
   * Decrypts and restores client vault state using authenticated AES-256-GCM.
   *
   * @param kEnc AES-256-GCM encryption key derived in client enclave
   * @returns Deserialized state or null if no state exists
   * @throws Error if ciphertext has been tampered with or key is wrong
   */
  public async loadEncryptedState(
    kEnc: CryptoKey
  ): Promise<ClientPersistedVaultState | null> {
    const raw = this.storageProvider.getItem(this.storageKey);
    if (!raw) return null;

    let envelope: {
      version: number;
      savedAt: number;
      encryptedBlob: SerializedEncryptedBlob;
    };

    try {
      envelope = JSON.parse(raw);
    } catch {
      throw new Error("Corrupted vault storage: JSON parsing error");
    }

    if (!envelope.encryptedBlob?.ivHex || !envelope.encryptedBlob?.ciphertextHex) {
      throw new Error("Invalid vault storage envelope: missing encryptedBlob");
    }

    const jsonStr = await decryptString(kEnc, envelope.encryptedBlob);
    const state: ClientPersistedVaultState = JSON.parse(jsonStr);

    return state;
  }

  /**
   * Purges persistent encrypted client state.
   */
  public clear(): void {
    this.storageProvider.removeItem(this.storageKey);
  }
}
