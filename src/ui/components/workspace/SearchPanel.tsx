import React, { useState } from "react";
import { useVault } from "../../context/VaultContext";
import { SearchIcon, CheckCircleIcon, RefreshIcon } from "../icons";

export const SearchPanel: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    searchLatency,
    executeSearch,
    documents,
  } = useVault();

  const [inputVal, setInputVal] = useState(searchQuery);

  const sampleQueries = ["quarter", "financial", "tax", "payroll", "audit", "compliance"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal);
    executeSearch(inputVal);
  };

  const handleTagClick = (tag: string) => {
    setInputVal(tag);
    setSearchQuery(tag);
    executeSearch(tag);
  };

  return (
    <div className="search-panel-container">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <div className="search-input-wrapper">
          <SearchIcon size={18} color="var(--ink-secondary)" className="search-icon-adornment" />
          <input
            id="vaultSearchInput"
            type="text"
            className="main-search-input"
            placeholder="Search encrypted vault using keywords or substrings (e.g. tax, audit, 2025)..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          {inputVal && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setInputVal("");
                setSearchQuery("");
                executeSearch("");
              }}
            >
              ✕
            </button>
          )}
          <button type="submit" className="search-submit-btn" disabled={isSearching}>
            {isSearching ? <RefreshIcon size={16} className="spin" /> : "Search Vault"}
          </button>
        </div>
      </form>

      {/* Suggested Search Query Pills */}
      <div className="suggested-queries-row">
        <span className="suggest-label">Suggestions:</span>
        <div className="suggested-tags">
          {sampleQueries.map((tag) => (
            <button
              key={tag}
              type="button"
              className="query-tag-pill"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Telemetry & Verification Status Bar */}
      {searchQuery && (
        <div className="search-telemetry-bar">
          <div className="telemetry-left">
            <span className="telemetry-count">
              <strong>{searchResults.length}</strong> match
              {searchResults.length === 1 ? "" : "es"} found
            </span>
            {searchLatency !== null && (
              <span className="telemetry-time">in {searchLatency}ms</span>
            )}
            <span className="telemetry-scope">
              (searched {documents.length} encrypted documents)
            </span>
          </div>

          <div className="telemetry-right">
            <div className="proof-status-pill">
              <CheckCircleIcon size={13} color="var(--status-verified)" />
              <span>Zero-Knowledge Proof Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
