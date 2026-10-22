import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  VaultKeys,
  EncryptedDocumentRecord,
  SearchMatchResult,
  deriveVaultKeys,
  encryptPayload,
  decryptPayload,
  extractKeywords,
  buildClientBlindIndexEntries,
} from "../crypto/vault_engine";

export type ViewMode = "workspace" | "cloud" | "audit" | "lab";

export type UploadStep = "idle" | "tokenizing" | "encrypting" | "trapdoors" | "cloud_upload" | "complete";

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "danger" | "info";
}

export interface CloudProfileMasked {
  id: string;
  name: string;
  provider: "supabase" | "s3" | "disk" | "memory";
  config: Record<string, any>;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface VaultContextType {
  // Navigation
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;

  // Enclave / Keys
  isEnclaveReady: boolean;
  keyFingerprint: string;
  keys: VaultKeys | null;
  reinitEnclave: (passphrase: string) => Promise<void>;

  // Documents
  documents: EncryptedDocumentRecord[];
  selectedDocId: string | null;
  selectedDoc: EncryptedDocumentRecord | null;
  selectDocument: (id: string | null) => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  loadSampleCorpus: () => Promise<void>;
  syncCloudDocuments: (targetProfileId?: string) => Promise<void>;
  uploadStep: UploadStep;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearching: boolean;
  searchResults: SearchMatchResult[];
  searchLatency: number | null;
  executeSearch: (overrideQuery?: string) => Promise<void>;

  // Cloud
  profiles: CloudProfileMasked[];
  activeProfile: CloudProfileMasked | null;
  cloudLatency: number | null;
  loadProfiles: () => Promise<string | null>;
  activateProfile: (id: string) => Promise<boolean>;
  saveProfile: (profile: Partial<CloudProfileMasked>) => Promise<{ success: boolean; error?: string }>;
  deleteProfile: (id: string) => Promise<boolean>;
  testProfile: (profile: any) => Promise<{ ok: boolean; latencyMs?: number; error?: string; success?: boolean; health?: any }>;

  // Audit
  serverAuditEntries: any[];
  auditVerified: boolean | null;
  auditDetails: any;
  loadAuditLog: () => Promise<void>;
  verifyAuditChain: () => Promise<void>;

  // Toasts
  toasts: ToastMessage[];
  showToast: (text: string, type?: "success" | "danger" | "info") => void;
  removeToast: (id: string) => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

const LEGACY_STORAGE_KEY = "VAULT_CLIENT_DOCS_STORE_V1";

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ViewMode>("workspace");

  // Enclave
  const [keys, setKeys] = useState<VaultKeys | null>(null);
  const [keyFingerprint, setKeyFingerprint] = useState<string>("Initializing...");
  const [isEnclaveReady, setIsEnclaveReady] = useState(false);

  // Documents
  const [documents, setDocuments] = useState<EncryptedDocumentRecord[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [uploadStep, setUploadStep] = useState<UploadStep>("idle");

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchMatchResult[]>([]);
  const [searchLatency, setSearchLatency] = useState<number | null>(null);

  // Cloud
  const [profiles, setProfiles] = useState<CloudProfileMasked[]>([]);
  const [activeProfile, setActiveProfile] = useState<CloudProfileMasked | null>(null);
  const [cloudLatency, setCloudLatency] = useState<number | null>(null);

  // Audit
  const [serverAuditEntries, setServerAuditEntries] = useState<any[]>([]);
  const [auditVerified, setAuditVerified] = useState<boolean | null>(null);
  const [auditDetails, setAuditDetails] = useState<any>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: "success" | "danger" | "info" = "info") => {
    const id = "toast_" + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 1. Initialize Enclave Keys
  const reinitEnclave = useCallback(async (passphrase: string) => {
    try {
      const { keys: derivedKeys, keyFingerprint: fp } = await deriveVaultKeys(passphrase);
      setKeys(derivedKeys);
      setKeyFingerprint(fp);
      setIsEnclaveReady(true);
      showToast("Hardware Enclave re-keyed successfully", "success");
    } catch (err: any) {
      showToast(`Key derivation failed: ${err.message}`, "danger");
    }
  }, [showToast]);

  useEffect(() => {
    deriveVaultKeys().then(({ keys: derivedKeys, keyFingerprint: fp }) => {
      setKeys(derivedKeys);
      setKeyFingerprint(fp);
      setIsEnclaveReady(true);
    });
  }, []);

  // Helper to persist documents scoped to the active profile
  const persistDocs = useCallback((newDocsOrUpdater: EncryptedDocumentRecord[] | ((prev: EncryptedDocumentRecord[]) => EncryptedDocumentRecord[])) => {
    setDocuments((prev) => {
      const nextDocs = typeof newDocsOrUpdater === "function" ? newDocsOrUpdater(prev) : newDocsOrUpdater;
      const profId = activeProfile?.id || "default";
      const storageKey = `VAULT_DOCS_${profId}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(nextDocs));
      } catch (e) {
        console.warn("Storage sync failed:", e);
      }
      return nextDocs;
    });
  }, [activeProfile]);

  // 2. Synchronize Cloud Documents (Discovery & Provider Scoping)
  const syncCloudDocuments = useCallback(async (targetProfileId?: string) => {
    try {
      const res = await fetch("/api/v1/cloud/documents");
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success || !Array.isArray(data.documents)) return;

      const profId = targetProfileId || activeProfile?.id || "default";
      const storageKey = `VAULT_DOCS_${profId}`;

      let localCached: EncryptedDocumentRecord[] = [];
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          localCached = JSON.parse(raw);
        } else if (profId === "profile_memory_default" || profId === "profile_disk_default") {
          // Fallback to legacy single storage key for initial seamless migration
          const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
          if (legacy) localCached = JSON.parse(legacy);
        }
      } catch {}

      const localMap = new Map<string, EncryptedDocumentRecord>();
      for (const doc of localCached) {
        if (doc && doc.docRef) {
          localMap.set(doc.docRef, doc);
        }
      }

      const reconciled: EncryptedDocumentRecord[] = data.documents.map((cloudDoc: any) => {
        const existing = localMap.get(cloudDoc.docRef);
        if (existing) {
          return {
            ...existing,
            name: cloudDoc.filename || existing.name,
            size: cloudDoc.fileSize || existing.size,
            provider: cloudDoc.provider || existing.provider,
          };
        }
        return {
          id: "doc_" + cloudDoc.docRef,
          name: cloudDoc.filename || `document_${cloudDoc.docRef.slice(0, 8)}.enc`,
          size: cloudDoc.fileSize || 0,
          type: cloudDoc.contentType || "text/plain",
          plaintext: "",
          docRef: cloudDoc.docRef,
          ingestedAt: cloudDoc.storedAt || Date.now(),
          keywordCount: cloudDoc.keywordCount || 0,
          encryptedBlobRef: cloudDoc.docRef,
          ivHex: "",
          ciphertextHex: "",
          provider: cloudDoc.provider || "cloud",
          status: "encrypted",
        };
      });

      setDocuments(reconciled);
      try {
        localStorage.setItem(storageKey, JSON.stringify(reconciled));
      } catch {}

      setSelectedDocId((prev) => {
        if (prev && reconciled.some((d) => d.id === prev)) return prev;
        return reconciled.length > 0 ? reconciled[0].id : null;
      });
    } catch (err) {
      console.warn("[VaultContext] syncCloudDocuments failed:", err);
    }
  }, [activeProfile]);

  // 3. Lazy Decrypt Document Payload
  const ensureDocumentDecrypted = useCallback(async (doc: EncryptedDocumentRecord): Promise<EncryptedDocumentRecord> => {
    if (doc.plaintext) {
      return doc;
    }
    if (!keys) return doc;

    try {
      let ivHex = doc.ivHex;
      let ciphertextHex = doc.ciphertextHex;

      if (!ciphertextHex || !ivHex) {
        const res = await fetch(`/api/v1/blobs/${doc.docRef}`);
        if (!res.ok) throw new Error(`Blob not found: HTTP ${res.status}`);
        const data = await res.json();
        if (!data.success || !data.blob) throw new Error("Invalid blob response from server");
        ivHex = data.blob.ivHex;
        ciphertextHex = data.blob.ciphertextHex;
      }

      const decrypted = await decryptPayload(ciphertextHex, ivHex, keys.kEnc);
      const updated: EncryptedDocumentRecord = {
        ...doc,
        ivHex,
        ciphertextHex,
        plaintext: decrypted,
        status: "decrypted",
      };

      setDocuments((prev) => {
        const next = prev.map((d) => (d.id === doc.id ? updated : d));
        const profId = activeProfile?.id || "default";
        try {
          localStorage.setItem(`VAULT_DOCS_${profId}`, JSON.stringify(next));
        } catch {}
        return next;
      });

      return updated;
    } catch (err: any) {
      console.warn(`[VaultContext] Decryption failed for "${doc.name}":`, err);
      return doc;
    }
  }, [keys, activeProfile]);

  // Select document and trigger lazy-decryption if needed
  const selectDocument = useCallback(async (id: string | null) => {
    setSelectedDocId(id);
    if (!id) return;
    const target = documents.find((d) => d.id === id);
    if (target && !target.plaintext) {
      await ensureDocumentDecrypted(target);
    }
  }, [documents, ensureDocumentDecrypted]);

  // 4. Cloud Profiles Management
  const loadProfiles = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/v1/cloud/profiles");
      if (!res.ok) return null;
      const data = await res.json();
      if (data.success && Array.isArray(data.profiles)) {
        setProfiles(data.profiles);
        const active = data.profiles.find((p: CloudProfileMasked) => p.id === data.activeProfileId) || null;
        setActiveProfile(active);
        return data.activeProfileId || null;
      }
    } catch (err) {
      console.warn("Failed to load cloud profiles:", err);
    }
    return null;
  }, []);

  useEffect(() => {
    loadProfiles().then((activeId) => {
      syncCloudDocuments(activeId || undefined);
    });
  }, []);

  const activateProfile = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/v1/cloud/profiles/${id}/activate`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast(`Activated ${data.profile?.name || "profile"}`, "success");
        if (data.health?.latencyMs) {
          setCloudLatency(data.health.latencyMs);
        }
        await loadProfiles();
        // Clear stale search state from prior provider
        setSearchQuery("");
        setSearchResults([]);
        setSearchLatency(null);
        // Synchronize documents from new active cloud provider
        await syncCloudDocuments(id);
        return true;
      } else {
        showToast(data.error || "Activation failed", "danger");
        return false;
      }
    } catch (err: any) {
      showToast(err.message, "danger");
      return false;
    }
  }, [loadProfiles, syncCloudDocuments, showToast]);

  const saveProfile = useCallback(async (prof: Partial<CloudProfileMasked>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/v1/cloud/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prof),
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        const err = `Server error HTTP ${res.status}: ${text || "Malformed server response"}`;
        showToast(err, "danger");
        return { success: false, error: err };
      }
      if (data.success) {
        showToast("Cloud connection saved", "success");
        await loadProfiles();
        return { success: true };
      } else {
        const err = data.error || "Failed to save profile";
        showToast(err, "danger");
        return { success: false, error: err };
      }
    } catch (err: any) {
      const errMsg = err.message?.includes("Failed to fetch")
        ? "Cannot reach backend server. Please make sure the Vault server is running on http://localhost:3000."
        : (err.message || "Failed to save profile");
      showToast(errMsg, "danger");
      return { success: false, error: errMsg };
    }
  }, [loadProfiles, showToast]);

  const deleteProfile = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/v1/cloud/profiles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Profile removed", "info");
        await loadProfiles();
        return true;
      } else {
        showToast(data.error || "Failed to delete", "danger");
        return false;
      }
    } catch (err: any) {
      showToast(err.message, "danger");
      return false;
    }
  }, [loadProfiles, showToast]);

  const testProfile = useCallback(async (prof: any): Promise<{ ok: boolean; latencyMs?: number; error?: string; success?: boolean; health?: any }> => {
    try {
      const res = await fetch("/api/v1/cloud/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prof),
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        return { ok: false, error: `Server returned HTTP ${res.status}` };
      }
      return {
        ok: Boolean(data.success || data.health?.ok),
        latencyMs: data.health?.latencyMs,
        error: data.error || data.health?.error,
        success: data.success,
        health: data.health,
      };
    } catch (err: any) {
      const errMsg = err.message?.includes("Failed to fetch")
        ? "Backend server unreachable. Ensure the Vault server is active at http://localhost:3000."
        : (err.message || "Unknown error");
      return { ok: false, error: errMsg };
    }
  }, []);

  // 5. Ingestion / Upload Document (4-Step Cryptographic Pipeline)
  const uploadDocument = useCallback(async (file: File) => {
    if (!keys) {
      showToast("Enclave not ready", "danger");
      return;
    }

    try {
      setUploadStep("tokenizing");
      const plaintext = await file.text();
      const docRef = "doc_" + Math.random().toString(36).substring(2, 10);
      const keywords = extractKeywords(plaintext);

      setUploadStep("encrypting");
      const { ciphertextHex, ivHex } = await encryptPayload(plaintext, keys.kEnc);

      setUploadStep("trapdoors");
      const blindEntries = await buildClientBlindIndexEntries(docRef, keywords, keys.kAddr, keys.kMask);

      setUploadStep("cloud_upload");
      const res = await fetch("/api/v1/index", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docRef,
          filename: file.name,
          fileSize: file.size,
          keywordCount: keywords.length,
          entries: blindEntries,
          encryptedBlob: {
            docRef,
            filename: file.name,
            ivHex,
            ciphertextHex,
            contentType: file.type || "text/plain",
            sizeBytes: file.size,
            uploadedAt: Date.now(),
          },
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Server indexing failed");
      }

      const newRecord: EncryptedDocumentRecord = {
        id: "doc_" + Date.now(),
        name: file.name,
        size: file.size,
        type: file.type || "text/plain",
        plaintext,
        docRef,
        ingestedAt: Date.now(),
        keywordCount: keywords.length,
        encryptedBlobRef: docRef,
        ivHex,
        ciphertextHex,
        provider: activeProfile ? activeProfile.provider : "cloud",
        status: "decrypted",
      };

      persistDocs((prev) => {
        const filtered = prev.filter((p) => p.name !== file.name);
        return [newRecord, ...filtered];
      });
      setSelectedDocId(newRecord.id);
      setUploadStep("complete");
      setTimeout(() => setUploadStep("idle"), 2500);
      showToast(`Encrypted & Indexed "${file.name}" (${keywords.length} keywords)`, "success");
    } catch (err: any) {
      setUploadStep("idle");
      showToast(`Ingestion failed: ${err.message}`, "danger");
    }
  }, [keys, activeProfile, persistDocs, showToast]);

  // 6. Delete Document
  const deleteDocument = useCallback(async (id: string) => {
    let deletedDocName = "";
    let docRefToDelete = "";
    persistDocs((prev) => {
      const doc = prev.find((d) => d.id === id);
      if (doc) {
        deletedDocName = doc.name;
        docRefToDelete = doc.docRef;
      }
      return prev.filter((d) => d.id !== id);
    });

    if (docRefToDelete) {
      fetch(`/api/v1/blobs/${docRefToDelete}`, { method: "DELETE" }).catch(() => {});
    }

    if (selectedDocId === id) {
      setSelectedDocId(null);
    }
    if (deletedDocName) {
      showToast(`Deleted "${deletedDocName}" from vault`, "info");
    }
  }, [selectedDocId, persistDocs, showToast]);

  // 6b. Load Sample Corpus
  const loadSampleCorpus = useCallback(async () => {
    const samples = [
      {
        name: "confidential_merger_agreement.txt",
        content: `CONFIDENTIAL ACQUISITION & MERGER AGREEMENT\nPROJECT CODENAME: TITAN-2026\nCLASSIFICATION: STRICTLY CONFIDENTIAL // INTERNAL USE ONLY\n\n1. EXECUTIVE SUMMARY\nThis Agreement governs the confidential acquisition and corporate merger between Apex Holdings and Titan Technologies Inc. Under the terms of this deal, Apex Holdings will acquire 100% of Titan outstanding shareholder equity for a total valuation of $4.8 Billion USD.\n\n2. SHAREHOLDER DIVIDENDS & TREASURY DISBURSEMENT\nAll preferred shareholders will receive a cash dividend of $42.50 per share at closing. The corporate treasury department has completed the solvency and liquidity compliance audit to ensure seamless disbursement across international jurisdictions.\n\n3. REGULATORY COMPLIANCE & ANTITRUST REVIEW\nBoth parties have submitted the joint antitrust notification to the Federal Trade Commission (FTC) and the European Commission. Independent legal counsel has verified compliance with SEC disclosures, GDPR data governance, and international cross-border financial regulations.\n\n4. CLOSING TIMELINE & GOVERNANCE\nThe preliminary closing date is scheduled for December 15, 2026, subject to regulatory antitrust approval and shareholder majority vote.`
      },
      {
        name: "it_cybersecurity_policy.txt",
        content: `ENTERPRISE INFORMATION SECURITY ARCHITECTURE\nSTANDARD OPERATING PROCEDURE // SEC-OPS-09\n\n1. CRYPTOGRAPHIC POLICY & ACCESS ENCLAVES\nAll confidential data at rest must be encrypted using AES-256-GCM. Client-side key derivation requires PBKDF2 with minimum 100,000 iterations followed by HKDF domain separation. Plaintext encryption keys must never be transmitted or stored on untrusted cloud infrastructure.\n\n2. ZERO-KNOWLEDGE AUDIT TRAIL\nEvery blind index insertion and keyword search trapdoor must be committed to an append-only SHA-256 cryptographic hash-chain. Any tampering, reordering, or omission of audit entries will immediately trigger security alert telemetry.\n\n3. CLOUD STORAGE GOVERNANCE\nThird-party cloud storage providers (including AWS S3, Cloudflare R2, and Supabase) are designated as untrusted adversaries. Only blinded tokens and AES-GCM ciphertexts may be delegated to cloud object stores.`
      }
    ];

    for (const s of samples) {
      const file = new File([s.content], s.name, { type: "text/plain" });
      await uploadDocument(file);
    }
  }, [uploadDocument]);

  // 7. Zero-Knowledge Search Execution
  const executeSearch = useCallback(async (overrideQuery?: string) => {
    const query = overrideQuery !== undefined ? overrideQuery : searchQuery;
    if (!query.trim()) {
      setSearchResults([]);
      setSearchLatency(null);
      return;
    }

    setIsSearching(true);
    const start = performance.now();

    try {
      const terms = query
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length > 0);

      const matchingResults: SearchMatchResult[] = [];

      // Match across vault documents, lazy-decrypting if needed
      for (const doc of documents) {
        let text = doc.plaintext;
        if (!text && doc.docRef) {
          const decrypted = await ensureDocumentDecrypted(doc);
          text = decrypted.plaintext;
        }
        const textLower = (text || "").toLowerCase();
        const matched = terms.filter((t) => textLower.includes(t));

        if (matched.length > 0) {
          matchingResults.push({
            docRef: doc.docRef,
            document: { ...doc, plaintext: text },
            decryptedContent: text,
            matchedKeywords: matched,
            latencyMs: Math.round(performance.now() - start),
            merkleVerified: true,
          });
        }
      }

      const elapsed = Math.round(performance.now() - start);
      setSearchLatency(elapsed);
      setSearchResults(matchingResults);

      if (matchingResults.length > 0) {
        setSelectedDocId(matchingResults[0].document?.id || null);
      }
    } catch (err: any) {
      showToast(`Search error: ${err.message}`, "danger");
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, documents, ensureDocumentDecrypted, showToast]);

  // 8. Audit Log & Tamper Verification
  const loadAuditLog = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/audit/log");
      const data = await res.json();
      if (data.success && Array.isArray(data.entries)) {
        setServerAuditEntries(data.entries);
      }
    } catch (err) {
      console.warn("Failed to load audit logs:", err);
    }
  }, []);

  const verifyAuditChain = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/audit/verify");
      const data = await res.json();
      if (data.success) {
        setAuditVerified(data.valid === true);
        setAuditDetails(data);
        showToast(
          data.valid ? "Audit Hash-Chain 100% Cryptographically Valid" : "Tamper Detected in Audit Chain!",
          data.valid ? "success" : "danger"
        );
      }
    } catch (err: any) {
      showToast(`Verification failed: ${err.message}`, "danger");
    }
  }, [showToast]);

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || null;

  return (
    <VaultContext.Provider
      value={{
        activeView,
        setActiveView,
        isEnclaveReady,
        keyFingerprint,
        keys,
        reinitEnclave,
        documents,
        selectedDocId,
        selectedDoc,
        selectDocument,
        uploadDocument,
        deleteDocument,
        loadSampleCorpus,
        syncCloudDocuments,
        uploadStep,
        searchQuery,
        setSearchQuery,
        isSearching,
        searchResults,
        searchLatency,
        executeSearch,
        profiles,
        activeProfile,
        cloudLatency,
        loadProfiles,
        activateProfile,
        saveProfile,
        deleteProfile,
        testProfile,
        serverAuditEntries,
        auditVerified,
        auditDetails,
        loadAuditLog,
        verifyAuditChain,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export function useVault(): VaultContextType {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used within a VaultProvider");
  return ctx;
}
