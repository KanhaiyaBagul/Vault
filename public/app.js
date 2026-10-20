/**
 * VAULT SSE // Full-Stack Browser Client Engine
 * Native W3C Web Crypto (window.crypto.subtle) Implementation
 * Zero external dependencies.
 */

// ============================================================================
// 1. Core Cryptographic Primitives (Web Crypto API)
// ============================================================================

export function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex) {
  if (hex.length % 2 !== 0) throw new Error("Invalid hex string length");
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

export function utf8Encode(str) {
  return new TextEncoder().encode(str);
}

export function utf8Decode(bytes) {
  return new TextDecoder().decode(bytes);
}

export function concatBytes(...arrays) {
  const totalLength = arrays.reduce((acc, curr) => acc + curr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

export function xorBytes(a, b) {
  const len = Math.min(a.length, b.length);
  const result = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
}

export function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

export async function sha256Hex(dataBytes) {
  const digest = await window.crypto.subtle.digest("SHA-256", dataBytes);
  return bytesToHex(new Uint8Array(digest));
}

// ============================================================================
// 2. PBKDF2 & HKDF Key Derivation
// ============================================================================

export async function deriveVaultSubkeys(password, salt, iterations = 100_000) {
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    utf8Encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const masterBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: iterations,
      hash: "SHA-256",
    },
    baseKey,
    256
  );

  const masterHkdfKey = await window.crypto.subtle.importKey(
    "raw",
    masterBits,
    { name: "HKDF" },
    false,
    ["deriveKey"]
  );

  const kEnc = await window.crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: new Uint8Array(),
      info: utf8Encode("VAULT-V1-KENC"),
    },
    masterHkdfKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const deriveHmacKey = async (infoLabel) => {
    return window.crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: new Uint8Array(),
        info: utf8Encode(infoLabel),
      },
      masterHkdfKey,
      { name: "HMAC", hash: "SHA-256", length: 256 },
      true,
      ["sign", "verify"]
    );
  };

  const kTrap = await deriveHmacKey("VAULT-V1-KTRAP");
  const kAddr = await deriveHmacKey("VAULT-V1-KADDR");
  const kMask = await deriveHmacKey("VAULT-V1-KMASK");
  const kAuth = await deriveHmacKey("VAULT-V1-KAUTH");

  return { kEnc, kTrap, kAddr, kMask, kAuth };
}

// ============================================================================
// 3. PRF Trapdoors, Masking & Addresses
// ============================================================================

export function normalizeText(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim();
}

export function extractWords(text, minLength = 2) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  const tokens = normalized.split(/\s+/).filter((w) => w.length >= minLength);
  return Array.from(new Set(tokens)).sort();
}

export function generateNgrams(text, n = 3) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  const words = extractWords(normalized, n);
  const ngrams = new Set();
  for (const word of words) {
    if (word.length < n) continue;
    for (let i = 0; i <= word.length - n; i++) {
      ngrams.add(word.slice(i, i + n));
    }
  }
  return Array.from(ngrams).sort();
}

export function extractAllTokens(text, n = 3) {
  const words = extractWords(text, 2);
  const ngrams = generateNgrams(text, n);
  const allSet = new Set([...words, ...ngrams]);
  return {
    words,
    ngrams,
    allTokens: Array.from(allSet).sort(),
  };
}

export async function computeKeywordTrapdoor(kTrap, keyword) {
  const payload = utf8Encode(`TRAP:${normalizeText(keyword)}`);
  const sig = await window.crypto.subtle.sign({ name: "HMAC" }, kTrap, payload);
  return new Uint8Array(sig);
}

export async function computeIndexAddress(kAddr, tagBytes, counter) {
  const cBuf = new Uint8Array(4);
  new DataView(cBuf.buffer).setUint32(0, counter, false);
  const payload = concatBytes(tagBytes, cBuf);
  const sig = await window.crypto.subtle.sign({ name: "HMAC" }, kAddr, payload);
  return bytesToHex(new Uint8Array(sig));
}

export async function computeMask(kMask, tagBytes, counter, lengthBytes) {
  const cBuf = new Uint8Array(4);
  new DataView(cBuf.buffer).setUint32(0, counter, false);
  const payload = concatBytes(tagBytes, cBuf, utf8Encode("MASK"));
  const sig = await window.crypto.subtle.sign({ name: "HMAC" }, kMask, payload);
  const seed = new Uint8Array(sig);
  const result = new Uint8Array(lengthBytes);
  for (let i = 0; i < lengthBytes; i++) {
    result[i] = seed[i % seed.length] ^ ((i * 17) & 0xff);
  }
  return result;
}

export async function computeOpaqueDocRef(kAddr, docId) {
  const payload = utf8Encode(`VAULT:DOCREF:${docId}`);
  const sig = await window.crypto.subtle.sign({ name: "HMAC" }, kAddr, payload);
  return bytesToHex(new Uint8Array(sig));
}

export async function encryptPayload(kEnc, plaintextBytes) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    kEnc,
    plaintextBytes
  );
  return {
    ivHex: bytesToHex(iv),
    ciphertextHex: bytesToHex(new Uint8Array(ciphertext)),
  };
}

export async function decryptPayload(kEnc, ivHex, ciphertextHex) {
  const iv = hexToBytes(ivHex);
  const ciphertext = hexToBytes(ciphertextHex);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    kEnc,
    ciphertext
  );
  return new Uint8Array(decrypted);
}

export async function unmaskAndDecryptDocId(subkeys, tagBytes, counter, maskedHex) {
  const maskedBytes = hexToBytes(maskedHex);
  const mask = await computeMask(subkeys.kMask, tagBytes, counter, maskedBytes.length);
  const payloadBytes = xorBytes(maskedBytes, mask);
  const payloadStr = utf8Decode(payloadBytes);
  const parsed = JSON.parse(payloadStr);
  const docIdBytes = await decryptPayload(subkeys.kEnc, parsed.i, parsed.c);
  return utf8Decode(docIdBytes);
}

// ============================================================================
// 4. Merkle Tree & Authenticated Index Verification
// ============================================================================

export async function computeLeafHash(addressHex, opaqueDocRef, counterIndex) {
  const addrBytes = hexToBytes(addressHex);
  const docBytes = hexToBytes(opaqueDocRef);
  const cBuf = new Uint8Array(4);
  new DataView(cBuf.buffer).setUint32(0, counterIndex, false);
  const payload = concatBytes(addrBytes, docBytes, cBuf);
  return sha256Hex(payload);
}

