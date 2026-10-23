import React from 'react';
import { Crosshair, ShieldCheck, Zap, Sliders, Target, Sparkles } from 'lucide-react';

interface HeroProps {
  onScrollTo: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollTo }) => {
  return (
    <section id="hero" style={{ padding: '4.5rem 0 3rem 0', position: 'relative' }}>
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Top Feature Pill */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <span className="badge" style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', gap: '0.5rem' }}>
            <Sparkles size={14} color="var(--accent-cyan)" />
            <span>Mathematical Engine 2.0 • 25 Verified Games</span>
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: '1.25rem',
          letterSpacing: '-0.04em',
        }}>
          One Aim.{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 50%, var(--accent-purple) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Every Game.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '740px',
          margin: '0 auto 2.25rem auto',
          lineHeight: 1.6,
        }}>
          Transfer your exact muscle memory between Valorant, CS2, Apex Legends, Overwatch 2, Fortnite, and 20+ PC titles. Built with verified engine yaw physics, cm/360° distance matching, and interactive aim calibration.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <button
            onClick={() => onScrollTo('converter')}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}
          >
            <Sliders size={18} />
            <span>Open Converter</span>
          </button>

          <button
            onClick={() => onScrollTo('recommender')}
            className="btn btn-secondary"
            style={{ padding: '0.85rem 1.6rem', fontSize: '1.025rem' }}
          >
            <Target size={18} color="var(--accent-cyan)" />
            <span>Find My Ideal Sens</span>
          </button>

          <button
            onClick={() => onScrollTo('calibration')}
            className="btn btn-outline"
            style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}
          >
            <Crosshair size={18} />
            <span>Aim Calibration</span>
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          maxWidth: '1080px',
          margin: '0 auto',
        }}>
          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 240, 255, 0.1)' }}>
                <Crosshair size={18} color="var(--accent-cyan)" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Verified Yaw Physics</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Source, UE4/UE5, Frostbite, id Tech, and cubic Minecraft inversion calculated with exact engine constants.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.1)' }}>
                <Zap size={18} color="var(--accent-blue)" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Real-Time cm/360°</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Instant physical mousepad distance matching, speed tier classification, and mousepad space checks.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)' }}>
                <ShieldCheck size={18} color="var(--accent-emerald)" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>100% Client-Side</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Zero logins, zero telemetry. All custom sensitivity profiles stay in your browser localStorage.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <div style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.1)' }}>
                <Target size={18} color="var(--accent-purple)" />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>PSA Calibration</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Guided esports coach iteration algorithm and browser aim canvas to eliminate overshooting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
