import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'What is cm/360° and why is it the universal standard for aim?',
    a: 'cm/360° is the physical distance in centimeters your mouse must travel on your mousepad to perform a full 360-degree rotation in the 3D game world. Because every game engine uses different arbitrary sensitivity sliders, cm/360° is the only objective, engine-independent metric that preserves your true physical muscle memory.',
  },
  {
    q: 'Why does my aim feel faster in Apex or Warzone than Valorant despite identical cm/360°?',
    a: 'This is caused by Field of View (FOV). Valorant is locked at 103° horizontal FOV, while Apex or Warzone often run at 110° or 120°. At higher FOVs, objects in the center are smaller, and peripheral vision is stretched. Your physical mouse movement turns your camera by the exact same degrees, but your monitor displays a broader panoramic perspective, making angular motion look visually faster.',
  },
  {
    q: 'Should I play on 400, 800, or 1600 DPI?',
    a: 'Modern optical gaming sensors (such as PixArt 3395, 3950, and Logitech HERO) perform with measurably lower input latency at 1600 DPI compared to 400 DPI. At 400 DPI, your mouse must travel farther before the sensor triggers its first motion count packet (a 2–3ms delay on initial micro-adjustments). We recommend 800 or 1600 DPI as the optimal esports baseline.',
  },
  {
    q: 'Can I compare eDPI directly between Valorant and CS2?',
    a: 'No. eDPI is calculated as DPI × in-game sensitivity, but because Valorant (yaw: 0.07°) and CS2 (yaw: 0.022°) use completely different engine rotation multipliers, 800 eDPI in CS2 is approximately 251 eDPI in Valorant. Use SensForge to translate between them accurately.',
  },
  {
    q: 'Does playing on 4:3 stretched resolution change my sensitivity?',
    a: 'Physically, no. Your mouse still travels the exact same distance to execute a 180° or 360° turn. However, stretching a 4:3 image across a 16:9 widescreen monitor expands horizontal pixels by 33%, making horizontal targets appear wider and horizontal screen velocity appear faster. Never modify `m_yaw`—keep it at 0.022 to preserve circular muscle memory.',
  },
  {
    q: 'How does Escape from Tarkov armor affect mouse sensitivity?',
    a: 'Tarkov realistically models equipment weight: heavy body armors (like Korund or Fort) and helmets (like Altyn) inflict a -5% to -35% turn rate penalty in-raid. SensForge features a built-in Tarkov Armor Penalty Compensator slider so you can boost your base sensitivity to offset heavy kits.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Clarity & Science</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">
            Clearing up myths about mouse DPI, FOV scaling, stretched resolutions, and muscle memory preservation.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel"
                style={{
                  overflow: 'hidden',
                  borderColor: isOpen ? 'var(--border-active)' : 'var(--border-subtle)',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
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
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <HelpCircle size={18} color="var(--accent-cyan)" />
                    <span>{faq.q}</span>
                  </div>
                  <div>
                    {isOpen ? <ChevronUp size={18} color="var(--accent-cyan)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingTop: '0.75rem' }}>
                      {faq.a}
                    </p>
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
