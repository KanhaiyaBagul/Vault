import React, { useState } from "react";
import { useVault, CloudProfileMasked } from "../../context/VaultContext";
import { CloudIcon, CheckCircleIcon, RefreshIcon, TrashIcon, AlertCircleIcon } from "../icons";

export const CloudStorageView: React.FC = () => {
  const {
    profiles,
    activeProfile,
    activateProfile,
    saveProfile,
    deleteProfile,
    testProfile,
    loadProfiles,
    showToast,
  } = useVault();

  const [isEditing, setIsEditing] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  // Form State
  const [formId, setFormId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formProvider, setFormProvider] = useState<"supabase" | "s3" | "disk" | "memory">("supabase");
  const [formSupabaseUrl, setFormSupabaseUrl] = useState("");
  const [formSupabaseKey, setFormSupabaseKey] = useState("");
  const [formSupabaseBucket, setFormSupabaseBucket] = useState("vault-blobs");
  const [formS3Bucket, setFormS3Bucket] = useState("");
  const [formS3Region, setFormS3Region] = useState("us-east-1");
  const [formS3AccessKey, setFormS3AccessKey] = useState("");
  const [formS3SecretKey, setFormS3SecretKey] = useState("");

  const handleOpenAdd = () => {
    setFormId(null);
    setFormName("New Cloud Connection");
    setFormProvider("supabase");
    setFormSupabaseUrl("");
    setFormSupabaseKey("");
    setFormSupabaseBucket("vault-blobs");
    setIsEditing(true);
  };

  const handleOpenEdit = (prof: CloudProfileMasked) => {
    setFormId(prof.id);
    setFormName(prof.name);
    setFormProvider(prof.provider);
    const cfg = prof.config || {};
    if (prof.provider === "supabase") {
      setFormSupabaseUrl(cfg.supabaseUrl || "");
      setFormSupabaseKey(cfg.supabaseKey || "");
      setFormSupabaseBucket(cfg.supabaseBucket || "vault-blobs");
    } else if (prof.provider === "s3") {
      setFormS3Bucket(cfg.s3Bucket || "");
      setFormS3Region(cfg.s3Region || "us-east-1");
      setFormS3AccessKey(cfg.s3AccessKeyId || "");
      setFormS3SecretKey(cfg.s3SecretAccessKey || "");
    }
    setIsEditing(true);
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const config: Record<string, any> = { provider: formProvider };

    if (formProvider === "supabase") {
      if (!formSupabaseUrl.trim() || !formSupabaseKey.trim()) {
        showToast("Supabase URL and API Key are required", "danger");
        return;
      }
      config.supabaseUrl = formSupabaseUrl.trim();
      config.supabaseKey = formSupabaseKey.trim();
      config.supabaseBucket = formSupabaseBucket.trim() || "vault-blobs";
    } else if (formProvider === "s3") {
      if (!formS3Bucket.trim() || !formS3AccessKey.trim()) {
        showToast("S3 Bucket and Access Key are required", "danger");
        return;
      }
      config.s3Bucket = formS3Bucket.trim();
      config.s3Region = formS3Region.trim() || "us-east-1";
      config.s3AccessKeyId = formS3AccessKey.trim();
      config.s3SecretAccessKey = formS3SecretKey.trim();
    }

    const payload: Partial<CloudProfileMasked> = {
      name: formName.trim() || "Cloud Profile",
      provider: formProvider,
      config,
    };
    if (formId) payload.id = formId;

    const ok = await saveProfile(payload);
    if (ok) setIsEditing(false);
  };

  const handleTestPing = async (prof: CloudProfileMasked) => {
    setTestingId(prof.id);
    const res = await testProfile({ provider: prof.provider, config: prof.config });
    setTestingId(null);
    if (res.ok) {
      showToast(`Ping successful: ${res.latencyMs || 25}ms`, "success");
    } else {
      showToast(`Connection test failed: ${res.error || "Unknown error"}`, "danger");
    }
  };

  const handleActivate = async (id: string) => {
    setActivatingId(id);
    await activateProfile(id);
    setActivatingId(null);
  };

  return (
    <div className="cloud-storage-container">
      <div className="cloud-view-header">
        <div>
          <h2 className="view-title">Cloud Storage Connections</h2>
          <p className="view-subtitle">
            Configure multi-cloud zero-knowledge storage backends. Connections auto-persist across server reboots.
          </p>
        </div>
        <div className="header-btn-group">
          <button type="button" className="secondary-btn" onClick={() => loadProfiles()}>
            <RefreshIcon size={14} />
            <span>Refresh</span>
          </button>
          <button type="button" className="primary-btn" onClick={handleOpenAdd}>
            <CloudIcon size={14} />
            <span>+ Add Cloud Connection</span>
          </button>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="profiles-grid">
        {profiles.map((prof) => {
          const isActive = prof.id === activeProfile?.id;
          return (
            <div key={prof.id} className={`profile-card ${isActive ? "active-profile" : ""}`}>
              <div className="profile-card-top">
                <div className="profile-icon-title">
                  <div className="provider-badge-icon">
                    <CloudIcon size={18} color="var(--accent-cherry)" />
                  </div>
                  <div>
                    <h3 className="profile-card-name">{prof.name}</h3>
                    <span className="profile-type-pill">{prof.provider.toUpperCase()}</span>
                  </div>
                </div>

                {isActive ? (
                  <span className="active-status-badge">
                    <CheckCircleIcon size={13} color="var(--status-verified)" />
                    ACTIVE
                  </span>
                ) : (
                  <button
                    type="button"
                    className="activate-btn"
                    disabled={activatingId === prof.id}
                    onClick={() => handleActivate(prof.id)}
                  >
                    {activatingId === prof.id ? "Connecting..." : "Activate"}
                  </button>
                )}
              </div>

              {/* Masked Config Summary */}
              <div className="profile-config-summary">
                {prof.provider === "supabase" && (
                  <>
                    <div className="summary-row">
                      <span className="summary-label">Project URL:</span>
                      <code>{prof.config?.supabaseUrl || "Not configured"}</code>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Storage Bucket:</span>
                      <span>{prof.config?.supabaseBucket || "vault-blobs"}</span>
                    </div>
                  </>
                )}
                {prof.provider === "s3" && (
                  <>
                    <div className="summary-row">
                      <span className="summary-label">Bucket:</span>
                      <code>{prof.config?.s3Bucket}</code>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Region:</span>
                      <span>{prof.config?.s3Region}</span>
                    </div>
                  </>
                )}
                {prof.provider === "disk" && (
                  <div className="summary-row">
                    <span className="summary-label">Storage Locality:</span>
                    <span>Local Persistent Host Storage (.vault_storage/blobs)</span>
                  </div>
                )}
                {prof.provider === "memory" && (
                  <div className="summary-row">
                    <span className="summary-label">Storage Locality:</span>
                    <span>RAM Cache (Ephemeral)</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="profile-card-footer">
                <button
                  type="button"
                  className="test-ping-btn"
                  disabled={testingId === prof.id}
                  onClick={() => handleTestPing(prof)}
                >
                  <RefreshIcon size={12} className={testingId === prof.id ? "spin" : ""} />
                  <span>{testingId === prof.id ? "Pinging..." : "Test Connection"}</span>
                </button>

                <div className="right-card-actions">
                  <button
                    type="button"
                    className="edit-profile-btn"
                    onClick={() => handleOpenEdit(prof)}
                  >
                    Edit
                  </button>
                  {!isActive && prof.provider !== "memory" && (
                    <button
                      type="button"
                      className="delete-profile-btn"
                      onClick={() => deleteProfile(prof.id)}
                      title="Delete profile"
                    >
                      <TrashIcon size={14} color="var(--accent-red)" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Editor Modal */}
      {isEditing && (
        <div className="modal-backdrop" onClick={() => setIsEditing(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{formId ? "Edit Cloud Connection" : "Add Cloud Connection"}</h3>
              <button type="button" className="close-btn" onClick={() => setIsEditing(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="modal-body profile-form">
              <div className="form-group">
                <label>Connection Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Supabase Production Vault"
                />
              </div>

              <div className="form-group">
                <label>Provider Type</label>
                <div className="provider-selector-row">
                  {(["supabase", "s3", "disk", "memory"] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      className={`provider-select-btn ${formProvider === prov ? "selected" : ""}`}
                      onClick={() => setFormProvider(prov)}
                    >
                      {prov.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {formProvider === "supabase" && (
                <>
                  <div className="form-group">
                    <label>Supabase Project URL</label>
                    <input
                      type="text"
                      required
                      placeholder="https://xyzcompany.supabase.co"
                      value={formSupabaseUrl}
                      onChange={(e) => setFormSupabaseUrl(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Supabase Service Role / Anon API Key</label>
                    <input
                      type="password"
                      required
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={formSupabaseKey}
                      onChange={(e) => setFormSupabaseKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Storage Bucket Name</label>
                    <input
                      type="text"
                      placeholder="vault-blobs"
                      value={formSupabaseBucket}
                      onChange={(e) => setFormSupabaseBucket(e.target.value)}
                    />
                  </div>
                </>
              )}

              {formProvider === "s3" && (
                <>
                  <div className="form-group">
                    <label>S3 Bucket Name</label>
                    <input
                      type="text"
                      required
                      placeholder="my-vault-blobs-bucket"
                      value={formS3Bucket}
                      onChange={(e) => setFormS3Bucket(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>AWS Region</label>
                    <input
                      type="text"
                      placeholder="us-east-1"
                      value={formS3Region}
                      onChange={(e) => setFormS3Region(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>AWS Access Key ID</label>
                    <input
                      type="text"
                      required
                      placeholder="AKIAIOSFODNN7EXAMPLE"
                      value={formS3AccessKey}
                      onChange={(e) => setFormS3AccessKey(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>AWS Secret Access Key</label>
                    <input
                      type="password"
                      required
                      placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                      value={formS3SecretKey}
                      onChange={(e) => setFormS3SecretKey(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Save Connection Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
