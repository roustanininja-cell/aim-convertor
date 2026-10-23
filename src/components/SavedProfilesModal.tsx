import React, { useRef } from 'react';
import { X, Bookmark, Trash2, Copy, Download, Upload, ExternalLink, Check } from 'lucide-react';
import type { SavedProfile } from './SensitivityConverter';

interface SavedProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: SavedProfile[];
  onDeleteProfile: (id: string) => void;
  onLoadProfile: (profile: SavedProfile) => void;
  onImportProfiles: (profiles: SavedProfile[]) => void;
  onClearAll: () => void;
}

export const SavedProfilesModal: React.FC<SavedProfilesModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onDeleteProfile,
  onLoadProfile,
  onImportProfiles,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (p: SavedProfile) => {
    const text = `SensForge Profile: ${p.gameName} | Sens: ${p.sensitivity} | DPI: ${p.dpi} | ${p.cm360} cm/360°`;
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sensforge-profiles-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportProfiles(parsed);
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '640px',
        maxHeight: '85vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-elevated)',
        borderColor: 'var(--border-active)',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Bookmark size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Saved Sensitivity Profiles</h3>
            <span className="badge" style={{ fontSize: '0.7rem' }}>{profiles.length}</span>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon" style={{ width: '2rem', height: '2rem' }}>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          {profiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Bookmark size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.3 }} />
              <p style={{ fontWeight: 600 }}>No saved profiles yet.</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Convert a sensitivity and click <strong>"Save Profile"</strong> to store your presets here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {profiles.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {p.name}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      <span className="mono" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                        Sens: {p.sensitivity}
                      </span>
                      <span>DPI: {p.dpi}</span>
                      <span>{p.cm360} cm/360°</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleCopy(p)}
                      className="btn btn-secondary btn-sm"
                      title="Copy settings string"
                    >
                      {copiedId === p.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => {
                        onLoadProfile(p);
                        onClose();
                      }}
                      className="btn btn-outline btn-sm"
                      title="Load into Converter"
                    >
                      <ExternalLink size={14} />
                      <span style={{ fontSize: '0.75rem' }}>Load</span>
                    </button>
                    <button
                      onClick={() => onDeleteProfile(p.id)}
                      className="btn btn-secondary btn-sm"
                      title="Delete profile"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleExportJson} disabled={profiles.length === 0} className="btn btn-secondary btn-sm">
              <Download size={14} />
              <span>Export JSON</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="btn btn-secondary btn-sm">
              <Upload size={14} />
              <span>Import JSON</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>

          {profiles.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all saved profiles?')) {
                  onClearAll();
                }
              }}
              className="btn btn-secondary btn-sm"
              style={{ color: '#ef4444', fontSize: '0.75rem' }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
