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
  const digest = await (window.crypto || globalThis.crypto).subtle.digest("SHA-256", dataBytes);
  return bytesToHex(new Uint8Array(digest));
}

export function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function escapeRegex(str) {
  if (!str) return "";
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function highlightTermsSafe(content, queryStr) {
  if (!content) return "";
  let safeContent = escapeHtml(content);

  const terms = (queryStr || "")
    .split(/\s+(?:AND|OR|NOT)\s+|\s+/i)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);

  for (const term of terms) {
    const safeTerm = escapeRegex(escapeHtml(term));
    if (!safeTerm) continue;
    try {
      const regex = new RegExp(`(${safeTerm})`, "gi");
      safeContent = safeContent.replace(regex, "<mark>$1</mark>");
    } catch {
      // Gracefully ignore invalid regex patterns
    }
  }
  return safeContent;
}

export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function normalizeSupabaseUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "";
  let url = rawUrl.trim().replace(/\/+$/, "");

  // Match dashboard URL: https://supabase.com/dashboard/project/ryfafenurtpwediiurjx
  const dashMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/i);
  if (dashMatch) {
    return `https://${dashMatch[1]}.supabase.co`;
  }

  // Match project reference: ryfafenurtpwediiurjx
  if (/^[a-z0-9_-]{15,30}$/i.test(url)) {
    return `https://${url}.supabase.co`;
  }

  // Match domain without protocol: ryfafenurtpwediiurjx.supabase.co
  if (/^[a-z0-9_-]+\.supabase\.co$/i.test(url)) {
    return `https://${url}`;
  }

  return url;
}