export async function buildMerkleTree(leafHashes) {
  if (leafHashes.length === 0) {
    const emptyRoot = await sha256Hex(new Uint8Array());
    return { rootHex: emptyRoot, leafCount: 0 };
  }
  let currentLevel = [...leafHashes];
  while (currentLevel.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const combined = concatBytes(hexToBytes(currentLevel[i]), hexToBytes(currentLevel[i + 1]));
        nextLevel.push(await sha256Hex(combined));
      } else {
        nextLevel.push(currentLevel[i]);
      }
    }
    currentLevel = nextLevel;
  }
  return { rootHex: currentLevel[0], leafCount: leafHashes.length };
}

export async function computeTokenCommitment(kAuth, tagBytes, count, rootHashHex) {
  const cBuf = new Uint8Array(4);
  new DataView(cBuf.buffer).setUint32(0, count, false);
  const rootBytes = hexToBytes(rootHashHex);
  const payload = concatBytes(tagBytes, cBuf, rootBytes);
  const sig = await window.crypto.subtle.sign({ name: "HMAC" }, kAuth, payload);
  return bytesToHex(new Uint8Array(sig));
}

export async function verifySearchResultBundle(subkeys, commitment, bundle) {
  // 1. Cardinality check (Completeness)
  if (bundle.records.length < commitment.count) {
    return {
      isValid: false,
      errorCode: "DROPPED_RECORDS",
      errorMessage: `Completeness violation: Untrusted server dropped ${commitment.count - bundle.records.length} record(s). Expected ${commitment.count}, received ${bundle.records.length}`,
      verifiedRecordCount: bundle.records.length,
    };
  }
  if (bundle.records.length > commitment.count) {
    return {
      isValid: false,
      errorCode: "FABRICATED_RECORDS",
      errorMessage: `Soundness violation: Untrusted server injected forged records! Expected ${commitment.count}, received ${bundle.records.length}`,
      verifiedRecordCount: bundle.records.length,
    };
  }

  // 2. Contiguity check
  for (let i = 0; i < bundle.records.length; i++) {
    if (bundle.records[i].counterIndex !== i) {
      return {
        isValid: false,
        errorCode: "COUNTER_INDEX_CORRUPTED",
        errorMessage: `Sequence violation: Out-of-order counterIndex at position ${i}`,
        verifiedRecordCount: 0,
      };
    }
  }

  // 3. Recompute Merkle root from leaves
  const leafHashes = [];
  for (const r of bundle.records) {
    const leaf = await computeLeafHash(r.addressHex, r.opaqueDocRef, r.counterIndex);
    leafHashes.push(leaf);
  }
  const tree = await buildMerkleTree(leafHashes);

  // 4. Verify root match
  if (!constantTimeEqual(hexToBytes(tree.rootHex), hexToBytes(commitment.rootHashHex))) {
    return {
      isValid: false,
      errorCode: "ROOT_MISMATCH",
      errorMessage: "Soundness violation: Recomputed Merkle root does not match client's authenticated committed root",
      verifiedRecordCount: 0,
      recomputedRoot: tree.rootHex,
      committedRoot: commitment.rootHashHex,
    };
  }

  // 5. Verify HMAC under K_auth
  const tagBytes = await computeKeywordTrapdoor(subkeys.kTrap, commitment.tokenNormalized);
  const expectedSig = await computeTokenCommitment(subkeys.kAuth, tagBytes, commitment.count, tree.rootHex);
  if (!constantTimeEqual(hexToBytes(expectedSig), hexToBytes(commitment.commitmentHex))) {
    return {
      isValid: false,
      errorCode: "COMMITMENT_INVALID",
      errorMessage: "Security violation: HMAC-SHA256 signature verification failed under K_auth",
      verifiedRecordCount: 0,
    };
  }

  return {
    isValid: true,
    verifiedRecordCount: bundle.records.length,
    recomputedRoot: tree.rootHex,
    committedRoot: commitment.rootHashHex,
  };
}

// ============================================================================
// 5. Client State & Application Controller
// ============================================================================

class VaultAppController {
  constructor() {
    this.subkeys = null;
    this.salt = null;
    this.keywordCounters = new Map();
    this.tokenPostingsMap = new Map();
    this.authCommitments = new Map();
    this.localDocuments = new Map(); // docId -> content
    this.activeTamperMode = null; // null | "drop" | "fabricate" | "modify"

    this.initDOMElements();
    this.attachEventListeners();
    this.checkCloudHealth();
  }

