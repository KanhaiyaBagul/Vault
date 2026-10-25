import React, { useState, useEffect } from "react";
import { useVault, ViewMode } from "../../context/VaultContext";
import { ShieldIcon, CloudIcon, FolderIcon, TerminalIcon, KeyIcon, LockIcon, SearchIcon } from "../icons";

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    isEnclaveReady,
    keyFingerprint,
    activeProfile,
    cloudLatency,
    reinitEnclave,
  } = useVault();

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newPassphrase, setNewPassphrase] = useState("");

  const tabs: Array<{ id: ViewMode; label: string; icon: React.ReactNode }> = [
    { id: "workspace", label: "Vault Workspace", icon: <FolderIcon size={16} /> },
    { id: "cloud", label: "Cloud Storage", icon: <CloudIcon size={16} /> },
    { id: "audit", label: "Security & Audit", icon: <ShieldIcon size={16} /> },
    { id: "lab", label: "Diagnostics Lab", icon: <TerminalIcon size={16} /> },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setActiveView("workspace");
        setTimeout(() => {
          const input = document.getElementById("vaultSearchInput");
          if (input) {
            input.focus();
            if (input instanceof HTMLInputElement) {
              input.select();
            }
          }
        }, 50);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveView]);

  const handleReKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassphrase.trim()) {
      reinitEnclave(newPassphrase.trim());
      setNewPassphrase("");
      setShowKeyModal(false);
    }
  };

  const focusSearch = () => {
    setActiveView("workspace");
    setTimeout(() => {
      const input = document.getElementById("vaultSearchInput");
      if (input) {
        input.focus();
        if (input instanceof HTMLInputElement) {
          input.select();
        }
      }
    }, 50);
  };

  return (
    <>
      <header className="vault-header glassmorphic-dock">
        <div className="header-brand">
          <div className="brand-logo">
            <LockIcon size={18} color="var(--accent-red)" />
            <span className="brand-title">VAULT</span>
          </div>
          <span className="brand-tag">Verifiable Searchable Symmetric Encryption</span>
        </div>

        <nav className="header-nav">
          {tabs.map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-tab-btn ${isActive ? "active" : ""}`}
                onClick={() => setActiveView(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {isActive && <div className="active-pip" />}
              </button>
            );
          })}
        </nav>

        <div className="header-actions">
          {/* Global Quick Search Launcher */}
          <button
            type="button"
            className="header-search-launcher"
            onClick={focusSearch}
            title="Focus Vault Search (Ctrl+K)"
          >
            <SearchIcon size={13} color="var(--ink-secondary)" />
            <span className="launcher-text">Quick Search...</span>
            <kbd className="kbd-shortcut">Ctrl+K</kbd>
          </button>

          {/* Active Cloud Indicator */}
          <button
            type="button"
            className="status-pill cloud-pill"
            onClick={() => setActiveView("cloud")}
            title="Manage Cloud Connection Profiles"
          >
            <CloudIcon size={14} color="var(--accent-cherry)" />
            <span className="pill-title">{activeProfile?.name || "Local Memory"}</span>
            {cloudLatency !== null && <span className="pill-meta">{cloudLatency}ms</span>}
          </button>

          {/* Enclave Status Pill */}
          <button
            type="button"
            className="status-pill enclave-pill gold-enclave-pill"
            onClick={() => setShowKeyModal(true)}
            title="Inspect Hardware Isolated Enclave"
          >
            <span className={`pulse-dot ${isEnclaveReady ? "ready gold-pulse" : ""}`} />
            <span className="pill-title">Enclave</span>
            <span className="pill-meta gold-text">AES-256</span>
          </button>
        </div>
      </header>

      {/* Enclave Key Manager Modal */}
      {showKeyModal && (
        <div className="modal-backdrop" onClick={() => setShowKeyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <ShieldIcon size={20} color="var(--accent-gold)" />
                <h3>Client Cryptographic Enclave</h3>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowKeyModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="info-callout">
                <p>
                  All document encryption, blind token generation, and trapdoor derivation
                  occur entirely within your browser&apos;s Web Crypto enclave. The cloud server
                  never sees your master key or plaintext.
                </p>
              </div>

              <div className="meta-row">
                <span className="meta-label">Enclave Status:</span>
                <span className="status-badge verified gold-seal">Hardware Sealed (SubtleCrypto)</span>
              </div>

              <div className="meta-row">
                <span className="meta-label">Enclave Fingerprint:</span>
                <code className="fp-code gold-seal">{keyFingerprint}</code>
              </div>

              <div className="meta-row">
                <span className="meta-label">Cipher Suite:</span>
                <span>AES-GCM-256 • HMAC-SHA256 • PBKDF2 (100k)</span>
              </div>

              <form onSubmit={handleReKey} className="rekey-form">
                <label htmlFor="rekeyInput">Re-Key Vault (Optional Custom Passphrase):</label>
                <div className="rekey-input-row">
                  <input
                    id="rekeyInput"
                    type="password"
                    placeholder="Enter new master passphrase..."
                    value={newPassphrase}
                    onChange={(e) => setNewPassphrase(e.target.value)}
                  />
                  <button type="submit" className="primary-btn">
                    <KeyIcon size={14} />
                    <span>Re-Derive</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
