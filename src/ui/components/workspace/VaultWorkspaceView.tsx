import React from "react";
import { DocumentVaultPanel } from "./DocumentVaultPanel";
import { SearchPanel } from "./SearchPanel";
import { DocumentViewer } from "./DocumentViewer";

export const VaultWorkspaceView: React.FC = () => {
  return (
    <div className="vault-workspace-layout">
      {/* Left Panel: Document Vault & Quick Ingestion */}
      <div className="workspace-left-column">
        <DocumentVaultPanel />
      </div>

      {/* Right Panel: Zero-Knowledge Search & Live Decrypted Viewer */}
      <div className="workspace-right-column">
        <section className="vault-panel search-and-viewer-panel">
          <SearchPanel />
          <div className="viewer-scroll-wrapper">
            <DocumentViewer />
          </div>
        </section>
      </div>
    </div>
  );
};
