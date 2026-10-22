import React, { useState, useRef } from "react";
import { useVault } from "../../context/VaultContext";
import { formatBytes } from "../../crypto/vault_engine";
import {
  UploadIcon,
  FileTextIcon,
  TrashIcon,
  EyeIcon,
  CopyIcon,
  SearchIcon,
  CheckIcon,
  RefreshIcon,
} from "../icons";

export const DocumentVaultPanel: React.FC = () => {
  const {
    documents,
    selectedDocId,
    selectDocument,
    uploadDocument,
    deleteDocument,
    loadSampleCorpus,
    showToast,
  } = useVault();

  const [filterText, setFilterText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalBytes = documents.reduce((acc, doc) => acc + (doc.size || 0), 0);

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(filterText.toLowerCase()) ||
    doc.docRef.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      await uploadDocument(files[i]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const copyDocRef = (ref: string, id: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedId(id);
    showToast(`Copied reference: ${ref}`, "info");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="vault-panel document-vault-panel">
      {/* Panel Header */}
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Document Vault</h2>
          <p className="panel-subtitle">Zero-Knowledge Encrypted Client Library</p>
        </div>
        <div className="stat-pill">
          <span className="stat-count">{documents.length}</span>
          <span className="stat-label">docs</span>
          <span className="stat-dot">•</span>
          <span className="stat-size">{formatBytes(totalBytes)}</span>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="dropzone-content">
          <div className="upload-icon-circle">
            <UploadIcon size={20} color="var(--accent-cherry)" />
          </div>
          <div className="dropzone-text">
            <span className="dropzone-prompt">Drop files to encrypt & store</span>
            <span className="dropzone-sub">AES-256-GCM encrypted client-side</span>
          </div>
        </div>
      </div>

      {/* Quick Ingestion Actions */}
      <div className="vault-quick-actions-bar">
        <button
          type="button"
          className="sample-corpus-btn"
          onClick={loadSampleCorpus}
          title="Load and encrypt sample documents"
        >
          <RefreshIcon size={12} color="var(--accent-cherry)" />
          <span>+ Load Sample Corpus</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="vault-filter-bar">
        <SearchIcon size={14} color="var(--ink-muted)" className="filter-search-icon" />
        <input
          type="text"
          className="filter-input"
          placeholder="Filter documents by name or ref..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        {filterText && (
          <button
            type="button"
            className="filter-clear-btn"
            onClick={() => setFilterText("")}
          >
            ✕
          </button>
        )}
      </div>

      {/* Document Cards List */}
      <div className="document-list-scroll">
        {filteredDocs.length === 0 ? (
          <div className="empty-vault-state">
            <FileTextIcon size={32} color="var(--ink-muted)" />
            <p className="empty-title">
              {documents.length === 0 ? "Vault is Empty" : "No matching documents"}
            </p>
            <p className="empty-desc">
              {documents.length === 0
                ? "Upload text files, invoices, or records above to begin encrypted indexing."
                : "Try clearing your filter query."}
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isSelected = doc.id === selectedDocId;
            return (
              <div
                key={doc.id}
                className={`document-card ${isSelected ? "selected" : ""}`}
                onClick={() => selectDocument(doc.id)}
              >
                <div className="doc-card-main">
                  <div className="doc-icon-wrapper">
                    <FileTextIcon size={18} color="var(--accent-cherry)" />
                  </div>
                  <div className="doc-info">
                    <span className="doc-filename" title={doc.name}>
                      {doc.name}
                    </span>
                    <div className="doc-meta-row">
                      <span className="doc-meta-item">{formatBytes(doc.size)}</span>
                      <span className="meta-sep">•</span>
                      <span className="doc-meta-item">
                        {new Date(doc.ingestedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="meta-sep">•</span>
                      <span className="keyword-chip">{doc.keywordCount} keywords</span>
                    </div>
                  </div>
                </div>

                <div className="doc-card-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="action-icon-btn"
                    title="View & Decrypt Document"
                    onClick={() => selectDocument(doc.id)}
                  >
                    <EyeIcon size={14} color="var(--ink-secondary)" />
                  </button>
                  <button
                    type="button"
                    className="action-icon-btn"
                    title="Copy Document Reference ID"
                    onClick={() => copyDocRef(doc.docRef, doc.id)}
                  >
                    {copiedId === doc.id ? (
                      <CheckIcon size={14} color="var(--status-verified)" />
                    ) : (
                      <CopyIcon size={14} color="var(--ink-secondary)" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="action-icon-btn delete-btn"
                    title="Delete from Vault"
                    onClick={() => deleteDocument(doc.id)}
                  >
                    <TrashIcon size={14} color="var(--accent-red)" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
