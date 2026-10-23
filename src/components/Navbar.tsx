import React from 'react';
import { Crosshair, Moon, Sun, Bookmark, Sliders, Target, Calculator, BookOpen, Layers } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

interface NavbarProps {
  theme: Theme;
  toggleTheme: () => void;
  savedCount: number;
  onOpenProfiles: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme, savedCount, onOpenProfiles }) => {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.85rem 0',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '2.4rem',
            height: '2.4rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--glow-cyan)',
          }}>
            <Crosshair size={22} color="#050811" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                Sens<span style={{ color: 'var(--accent-cyan)' }}>Forge</span>
              </span>
              <span className="badge" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>v2.0</span>
            </div>
          </div>
        </a>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="nav-links">
          <a href="#converter" style={navLinkStyle}>
            <Sliders size={16} />
            <span>Converter</span>
          </a>
          <a href="#recommender" style={navLinkStyle}>
            <Target size={16} />
            <span>Smart Recommender</span>
          </a>
          <a href="#calibration" style={navLinkStyle}>
            <Crosshair size={16} />
            <span>Aim Calibration</span>
          </a>
          <a href="#compare" style={navLinkStyle}>
            <Layers size={16} />
            <span>Matrix</span>
          </a>
          <a href="#calculators" style={navLinkStyle}>
            <Calculator size={16} />
            <span>Tools</span>
          </a>
          <a href="#guides" style={navLinkStyle}>
            <BookOpen size={16} />
            <span>Guides</span>
          </a>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Saved Profiles Button */}
          <button
            onClick={onOpenProfiles}
            className="btn btn-secondary btn-sm"
            title="View saved profiles"
            style={{ position: 'relative' }}
          >
            <Bookmark size={15} color="var(--accent-cyan)" />
            <span style={{ display: 'none' }} className="hide-on-mobile">Profiles</span>
            {savedCount > 0 && (
              <span style={{
                background: 'var(--accent-cyan)',
                color: '#050811',
                borderRadius: 'var(--radius-full)',
                padding: '0.1rem 0.4rem',
                fontSize: '0.7rem',
                fontWeight: 800,
                marginLeft: '0.2rem',
              }}>
                {savedCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-icon"
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="var(--accent-blue)" />}
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .nav-links { display: none !important; }
        }
        @media (min-width: 640px) {
          .hide-on-mobile { display: inline !important; }
        }
      `}</style>
    </nav>
  );
};

const navLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,
  transition: 'color var(--transition-fast)',
  cursor: 'pointer',
};
