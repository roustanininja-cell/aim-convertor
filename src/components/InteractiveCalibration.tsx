import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Crosshair, Play, RotateCcw, Award, Sparkles } from 'lucide-react';
import type { GameDefinition } from '../data/games';
import { GAMES_DATABASE } from '../data/games';
import type { PsaState } from '../engine/psa';
import { initializePsa, stepPsa } from '../engine/psa';
import { calculateCm360 } from '../engine/converter';

interface InteractiveCalibrationProps {
  initialGame?: GameDefinition;
  initialSens?: number;
  initialDpi?: number;
  onApplyCalibratedSens: (game: GameDefinition, sens: number, dpi: number) => void;
}

export const InteractiveCalibration: React.FC<InteractiveCalibrationProps> = ({
  initialGame = GAMES_DATABASE[0],
  initialSens = 0.35,
  initialDpi = 800,
  onApplyCalibratedSens,
}) => {
  const [activeTab, setActiveTab] = useState<'psa' | 'canvas'>('psa');

  // PSA State
  const [selectedGame, setSelectedGame] = useState<GameDefinition>(initialGame);
  const [baseSensInput, setBaseSensInput] = useState<number>(initialSens);
  const [dpiInput, setDpiInput] = useState<number>(initialDpi);
  const [psaState, setPsaState] = useState<PsaState | null>(null);

  const handleStartPsa = () => {
    setPsaState(initializePsa(baseSensInput, 5));
  };

  const handlePsaChoice = (choice: 'low' | 'high') => {
    if (!psaState) return;
    const nextState = stepPsa(psaState, choice);
    setPsaState(nextState);
  };

  const handleResetPsa = () => {
    setPsaState(null);
  };

  // Canvas Aim Benchmark State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const targetRef = useRef<{ x: number; y: number; r: number; spawnTime: number } | null>(null);

  // Canvas Game loop
  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle grid background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (!targetRef.current) return;

    const { x, y, r } = targetRef.current;

    // Glowing Target Ring
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner Bullseye
    ctx.beginPath();
    ctx.arc(x, y, r * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();

    // Center Cross
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.lineTo(x + 6, y);
    ctx.moveTo(x, y - 6);
    ctx.lineTo(x, y + 6);
    ctx.stroke();
  }, []);

  const handleSpawnTarget = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = 24;
    const x = r + Math.random() * (canvas.width - 2 * r);
    const y = r + Math.random() * (canvas.height - 2 * r);
    targetRef.current = { x, y, r, spawnTime: performance.now() };
    draw();
  }, [draw]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (!targetRef.current) return;

    const dx = clickX - targetRef.current.x;
    const dy = clickY - targetRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= targetRef.current.r) {
      // Hit!
      const elapsed = performance.now() - targetRef.current.spawnTime;
      setReactionTimes((prev) => [...prev, elapsed]);
      setScore((s) => s + 1);
      handleSpawnTarget();
    } else {
      // Miss
      setMisses((m) => m + 1);
    }
  };

  const handleStartCanvasGame = () => {
    setScore(0);
    setMisses(0);
    setReactionTimes([]);
    setTimeLeft(30);
    setGameActive(true);
    setTimeout(() => handleSpawnTarget(), 100);
  };

  const avgReactionMs = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const totalShots = score + misses;
  const accuracyPct = totalShots > 0 ? Math.round((score / totalShots) * 100) : 0;

  return (
    <section id="calibration" style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Interactive Fine-Tuning</span>
          <h2 className="section-title">Aim Calibration & Testing</h2>
          <p className="section-desc">
            Use the Perfect Sensitivity Approximation (PSA) coach method to dial in your sweet spot, or test your click speed and accuracy on the interactive aim canvas.
          </p>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveTab('psa')}
            className="btn"
            style={{
              padding: '0.65rem 1.5rem',
              backgroundColor: activeTab === 'psa' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTab === 'psa' ? '#050811' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: activeTab === 'psa' ? 'var(--accent-cyan)' : 'var(--border-subtle)',
              fontWeight: 700,
            }}
          >
            <Sparkles size={16} />
            <span>PSA Method (Coaching Iteration)</span>
          </button>

          <button
            onClick={() => setActiveTab('canvas')}
            className="btn"
            style={{
              padding: '0.65rem 1.5rem',
              backgroundColor: activeTab === 'canvas' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTab === 'canvas' ? '#050811' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: activeTab === 'canvas' ? 'var(--accent-cyan)' : 'var(--border-subtle)',
              fontWeight: 700,
            }}
          >
            <Crosshair size={16} />
            <span>Interactive Aim Canvas Mini-Trainer</span>
          </button>
        </div>

        {/* TAB 1: PSA COACHING METHOD */}
        {activeTab === 'psa' && (
          <div className="glass-panel" style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem' }}>
            {!psaState ? (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    What is the PSA Method?
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto' }}>
                    The <strong>Perfect Sensitivity Approximation</strong> is used by pro FPS coaches. You test high and low candidate sensitivities side-by-side. Through binary elimination over 5 iterations, your natural hand motor control converges on your optimal sensitivity.
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                }}>
                  <div className="input-group">
                    <label className="input-label">Selected Game</label>
                    <select
                      value={selectedGame.id}
                      onChange={(e) => {
                        const g = GAMES_DATABASE.find((item) => item.id === e.target.value);
                        if (g) setSelectedGame(g);
                      }}
                      className="input-field"
                    >
                      {GAMES_DATABASE.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Estimated Base Sens</label>
                    <input
                      type="number"
                      step={selectedGame.sensStep}
                      value={baseSensInput}
                      onChange={(e) => setBaseSensInput(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                      className="input-field mono"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">DPI</label>
                    <input
                      type="number"
                      value={dpiInput}
                      onChange={(e) => setDpiInput(Math.max(100, parseInt(e.target.value) || 800))}
                      className="input-field mono"
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button onClick={handleStartPsa} className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
                    <Play size={18} />
                    <span>Begin 5-Round PSA Calibration</span>
                  </button>
                </div>
              </div>
            ) : !psaState.isFinished ? (
              /* Ongoing PSA Iterations */
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className="badge" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                      Iteration {psaState.currentIteration} of {psaState.maxIterations}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      in {selectedGame.name} ({dpiInput} DPI)
                    </span>
                  </div>
                  <button onClick={handleResetPsa} className="btn btn-secondary btn-sm">
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Instructions */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.75rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                }}>
                  Test both sensitivities in <strong>{selectedGame.name}</strong> practice mode (or target tracking). Spend 60 seconds testing <strong>Low</strong>, then 60 seconds testing <strong>High</strong>. Which felt more natural and had fewer overshoots?
                </div>

                {/* Candidate Selection Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                  {/* Low Candidate */}
                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Option A: Lower Candidate
                    </div>
                    <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-blue)', margin: '0.5rem 0' }}>
                      {psaState.history[psaState.currentIteration - 1].lowSens.toFixed(selectedGame.sensPrecision)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      ~{calculateCm360(selectedGame, psaState.history[psaState.currentIteration - 1].lowSens, dpiInput).toFixed(1)} cm/360°
                    </div>
                    <button
                      onClick={() => handlePsaChoice('low')}
                      className="btn btn-outline"
                      style={{ width: '100%', borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)' }}
                    >
                      <span>Low Felt More Consistent</span>
                    </button>
                  </div>

                  {/* High Candidate */}
                  <div
                    style={{
                      padding: '1.5rem',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Option B: Higher Candidate
                    </div>
                    <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-cyan)', margin: '0.5rem 0' }}>
                      {psaState.history[psaState.currentIteration - 1].highSens.toFixed(selectedGame.sensPrecision)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      ~{calculateCm360(selectedGame, psaState.history[psaState.currentIteration - 1].highSens, dpiInput).toFixed(1)} cm/360°
                    </div>
                    <button
                      onClick={() => handlePsaChoice('high')}
                      className="btn btn-outline"
                      style={{ width: '100%', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}
                    >
                      <span>High Felt More Responsive</span>
                    </button>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  {Array.from({ length: psaState.maxIterations }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '35px',
                        height: '6px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor:
                          i + 1 < psaState.currentIteration
                            ? 'var(--accent-cyan)'
                            : i + 1 === psaState.currentIteration
                            ? 'var(--accent-blue)'
                            : 'var(--border-subtle)',
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Finished Calibration Result */
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}>
                  <Award size={36} color="#10b981" />
                </div>

                <span className="section-tag" style={{ color: '#10b981' }}>Convergence Complete</span>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                  Your Calibrated Golden Sensitivity
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Through 5 binary coach iterations, your aiming motor control selected this sensitivity as your optimal stability point.
                </p>

                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-active)',
                  maxWidth: '360px',
                  margin: '0 auto 2rem auto',
                }}>
                  <div className="mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                    {psaState.optimalSens.toFixed(selectedGame.sensPrecision)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    in {selectedGame.name} at {dpiInput} DPI (
                    {calculateCm360(selectedGame, psaState.optimalSens, dpiInput).toFixed(1)} cm/360°)
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => onApplyCalibratedSens(selectedGame, psaState.optimalSens, dpiInput)}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.75rem' }}
                  >
                    <span>Apply to Sensitivity Converter</span>
                  </button>
                  <button onClick={handleResetPsa} className="btn btn-secondary">
                    <RotateCcw size={15} />
                    <span>Test Another Game</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE AIM CANVAS MINI-TRAINER */}
        {activeTab === 'canvas' && (
          <div className="glass-panel" style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                In-Browser Flick & Reaction Benchmark
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Test your cursor control right now. Hit targets as fast as they appear to measure reaction time and flick consistency.
              </p>
            </div>

            {/* Canvas */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
              <canvas
                ref={canvasRef}
                width={720}
                height={400}
                onClick={handleCanvasClick}
                style={{
                  width: '100%',
                  maxWidth: '720px',
                  height: 'auto',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  cursor: gameActive ? 'crosshair' : 'default',
                  display: 'block',
                }}
              />

              {!gameActive && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(9, 14, 24, 0.85)',
                  borderRadius: 'var(--radius-md)',
                  backdropFilter: 'blur(4px)',
                }}>
                  <button onClick={handleStartCanvasGame} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                    <Play size={18} />
                    <span>{score > 0 ? 'Play Again (30s)' : 'Start 30-Second Aim Test'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Score & Metrics Ribbon */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'var(--bg-input)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Left</div>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: timeLeft < 10 ? '#ef4444' : 'var(--text-primary)' }}>
                  {timeLeft}s
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hits</div>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {score}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: accuracyPct >= 90 ? '#10b981' : 'var(--text-primary)' }}>
                  {accuracyPct}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Reaction</div>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                  {avgReactionMs > 0 ? `${avgReactionMs}ms` : '—'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
