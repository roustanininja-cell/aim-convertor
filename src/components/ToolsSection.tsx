import React, { useState } from 'react';
import { Calculator, Gauge, Cpu, ShieldCheck } from 'lucide-react';
import { GAMES_DATABASE } from '../data/games';
import { calculateCm360, calculateDpiShift, getSpeedTier } from '../engine/converter';
import { PRO_BENCHMARKS } from '../data/proRanges';

export const ToolsSection: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'edpi' | 'cm360' | 'dpishift'>('edpi');

  // eDPI Calculator State
  const [edpiGameId, setEdpiGameId] = useState<string>('valorant');
  const [edpiSens, setEdpiSens] = useState<number>(0.35);
  const [edpiDpi, setEdpiDpi] = useState<number>(800);

  // cm/360 Calculator State
  const [cmGameId, setCmGameId] = useState<string>('cs2');
  const [cmSens, setCmSens] = useState<number>(1.2);
  const [cmDpi, setCmDpi] = useState<number>(800);

  // DPI Shifter State
  const [shiftSens, setShiftSens] = useState<number>(1.5);
  const [oldDpi, setOldDpi] = useState<number>(400);
  const [newDpi, setNewDpi] = useState<number>(1600);

  // eDPI Calculations
  const selectedEdpiGame = GAMES_DATABASE.find((g) => g.id === edpiGameId) || GAMES_DATABASE[0];
  const userEdpi = Math.round(edpiSens * edpiDpi);
  const proBenchmark = PRO_BENCHMARKS.find((b) => b.gameId === edpiGameId);

  // cm/360 Calculations
  const selectedCmGame = GAMES_DATABASE.find((g) => g.id === cmGameId) || GAMES_DATABASE[1];
  const calculatedCm = calculateCm360(selectedCmGame, cmSens, cmDpi);
  const calculatedInches = calculatedCm / 2.54;
  const speedTier = getSpeedTier(calculatedCm);
  const halfFlickCm = calculatedCm / 2;

  // DPI Shifter Calculations
  const shifted = calculateDpiShift(shiftSens, oldDpi, newDpi);

  return (
    <section id="calculators" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Precision Utilities</span>
          <h2 className="section-title">Esports Aim Calculators</h2>
          <p className="section-desc">
            Essential standalone calculators for pro eDPI benchmarks, physical cm/360° mousepad travel, and low-latency DPI shifts.
          </p>
        </div>

        {/* Tool Switcher Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTool('edpi')}
            className="btn"
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: activeTool === 'edpi' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTool === 'edpi' ? '#050811' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: activeTool === 'edpi' ? 'var(--accent-cyan)' : 'var(--border-subtle)',
              fontWeight: 700,
            }}
          >
            <Gauge size={16} />
            <span>eDPI Benchmark</span>
          </button>

          <button
            onClick={() => setActiveTool('cm360')}
            className="btn"
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: activeTool === 'cm360' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTool === 'cm360' ? '#050811' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: activeTool === 'cm360' ? 'var(--accent-cyan)' : 'var(--border-subtle)',
              fontWeight: 700,
            }}
          >
            <Calculator size={16} />
            <span>cm/360° Travel Calculator</span>
          </button>

          <button
            onClick={() => setActiveTool('dpishift')}
            className="btn"
            style={{
              padding: '0.65rem 1.25rem',
              backgroundColor: activeTool === 'dpishift' ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: activeTool === 'dpishift' ? '#050811' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: activeTool === 'dpishift' ? 'var(--accent-cyan)' : 'var(--border-subtle)',
              fontWeight: 700,
            }}
          >
            <Cpu size={16} />
            <span>DPI Shifter (Latency Tuner)</span>
          </button>
        </div>

        {/* TOOL 1: eDPI CALCULATOR */}
        {activeTool === 'edpi' && (
          <div className="glass-panel" style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              <div className="input-group">
                <label className="input-label">Game</label>
                <select
                  value={edpiGameId}
                  onChange={(e) => setEdpiGameId(e.target.value)}
                  className="input-field"
                >
                  {GAMES_DATABASE.filter((g) => g.supportsEdpi).map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Sensitivity</label>
                <input
                  type="number"
                  step="0.01"
                  value={edpiSens}
                  onChange={(e) => setEdpiSens(parseFloat(e.target.value) || 0)}
                  className="input-field mono"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Mouse DPI</label>
                <input
                  type="number"
                  step="50"
                  value={edpiDpi}
                  onChange={(e) => setEdpiDpi(parseInt(e.target.value) || 800)}
                  className="input-field mono"
                />
              </div>
            </div>

            {/* eDPI Result Card */}
            <div style={{
              padding: '1.75rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-active)',
              marginBottom: '2rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Your {selectedEdpiGame.name} Effective DPI (eDPI)
              </div>
              <div className="mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                {userEdpi}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Formula: {edpiDpi} DPI × {edpiSens} Sensitivity = {userEdpi} eDPI
              </div>
            </div>

            {/* Pro Benchmark Comparison */}
            {proBenchmark && (
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} color="var(--accent-cyan)" />
                  <span>Pro Esports Benchmark ({proBenchmark.gameName})</span>
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  {proBenchmark.description}
                </p>

                {/* Benchmark Range Visual Bar */}
                <div style={{
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.5rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <span>Pro Low: {proBenchmark.proLow}</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Pro Median: ~{proBenchmark.proAverage}</span>
                    <span>Pro High: {proBenchmark.proHigh}</span>
                  </div>
                  <div style={{ position: 'relative', height: '10px', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute',
                      left: '25%',
                      right: '25%',
                      top: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 240, 255, 0.4)',
                    }} />
                  </div>
                </div>

                {/* Notable Pros */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                  {proBenchmark.notablePros.map((pro, idx) => (
                    <div key={idx} style={{
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{pro.name}</div>
                      <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{pro.value}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pro.team}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TOOL 2: cm/360 CALCULATOR */}
        {activeTool === 'cm360' && (
          <div className="glass-panel" style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              <div className="input-group">
                <label className="input-label">Game</label>
                <select
                  value={cmGameId}
                  onChange={(e) => setCmGameId(e.target.value)}
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
                <label className="input-label">In-Game Sensitivity</label>
                <input
                  type="number"
                  step="0.05"
                  value={cmSens}
                  onChange={(e) => setCmSens(parseFloat(e.target.value) || 0)}
                  className="input-field mono"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Mouse DPI</label>
                <input
                  type="number"
                  step="50"
                  value={cmDpi}
                  onChange={(e) => setCmDpi(parseInt(e.target.value) || 800)}
                  className="input-field mono"
                />
              </div>
            </div>

            {/* cm/360 Result Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-active)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Full 360° Rotation Distance
                </div>
                <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                  {calculatedCm.toFixed(1)} <span style={{ fontSize: '1.25rem' }}>cm</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ({calculatedInches.toFixed(1)} inches)
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  180° Snap Turn Distance
                </div>
                <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--accent-blue)' }}>
                  {halfFlickCm.toFixed(1)} <span style={{ fontSize: '1.25rem' }}>cm</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Requires ≥ {Math.ceil(halfFlickCm * 1.2)} cm mousepad surface
                </div>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Speed Classification
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: speedTier.color, marginTop: '0.5rem' }}>
                  {speedTier.label.split('/')[0]}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  {speedTier.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: DPI SHIFTER (LATENCY TUNER) */}
        {activeTool === 'dpishift' && (
          <div className="glass-panel" style={{ maxWidth: '840px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Why Shift to 1600 DPI?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Modern optical sensors (PixArt 3395/3950/Hero) send cursor movement reports faster at higher DPIs. Switching from 400 DPI to 1600 DPI cuts sensor click-to-motion latency by up to 2–3 milliseconds and prevents pixel skipping.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}>
              <div className="input-group">
                <label className="input-label">Current Sensitivity</label>
                <input
                  type="number"
                  step="0.05"
                  value={shiftSens}
                  onChange={(e) => setShiftSens(parseFloat(e.target.value) || 0)}
                  className="input-field mono"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Current Mouse DPI</label>
                <select
                  value={oldDpi}
                  onChange={(e) => setOldDpi(parseInt(e.target.value))}
                  className="input-field mono"
                >
                  <option value="400">400 DPI</option>
                  <option value="800">800 DPI</option>
                  <option value="1200">1200 DPI</option>
                  <option value="1600">1600 DPI</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">New Mouse DPI</label>
                <select
                  value={newDpi}
                  onChange={(e) => setNewDpi(parseInt(e.target.value))}
                  className="input-field mono"
                >
                  <option value="800">800 DPI (Double)</option>
                  <option value="1600">1600 DPI (Recommended Low Latency)</option>
                  <option value="3200">3200 DPI (Ultra Saturation)</option>
                </select>
              </div>
            </div>

            {/* Shifter Result */}
            <div style={{
              padding: '2rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-active)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Adjusted In-Game Sensitivity at {newDpi} DPI
              </div>
              <div className="mono" style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>
                {shifted.newSens.toFixed(3)}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Your physical cm/360° remains 100% identical. Your mouse now sends {newDpi / oldDpi}x more sensor counts per inch for smoother micro-corrections!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
