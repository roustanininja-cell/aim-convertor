import React, { useState } from 'react';
import { BookOpen, CheckCircle, Lightbulb, ChevronDown, ChevronUp, MousePointer, Eye, Maximize, Shield, Cpu } from 'lucide-react';
import { GAME_GUIDES } from '../data/guides';

export const GameSettingsGuides: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('windows-pointer-acceleration');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MousePointer':
        return <MousePointer size={18} color="var(--accent-cyan)" />;
      case 'Eye':
        return <Eye size={18} color="var(--accent-blue)" />;
      case 'Maximize':
        return <Maximize size={18} color="var(--accent-purple)" />;
      case 'Shield':
        return <Shield size={18} color="#f59e0b" />;
      case 'Cpu':
        return <Cpu size={18} color="#10b981" />;
      default:
        return <BookOpen size={18} color="var(--accent-cyan)" />;
    }
  };

  return (
    <section id="guides" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Optimization Playbook</span>
          <h2 className="section-title">Esports Aim & System Guides</h2>
          <p className="section-desc">
            Essential Windows tweaks, FOV projection physics, and engine configurations to ensure zero acceleration and pure raw input.
          </p>
        </div>

        {/* Guides List */}
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {GAME_GUIDES.map((guide) => {
            const isExpanded = expandedId === guide.id;
            return (
              <div
                key={guide.id}
                className="glass-panel"
                style={{
                  overflow: 'hidden',
                  borderColor: isExpanded ? 'var(--border-active)' : 'var(--border-subtle)',
                }}
              >
                {/* Header Accordion Bar */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : guide.id)}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      padding: '0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-input)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {getIcon(guide.icon)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{guide.title}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {guide.summary.slice(0, 85)}...
                      </p>
                    </div>
                  </div>
                  <div>
                    {isExpanded ? <ChevronUp size={20} color="var(--text-muted)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '1rem 0' }}>
                      {guide.summary}
                    </p>

                    {/* Step-by-Step Instructions */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.65rem' }}>
                        Action Steps:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {guide.steps.map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                            <CheckCircle size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Tips Box */}
                    {guide.tips && guide.tips.length > 0 && (
                      <div style={{
                        padding: '1rem',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.4rem' }}>
                          <Lightbulb size={15} />
                          <span>Pro Coach Tip:</span>
                        </div>
                        {guide.tips.map((tip, idx) => (
                          <p key={idx} style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {tip}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
