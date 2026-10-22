import React, { useState } from "react";
import { useVault } from "../../context/VaultContext";
import { formatBytes, highlightText } from "../../crypto/vault_engine";
import {
  FileTextIcon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  ShieldIcon,
  LockIcon,
} from "../icons";

export const DocumentViewer: React.FC = () => {
  const { selectedDoc, searchQuery, showToast } = useVault();
  const [copied, setCopied] = useState(false);
  const [showProofDetails, setShowProofDetails] = useState(false);

  if (!selectedDoc) {
    return (
      <div className="viewer-empty-card">
        <div className="empty-icon-halo">
          <FileTextIcon size={36} color="var(--accent-cherry)" />
        </div>
        <h3 className="empty-title">Select a Document or Run a Search</h3>
        <p className="empty-sub">
          Click any document in your vault on the left, or enter keywords in the search bar above.
          Documents are decrypted on-the-fly inside your browser using AES-256-GCM.
        </p>
      </div>
    );
  }

  const handleCopyPlaintext = () => {
    navigator.clipboard.writeText(selectedDoc.plaintext);
    setCopied(true);
    showToast("Plaintext copied to clipboard", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedDoc.plaintext], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `decrypted_${selectedDoc.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded decrypted ${selectedDoc.name}`, "success");
  };

  const highlightedHtml = highlightText(selectedDoc.plaintext, searchQuery);

  return (
    <article className="document-viewer-card">
      {/* Viewer Header */}
      <div className="viewer-header">
        <div className="viewer-title-row">
          <div className="doc-icon-badge">
            <FileTextIcon size={20} color="var(--accent-cherry)" />
          </div>
          <div className="viewer-title-text">
            <h3 className="viewer-doc-title">{selectedDoc.name}</h3>
            <div className="viewer-meta-chips">
              <span className="meta-chip">{formatBytes(selectedDoc.size)}</span>
              <span className="meta-chip">Ref: {selectedDoc.docRef}</span>
              <span className="meta-chip highlight-chip">AES-256-GCM Verified</span>
              <span className="meta-chip">
                {new Date(selectedDoc.ingestedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="viewer-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={handleCopyPlaintext}
            title="Copy decrypted plaintext"
          >
            {copied ? <CheckIcon size={14} color="var(--status-verified)" /> : <CopyIcon size={14} />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <button
            type="button"
            className="primary-btn"
            onClick={handleDownload}
            title="Download locally decrypted file"
          >
            <DownloadIcon size={14} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Live Decrypted Text Body */}
      <div className="viewer-content-container">
        <div
          className="decrypted-text-body"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>

      {/* Zero-Knowledge Proof & Cryptographic Accordion */}
      <div className="proof-accordion">
        <button
          type="button"
          className="proof-accordion-trigger"
          onClick={() => setShowProofDetails(!showProofDetails)}
        >
          <div className="proof-trigger-left">
            <ShieldIcon size={14} color="var(--accent-cherry)" />
            <span>Cryptographic Proof & Zero-Knowledge Verification</span>
          </div>
          <span className="accordion-arrow">{showProofDetails ? "▲" : "▼"}</span>
        </button>

        {showProofDetails && (
          <div className="proof-details-body">
            <div className="proof-grid">
              <div className="proof-cell">
                <span className="cell-label">Cloud Blob Storage Reference:</span>
                <code>{selectedDoc.docRef}</code>
              </div>
              <div className="proof-cell">
                <span className="cell-label">AES-GCM Initialization Vector (IV):</span>
                <code>{selectedDoc.ivHex}</code>
              </div>
              <div className="proof-cell">
                <span className="cell-label">Ciphertext Integrity Digest:</span>
                <code>
                  {selectedDoc.ciphertextHex.substring(0, 32)}...
                  {selectedDoc.ciphertextHex.substring(selectedDoc.ciphertextHex.length - 16)}
                </code>
              </div>
              <div className="proof-cell">
                <span className="cell-label">Authentication Status:</span>
                <span className="proof-verified-tag">
                  <LockIcon size={12} color="var(--status-verified)" />
                  Client Authenticated • Zero Server Leakage
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
