import React from "react";
import { VaultProvider, useVault } from "./context/VaultContext";
import { Header } from "./components/layout/Header";
import { VaultWorkspaceView } from "./components/workspace/VaultWorkspaceView";
import { CloudStorageView } from "./components/cloud/CloudStorageView";
import { SecurityAuditView } from "./components/security/SecurityAuditView";
import { DiagnosticsLabView } from "./components/lab/DiagnosticsLabView";
import "./styles/theme.css";
import "./styles/components.css";

const MainContent: React.FC = () => {
  const { activeView, toasts, removeToast } = useVault();

  return (
    <div className="vault-app-root">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Viewport Container */}
      <main className="vault-viewport">
        {activeView === "workspace" && <VaultWorkspaceView />}
        {activeView === "cloud" && <CloudStorageView />}
        {activeView === "audit" && <SecurityAuditView />}
        {activeView === "lab" && <DiagnosticsLabView />}
      </main>

      {/* Floating Toast System */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-pill ${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <span className="toast-dot" />
            <span className="toast-text">{toast.text}</span>
            <button
              type="button"
              className="toast-close"
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <VaultProvider>
      <MainContent />
    </VaultProvider>
  );
};

export default App;
