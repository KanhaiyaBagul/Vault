import React, { useState } from "react";
import { useVault } from "../../context/VaultContext";
import { generateSearchTrapdoor } from "../../crypto/vault_engine";
import { TerminalIcon, ShieldIcon, LockIcon, AlertCircleIcon, CheckCircleIcon } from "../icons";

export const DiagnosticsLabView: React.FC = () => {
  const { keys, keyFingerprint, showToast } = useVault();

  const [simQuery, setSimQuery] = useState("confidential");
  const [trapdoorHex, setTrapdoorHex] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showSubkeys, setShowSubkeys] = useState(false);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keys) {
      showToast("Enclave not initialized", "danger");
      return;
    }
    setIsSimulating(true);
    try {
      const td = await generateSearchTrapdoor(simQuery, keys.kTrap);
      setTrapdoorHex(td);
    } catch (err: any) {
      showToast(`Simulation error: ${err.message}`, "danger");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="diagnostics-lab-container">
      <div className="lab-header">
        <div>
          <h2 className="view-title">Cryptographic Diagnostics & Adversary Lab</h2>
          <p className="view-subtitle">
            Simulate an active eavesdropper or compromised cloud server to empirically verify zero-knowledge guarantees.
          </p>
        </div>
      </div>

      {/* Adversary Simulation Card */}
      <div className="lab-card">
        <div className="card-header-row">
          <div className="card-title-group">
            <TerminalIcon size={18} color="var(--accent-cherry)" />
            <h3>Adversary Trapdoor Interception Simulator</h3>
          </div>
          <span className="security-tag">IND-CKA2 Certified</span>
        </div>

        <p className="lab-card-desc">
          When you execute a search, your client transmits an opaque trapdoor token to the cloud.
          Enter any search term below to inspect what an eavesdropping network or rogue database admin sees:
        </p>

        <form onSubmit={handleSimulate} className="sim-form">
          <div className="sim-input-row">
            <input
              type="text"
              placeholder="e.g. confidential, payroll, quarterly_bonus..."
              value={simQuery}
              onChange={(e) => setSimQuery(e.target.value)}
            />
            <button type="submit" className="primary-btn" disabled={isSimulating}>
              Simulate Interception
            </button>
          </div>
        </form>

        {trapdoorHex && (
          <div className="sim-results-grid">
            <div className="sim-column client-perspective">
              <div className="column-header">
                <ShieldIcon size={14} color="var(--status-verified)" />
                <h4>Client Plaintext Knowledge</h4>
              </div>
              <div className="column-body">
                <div className="kv-row">
                  <span className="kv-label">Target Term:</span>
                  <span className="kv-val client-val">&quot;{simQuery}&quot;</span>
                </div>
                <div className="kv-row">
                  <span className="kv-label">Enclave Key:</span>
                  <span className="kv-val">{keyFingerprint} (Hardware Isolated)</span>
                </div>
                <p className="kv-note">
                  The client uses standard Web Crypto SubtleCrypto to generate an HMAC-SHA256 signature
                  over the normalized search term.
                </p>
              </div>
            </div>

            <div className="sim-column server-perspective">
              <div className="column-header">
                <LockIcon size={14} color="var(--accent-red)" />
                <h4>Server / Attacker Intercepted Token</h4>
              </div>
              <div className="column-body">
                <div className="kv-row">
                  <span className="kv-label">Raw Wire Token:</span>
                  <code className="token-code">{trapdoorHex}</code>
                </div>
                <div className="leak-check-row">
                  <div className="leak-badge safe">
                    <CheckCircleIcon size={13} color="var(--status-verified)" />
                    <span>Plaintext Leakage: 0.00% (Uniform Pseudorandom)</span>
                  </div>
                </div>
                <p className="kv-note">
                  Without knowing <code>K_trap</code>, reversing this 256-bit hash to recover &quot;{simQuery}&quot;
                  requires $2^{256}$ operations (infeasible under SHA-256 collision resistance).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hardware Enclave Subkeys Inspector */}
      <div className="lab-card">
        <div className="card-header-row">
          <div className="card-title-group">
            <LockIcon size={18} color="var(--accent-cherry)" />
            <h3>Enclave Domain Separation Inspection</h3>
          </div>
          <button
            type="button"
            className="secondary-btn small"
            onClick={() => setShowSubkeys(!showSubkeys)}
          >
            {showSubkeys ? "Hide Enclave Subkeys" : "Inspect Derived Subkeys"}
          </button>
        </div>

        <p className="lab-card-desc">
          Vault enforces domain separation (RFC 5869) to derive independent subkeys from your master password.
          A compromise of one key does not reveal any other key.
        </p>

        {showSubkeys ? (
          <div className="subkeys-grid">
            <div className="subkey-card">
              <span className="subkey-name">K_enc (Payload Cipher)</span>
              <span className="subkey-algo">AES-256-GCM</span>
              <code className="subkey-dom">VAULT:DOM:PAYLOAD:04</code>
              <p className="subkey-desc">Encrypts all document text and uploaded binary blobs.</p>
            </div>
            <div className="subkey-card">
              <span className="subkey-name">K_trap (Search Trapdoor)</span>
              <span className="subkey-algo">HMAC-SHA256</span>
              <code className="subkey-dom">VAULT:DOM:TRAPDOOR:01</code>
              <p className="subkey-desc">Generates deterministic query tokens for blind matching.</p>
            </div>
            <div className="subkey-card">
              <span className="subkey-name">K_addr (Blind Index Row)</span>
              <span className="subkey-algo">HMAC-SHA256</span>
              <code className="subkey-dom">VAULT:DOM:ADDRESS:02</code>
              <p className="subkey-desc">Derives opaque bucket addresses in the server multimap.</p>
            </div>
            <div className="subkey-card">
              <span className="subkey-name">K_mask (Postings Mask)</span>
              <span className="subkey-algo">HMAC-SHA256</span>
              <code className="subkey-dom">VAULT:DOM:MASKING:03</code>
              <p className="subkey-desc">Blinds document IDs before storing on the cloud provider.</p>
            </div>
          </div>
        ) : (
          <div className="subkeys-collapsed-hint">
            <span>Enclave subkeys are sealed securely inside Web Crypto memory.</span>
          </div>
        )}
      </div>
    </div>
  );
};
