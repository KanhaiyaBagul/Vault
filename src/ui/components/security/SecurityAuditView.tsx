import React, { useEffect, useState } from "react";
import { useVault } from "../../context/VaultContext";
import { ShieldIcon, CheckCircleIcon, RefreshIcon, DownloadIcon, AlertCircleIcon } from "../icons";

export const SecurityAuditView: React.FC = () => {
  const {
    serverAuditEntries,
    auditVerified,
    auditDetails,
    loadAuditLog,
    verifyAuditChain,
    showToast,
  } = useVault();

  const [filterOp, setFilterOp] = useState<string>("ALL");

  useEffect(() => {
    loadAuditLog();
  }, [loadAuditLog]);

  const filteredEntries = serverAuditEntries.filter((entry) => {
    if (filterOp === "ALL") return true;
    return entry.operation?.toUpperCase() === filterOp;
  });

  const exportAuditJson = () => {
    const dataStr = JSON.stringify(serverAuditEntries, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vault_audit_trail_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Audit trail exported as JSON", "success");
  };

  return (
    <div className="security-audit-container">
      {/* Header */}
      <div className="audit-view-header">
        <div>
          <h2 className="view-title">Zero-Knowledge Audit Trail & Cryptographic Verification</h2>
          <p className="view-subtitle">
            Every index insertion and blind query is committed into a SHA-256 hash-chain to guarantee zero server tampering.
          </p>
        </div>

        <div className="header-btn-group">
          <button type="button" className="secondary-btn" onClick={exportAuditJson}>
            <DownloadIcon size={14} />
            <span>Export JSON</span>
          </button>
          <button type="button" className="primary-btn" onClick={() => verifyAuditChain()}>
            <ShieldIcon size={14} />
            <span>Verify Hash-Chain</span>
          </button>
        </div>
      </div>

      {/* Verification Status Card */}
      {auditVerified !== null && (
        <div className={`verification-banner ${auditVerified ? "valid" : "invalid"}`}>
          <div className="banner-left">
            {auditVerified ? (
              <CheckCircleIcon size={22} color="var(--status-verified)" />
            ) : (
              <AlertCircleIcon size={22} color="var(--accent-red)" />
            )}
            <div>
              <h4 className="banner-title">
                {auditVerified ? "Cryptographic Chain 100% Intact" : "Tamper Detected in Audit Chain!"}
              </h4>
              <p className="banner-desc">
                {auditVerified
                  ? `Verified ${auditDetails?.entryCount || serverAuditEntries.length} chained entries against Merkle root. No entries were modified, reordered, or deleted.`
                  : "Hash mismatch detected! Server logs have been altered."}
              </p>
            </div>
          </div>
          {auditDetails?.headHash && (
            <div className="banner-right">
              <span className="chain-head-label">Chain Head:</span>
              <code className="chain-head-code">{auditDetails.headHash.substring(0, 20)}...</code>
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="audit-filter-row">
        <div className="filter-pills">
          {["ALL", "INDEX", "SEARCH", "DELETE"].map((op) => (
            <button
              key={op}
              type="button"
              className={`filter-pill ${filterOp === op ? "active" : ""}`}
              onClick={() => setFilterOp(op)}
            >
              {op}
            </button>
          ))}
        </div>
        <span className="entry-counter">Showing {filteredEntries.length} recorded events</span>
      </div>

      {/* Audit Table */}
      <div className="audit-table-card">
        {filteredEntries.length === 0 ? (
          <div className="empty-audit-state">
            <ShieldIcon size={32} color="var(--ink-muted)" />
            <p>No audit entries recorded for this filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Timestamp</th>
                  <th>Operation</th>
                  <th>Target / Blob Ref</th>
                  <th>Current SHA-256 Hash</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, idx) => (
                  <tr key={idx}>
                    <td>
                      <span className="row-index">{entry.index ?? idx + 1}</span>
                    </td>
                    <td>
                      <span className="timestamp-text">
                        {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : "—"}
                      </span>
                    </td>
                    <td>
                      <span className={`op-badge ${entry.operation?.toLowerCase()}`}>
                        {entry.operation}
                      </span>
                    </td>
                    <td>
                      <code className="ref-code">{entry.details?.docRef || entry.details?.ref || "—"}</code>
                    </td>
                    <td>
                      <code className="hash-code" title={entry.hash}>
                        {entry.hash ? `${entry.hash.substring(0, 16)}...` : "Genesis"}
                      </code>
                    </td>
                    <td>
                      <span className="status-tag verified">
                        <CheckCircleIcon size={12} color="var(--status-verified)" />
                        Committed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