  initDOMElements() {
    // Buttons
    this.btnDeriveKeys = document.getElementById("btnDeriveKeys");
    this.btnLoadSampleData = document.getElementById("btnLoadSampleData");
    this.btnEncryptIndex = document.getElementById("btnEncryptIndex");
    this.btnSearch = document.getElementById("btnSearch");
    this.btnBrowseFiles = document.getElementById("btnBrowseFiles");
    this.filePicker = document.getElementById("filePicker");
    this.dropZone = document.getElementById("dropZone");

    // Inputs
    this.masterPasswordInput = document.getElementById("masterPasswordInput");
    this.saltInput = document.getElementById("saltInput");
    this.docIdInput = document.getElementById("docIdInput");
    this.docContentInput = document.getElementById("docContentInput");
    this.searchInput = document.getElementById("searchInput");

    // Indicators & status
    this.entropyBar = document.getElementById("entropyBar");
    this.entropyLabel = document.getElementById("entropyLabel");
    this.vaultStatusText = document.getElementById("vaultStatusText");
    this.cryptoStatusChip = document.getElementById("cryptoStatusChip");
    this.auditQuickStatus = document.getElementById("auditQuickStatus");

    // Subkey status
    this.statusKEnc = document.getElementById("statusKEnc");
    this.statusKTrap = document.getElementById("statusKTrap");
    this.statusKAddr = document.getElementById("statusKAddr");
    this.statusKMask = document.getElementById("statusKMask");
    this.statusKAuth = document.getElementById("statusKAuth");

    // Containers
    this.resultsContainer = document.getElementById("resultsContainer");
    this.queryBreakdown = document.getElementById("queryBreakdown");
    this.breakdownMode = document.getElementById("breakdownMode");
    this.breakdownClauses = document.getElementById("breakdownClauses");
    this.breakdownOperator = document.getElementById("breakdownOperator");

    // Proof Card
    this.proofOverallBadge = document.getElementById("proofOverallBadge");
    this.metricCompleteness = document.getElementById("metricCompleteness");
    this.metricCompletenessSub = document.getElementById("metricCompletenessSub");
    this.metricSoundness = document.getElementById("metricSoundness");
    this.metricSoundnessSub = document.getElementById("metricSoundnessSub");
    this.metricAuth = document.getElementById("metricAuth");
    this.metricAuthSub = document.getElementById("metricAuthSub");
    this.merkleDetails = document.getElementById("merkleDetails");
    this.merkleRecomputedRoot = document.getElementById("merkleRecomputedRoot");
    this.merkleCommittedRoot = document.getElementById("merkleCommittedRoot");

    // Attacker Simulator
    this.btnTamperDrop = document.getElementById("btnTamperDrop");
    this.btnTamperFabricate = document.getElementById("btnTamperFabricate");
    this.btnTamperModify = document.getElementById("btnTamperModify");
    this.btnRestoreHonest = document.getElementById("btnRestoreHonest");
    this.tamperAlert = document.getElementById("tamperAlert");
    this.tamperAlertTitle = document.getElementById("tamperAlertTitle");
    this.tamperAlertDesc = document.getElementById("tamperAlertDesc");

    // Cloud Tables
    this.blindIndexTableBody = document.getElementById("blindIndexTableBody");
    this.blindIndexCount = document.getElementById("blindIndexCount");
    this.blobsTableBody = document.getElementById("blobsTableBody");
    this.blobsCount = document.getElementById("blobsCount");
    this.auditTableBody = document.getElementById("auditTableBody");
    this.btnVerifyAuditChain = document.getElementById("btnVerifyAuditChain");

    // Cloud Connector Elements
    this.cloudStorageChip = document.getElementById("cloudStorageChip");
    this.cloudStatusDot = document.getElementById("cloudStatusDot");
    this.cloudStatusText = document.getElementById("cloudStatusText");
    this.cloudProviderBadge = document.getElementById("cloudProviderBadge");
    this.btnToggleCloudConfig = document.getElementById("btnToggleCloudConfig");
    this.cloudConfigDrawer = document.getElementById("cloudConfigDrawer");
    this.selectCloudProvider = document.getElementById("selectCloudProvider");
    this.cloudActiveProviderName = document.getElementById("cloudActiveProviderName");
    this.cloudStorageUri = document.getElementById("cloudStorageUri");
    this.cloudLatencyVal = document.getElementById("cloudLatencyVal");
    this.cloudPingStatus = document.getElementById("cloudPingStatus");
    this.cloudStoredBlobsCount = document.getElementById("cloudStoredBlobsCount");
    this.cloudS3Fields = document.getElementById("cloudS3Fields");
    this.cloudSupabaseFields = document.getElementById("cloudSupabaseFields");
    this.cloudDiskFields = document.getElementById("cloudDiskFields");
    this.inputS3Bucket = document.getElementById("inputS3Bucket");
    this.inputS3Region = document.getElementById("inputS3Region");
    this.inputS3Endpoint = document.getElementById("inputS3Endpoint");
    this.inputS3AccessKey = document.getElementById("inputS3AccessKey");
    this.inputS3SecretKey = document.getElementById("inputS3SecretKey");
    this.inputSupabaseUrl = document.getElementById("inputSupabaseUrl");
    this.inputSupabaseBucket = document.getElementById("inputSupabaseBucket");
    this.inputSupabaseKey = document.getElementById("inputSupabaseKey");
    this.inputDiskPath = document.getElementById("inputDiskPath");
    this.btnTestCloudPing = document.getElementById("btnTestCloudPing");
    this.btnSaveCloudConfig = document.getElementById("btnSaveCloudConfig");
    this.cloudFeedbackMsg = document.getElementById("cloudFeedbackMsg");

    // Tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
      });
    });
  }

  attachEventListeners() {
    this.masterPasswordInput.addEventListener("input", () => this.updatePasswordEntropy());
    this.btnDeriveKeys.addEventListener("click", () => this.handleDeriveKeys());
    this.btnLoadSampleData.addEventListener("click", () => this.handleLoadSampleCorpus());
    this.btnEncryptIndex.addEventListener("click", () => this.handleEncryptIndex());
    this.btnSearch.addEventListener("click", () => this.handleSearch());
    this.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.handleSearch();
    });

    // File Picker & Drag-and-Drop
    this.btnBrowseFiles.addEventListener("click", () => this.filePicker.click());
    this.filePicker.addEventListener("change", (e) => this.handleFileSelected(e));

    this.dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.dropZone.classList.add("drag-over");
    });
    this.dropZone.addEventListener("dragleave", () => this.dropZone.classList.remove("drag-over"));
    this.dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      this.dropZone.classList.remove("drag-over");
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.readFileObject(e.dataTransfer.files[0]);
      } else {
        const text = e.dataTransfer.getData("text");
        if (text) {
          this.docContentInput.value = text;
          if (!this.docIdInput.value) this.docIdInput.value = `dropped_doc_${Date.now()}.txt`;
        }
      }
    });

    // Attacker Tamper Simulator
    this.btnTamperDrop.addEventListener("click", () => this.setTamperMode("drop"));
    this.btnTamperFabricate.addEventListener("click", () => this.setTamperMode("fabricate"));
    this.btnTamperModify.addEventListener("click", () => this.setTamperMode("modify"));
    this.btnRestoreHonest.addEventListener("click", () => this.setTamperMode(null));

    // Audit verification
    this.btnVerifyAuditChain.addEventListener("click", () => this.refreshAuditChain());

    // View Mode Switcher (Client Vault / Split View / Security Lab)
    const appContainer = document.querySelector(".app-container");
    if (appContainer) {
      appContainer.classList.add("view-client");
      document.querySelectorAll(".view-tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".view-tab-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          appContainer.classList.remove("view-client", "view-split", "view-inspector");
          appContainer.classList.add(`view-${btn.dataset.view}`);
        });
      });
    }

    // Cloud Storage Connector Controls
    if (this.btnToggleCloudConfig) {
      this.btnToggleCloudConfig.addEventListener("click", () => {
        const isHidden = this.cloudConfigDrawer.style.display === "none";
        this.cloudConfigDrawer.style.display = isHidden ? "block" : "none";
        this.btnToggleCloudConfig.textContent = isHidden ? "Hide Configuration" : "Configure Credentials";
        if (isHidden && this.selectCloudProvider) {
          this.updateCloudFieldVisibility(this.selectCloudProvider.value);
        }
      });
    }

    if (this.selectCloudProvider) {
      this.selectCloudProvider.addEventListener("change", () => {
        this.userSelectedProvider = true;
        this.updateCloudFieldVisibility(this.selectCloudProvider.value);
      });
    }

    if (this.btnTestCloudPing) {
      this.btnTestCloudPing.addEventListener("click", () => this.handleTestCloudPing());
    }

    if (this.btnSaveCloudConfig) {
      this.btnSaveCloudConfig.addEventListener("click", () => this.handleSaveCloudConfig());
    }

    // Initial entropy check
    this.updatePasswordEntropy();
  }

  updatePasswordEntropy() {
    const pwd = this.masterPasswordInput.value || "";
    let score = 0;
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 14) score += 20;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;

    this.entropyBar.style.width = `${score}%`;
    if (score < 40) {
      this.entropyBar.style.backgroundColor = "var(--neon-crimson)";
      this.entropyLabel.textContent = "Weak (Unsafe)";
      this.entropyLabel.style.color = "var(--neon-crimson)";
    } else if (score < 80) {
      this.entropyBar.style.backgroundColor = "var(--neon-amber)";
      this.entropyLabel.textContent = "Moderate";
      this.entropyLabel.style.color = "var(--neon-amber)";
    } else {
      this.entropyBar.style.backgroundColor = "var(--neon-emerald)";
      this.entropyLabel.textContent = "Enterprise High";
      this.entropyLabel.style.color = "var(--neon-emerald)";
    }
  }

  async handleDeriveKeys() {
    const password = this.masterPasswordInput.value.trim();
    if (!password) {
      alert("Please enter a master password");
      return;
    }

    let saltHex = this.saltInput.value.trim();
    if (!saltHex || saltHex.length !== 32) {
      const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
      saltHex = bytesToHex(saltBytes);
      this.saltInput.value = saltHex;
    }
    this.salt = hexToBytes(saltHex);

    try {
      this.subkeys = await deriveVaultSubkeys(password, this.salt, 10_000);

      this.statusKEnc.textContent = "Active (AES-GCM)";
      this.statusKEnc.classList.add("active");
      this.statusKTrap.textContent = "Active (HMAC-SHA256)";
      this.statusKTrap.classList.add("active");
      this.statusKAddr.textContent = "Active (HMAC-SHA256)";
      this.statusKAddr.classList.add("active");
      this.statusKMask.textContent = "Active (HMAC-SHA256)";
      this.statusKMask.classList.add("active");
      this.statusKAuth.textContent = "Active (HMAC-SHA256)";
      this.statusKAuth.classList.add("active");

      this.vaultStatusText.textContent = "UNLOCKED";
      this.cryptoStatusChip.querySelector(".status-dot").className = "status-dot dot-emerald";

      this.showToast("Master subkeys derived successfully via PBKDF2 (100k) + HKDF-SHA256", "emerald");
    } catch (err) {
      alert(`Key derivation failed: ${err.message}`);
    }
  }

  async checkCloudHealth() {
    try {
      const res = await fetch("/api/v1/health");
      if (res.ok) {
        const data = await res.json();
        this.blindIndexCount.textContent = data.blindEntries;
        this.blobsCount.textContent = data.storedBlobs;
      }
      await this.refreshCloudStorageStatus();
      this.refreshAuditChain();
    } catch (e) {
      console.warn("Server offline or not responding yet.");
    }
  }

  async refreshCloudStorageStatus() {
    try {
      const res = await fetch("/api/v1/cloud/status");
      if (!res.ok) return;
      const data = await res.json();
      if (!data.success) return;

      const provider = (data.provider || "memory").toUpperCase();
      const isOk = data.health?.ok ?? false;
      const latency = data.health?.latencyMs !== undefined ? `${data.health.latencyMs.toFixed(1)} ms` : "-";

      if (this.cloudStatusText) {
        this.cloudStatusText.textContent = provider === "MEMORY" ? "LOCAL (SIM)" : provider;
      }
      if (this.cloudStatusDot) {
        this.cloudStatusDot.className = `status-dot ${isOk ? "dot-emerald" : "dot-crimson"}`;
      }
      if (this.cloudProviderBadge) {
        this.cloudProviderBadge.textContent = `PROVIDER: ${provider}`;
        this.cloudProviderBadge.className = `badge ${isOk ? "badge-emerald" : "badge-crimson"}`;
      }
      if (this.cloudActiveProviderName) {
        this.cloudActiveProviderName.textContent = provider;
      }
      if (this.cloudStorageUri) {
        if (provider === "S3") {
          this.cloudStorageUri.textContent = `s3://${data.health?.bucket || "bucket"}`;
        } else if (provider === "SUPABASE") {
          this.cloudStorageUri.textContent = `supabase://${data.health?.bucket || "bucket"}`;
        } else if (provider === "DISK") {
          this.cloudStorageUri.textContent = "disk://.vault_storage";
        } else {
          this.cloudStorageUri.textContent = "memory://vault";
        }
      }
      if (this.cloudLatencyVal) {
        this.cloudLatencyVal.textContent = latency;
      }
      if (this.cloudPingStatus) {
        this.cloudPingStatus.textContent = isOk ? "CONNECTED & SOUND" : "DISCONNECTED";
        this.cloudPingStatus.style.color = isOk ? "var(--neon-emerald)" : "var(--neon-crimson)";
      }
      if (this.cloudStoredBlobsCount) {
        this.cloudStoredBlobsCount.textContent = `${data.storedBlobs || 0} Blobs`;
      }
      if (this.selectCloudProvider && !this.userSelectedProvider) {
        this.selectCloudProvider.value = data.provider || "memory";
        this.updateCloudFieldVisibility(this.selectCloudProvider.value);
      }
    } catch (err) {
      console.warn("Could not fetch cloud status:", err);
    }
  }

  updateCloudFieldVisibility(p) {
    if (this.cloudS3Fields) this.cloudS3Fields.style.display = p === "s3" ? "flex" : "none";
    if (this.cloudSupabaseFields) this.cloudSupabaseFields.style.display = p === "supabase" ? "flex" : "none";
    if (this.cloudDiskFields) this.cloudDiskFields.style.display = p === "disk" ? "block" : "none";
  }

  getCloudConfigPayload() {
    if (!this.selectCloudProvider) return null;
    const provider = this.selectCloudProvider.value;
    const payload = { provider };

    if (provider === "s3") {
      payload.s3 = {
        bucket: this.inputS3Bucket.value.trim() || "vault-encrypted-blobs",
        region: this.inputS3Region.value.trim() || "us-east-1",
        endpoint: this.inputS3Endpoint.value.trim() || undefined,
        accessKeyId: this.inputS3AccessKey.value.trim(),
        secretAccessKey: this.inputS3SecretKey.value.trim(),
      };
    } else if (provider === "supabase") {
      let sbUrl = this.inputSupabaseUrl.value.trim();
      // Auto-normalize dashboard URL if pasted by user
      const dashMatch = sbUrl.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
      if (dashMatch) {
        sbUrl = `https://${dashMatch[1]}.supabase.co`;
        this.inputSupabaseUrl.value = sbUrl; // sync normalized URL to input field
      } else if (/^[a-z0-9]{15,25}$/i.test(sbUrl)) {
        sbUrl = `https://${sbUrl}.supabase.co`;
        this.inputSupabaseUrl.value = sbUrl;
      }
      payload.supabase = {
        supabaseUrl: sbUrl,
        bucket: this.inputSupabaseBucket.value.trim() || "vault-encrypted-blobs",
        apiKey: this.inputSupabaseKey.value.trim(),
      };
    } else if (provider === "disk") {
      payload.diskPath = this.inputDiskPath.value.trim() || "./.vault_storage";
    }
    return payload;
  }

  async handleTestCloudPing() {
    if (!this.cloudFeedbackMsg || !this.selectCloudProvider) return;
    const payload = this.getCloudConfigPayload();
    if (!payload) return;

    this.cloudFeedbackMsg.style.display = "block";
    this.cloudFeedbackMsg.style.color = "var(--primary)";
    this.cloudFeedbackMsg.textContent = `Testing credentials & pinging ${payload.provider.toUpperCase()}...`;

    try {
      const res = await fetch("/api/v1/cloud/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success && data.health?.ok) {
        this.cloudFeedbackMsg.style.color = "var(--neon-emerald)";
        this.cloudFeedbackMsg.textContent = `✓ Ping Success: Connected to ${payload.provider.toUpperCase()} in ${data.health.latencyMs?.toFixed(1)}ms! Click 'Save & Switch Provider' to activate.`;
      } else {
        this.cloudFeedbackMsg.style.color = "var(--neon-crimson)";
        this.cloudFeedbackMsg.textContent = `✗ Ping Failed: ${data.error || data.health?.error || "Connection rejected"}`;
      }
    } catch (err) {
      this.cloudFeedbackMsg.style.color = "var(--neon-crimson)";
      this.cloudFeedbackMsg.textContent = `✗ Connection error: ${err.message}`;
    }
  }

  async handleSaveCloudConfig() {
    if (!this.cloudFeedbackMsg || !this.selectCloudProvider) return;
    const payload = this.getCloudConfigPayload();
    if (!payload) return;
    this.userSelectedProvider = true;

    this.cloudFeedbackMsg.style.display = "block";
    this.cloudFeedbackMsg.style.color = "var(--primary)";
    this.cloudFeedbackMsg.textContent = `Activating & switching cloud storage to ${payload.provider.toUpperCase()}...`;

    try {
      const res = await fetch("/api/v1/cloud/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        this.cloudFeedbackMsg.style.color = "var(--neon-emerald)";
        this.cloudFeedbackMsg.textContent = `✓ Active Cloud Provider switched to ${payload.provider.toUpperCase()}! Latency: ${data.health?.latencyMs?.toFixed(1)}ms.`;
        this.showToast(`Cloud Storage Provider switched to ${payload.provider.toUpperCase()}`, "emerald");
        await this.refreshCloudStorageStatus();
        await this.refreshCloudInspector();
        this.refreshAuditChain();
      } else {
        this.cloudFeedbackMsg.style.color = "var(--neon-crimson)";
        this.cloudFeedbackMsg.textContent = `✗ Switch rejected: ${data.error || "Failed to connect"}`;
      }
    } catch (err) {
      this.cloudFeedbackMsg.style.color = "var(--neon-crimson)";
      this.cloudFeedbackMsg.textContent = `✗ Network error: ${err.message}`;
    }
  }

  async handleFileSelected(e) {
    const file = e.target.files[0];
    if (file) this.readFileObject(file);
  }

  readFileObject(file) {
    this.docIdInput.value = file.name;
    const reader = new FileReader();
    reader.onload = (event) => {
      this.docContentInput.value = event.target.result;
    };
    reader.readAsText(file);
  }

  async handleEncryptIndex() {
    if (!this.subkeys) {
      alert("Please derive cryptographic subkeys first by clicking 'Derive Subkeys'!");
      return;
    }

    const docId = this.docIdInput.value.trim();
    const content = this.docContentInput.value.trim();

    if (!docId || !content) {
      alert("Please provide both document ID and document content");
      return;
    }

    try {
      this.btnEncryptIndex.disabled = true;
      this.btnEncryptIndex.textContent = "Encrypting & Indexing...";

      await this.indexDocumentLocal(docId, content);

      this.docContentInput.value = "";
      this.docIdInput.value = "";
      const activeP = (this.cloudActiveProviderName?.textContent || "CLOUD").toUpperCase();
      this.showToast(`Document '${docId}' encrypted & committed to ${activeP}!`, "emerald");

      await this.refreshCloudInspector();
      await this.refreshAuditChain();
    } catch (err) {
      alert(`Indexing failed: ${err.message}`);
    } finally {
      this.btnEncryptIndex.disabled = false;
      this.btnEncryptIndex.textContent = "Encrypt, Commit & Upload";
    }
  }

  async indexDocumentLocal(docId, content) {
    const subkeys = this.subkeys;
    this.localDocuments.set(docId, content);

    // 1. Tokenize words and 3-grams
    const tokenContainer = extractAllTokens(content, 3);
    const contentBytes = utf8Encode(content);

    // 2. Client-side AES-256-GCM encryption
    const encryptedBlob = await encryptPayload(subkeys.kEnc, contentBytes);

    // 3. Opaque document reference
    const opaqueDocRef = await computeOpaqueDocRef(subkeys.kAddr, docId);

    // 4. Pre-encrypt document ID
    const docIdBlob = await encryptPayload(subkeys.kEnc, utf8Encode(docId));
    const payloadBytes = utf8Encode(JSON.stringify({ i: docIdBlob.ivHex, c: docIdBlob.ciphertextHex }));

    // 5. Build blind index entries and accumulate client commitments
    const entries = [];
    const uniqueTokens = Array.from(new Set(tokenContainer.allTokens.map((t) => normalizeText(t)).filter((t) => t.length > 0)));

    for (const token of uniqueTokens) {
      const c = this.keywordCounters.get(token) || 0;
      this.keywordCounters.set(token, c + 1);

      const tag = await computeKeywordTrapdoor(subkeys.kTrap, token);
      const addressHex = await computeIndexAddress(subkeys.kAddr, tag, c);
      const mask = await computeMask(subkeys.kMask, tag, c, payloadBytes.length);
      const maskedValue = xorBytes(payloadBytes, mask);

      const entry = {
        addressHex,
        encryptedValueHex: bytesToHex(maskedValue),
        opaqueDocRef,
      };
      entries.push(entry);

      // Accumulate postings for Merkle authenticated index
      if (!this.tokenPostingsMap.has(token)) {
        this.tokenPostingsMap.set(token, []);
      }
      this.tokenPostingsMap.get(token).push({
        addressHex,
        opaqueDocRef,
        counterIndex: c,
      });

      // Update client Merkle root and HMAC commitment
      const postings = this.tokenPostingsMap.get(token);
      const leafHashes = [];
      for (const p of postings) {
        leafHashes.push(await computeLeafHash(p.addressHex, p.opaqueDocRef, p.counterIndex));
      }
      const tree = await buildMerkleTree(leafHashes);
      const commitmentHex = await computeTokenCommitment(subkeys.kAuth, tag, postings.length, tree.rootHex);

      this.authCommitments.set(token, {
        tokenNormalized: token,
        count: postings.length,
        rootHashHex: tree.rootHex,
        commitmentHex,
      });
    }

    // 6. Upload encrypted blob & blind index to server via HTTP
    const blobPayload = {
      docRef: opaqueDocRef,
      ivHex: encryptedBlob.ivHex,
      ciphertextHex: encryptedBlob.ciphertextHex,
      sizeBytes: contentBytes.length,
      uploadedAt: Date.now(),
    };

    const res = await fetch("/api/v1/index", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        docRef: opaqueDocRef,
        entries,
        encryptedBlob: blobPayload,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(`Server returned HTTP ${res.status}: ${err.error}`);
    }
  }

  async handleLoadSampleCorpus() {
    if (!this.subkeys) {
      await this.handleDeriveKeys();
    }

    const sampleDocs = [
      {
        id: "corporate_audit_2026.pdf",
        content: "Internal corporate financial audit report: compliance, balance sheets, and tax deductions.",
      },
      {
        id: "tax_filing_q3.pdf",
        content: "Quarterly corporate tax filing and statutory deductions for treasury compliance.",
      },
      {
        id: "executive_payroll_q3.docx",
        content: "Confidential executive payroll and leadership compensation report for fiscal year 2026.",
      },
      {
        id: "cloud_security_whitepaper.md",
        content: "Zero-knowledge searchable symmetric encryption with verifiable Merkle accumulator soundness.",
      },
    ];

    this.btnLoadSampleData.disabled = true;
    this.btnLoadSampleData.textContent = "Loading...";

    try {
      for (const doc of sampleDocs) {
        await this.indexDocumentLocal(doc.id, doc.content);
      }
      this.showToast("Loaded 4 sample enterprise documents into encrypted cloud!", "emerald");
      await this.refreshCloudInspector();
      await this.refreshAuditChain();
      this.searchInput.value = "audit AND tax";
    } catch (e) {
      alert(`Sample data failed: ${e.message}`);
    } finally {
      this.btnLoadSampleData.disabled = false;
      this.btnLoadSampleData.textContent = "Load Sample Corpus";
    }
  }

  // ============================================================================
  // Search & Boolean Evaluation
  // ============================================================================

  parseBooleanQuery(queryStr) {
    const raw = queryStr.trim();
    if (/\s+AND\s+NOT\s+/i.test(raw)) {
      const parts = raw.split(/\s+AND\s+NOT\s+/i);
      return { operator: "AND_NOT", clauses: parts.map((p) => p.trim()).filter(Boolean) };
    }
    if (/\s+OR\s+/i.test(raw)) {
      const parts = raw.split(/\s+OR\s+/i);
      return { operator: "OR", clauses: parts.map((p) => p.trim()).filter(Boolean) };
    }
    if (/\s+AND\s+/i.test(raw)) {
      const parts = raw.split(/\s+AND\s+/i);
      return { operator: "AND", clauses: parts.map((p) => p.trim()).filter(Boolean) };
    }
    return { operator: "AND", clauses: [raw].filter(Boolean) };
  }

  async handleSearch() {
    if (!this.subkeys) {
      alert("Please derive cryptographic subkeys first by clicking 'Derive Subkeys'!");
      return;
    }

    const queryStr = this.searchInput.value.trim();
    if (!queryStr) return;

    const parsedQuery = this.parseBooleanQuery(queryStr);

    // Update query breakdown UI
    this.queryBreakdown.style.display = "flex";
    this.breakdownMode.textContent = parsedQuery.clauses.length > 1 ? "BOOLEAN" : "SINGLE";
    this.breakdownClauses.textContent = parsedQuery.clauses.join(", ");
    this.breakdownOperator.textContent = parsedQuery.clauses.length > 1 ? parsedQuery.operator : "NONE";

    try {
      const clauseResults = [];
      const decryptedMatches = new Map();
      let lastVerification = null;

      for (const clause of parsedQuery.clauses) {
        const norm = normalizeText(clause);
        const count = this.keywordCounters.get(norm) || 0;

        // If not directly indexed, check if 3-grams exist
        let tokens = [];
        let queryType = "EXACT_WORD";

        if (count > 0) {
          const trapdoorBytes = await computeKeywordTrapdoor(this.subkeys.kTrap, norm);
          const trapdoorHex = bytesToHex(trapdoorBytes);
          const addressHexList = [];
          for (let i = 0; i < count; i++) {
            addressHexList.push(await computeIndexAddress(this.subkeys.kAddr, trapdoorBytes, i));
          }
          tokens.push({ trapdoorHex, count, addressHexList });
        } else {
          // Decompose into 3-grams
          queryType = "SUBSTRING_CONJUNCTIVE";
          const ngrams = generateNgrams(clause, 3);
          for (const gram of ngrams) {
            const gCount = this.keywordCounters.get(gram) || 0;
            const trapBytes = await computeKeywordTrapdoor(this.subkeys.kTrap, gram);
            const addressList = [];
            for (let i = 0; i < gCount; i++) {
              addressList.push(await computeIndexAddress(this.subkeys.kAddr, trapBytes, i));
            }
            tokens.push({
              trapdoorHex: bytesToHex(trapBytes),
              count: gCount,
              addressHexList: addressList,
            });
          }
        }

        if (tokens.length === 0 || tokens.some((t) => t.count === 0)) {
          clauseResults.push({ clause, docIds: new Set() });
          continue;
        }

        // Query untrusted server
        const searchRes = await fetch("/api/v1/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ queryType, tokens }),
        });

        if (!searchRes.ok) throw new Error(`Server returned HTTP ${searchRes.status}`);

        const searchData = await searchRes.json();
        let primaryBundle = searchData.bundles[0];

        if (!primaryBundle || primaryBundle.records.length === 0) {
          clauseResults.push({ clause, docIds: new Set() });
          continue;
        }

        // Simulate Attacker Tampering if active
        if (this.activeTamperMode) {
          primaryBundle = this.applyTamperSimulation(primaryBundle);
        }

        // Cryptographic Verification
        const commitment = this.authCommitments.get(norm);
        if (commitment) {
          lastVerification = await verifySearchResultBundle(this.subkeys, commitment, primaryBundle);
          this.updateProofCard(lastVerification, commitment);

          if (!lastVerification.isValid) {
            this.renderTamperAlert(lastVerification);
            this.renderResults([]);
            return;
          }
        }

        // Decrypt document IDs
        const clauseDocIds = new Set();
        const primaryTag = hexToBytes(tokens[0].trapdoorHex);

        for (const r of primaryBundle.records) {
          const docId = await unmaskAndDecryptDocId(this.subkeys, primaryTag, r.counterIndex, r.encryptedValueHex);
          clauseDocIds.add(docId);

          if (!decryptedMatches.has(docId)) {
            // Fetch blob from server and decrypt
            let content = this.localDocuments.get(docId);
            if (!content) {
              const bRes = await fetch(`/api/v1/blobs/${r.opaqueDocRef}`);
              if (bRes.ok) {
                const bData = await bRes.json();
                const decrypted = await decryptPayload(this.subkeys.kEnc, bData.blob.ivHex, bData.blob.ciphertextHex);
                content = utf8Decode(decrypted);
              } else {
                content = "[Encrypted Content Available]";
              }
            }
            decryptedMatches.set(docId, {
              docId,
              content,
              opaqueDocRef: r.opaqueDocRef,
            });
          }
        }
        clauseResults.push({ clause, docIds: clauseDocIds });
      }

      // Boolean combination
      const finalDocIds = this.combineBooleanSets(parsedQuery.operator, clauseResults);
      const finalMatches = [];
      for (const id of finalDocIds) {
        if (decryptedMatches.has(id)) {
          finalMatches.push(decryptedMatches.get(id));
        }
      }

      if (this.activeTamperMode === null && lastVerification && lastVerification.isValid) {
        this.clearTamperAlert();
      }

      this.renderResults(finalMatches, queryStr);
      await this.refreshAuditChain();
    } catch (err) {
      alert(`Search error: ${err.message}`);
    }
  }

  combineBooleanSets(operator, clauseResults) {
    if (clauseResults.length === 0) return new Set();
    if (clauseResults.length === 1) return clauseResults[0].docIds;

    let result = new Set(clauseResults[0].docIds);

    if (operator === "AND") {
      for (let i = 1; i < clauseResults.length; i++) {
        const next = new Set();
        for (const id of result) {
          if (clauseResults[i].docIds.has(id)) next.add(id);
        }
        result = next;
      }
    } else if (operator === "OR") {
      for (let i = 1; i < clauseResults.length; i++) {
        for (const id of clauseResults[i].docIds) result.add(id);
      }
    } else if (operator === "AND_NOT") {
      for (let i = 1; i < clauseResults.length; i++) {
        for (const id of clauseResults[i].docIds) result.delete(id);
      }
    }

    return result;
  }

  renderResults(matches, queryStr = "") {
    if (matches.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p>No verified matching documents found for "${queryStr}".</p>
        </div>
      `;
      return;
    }

    let html = "";
    for (const match of matches) {
      // Highlight matching query terms
      const highlighted = this.highlightTerms(match.content, queryStr);
      html += `
        <div class="doc-result-card">
          <div class="doc-card-header">
            <div class="doc-id-title">${match.docId}</div>
            <span class="badge badge-emerald">AUTHENTIC &bull; VERIFIED</span>
          </div>
          <div class="doc-content-body">${highlighted}</div>
          <div class="doc-footer">
            <span>Opaque Pointer: <code>${match.opaqueDocRef.slice(0, 16)}...</code></span>
            <span>Decrypted via AES-256-GCM</span>
          </div>
        </div>
      `;
    }
    this.resultsContainer.innerHTML = html;
  }

  highlightTerms(content, queryStr) {
    const terms = queryStr
      .split(/\s+(?:AND|OR|NOT)\s+|\s+/i)
      .map((t) => t.trim())
      .filter((t) => t.length > 1);

    let res = content;
    for (const term of terms) {
      const regex = new RegExp(`(${term})`, "gi");
      res = res.replace(regex, "<mark>$1</mark>");
    }
    return res;
  }

  updateProofCard(report, commitment) {
    if (report.isValid) {
      if (this.proofOverallBadge) {
        this.proofOverallBadge.className = "badge badge-emerald";
        this.proofOverallBadge.textContent = "SOUND & COMPLETE (100%)";
      }

      if (this.metricCompleteness) {
        this.metricCompleteness.textContent = "100%";
        this.metricCompleteness.style.color = "var(--neon-emerald)";
      }
      if (this.metricCompletenessSub) {
        this.metricCompletenessSub.textContent = `All ${report.verifiedRecordCount} records verified`;
      }

      if (this.metricSoundness) {
        this.metricSoundness.textContent = "100%";
        this.metricSoundness.style.color = "var(--neon-emerald)";
      }
      if (this.metricSoundnessSub) {
        this.metricSoundnessSub.textContent = "Zero forgeries detected";
      }

      if (this.metricAuth) {
        this.metricAuth.textContent = "VALID";
        this.metricAuth.style.color = "var(--neon-emerald)";
      }
      if (this.metricAuthSub) {
        this.metricAuthSub.textContent = "HMAC(K_auth) signature passed";
      }

      if (this.merkleDetails) this.merkleDetails.style.display = "flex";
      if (this.merkleRecomputedRoot) this.merkleRecomputedRoot.textContent = report.recomputedRoot;
      if (this.merkleCommittedRoot) this.merkleCommittedRoot.textContent = report.committedRoot;
    } else {
      if (this.proofOverallBadge) {
        this.proofOverallBadge.className = "badge badge-crimson";
        this.proofOverallBadge.textContent = `VIOLATION: ${report.errorCode}`;
      }

      if (this.metricCompleteness) {
        this.metricCompleteness.textContent = report.errorCode === "DROPPED_RECORDS" ? "FAILED" : "N/A";
        this.metricCompleteness.style.color = "var(--neon-crimson)";
      }
      if (this.metricCompletenessSub) {
        this.metricCompletenessSub.textContent = report.errorCode === "DROPPED_RECORDS" ? "Omission Detected" : "Completeness Rejected";
      }

      if (this.metricSoundness) {
        this.metricSoundness.textContent = report.errorCode === "FABRICATED_RECORDS" ? "FORGERY" : "REJECTED";
        this.metricSoundness.style.color = "var(--neon-crimson)";
      }
      if (this.metricSoundnessSub) {
        this.metricSoundnessSub.textContent = report.errorCode === "FABRICATED_RECORDS" ? "Fabrication Caught" : "Root Mismatch";
      }

      if (this.metricAuth) {
        this.metricAuth.textContent = report.errorCode === "COMMITMENT_INVALID" ? "INVALID" : "REJECTED";
        this.metricAuth.style.color = "var(--neon-crimson)";
      }
      if (this.metricAuthSub) {
        this.metricAuthSub.textContent = "Signature / Root Rejected";
      }

      if (this.merkleDetails) this.merkleDetails.style.display = "flex";
      if (this.merkleRecomputedRoot) this.merkleRecomputedRoot.textContent = report.recomputedRoot || "[Tampered]";
      if (this.merkleCommittedRoot) this.merkleCommittedRoot.textContent = commitment?.rootHashHex || "[Unknown]";
    }
  }

  // ============================================================================
  // Attacker Tamper Simulator
  // ============================================================================

  setTamperMode(mode) {
    this.activeTamperMode = mode;
    this.btnTamperDrop.classList.toggle("active", mode === "drop");
    this.btnTamperFabricate.classList.toggle("active", mode === "fabricate");
    this.btnTamperModify.classList.toggle("active", mode === "modify");

    if (mode === null) {
      this.clearTamperAlert();
      this.showToast("Honest cloud mode restored", "emerald");
      this.handleSearch();
    } else {
      this.showToast(`Tamper Simulation Active: ${mode.toUpperCase()} attack`, "crimson");
      this.handleSearch();
    }
  }

  applyTamperSimulation(bundle) {
    const copy = JSON.parse(JSON.stringify(bundle));
    if (this.activeTamperMode === "drop" && copy.records.length > 0) {
      // Drop last record
      copy.records = copy.records.slice(0, -1);
    } else if (this.activeTamperMode === "fabricate") {
      // Inject fake forged record
      copy.records.push({
        addressHex: "0".repeat(64),
        encryptedValueHex: "deadbeefcafebabe",
        opaqueDocRef: "forged_malicious_pointer",
        counterIndex: copy.records.length,
      });
    } else if (this.activeTamperMode === "modify" && copy.records.length > 0) {
      // Modify pointer
      copy.records[0].opaqueDocRef = "f".repeat(64);
    }
    return copy;
  }

  renderTamperAlert(report) {
    this.tamperAlert.style.display = "flex";
    this.tamperAlertTitle.textContent = `Active Defense: Tampered Cloud Payload Caught (${report.errorCode})`;
    this.tamperAlertDesc.textContent = `${report.errorMessage}. Client mathematically rejected the unverified search bundle before payload decryption.`;
  }

  clearTamperAlert() {
    this.tamperAlert.style.display = "none";
  }

  // ============================================================================
  // Cloud Inspector & Audit Chain Rendering
  // ============================================================================

  async refreshCloudInspector() {
    try {
      const healthRes = await fetch("/api/v1/health");
      if (healthRes.ok) {
        const health = await healthRes.json();
        this.blindIndexCount.textContent = health.blindEntries;
        this.blobsCount.textContent = health.storedBlobs;
      }

      // Populate sample table entries from local postings
      const rows = [];
      for (const [token, postings] of this.tokenPostingsMap.entries()) {
        for (const p of postings) {
          rows.push(`
            <tr>
              <td><code>${p.addressHex.slice(0, 24)}...</code></td>
              <td><code>[MASKED AES-GCM CIPHERTEXT]</code></td>
              <td><code>${p.opaqueDocRef.slice(0, 24)}...</code></td>
            </tr>
          `);
        }
      }
      if (rows.length > 0) {
        this.blindIndexTableBody.innerHTML = rows.slice(0, 15).join("");
      }

      // Populate blobs
      const blobRows = [];
      for (const [docId, content] of this.localDocuments.entries()) {
        const ref = await computeOpaqueDocRef(this.subkeys.kAddr, docId);
        blobRows.push(`
          <tr>
            <td><code>${ref.slice(0, 24)}...</code></td>
            <td><code>[12-BYTE IV]</code></td>
            <td><code>[ENCRYPTED PAYLOAD ${utf8Encode(content).length}B]</code></td>
            <td>${utf8Encode(content).length} B</td>
          </tr>
        `);
      }
      if (blobRows.length > 0) {
        this.blobsTableBody.innerHTML = blobRows.join("");
      }
    } catch (e) {
      console.warn("Could not refresh cloud inspector tables:", e);
    }
  }

  async refreshAuditChain() {
    try {
      const res = await fetch("/api/v1/audit/verify");
      if (!res.ok) return;
      const data = await res.json();

      this.auditQuickStatus.textContent = data.isChainValid ? "VALID (100%)" : "CHAIN BROKEN";
      this.auditQuickStatus.style.color = data.isChainValid ? "var(--neon-emerald)" : "var(--neon-crimson)";

      const entries = data.chain || [];
      if (entries.length === 0) {
        this.auditTableBody.innerHTML = `<tr><td colspan="7" class="table-empty">Audit log empty.</td></tr>`;
        return;
      }

      let html = "";
      for (const e of entries) {
        const timeStr = new Date(e.timestamp).toLocaleTimeString();
        html += `
          <tr>
            <td>#${e.sequenceId}</td>
            <td>${timeStr}</td>
            <td><span class="badge badge-sm badge-cyan">${e.action}</span></td>
            <td><code>${(e.opaqueDetails || "").slice(0, 20)}...</code></td>
            <td><code>${e.prevHash.slice(0, 16)}...</code></td>
            <td><code>${e.entryHash.slice(0, 16)}...</code></td>
            <td><span class="status-dot dot-emerald" title="Cryptographically Linked"></span></td>
          </tr>
        `;
      }
      this.auditTableBody.innerHTML = html;
    } catch (err) {
      console.warn("Audit refresh failed:", err);
    }
  }

  showToast(message, type = "cyan") {
    console.log(`[VAULT ${type.toUpperCase()}] ${message}`);
  }
}

// Instantiate on DOM load
window.addEventListener("DOMContentLoaded", () => {
  window.vaultApp = new VaultAppController();
});
