import React from 'react';
import { Crosshair, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-primary)',
      padding: '3.5rem 0 2rem 0',
      color: 'var(--text-secondary)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '2.2rem',
                height: '2.2rem',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Crosshair size={20} color="#050811" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Sens<span style={{ color: 'var(--accent-cyan)' }}>Forge</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              The mathematically verified gaming sensitivity converter and biomechanical aim calibration suite for competitive and singleplayer PC gamers.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <ShieldCheck size={16} color="var(--accent-emerald)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                100% Client-Side • Zero Telemetry
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Tools & Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><a href="#converter" style={footerLinkStyle}>Sensitivity Converter</a></li>
              <li><a href="#recommender" style={footerLinkStyle}>Smart Recommender Engine</a></li>
              <li><a href="#calibration" style={footerLinkStyle}>PSA Aim Calibration</a></li>
              <li><a href="#compare" style={footerLinkStyle}>Multi-Game Comparison Matrix</a></li>
              <li><a href="#calculators" style={footerLinkStyle}>eDPI & cm/360° Tools</a></li>
            </ul>
          </div>

          {/* Top Games */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Popular Conversions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li><a href="#converter" style={footerLinkStyle}>Valorant to CS2</a></li>
              <li><a href="#converter" style={footerLinkStyle}>CS2 to Apex Legends</a></li>
              <li><a href="#converter" style={footerLinkStyle}>Valorant to Overwatch 2</a></li>
              <li><a href="#converter" style={footerLinkStyle}>Fortnite to Valorant</a></li>
              <li><a href="#converter" style={footerLinkStyle}>Escape from Tarkov Compensator</a></li>
            </ul>
          </div>

          {/* Verification & Physics */}
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              Mathematical Foundation
            </h4>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              All conversions utilize engine-specific linear yaw constants (Source <code className="mono">0.022</code>, Valorant <code className="mono">0.07</code>, Overwatch <code className="mono">0.0066</code>, Frostbite <code className="mono">0.0718</code>) and exact non-linear cubic root inversions for Minecraft Java.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>
          <div>
            © {new Date().getFullYear()} SensForge. All game trademarks belong to their respective publishers.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built for competitive gamers with precision mathematics.
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerLinkStyle: React.CSSProperties = {
  color: 'var(--text-muted)',
  textDecoration: 'none',
  transition: 'color var(--transition-fast)',
};