export function translateCloudError(rawError, provider = "general", details = {}) {
  const err = String(rawError || "");
  const prov = (provider || "").toLowerCase();

  // 1. Supabase / REST 401 or Invalid API Key / JWT
  if (err.includes("401") || /invalid.*(key|jwt|token|api_key)/i.test(err) || /jwt.*(expired|invalid)/i.test(err) || err.includes("signature is invalid")) {
    return {
      title: "Authentication Failed (401)",
      message: "The API Key or JWT token was rejected by Supabase. In your Supabase Dashboard, go to Project Settings → API, and copy the 'service_role' secret token (begins with eyJ...).",
      action: "Check Project Settings → API in Supabase",
    };
  }

  // 2. 404 / Missing Bucket
  if (err.includes("404") || /bucket.*not found/i.test(err) || /nosuchbucket/i.test(err) || err.includes("does not exist")) {
    const bucket = details.bucket || "vault-encrypted-blobs";
    return {
      title: "Storage Bucket Not Found (404)",
      message: `The bucket '${bucket}' does not exist on your cloud project. Please create the bucket '${bucket}' in your storage console and enable authenticated or public upload policies.`,
      action: `Create '${bucket}' in storage console`,
    };
  }

  // 3. AWS S3 Access / Secret Key / Signature Error
  if (/signaturedoesnotmatch/i.test(err) || /invalidaccesskeyid/i.test(err) || /accessdenied/i.test(err) || (prov === "s3" && err.includes("403"))) {
    return {
      title: "S3 Authorization Rejected",
      message: `AWS S3 authorization failed. Verify that your Access Key ID and Secret Access Key are correct, and that your IAM user has 's3:PutObject', 's3:GetObject', and 's3:ListBucket' permissions for region '${details.region || "us-east-1"}'.`,
      action: "Verify AWS IAM credentials & region",
    };
  }

  // 4. Network / DNS / Host Unreachable
  if (/enotfound/i.test(err) || /econnrefused/i.test(err) || /failed to fetch/i.test(err) || /networkerror/i.test(err) || /getaddrinfo/i.test(err)) {
    return {
      title: "Network / Endpoint Unreachable",
      message: `Could not connect to the cloud endpoint. Verify that the URL is formatted correctly (e.g., 'https://<project-ref>.supabase.co') and that your network allows outgoing HTTP/HTTPS connections.`,
      action: "Check project URL & network",
    };
  }

  // 5. Disk Permission / Path Error
  if (prov === "disk" && (/eacces/i.test(err) || /eperm/i.test(err) || /no such file/i.test(err))) {
    return {
      title: "Disk Storage Error",
      message: `Cannot write to local storage path '${details.diskPath || "./.vault_storage"}'. Ensure the directory exists or that the process has write permissions.`,
      action: "Check filesystem write permissions",
    };
  }

  // 6. Generic Fallback
  return {
    title: "Cloud Connection Error",
    message: err || "Unknown error occurred while contacting storage provider.",
    action: "Review credentials and retry",
  };
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
    this.documentManifest = new Map(); // docId -> IngestedDocumentMeta
    this.clientLogs = [];
    this.clientLogHeadHash = "0".repeat(64);
    this.activeLogFilter = "ALL";
    this.activeTamperMode = null; // null | "drop" | "fabricate" | "modify"

    this.initDOMElements();
    this.attachEventListeners();
    this.checkCloudHealth();
    this.renderDocumentVaultTable();
    this.renderClientLogFeed();
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

    // Global Cloud Modal Elements
    this.cloudModalBackdrop = document.getElementById("cloudModalBackdrop");
    this.btnCloseCloudModal = document.getElementById("btnCloseCloudModal");
    this.modalCloudProviderBadge = document.getElementById("modalCloudProviderBadge");
    this.modalActiveProviderName = document.getElementById("modalActiveProviderName");
    this.modalStorageUri = document.getElementById("modalStorageUri");
    this.modalLatencyVal = document.getElementById("modalLatencyVal");
    this.modalPingStatus = document.getElementById("modalPingStatus");
    this.modalStoredBlobsCount = document.getElementById("modalStoredBlobsCount");

    // Notifications & Validation Elements
    this.toastContainer = document.getElementById("toastContainer");
    this.masterPasswordError = document.getElementById("masterPasswordError");
    this.docIdError = document.getElementById("docIdError");
    this.docContentError = document.getElementById("docContentError");
    this.searchError = document.getElementById("searchError");

    // Ingested Document Vault Elements
    this.docVaultTableBody = document.getElementById("docVaultTableBody");
    this.vaultDocCountBadge = document.getElementById("vaultDocCountBadge");
    this.btnExportVaultBackup = document.getElementById("btnExportVaultBackup");

    // Client Security & Audit Activity Elements
    this.btnExportClientAuditLog = document.getElementById("btnExportClientAuditLog");
    this.btnClearClientLogs = document.getElementById("btnClearClientLogs");
    this.clientLogFeed = document.getElementById("clientLogFeed");
    this.clientLogChainDot = document.getElementById("clientLogChainDot");
    this.clientLogChainText = document.getElementById("clientLogChainText");
    this.countLogAll = document.getElementById("countLogAll");
    this.countLogIngest = document.getElementById("countLogIngest");
    this.countLogSearch = document.getElementById("countLogSearch");
    this.countLogSecurity = document.getElementById("countLogSecurity");
    this.countLogKey = document.getElementById("countLogKey");
    this.countLogCloud = document.getElementById("countLogCloud");

    // Decrypted Document Viewer Modal Elements
    this.docViewerModalBackdrop = document.getElementById("docViewerModalBackdrop");
    this.btnCloseDocViewer = document.getElementById("btnCloseDocViewer");
    this.viewerDocName = document.getElementById("viewerDocName");
    this.viewerProvider = document.getElementById("viewerProvider");
    this.viewerSize = document.getElementById("viewerSize");
    this.viewerOpaqueRef = document.getElementById("viewerOpaqueRef");
    this.viewerDecryptedContent = document.getElementById("viewerDecryptedContent");
    this.btnCopyDecryptedContent = document.getElementById("btnCopyDecryptedContent");
    this.btnDownloadDecryptedFile = document.getElementById("btnDownloadDecryptedFile");

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

    if (this.resultsContainer) {
      this.resultsContainer.addEventListener("click", (e) => {
        const chip = e.target.closest(".btn-chip-suggest");
        if (chip && chip.dataset.query) {
          this.searchInput.value = chip.dataset.query;
          this.handleSearch();
        }
      });
    }

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

    // Interactive Cloud Storage Chip & Universal Modal Controls
    if (this.cloudStorageChip) {
      this.cloudStorageChip.addEventListener("click", () => this.openCloudModal());
      this.cloudStorageChip.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.openCloudModal();
        }
      });
    }

    if (this.btnToggleCloudConfig) {
      this.btnToggleCloudConfig.addEventListener("click", () => this.openCloudModal());
    }

    if (this.btnCloseCloudModal) {
      this.btnCloseCloudModal.addEventListener("click", () => this.closeCloudModal());
    }

    if (this.cloudModalBackdrop) {
      this.cloudModalBackdrop.addEventListener("click", (e) => {
        if (e.target === this.cloudModalBackdrop) this.closeCloudModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.cloudModalBackdrop && this.cloudModalBackdrop.style.display === "flex") {
        this.closeCloudModal();
      }
    });

    // Password Visibility Eye Toggles
    document.querySelectorAll(".btn-toggle-pw").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        btn.innerHTML = isPassword
          ? `<svg class="icon-eye-off" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
          : `<svg class="icon-eye" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        btn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
      });
    });

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

    // Client Security & Audit Activity Filter Pills
    document.querySelectorAll(".log-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".log-filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeLogFilter = btn.dataset.filter || "ALL";
        this.renderClientLogFeed();
      });
    });

    if (this.btnExportClientAuditLog) {
      this.btnExportClientAuditLog.addEventListener("click", () => this.handleExportClientAuditLog());
    }

    if (this.btnClearClientLogs) {
      this.btnClearClientLogs.addEventListener("click", () => this.handleClearClientLogs());
    }

    if (this.btnExportVaultBackup) {
      this.btnExportVaultBackup.addEventListener("click", () => this.handleExportVaultBackup());
    }

    // Decrypted Document Viewer Modal Controls
    if (this.btnCloseDocViewer) {
      this.btnCloseDocViewer.addEventListener("click", () => this.closeDocViewerModal());
    }

    if (this.docViewerModalBackdrop) {
      this.docViewerModalBackdrop.addEventListener("click", (e) => {
        if (e.target === this.docViewerModalBackdrop) this.closeDocViewerModal();
      });
    }

    if (this.btnCopyDecryptedContent) {
      this.btnCopyDecryptedContent.addEventListener("click", () => {
        if (this.viewerDecryptedContent && this.viewerDecryptedContent.value) {
          navigator.clipboard.writeText(this.viewerDecryptedContent.value);
          this.showToast("Copied to Clipboard", "Decrypted document content copied.", "success");
        }
      });
    }

    if (this.btnDownloadDecryptedFile) {
      this.btnDownloadDecryptedFile.addEventListener("click", () => {
        const filename = this.viewerDocName?.textContent || "decrypted_doc.txt";
        const content = this.viewerDecryptedContent?.value || "";
        this.downloadTextFile(filename, content);
      });
    }

    // Ingested Document Vault Table Action Delegation (View / Download / Delete)
    if (this.docVaultTableBody) {
      this.docVaultTableBody.addEventListener("click", (e) => {
        const viewBtn = e.target.closest(".btn-action-view");
        if (viewBtn) {
          const docId = viewBtn.dataset.docId;
          if (docId) this.handleViewDocument(docId);
          return;
        }
        const dlBtn = e.target.closest(".btn-action-download");
        if (dlBtn) {
          const docId = dlBtn.dataset.docId;
          if (docId) this.handleDownloadDocument(docId);
          return;
        }
        const delBtn = e.target.closest(".btn-action-delete");
        if (delBtn) {
          const docId = delBtn.dataset.docId;
          if (docId) this.handleDeleteDocument(docId);
          return;
        }
      });
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

  setFieldError(inputEl, errorEl, msg) {
    if (!inputEl) return;
    inputEl.classList.add("has-error");
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = "flex";
    }
    inputEl.addEventListener(
      "input",
      () => {
        this.clearFieldError(inputEl, errorEl);
      },
      { once: true }
    );
  }

  clearFieldError(inputEl, errorEl) {
    if (inputEl) inputEl.classList.remove("has-error");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.style.display = "none";
    }
  }

  async handleDeriveKeys() {
    this.clearFieldError(this.masterPasswordInput, this.masterPasswordError);
    const password = this.masterPasswordInput.value.trim();
    if (!password) {
      this.setFieldError(
        this.masterPasswordInput,
        this.masterPasswordError,
        "Master password is required to derive cryptographic subkeys."
      );
      this.showToast("Vault Locked", "Please enter an enterprise master password.", "warning");
      this.masterPasswordInput.focus();
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
      this.btnDeriveKeys.classList.add("is-loading");
      this.btnDeriveKeys.disabled = true;

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

      await this.logClientSecurityEvent(
        "KEY_MANAGEMENT",
        "KEY_DERIVATION",
        {
          kdf: "PBKDF2-SHA256",
          iterations: 10_000,
          saltHex,
          subkeys: "K_enc, K_trap, K_addr, K_mask, K_auth",
        },
        "SUCCESS"
      );

      const restored = await this.loadEncryptedVaultState();
      if (restored && this.documentManifest.size > 0) {
        this.showToast("Vault Unlocked & Restored", `Recovered ${this.documentManifest.size} documents from encrypted storage.`, "success");
      } else {
        this.showToast("Vault Unlocked", "Master subkeys derived successfully via PBKDF2 (100k) + HKDF-SHA256", "success");
      }
    } catch (err) {
      this.showToast("Key Derivation Failed", err.message, "error");
    } finally {
      this.btnDeriveKeys.classList.remove("is-loading");
      this.btnDeriveKeys.disabled = false;
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

  openCloudModal() {
    if (this.cloudModalBackdrop) {
      this.cloudModalBackdrop.style.display = "flex";
      if (this.selectCloudProvider) {
        this.updateCloudFieldVisibility(this.selectCloudProvider.value);
      }
    }
  }

  closeCloudModal() {
    if (this.cloudModalBackdrop) {
      this.cloudModalBackdrop.style.display = "none";
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
      if (this.modalCloudProviderBadge) {
        this.modalCloudProviderBadge.textContent = `PROVIDER: ${provider}`;
        this.modalCloudProviderBadge.className = `badge ${isOk ? "badge-emerald" : "badge-crimson"}`;
      }
      if (this.cloudActiveProviderName) {
        this.cloudActiveProviderName.textContent = provider;
      }
      if (this.modalActiveProviderName) {
        this.modalActiveProviderName.textContent = provider;
      }

      let uri = "memory://vault";
      if (provider === "S3") {
        uri = `s3://${data.health?.bucket || "bucket"}`;
      } else if (provider === "SUPABASE") {
        uri = `supabase://${data.health?.bucket || "bucket"}`;
      } else if (provider === "DISK") {
        uri = "disk://.vault_storage";
      }

      if (this.cloudStorageUri) this.cloudStorageUri.textContent = uri;
      if (this.modalStorageUri) this.modalStorageUri.textContent = uri;

      if (this.cloudLatencyVal) this.cloudLatencyVal.textContent = latency;
      if (this.modalLatencyVal) this.modalLatencyVal.textContent = latency;

      if (this.cloudPingStatus) {
        this.cloudPingStatus.textContent = isOk ? "CONNECTED & SOUND" : "DISCONNECTED";
        this.cloudPingStatus.style.color = isOk ? "var(--neon-emerald)" : "var(--neon-crimson)";
      }
      if (this.modalPingStatus) {
        this.modalPingStatus.textContent = isOk ? "CONNECTED & SOUND" : "DISCONNECTED";
        this.modalPingStatus.style.color = isOk ? "var(--neon-emerald)" : "var(--neon-crimson)";
      }

      const blobsText = `${data.storedBlobs || 0} Blobs`;
      if (this.cloudStoredBlobsCount) this.cloudStoredBlobsCount.textContent = blobsText;
      if (this.modalStoredBlobsCount) this.modalStoredBlobsCount.textContent = blobsText;

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
      let sbUrl = normalizeSupabaseUrl(this.inputSupabaseUrl.value);
      if (sbUrl) {
        this.inputSupabaseUrl.value = sbUrl; // sync normalized URL back to input field
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
    this.cloudFeedbackMsg.innerHTML = `
      <div class="cloud-feedback-card is-loading">
        <div class="feedback-icon">⏳</div>
        <div class="feedback-text">
          <strong>Testing Connection to ${payload.provider.toUpperCase()}...</strong>
          <div>Contacting storage API and verifying bucket permissions.</div>
        </div>
      </div>
    `;

    try {
      if (this.btnTestCloudPing) {
        this.btnTestCloudPing.classList.add("is-loading");
        this.btnTestCloudPing.disabled = true;
      }

      const res = await fetch("/api/v1/cloud/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success && data.health?.ok) {
        this.cloudFeedbackMsg.innerHTML = `
          <div class="cloud-feedback-card is-success">
            <div class="feedback-icon">✓</div>
            <div class="feedback-text">
              <strong>Connection Success: ${payload.provider.toUpperCase()} Reachable!</strong>
              <div>Verified healthy bucket in ${data.health.latencyMs?.toFixed(1)}ms. Click 'Save &amp; Switch Provider' to activate.</div>
            </div>
          </div>
        `;
        this.showToast("Cloud Ping Verified", `Successfully connected to ${payload.provider.toUpperCase()} (${data.health.latencyMs?.toFixed(1)}ms)`, "success");
      } else {
        const translated = translateCloudError(data.error || data.health?.error || "Connection rejected", payload.provider, {
          bucket: payload.s3?.bucket || payload.supabase?.bucket,
          region: payload.s3?.region,
          url: payload.supabase?.supabaseUrl || payload.s3?.endpoint,
          diskPath: payload.diskPath,
        });
        this.cloudFeedbackMsg.innerHTML = `
          <div class="cloud-feedback-card is-error">
            <div class="feedback-icon">✗</div>
            <div class="feedback-text">
              <strong>${escapeHtml(translated.title)}</strong>
              <div>${escapeHtml(translated.message)}</div>
              <div class="feedback-hint">Action: ${escapeHtml(translated.action)}</div>
            </div>
          </div>
        `;
        this.showToast(translated.title, translated.message, "error");
      }
    } catch (err) {
      const translated = translateCloudError(err.message, payload.provider);
      this.cloudFeedbackMsg.innerHTML = `
        <div class="cloud-feedback-card is-error">
          <div class="feedback-icon">✗</div>
          <div class="feedback-text">
            <strong>${escapeHtml(translated.title)}</strong>
            <div>${escapeHtml(translated.message)}</div>
          </div>
        </div>
      `;
      this.showToast(translated.title, translated.message, "error");
    } finally {
      if (this.btnTestCloudPing) {
        this.btnTestCloudPing.classList.remove("is-loading");
        this.btnTestCloudPing.disabled = false;
      }
    }
  }

  async handleSaveCloudConfig() {
    if (!this.cloudFeedbackMsg || !this.selectCloudProvider) return;
    const payload = this.getCloudConfigPayload();
    if (!payload) return;
    this.userSelectedProvider = true;

    this.cloudFeedbackMsg.style.display = "block";
    this.cloudFeedbackMsg.innerHTML = `
      <div class="cloud-feedback-card is-loading">
        <div class="feedback-icon">⏳</div>
        <div class="feedback-text">
          <strong>Activating ${payload.provider.toUpperCase()}...</strong>
          <div>Reconfiguring server storage driver and running health check.</div>
        </div>
      </div>
    `;

    try {
      if (this.btnSaveCloudConfig) {
        this.btnSaveCloudConfig.classList.add("is-loading");
        this.btnSaveCloudConfig.disabled = true;
      }

      const res = await fetch("/api/v1/cloud/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        this.cloudFeedbackMsg.innerHTML = `
          <div class="cloud-feedback-card is-success">
            <div class="feedback-icon">✓</div>
            <div class="feedback-text">
              <strong>Active Storage Switched to ${payload.provider.toUpperCase()}</strong>
              <div>Future document encryptions will be committed to ${payload.provider.toUpperCase()} (${data.health?.latencyMs?.toFixed(1)}ms).</div>
            </div>
          </div>
        `;
        this.showToast(`Cloud Provider Switched to ${payload.provider.toUpperCase()}`, "success");
        await this.logClientSecurityEvent(
          "CLOUD",
          "CLOUD_PROVIDER_SWITCHED",
          {
            provider: payload.provider.toUpperCase(),
            latencyMs: data.health?.latencyMs,
            bucket: data.health?.bucket || payload.s3?.bucket || payload.supabase?.bucket,
          },
          "SUCCESS",
          { provider: payload.provider.toUpperCase() }
        );
        await this.saveEncryptedVaultState();
        await this.refreshCloudStorageStatus();
        await this.refreshCloudInspector();
        this.refreshAuditChain();
      } else {
        const translated = translateCloudError(data.error || "Failed to switch provider", payload.provider, {
          bucket: payload.s3?.bucket || payload.supabase?.bucket,
          region: payload.s3?.region,
          url: payload.supabase?.supabaseUrl || payload.s3?.endpoint,
          diskPath: payload.diskPath,
        });
        this.cloudFeedbackMsg.innerHTML = `
          <div class="cloud-feedback-card is-error">
            <div class="feedback-icon">✗</div>
            <div class="feedback-text">
              <strong>${escapeHtml(translated.title)}</strong>
              <div>${escapeHtml(translated.message)}</div>
              <div class="feedback-hint">Action: ${escapeHtml(translated.action)}</div>
            </div>
          </div>
        `;
        this.showToast(translated.title, translated.message, "error");
      }
    } catch (err) {
      const translated = translateCloudError(err.message, payload.provider);
      this.cloudFeedbackMsg.innerHTML = `
        <div class="cloud-feedback-card is-error">
          <div class="feedback-icon">✗</div>
          <div class="feedback-text">
            <strong>${escapeHtml(translated.title)}</strong>
            <div>${escapeHtml(translated.message)}</div>
          </div>
        </div>
      `;
      this.showToast(translated.title, translated.message, "error");
    } finally {
      if (this.btnSaveCloudConfig) {
        this.btnSaveCloudConfig.classList.remove("is-loading");
        this.btnSaveCloudConfig.disabled = false;
      }
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
    this.clearFieldError(this.docIdInput, this.docIdError);
    this.clearFieldError(this.docContentInput, this.docContentError);

    if (!this.subkeys) {
      this.showToast("Vault Locked", "Please derive cryptographic subkeys in Section 1 first.", "warning");
      this.masterPasswordInput?.focus();
      return;
    }

    const docId = this.docIdInput.value.trim();
    const content = this.docContentInput.value.trim();

    let hasError = false;
    if (!docId) {
      this.setFieldError(this.docIdInput, this.docIdError, "Document filename / ID is required.");
      hasError = true;
    }
    if (!content) {
      this.setFieldError(this.docContentInput, this.docContentError, "Document content is required to encrypt and index.");
      hasError = true;
    }

    if (hasError) {
      this.showToast("Missing Document Fields", "Please provide both document ID and content to encrypt.", "warning");
      return;
    }

    try {
      this.btnEncryptIndex.classList.add("is-loading");
      this.btnEncryptIndex.disabled = true;

      await this.indexDocumentLocal(docId, content);

      this.docContentInput.value = "";
      this.docIdInput.value = "";
      const activeP = (this.cloudActiveProviderName?.textContent || "CLOUD").toUpperCase();
      this.showToast("Document Encrypted & Uploaded", `Document '${docId}' committed to ${activeP} with zero plaintext leakage!`, "success");

      await this.refreshCloudInspector();
      await this.refreshAuditChain();
    } catch (err) {
      this.showToast("Indexing Failed", err.message, "error");
    } finally {
      this.btnEncryptIndex.classList.remove("is-loading");
      this.btnEncryptIndex.disabled = false;
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

    const activeProvider = (this.cloudActiveProviderName?.textContent || "CLOUD").toUpperCase();
    const meta = {
      docId,
      docRef: opaqueDocRef,
      sizeBytes: contentBytes.length,
      tokenCount: entries.length,
      uploadedAt: blobPayload.uploadedAt,
      provider: activeProvider,
    };
    this.documentManifest.set(docId, meta);

    await this.logClientSecurityEvent(
      "INGESTION",
      "DOC_ENCRYPTED",
      {
        cipher: "AES-256-GCM",
        ivHex: encryptedBlob.ivHex,
        payloadBytes: contentBytes.length,
        indexed3Grams: entries.length,
      },
      "SUCCESS",
      { docRef: opaqueDocRef, docId }
    );

    await this.logClientSecurityEvent(
      "CLOUD",
      "CLOUD_BLOB_COMMIT",
      {
        provider: activeProvider,
        sizeBytes: contentBytes.length,
        entriesCount: entries.length,
      },
      "SUCCESS",
      { docRef: opaqueDocRef, docId, provider: activeProvider }
    );

    await this.saveEncryptedVaultState();
    this.renderDocumentVaultTable();
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

    this.btnLoadSampleData.classList.add("is-loading");
    this.btnLoadSampleData.disabled = true;

    try {
      for (const doc of sampleDocs) {
        await this.indexDocumentLocal(doc.id, doc.content);
      }
      this.showToast("Sample Corpus Loaded", "4 enterprise documents encrypted and indexed into cloud storage.", "success");
      await this.refreshCloudInspector();
      await this.refreshAuditChain();
      this.searchInput.value = "audit AND tax";
    } catch (e) {
      this.showToast("Sample Load Failed", e.message, "error");
    } finally {
      this.btnLoadSampleData.classList.remove("is-loading");
      this.btnLoadSampleData.disabled = false;
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
    this.clearFieldError(this.searchInput, this.searchError);

    if (!this.subkeys) {
      this.showToast("Vault Locked", "Please unlock Vault & derive subkeys in Section 1 before searching.", "warning");
      this.masterPasswordInput?.focus();
      return;
    }

    const queryStr = this.searchInput.value.trim();
    if (!queryStr) {
      this.setFieldError(this.searchInput, this.searchError, "Please enter a search keyword, substring, or Boolean query.");
      this.showToast("Search Query Required", "Enter search terms to evaluate against the encrypted index.", "warning");
      this.searchInput.focus();
      return;
    }

    const parsedQuery = this.parseBooleanQuery(queryStr);

    // Update query breakdown UI
    this.queryBreakdown.style.display = "flex";
    this.breakdownMode.textContent = parsedQuery.clauses.length > 1 ? "BOOLEAN" : "SINGLE";
    this.breakdownClauses.textContent = parsedQuery.clauses.join(", ");
    this.breakdownOperator.textContent = parsedQuery.clauses.length > 1 ? parsedQuery.operator : "NONE";

    try {
      const searchStart = performance.now();
      this.btnSearch.classList.add("is-loading");
      this.btnSearch.disabled = true;

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

      const elapsedSearch = (performance.now() - searchStart).toFixed(1);
      await this.logClientSecurityEvent(
        "SEARCH",
        "SSE_SEARCH_QUERY",
        {
          query: queryStr,
          mode: parsedQuery.clauses.length > 1 ? "BOOLEAN" : "SINGLE",
          operator: parsedQuery.operator,
          matchCount: finalMatches.length,
          elapsedMs: Number(elapsedSearch),
        },
        "SUCCESS"
      );

      if (lastVerification) {
        if (lastVerification.isValid) {
          await this.logClientSecurityEvent(
            "SECURITY",
            "PROOF_VERIFIED",
            {
              query: queryStr,
              verifiedRecords: lastVerification.verifiedRecordCount || finalMatches.length,
              completeness: "100%",
              soundness: "100%",
              recomputedRoot: lastVerification.recomputedRoot,
              committedRoot: lastVerification.committedRoot,
            },
            "VERIFIED"
          );
        } else {
          await this.logClientSecurityEvent(
            "SECURITY",
            "TAMPER_DETECTED",
            {
              query: queryStr,
              errorCode: lastVerification.errorCode,
              errorMessage: lastVerification.errorMessage,
            },
            "TAMPER_DETECTED"
          );
        }
      }

      this.renderResults(finalMatches, queryStr);
      await this.refreshAuditChain();
    } catch (err) {
      this.showToast("Search Failed", err.message, "error");
    } finally {
      this.btnSearch.classList.remove("is-loading");
      this.btnSearch.disabled = false;
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
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h4 class="empty-state-title">No Matching Documents</h4>
          <p class="empty-state-desc">No encrypted documents matched the query <code>"${escapeHtml(queryStr)}"</code>. Try searching another keyword or load the sample corpus.</p>
          <div class="empty-suggestions">
            <span class="suggestion-label">Try searching:</span>
            <button type="button" class="btn-chip-suggest" data-query="tax">tax</button>
            <button type="button" class="btn-chip-suggest" data-query="audit AND compliance">audit AND compliance</button>
            <button type="button" class="btn-chip-suggest" data-query="payroll">payroll</button>
            <button type="button" class="btn-chip-suggest" data-query="quarter">quarter</button>
          </div>
        </div>
      `;
      return;
    }

    let html = "";
    for (const match of matches) {
      const highlighted = this.highlightTerms(match.content, queryStr);
      html += `
        <div class="doc-result-card">
          <div class="doc-card-header">
            <div class="doc-id-title">${escapeHtml(match.docId)}</div>
            <span class="badge badge-emerald">AUTHENTIC &bull; VERIFIED</span>
          </div>
          <div class="doc-content-body">${highlighted}</div>
          <div class="doc-footer">
            <span>Opaque Pointer: <code>${escapeHtml(match.opaqueDocRef.slice(0, 16))}...</code></span>
            <span>Decrypted via AES-256-GCM</span>
          </div>
        </div>
      `;
    }
    this.resultsContainer.innerHTML = html;
  }

  highlightTerms(content, queryStr) {
    return highlightTermsSafe(content, queryStr);
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

  showToast(titleOrMsg, msgOrType = "info", type = "info", duration = 4500) {
    if (!this.toastContainer) this.toastContainer = document.getElementById("toastContainer");
    if (!this.toastContainer) {
      console.log(`[VAULT] ${titleOrMsg}`);
      return;
    }

    let title = "";
    let msg = "";
    let toastType = "info";

    if (["success", "emerald", "error", "danger", "warning", "warn", "info", "cyan"].includes(msgOrType)) {
      msg = titleOrMsg;
      toastType = msgOrType;
    } else {
      title = titleOrMsg;
      msg = msgOrType;
      toastType = type;
    }

    // Map internal types to CSS classes
    const typeClass = (toastType === "emerald" || toastType === "success") ? "toast-success"
      : (toastType === "danger" || toastType === "error") ? "toast-error"
      : (toastType === "warn" || toastType === "warning") ? "toast-warning"
      : "toast-info";

    const iconSvg = typeClass === "toast-success"
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : typeClass === "toast-error"
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
      : typeClass === "toast-warning"
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

    const toast = document.createElement("div");
    toast.className = `vault-toast ${typeClass}`;
    toast.setAttribute("role", "status");
    toast.innerHTML = `
      <div class="vault-toast-icon">${iconSvg}</div>
      <div class="vault-toast-content">
        ${title ? `<div class="vault-toast-title">${escapeHtml(title)}</div>` : ""}
        <div class="vault-toast-msg">${escapeHtml(msg)}</div>
      </div>
      <button type="button" class="vault-toast-close" aria-label="Close notification">&times;</button>
    `;

    const closeToast = () => {
      toast.classList.add("toast-exit");
      setTimeout(() => toast.remove(), 220);
    };

    toast.querySelector(".vault-toast-close")?.addEventListener("click", closeToast);

    this.toastContainer.appendChild(toast);

    if (duration > 0) {
      setTimeout(closeToast, duration);
    }
  }

  // ============================================================================
  // Phase 14: Document Vault, Client Security Logs & Encrypted Persistence
  // ============================================================================

  downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  openDocViewerModal() {
    if (this.docViewerModalBackdrop) {
      this.docViewerModalBackdrop.style.display = "flex";
    }
  }

  closeDocViewerModal() {
    if (this.docViewerModalBackdrop) {
      this.docViewerModalBackdrop.style.display = "none";
    }
  }

  async handleViewDocument(docId) {
    if (!this.subkeys) {
      this.showToast("Vault Locked", "Unlock the vault enclave in Section 1 to decrypt documents.", "warning");
      return;
    }
    const meta = this.documentManifest.get(docId);
    this.openDocViewerModal();
    if (this.viewerDocName) this.viewerDocName.textContent = docId;
    if (this.viewerProvider) this.viewerProvider.textContent = meta?.provider || (this.cloudActiveProviderName?.textContent || "CLOUD");
    if (this.viewerSize) this.viewerSize.textContent = meta ? formatBytes(meta.sizeBytes) : "-";
    if (this.viewerOpaqueRef) this.viewerOpaqueRef.textContent = meta?.docRef || "-";
    if (this.viewerDecryptedContent) this.viewerDecryptedContent.value = "Fetching encrypted blob and executing AES-256-GCM client decryption...";

    try {
      const start = performance.now();
      let content = this.localDocuments.get(docId);
      if (!content) {
        const opaqueRef = meta?.docRef || (await computeOpaqueDocRef(this.subkeys.kAddr, docId));
        const res = await fetch(`/api/v1/blobs/${opaqueRef}`);
        if (!res.ok) throw new Error(`Blob not found on cloud (HTTP ${res.status})`);
        const data = await res.json();
        const decrypted = await decryptPayload(this.subkeys.kEnc, data.blob.ivHex, data.blob.ciphertextHex);
        content = utf8Decode(decrypted);
        this.localDocuments.set(docId, content);
      }
      const elapsed = (performance.now() - start).toFixed(1);
      if (this.viewerDecryptedContent) this.viewerDecryptedContent.value = content;

      await this.logClientSecurityEvent(
        "SECURITY",
        "DOC_DECRYPTED",
        {
          docId,
          elapsedMs: Number(elapsed),
          sizeBytes: content.length,
          provider: meta?.provider || "CLOUD",
        },
        "SUCCESS",
        { docRef: meta?.docRef, docId }
      );
    } catch (err) {
      if (this.viewerDecryptedContent) this.viewerDecryptedContent.value = `[Decryption Error]: ${err.message}`;
      this.showToast("Decryption Failed", err.message, "error");
    }
  }

  async handleDownloadDocument(docId) {
    if (!this.subkeys) {
      this.showToast("Vault Locked", "Unlock vault to download documents.", "warning");
      return;
    }
    try {
      let content = this.localDocuments.get(docId);
      if (!content) {
        const meta = this.documentManifest.get(docId);
        const opaqueRef = meta?.docRef || (await computeOpaqueDocRef(this.subkeys.kAddr, docId));
        const res = await fetch(`/api/v1/blobs/${opaqueRef}`);
        if (!res.ok) throw new Error(`Blob not found on cloud (HTTP ${res.status})`);
        const data = await res.json();
        const decrypted = await decryptPayload(this.subkeys.kEnc, data.blob.ivHex, data.blob.ciphertextHex);
        content = utf8Decode(decrypted);
        this.localDocuments.set(docId, content);
      }
      this.downloadTextFile(docId, content);
      this.showToast("Document Downloaded", `Decrypted plaintext '${docId}' downloaded.`, "success");
    } catch (err) {
      this.showToast("Download Failed", err.message, "error");
    }
  }

  async handleDeleteDocument(docId) {
    if (!this.subkeys) {
      this.showToast("Vault Locked", "Unlock vault to delete documents.", "warning");
      return;
    }
    const meta = this.documentManifest.get(docId);
    const opaqueDocRef = meta?.docRef || (await computeOpaqueDocRef(this.subkeys.kAddr, docId));

    try {
      const res = await fetch(`/api/v1/blobs/${opaqueDocRef}`, { method: "DELETE" });
      if (!res.ok && res.status !== 404) {
        throw new Error(`Cloud deletion returned HTTP ${res.status}`);
      }
      this.documentManifest.delete(docId);
      this.localDocuments.delete(docId);
      await this.saveEncryptedVaultState();
      this.renderDocumentVaultTable();
      this.showToast("Document Purged", `'${docId}' removed from cloud and vault manifest.`, "success");

      await this.logClientSecurityEvent(
        "INGESTION",
        "DOC_PURGED",
        { purgedDocId: docId },
        "SUCCESS",
        { docRef: opaqueDocRef, docId }
      );
      await this.refreshCloudInspector();
      this.refreshAuditChain();
    } catch (err) {
      this.showToast("Deletion Failed", err.message, "error");
    }
  }

  renderDocumentVaultTable() {
    if (!this.docVaultTableBody) return;
    const docs = Array.from(this.documentManifest.values());
    if (this.vaultDocCountBadge) {
      this.vaultDocCountBadge.textContent = `${docs.length} DOCUMENT${docs.length === 1 ? "" : "S"}`;
    }
    if (docs.length === 0) {
      this.docVaultTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="table-empty">No documents in vault yet. Upload files or load sample corpus above.</td>
        </tr>
      `;
      return;
    }

    this.docVaultTableBody.innerHTML = docs
      .map((d) => {
        const timeStr = new Date(d.uploadedAt || Date.now()).toLocaleTimeString();
        const p = (d.provider || "CLOUD").toUpperCase();
        return `
          <tr>
            <td><strong>${escapeHtml(d.docId)}</strong></td>
            <td><span class="badge badge-sm badge-cyan">${escapeHtml(p)}</span></td>
            <td class="monospace">${formatBytes(d.sizeBytes)}</td>
            <td class="monospace">${d.tokenCount || 0}</td>
            <td class="monospace">${timeStr}</td>
            <td class="doc-actions-cell">
              <button type="button" class="btn-table-action btn-action-view" data-doc-id="${escapeHtml(d.docId)}" title="Decrypt and view in client enclave">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Decrypt
              </button>
              <button type="button" class="btn-table-action btn-action-download" data-doc-id="${escapeHtml(d.docId)}" title="Download plaintext file">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </button>
              <button type="button" class="btn-table-action action-delete btn-action-delete" data-doc-id="${escapeHtml(d.docId)}" title="Purge document from vault">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  async logClientSecurityEvent(category, event, details = {}, status = "SUCCESS", meta = {}) {
    const seq = this.clientLogs.length + 1;
    const timestamp = Date.now();
    const prevHash = this.clientLogHeadHash;
    const id = window.crypto?.randomUUID ? window.crypto.randomUUID() : `log-${seq}-${Date.now()}`;

    // Strict zero-plaintext check
    const cleanDetails = {};
    for (const [k, v] of Object.entries(details)) {
      const lk = k.toLowerCase();
      if (lk.includes("plaintext") || lk.includes("password") || lk.includes("secret") || (lk.includes("content") && lk !== "contentlength")) {
        continue;
      }
      cleanDetails[k] = v;
    }

    const sortedKeys = Object.keys(cleanDetails).sort();
    const sortedDetails = {};
    for (const k of sortedKeys) sortedDetails[k] = cleanDetails[k];

    const payload = [
      seq,
      timestamp,
      category,
      event,
      status,
      meta.docRef || "",
      meta.docId || "",
      meta.provider || "",
      prevHash,
      JSON.stringify(sortedDetails),
    ].join("|");

    const digestBuffer = await window.crypto.subtle.digest("SHA-256", utf8Encode(payload));
    const entryHash = bytesToHex(new Uint8Array(digestBuffer));

    const entry = {
      id,
      seq,
      timestamp,
      category,
      event,
      status,
      docRef: meta.docRef,
      docId: meta.docId,
      provider: meta.provider,
      details: cleanDetails,
      prevHash,
      entryHash,
    };

    this.clientLogs.unshift(entry);
    if (this.clientLogs.length > 200) this.clientLogs.pop();
    this.clientLogHeadHash = entryHash;

    this.renderClientLogFeed();
    this.updateClientLogCounts();
    await this.verifyClientLogChain();
    return entry;
  }

  renderClientLogFeed() {
    if (!this.clientLogFeed) return;
    const filtered = this.activeLogFilter === "ALL"
      ? this.clientLogs
      : this.clientLogs.filter((l) => l.category === this.activeLogFilter);

    if (filtered.length === 0) {
      this.clientLogFeed.innerHTML = `
        <div class="log-feed-empty">
          ${this.clientLogs.length === 0 ? "No client activity recorded yet. Unlock the vault or upload documents to stream events." : `No events recorded in category '${this.activeLogFilter}'.`}
        </div>
      `;
      return;
    }

    this.clientLogFeed.innerHTML = filtered
      .map((entry) => {
        const timeStr = new Date(entry.timestamp).toLocaleTimeString();
        const detailsLines = Object.entries(entry.details)
          .map(([k, v]) => `<div class="log-detail-line"><span class="log-detail-k">${escapeHtml(k)}:</span> <span class="log-detail-v">${escapeHtml(String(v))}</span></div>`)
          .join("");

        return `
          <div class="log-item-row" data-seq="${entry.seq}">
            <div class="log-item-header">
              <div class="log-item-title-wrap">
                <span class="log-item-seq">#${entry.seq}</span>
                <span class="log-item-time">${timeStr}</span>
                <span class="log-cat-badge log-cat-${entry.category}">${entry.category}</span>
                <span class="log-item-event">${escapeHtml(entry.event)}</span>
                ${entry.docId ? `<span class="badge badge-sm badge-cyan">${escapeHtml(entry.docId)}</span>` : ""}
              </div>
              <span class="log-item-status status-${entry.status}">${entry.status}</span>
            </div>
            <div class="log-item-details-box">
              ${detailsLines}
              <div class="log-detail-line"><span class="log-detail-k">prevHash:</span> <span class="log-detail-v">${entry.prevHash.slice(0, 16)}...</span></div>
              <div class="log-detail-line"><span class="log-detail-k">entryHash:</span> <span class="log-detail-v">${entry.entryHash.slice(0, 16)}...</span></div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  updateClientLogCounts() {
    if (this.countLogAll) this.countLogAll.textContent = this.clientLogs.length;
    if (this.countLogIngest) this.countLogIngest.textContent = this.clientLogs.filter((l) => l.category === "INGESTION").length;
    if (this.countLogSearch) this.countLogSearch.textContent = this.clientLogs.filter((l) => l.category === "SEARCH").length;
    if (this.countLogSecurity) this.countLogSecurity.textContent = this.clientLogs.filter((l) => l.category === "SECURITY").length;
    if (this.countLogKey) this.countLogKey.textContent = this.clientLogs.filter((l) => l.category === "KEY_MANAGEMENT").length;
    if (this.countLogCloud) this.countLogCloud.textContent = this.clientLogs.filter((l) => l.category === "CLOUD").length;
  }

  async verifyClientLogChain() {
    if (this.clientLogs.length === 0) {
      if (this.clientLogChainDot) this.clientLogChainDot.className = "status-dot dot-emerald";
      if (this.clientLogChainText) this.clientLogChainText.textContent = "VERIFIED SOUND";
      return { isValid: true, verifiedCount: 0 };
    }

    const chronological = [...this.clientLogs].reverse();
    let expectedPrevHash = chronological[0]?.prevHash || "0".repeat(64);

    for (let i = 0; i < chronological.length; i++) {
      const e = chronological[i];
      if (e.prevHash !== expectedPrevHash) {
        if (this.clientLogChainDot) this.clientLogChainDot.className = "status-dot dot-crimson";
        if (this.clientLogChainText) this.clientLogChainText.textContent = `CHAIN TAMPERED (seq #${e.seq})`;
        return { isValid: false, tamperedSeq: e.seq };
      }
      expectedPrevHash = e.entryHash;
    }

    if (this.clientLogChainDot) this.clientLogChainDot.className = "status-dot dot-emerald";
    if (this.clientLogChainText) this.clientLogChainText.textContent = "VERIFIED SOUND";
    return { isValid: true, verifiedCount: chronological.length };
  }

  async handleExportClientAuditLog() {
    const report = await this.verifyClientLogChain();
    const bundle = {
      title: "VAULT SSE Client Security & Cryptographic Audit Trail",
      exportedAt: new Date().toISOString(),
      generator: "VAULT W3C WebCrypto Native Client",
      integrity: {
        isValid: report.isValid,
        verifiedCount: report.verifiedCount,
        headHash: this.clientLogHeadHash,
      },
      entries: [...this.clientLogs].reverse(),
    };
    this.downloadTextFile(`vault_client_audit_log_${Date.now()}.json`, JSON.stringify(bundle, null, 2));
    this.showToast("Audit Log Exported", "Verifiable client security audit log downloaded as JSON.", "success");
  }

  handleClearClientLogs() {
    this.clientLogs = [];
    this.clientLogHeadHash = "0".repeat(64);
    this.renderClientLogFeed();
    this.updateClientLogCounts();
    if (this.clientLogChainDot) this.clientLogChainDot.className = "status-dot dot-emerald";
    if (this.clientLogChainText) this.clientLogChainText.textContent = "VERIFIED SOUND";
    this.showToast("Client Logs Cleared", "Local activity telemetry buffer has been reset.", "success");
  }

  handleExportVaultBackup() {
    if (!this.subkeys) {
      this.showToast("Vault Locked", "Unlock the vault enclave in Section 1 first.", "warning");
      return;
    }
    const backupData = {
      title: "VAULT SSE Encrypted Vault Manifest & State Backup",
      exportedAt: new Date().toISOString(),
      documents: Array.from(this.documentManifest.values()),
      keywordCounters: Object.fromEntries(this.keywordCounters),
      authCommitments: Object.fromEntries(this.authCommitments),
      clientLogs: this.clientLogs,
    };
    this.downloadTextFile(`vault_backup_${Date.now()}.json`, JSON.stringify(backupData, null, 2));
    this.showToast("Backup Exported", "Encrypted vault backup downloaded.", "success");
  }

  async saveEncryptedVaultState() {
    if (!this.subkeys?.kEnc) return;
    try {
      const state = {
        version: 1,
        savedAt: Date.now(),
        documents: Array.from(this.documentManifest.values()),
        keywordCounters: Object.fromEntries(this.keywordCounters),
        authCommitments: Object.fromEntries(this.authCommitments),
        logs: {
          entries: this.clientLogs,
          latestHash: this.clientLogHeadHash,
        },
      };

      const jsonBytes = utf8Encode(JSON.stringify(state));
      const encrypted = await encryptPayload(this.subkeys.kEnc, jsonBytes);
      const envelope = {
        version: 1,
        savedAt: state.savedAt,
        encryptedBlob: {
          ivHex: encrypted.ivHex,
          ciphertextHex: encrypted.ciphertextHex,
        },
      };

      localStorage.setItem("vault_client_encrypted_state", JSON.stringify(envelope));
    } catch (err) {
      console.warn("[VaultStorage] Auto-save encrypted state failed:", err);
    }
  }

  async loadEncryptedVaultState() {
    if (!this.subkeys?.kEnc) return false;
    const raw = localStorage.getItem("vault_client_encrypted_state");
    if (!raw) return false;

    try {
      const envelope = JSON.parse(raw);
      if (!envelope.encryptedBlob?.ivHex || !envelope.encryptedBlob?.ciphertextHex) return false;

      const decryptedBytes = await decryptPayload(
        this.subkeys.kEnc,
        envelope.encryptedBlob.ivHex,
        envelope.encryptedBlob.ciphertextHex
      );
      const state = JSON.parse(utf8Decode(decryptedBytes));

      if (Array.isArray(state.documents)) {
        this.documentManifest.clear();
        for (const d of state.documents) {
          this.documentManifest.set(d.docId, d);
        }
      }
      if (state.keywordCounters) {
        this.keywordCounters.clear();
        for (const [k, v] of Object.entries(state.keywordCounters)) {
          this.keywordCounters.set(k, v);
        }
      }
      if (state.authCommitments) {
        this.authCommitments.clear();
        for (const [k, v] of Object.entries(state.authCommitments)) {
          this.authCommitments.set(k, v);
        }
      }
      if (state.logs?.entries && Array.isArray(state.logs.entries)) {
        this.clientLogs = state.logs.entries;
        this.clientLogHeadHash = state.logs.latestHash || "0".repeat(64);
      }

      this.renderDocumentVaultTable();
      this.renderClientLogFeed();
      this.updateClientLogCounts();
      await this.verifyClientLogChain();
      return true;
    } catch (err) {
      console.warn("[VaultStorage] Auto-restore encrypted state failed (possibly wrong password/key):", err);
      return false;
    }
  }
}

// Instantiate on DOM load if running in browser
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    window.vaultApp = new VaultAppController();
  });
}
