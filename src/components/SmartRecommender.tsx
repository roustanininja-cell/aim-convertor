import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Sliders, Target } from 'lucide-react';
import type { GameDefinition } from '../data/games';
import { GAMES_DATABASE } from '../data/games';
import type { QuestionnaireAnswers, RecommendationResult } from '../engine/recommendation';
import { generateRecommendation } from '../engine/recommendation';

interface SmartRecommenderProps {
  onApplyRecommendation: (game: GameDefinition, sens: number, dpi: number) => void;
  onSendToPsa: (game: GameDefinition, sens: number, dpi: number) => void;
}

export const SmartRecommender: React.FC<SmartRecommenderProps> = ({
  onApplyRecommendation,
  onSendToPsa,
}) => {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    mainGameId: 'valorant',
    dpi: 800,
    mousepadSize: 'large',
    deskSpace: 'standard',
    aimingPreference: 'balanced',
    engagementRange: 'medium',
    aimStyle: 'mixed',
    experienceLevel: 'intermediate',
    struggles: {
      overshooting: false,
      undershooting: false,
      shakyAim: false,
      panicCloseRange: false,
    },
  });

  const [result, setResult] = useState<RecommendationResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const rec = generateRecommendation(answers);
    setResult(rec);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <section id="recommender" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Biomechanical Aim Matching</span>
          <h2 className="section-title">Smart Sensitivity Recommender</h2>
          <p className="section-desc">
            Discover a tailored starting sensitivity based on your physical desk environment, mousepad dimensions, aiming ergonomics, and mechanical tendencies.
          </p>
        </div>

        <div style={{ maxWidth: '940px', margin: '0 auto' }}>
          {!result ? (
            <form onSubmit={handleCalculate} className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}>
                {/* 1. Main Game */}
                <div className="input-group">
                  <label className="input-label">
                    <span>Target Main Game</span>
                  </label>
                  <select
                    value={answers.mainGameId}
                    onChange={(e) => setAnswers({ ...answers, mainGameId: e.target.value })}
                    className="input-field"
                  >
                    {GAMES_DATABASE.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.genre})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Mouse DPI */}
                <div className="input-group">
                  <label className="input-label">
                    <span>Mouse Hardware DPI</span>
                  </label>
                  <select
                    value={answers.dpi}
                    onChange={(e) => setAnswers({ ...answers, dpi: parseInt(e.target.value) })}
                    className="input-field mono"
                  >
                    <option value="400">400 DPI (Tactical Classic)</option>
                    <option value="800">800 DPI (Modern Esports Standard)</option>
                    <option value="1600">1600 DPI (Low Latency Optimal)</option>
                    <option value="3200">3200 DPI (High Sensor Saturation)</option>
                  </select>
                </div>

                {/* 3. Mousepad Size */}
                <div className="input-group">
                  <label className="input-label">
                    <span>Mousepad Surface Size</span>
                  </label>
                  <select
                    value={answers.mousepadSize}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        mousepadSize: e.target.value as QuestionnaireAnswers['mousepadSize'],
                      })
                    }
                    className="input-field"
                  >
                    <option value="small">Small (&lt; 30 cm / Standard Office Pad)</option>
                    <option value="medium">Medium (30–45 cm / Standard Gaming)</option>
                    <option value="large">Large (45–90 cm / Esports Extended)</option>
                    <option value="deskmat">Full Deskmat (&gt; 90 cm / Unrestricted)</option>
                  </select>
                </div>

                {/* 4. Desk Space */}
                <div className="input-group">
                  <label className="input-label">
                    <span>Available Desk Space</span>
                  </label>
                  <select
                    value={answers.deskSpace}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        deskSpace: e.target.value as QuestionnaireAnswers['deskSpace'],
                      })
                    }
                    className="input-field"
                  >
                    <option value="cramped">Cramped / Restricted (Must rely on wrist)</option>
                    <option value="standard">Standard (Moderate wrist + arm blend)</option>
                    <option value="generous">Generous / Huge (Full arm sweeps enabled)</option>
                  </select>
                </div>

                {/* 5. Aiming Preference */}
                <div className="input-group">
                  <label className="input-label">
                    <span>Preferred Aiming Style</span>
                  </label>
                  <select
                    value={answers.aimingPreference}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        aimingPreference: e.target.value as QuestionnaireAnswers['aimingPreference'],
                      })
                    }
                    className="input-field"
                  >
                    <option value="precise">Precise (Lower sens, max micro-precision)</option>
                    <option value="balanced">Balanced (Hybrid versatile all-rounder)</option>
                    <option value="fast">Fast (High agility, rapid 180 snap turns)</option>
                  </select>
                </div>

                {/* 6. Engagement Range */}
                <div className="input-group">
                  <label className="input-label">
                    <span>Preferred Engagement Range</span>
                  </label>
                  <select
                    value={answers.engagementRange}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        engagementRange: e.target.value as QuestionnaireAnswers['engagementRange'],
                      })
                    }
                    className="input-field"
                  >
                    <option value="close">Close Quarters (Point-blank tracking & shotgun)</option>
                    <option value="medium">Medium Range (Rifle duels & angle holding)</option>
                    <option value="long">Long Range (Pixel precision & sniper taps)</option>
                    <option value="mixed">Mixed / All Distances</option>
                  </select>
                </div>

                {/* 7. Aim Style */}
                <div className="input-group">
                  <label className="input-label">
                    <span>Dominant Aim Style</span>
                  </label>
                  <select
                    value={answers.aimStyle}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        aimStyle: e.target.value as QuestionnaireAnswers['aimStyle'],
                      })
                    }
                    className="input-field"
                  >
                    <option value="onetap">One-Taps & Crosshair Placement (Valorant/CS)</option>
                    <option value="flicking">Flicking & Snapping (Widow / Cassidy / Scout)</option>
                    <option value="tracking">Smooth Tracking (Apex / Overwatch / CoD)</option>
                    <option value="mixed">Mixed All-Around</option>
                  </select>
                </div>

                {/* 8. Experience Level */}
                <div className="input-group">
                  <label className="input-label">
                    <span>FPS Experience Level</span>
                  </label>
                  <select
                    value={answers.experienceLevel}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        experienceLevel: e.target.value as QuestionnaireAnswers['experienceLevel'],
                      })
                    }
                    className="input-field"
                  >
                    <option value="beginner">Beginner (Still finding comfort)</option>
                    <option value="intermediate">Intermediate (Comfortable with basic aim)</option>
                    <option value="advanced">Advanced (Diamond+ / Faceit Level 7+)</option>
                    <option value="competitive">Esports / Semi-Pro Competitor</option>
                  </select>
                </div>
              </div>

              {/* 9. Mechanical Struggles Checkboxes */}
              <div style={{
                padding: '1.25rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '2rem',
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                  Do you frequently experience any of these mechanical struggles?
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={answers.struggles.overshooting}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          struggles: { ...answers.struggles, overshooting: e.target.checked },
                        })
                      }
                      style={{ accentColor: 'var(--accent-cyan)' }}
                    />
                    <span>Overshooting (Swiping past target)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={answers.struggles.undershooting}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          struggles: { ...answers.struggles, undershooting: e.target.checked },
                        })
                      }
                      style={{ accentColor: 'var(--accent-cyan)' }}
                    />
                    <span>Undershooting (Falling short of target)</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={answers.struggles.shakyAim}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          struggles: { ...answers.struggles, shakyAim: e.target.checked },
                        })
                      }
                      style={{ accentColor: 'var(--accent-cyan)' }}
                    />
                    <span>Shaky / Nervous Jittery Aim</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={answers.struggles.panicCloseRange}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          struggles: { ...answers.struggles, panicCloseRange: e.target.checked },
                        })
                      }
                      style={{ accentColor: 'var(--accent-cyan)' }}
                    />
                    <span>Panic in Close-Range 180 Duels</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '0.85rem 2.25rem', fontSize: '1.05rem' }}
                >
                  <Sparkles size={18} />
                  <span>Generate Tailored Recommendation</span>
                </button>
              </div>
            </form>
          ) : (
            /* Recommendation Result View */
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}>
                <div>
                  <span className="section-tag" style={{ color: 'var(--accent-emerald)' }}>Optimal Starting Point</span>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                    Recommended for {result.game.name}
                  </h3>
                </div>

                <button onClick={handleReset} className="btn btn-secondary btn-sm">
                  <RefreshCw size={14} />
                  <span>Adjust Answers</span>
                </button>
              </div>

              {/* Main Sensitivity Highlight Box */}
              <div style={{
                padding: '2rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-active)',
                marginBottom: '2rem',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Starting Sensitivity ({result.dpi} DPI)
                  </div>
                  <div className="mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                    {result.startingSens.toFixed(result.game.sensPrecision)}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Recommended Exploration Bracket:{' '}
                    <strong className="mono" style={{ color: 'var(--text-primary)' }}>
                      {result.sensRangeMin.toFixed(result.game.sensPrecision)} –{' '}
                      {result.sensRangeMax.toFixed(result.game.sensPrecision)}
                    </strong>
                  </div>
                </div>

                {/* Speed & cm/360 pill */}
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                    {result.targetCm360.toFixed(1)} cm/360°
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ({result.targetInches360.toFixed(1)} inches / 360°)
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: result.speedTier.color + '22',
                      color: result.speedTier.color,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      border: `1px solid ${result.speedTier.color}44`,
                    }}>
                      {result.speedTier.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Transparent Reasoning Points */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--accent-cyan)" />
                  <span>Why This Sensitivity Was Chosen</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.reasoningPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '1rem',
                        backgroundColor: 'var(--bg-input)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        {pt.title}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {pt.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Honest Disclaimer */}
              <div style={{
                padding: '1rem 1.25rem',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
              }}>
                <AlertTriangle size={18} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {result.disclaimer}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={() => onApplyRecommendation(result.game, result.startingSens, result.dpi)}
                  className="btn btn-primary"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  <Sliders size={16} />
                  <span>Apply to Sensitivity Converter</span>
                </button>

                <button
                  onClick={() => onSendToPsa(result.game, result.startingSens, result.dpi)}
                  className="btn btn-outline"
                  style={{ padding: '0.75rem 1.5rem' }}
                >
                  <Target size={16} />
                  <span>Start PSA Calibration With This Sens</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
