import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Check,
  Bookmark,
  Info,
  Shield,
  FileCode,
  Sparkles,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { GameDefinition } from '../data/games';
import { GAMES_DATABASE } from '../data/games';
import type { ConversionResult } from '../engine/converter';
import { convertSensitivity } from '../engine/converter';

export interface SavedProfile {
  id: string;
  name: string;
  gameId: string;
  gameName: string;
  sensitivity: number;
  dpi: number;
  cm360: number;
  date: string;
}

interface SensitivityConverterProps {
  onSaveProfile: (profile: Omit<SavedProfile, 'id' | 'date'>) => void;
  onSendToPsa: (game: GameDefinition, sens: number, dpi: number) => void;
  initialSourceGameId?: string;
  initialTargetGameId?: string;
  initialSens?: number;
  initialDpi?: number;
}

export const SensitivityConverter: React.FC<SensitivityConverterProps> = ({
  onSaveProfile,
  onSendToPsa,
  initialSourceGameId = 'valorant',
  initialTargetGameId = 'cs2',
  initialSens = 0.35,
  initialDpi = 800,
}) => {
  const [sourceGameId, setSourceGameId] = useState(initialSourceGameId);
  const [targetGameId, setTargetGameId] = useState(initialTargetGameId);
  const [sourceSens, setSourceSens] = useState<number>(initialSens);
  const [sourceDpi, setSourceDpi] = useState<number>(initialDpi);
  const [matchTargetDpi, setMatchTargetDpi] = useState<boolean>(true);
  const [targetDpi, setTargetDpi] = useState<number>(initialDpi);
  const [tarkovGearPenalty, setTarkovGearPenalty] = useState<number>(0);

  const [copied, setCopied] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);
  const [recentPairs, setRecentPairs] = useState<{ sourceId: string; targetId: string }[]>([
    { sourceId: 'valorant', targetId: 'cs2' },
    { sourceId: 'cs2', targetId: 'apex' },
    { sourceId: 'valorant', targetId: 'overwatch2' },
    { sourceId: 'fortnite', targetId: 'valorant' },
    { sourceId: 'apex', targetId: 'thefinals' },
  ]);

  const sourceGame = useMemo(
    () => GAMES_DATABASE.find((g) => g.id === sourceGameId) || GAMES_DATABASE[0],
    [sourceGameId]
  );
  const targetGame = useMemo(
    () => GAMES_DATABASE.find((g) => g.id === targetGameId) || GAMES_DATABASE[1],
    [targetGameId]
  );

  const activeTargetDpi = matchTargetDpi ? sourceDpi : targetDpi;

  // Run conversion
  const result: ConversionResult = useMemo(() => {
    return convertSensitivity(
      sourceGame,
      targetGame,
      sourceSens,
      sourceDpi,
      activeTargetDpi,
      tarkovGearPenalty
    );
  }, [sourceGame, targetGame, sourceSens, sourceDpi, activeTargetDpi, tarkovGearPenalty]);

  // Swap source and target
  const handleSwap = () => {
    const prevSourceId = sourceGameId;
    const prevTargetId = targetGameId;
    setSourceGameId(prevTargetId);
    setTargetGameId(prevSourceId);

    // If swapping, adopt the target sensitivity as the new source sensitivity for continuous conversion!
    if (result.targetSens > 0) {
      setSourceSens(Number(result.targetSens.toFixed(targetGame.sensPrecision)));
    }

    // Update recents
    addRecentPair(prevTargetId, prevSourceId);
  };

  const addRecentPair = (srcId: string, tgtId: string) => {
    setRecentPairs((prev) => {
      const filtered = prev.filter((p) => !(p.sourceId === srcId && p.targetId === tgtId));
      return [{ sourceId: srcId, targetId: tgtId }, ...filtered].slice(0, 6);
    });
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.formattedTargetSens);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveProfile({
      name: `${targetGame.name} (${activeTargetDpi} DPI)`,
      gameId: targetGame.id,
      gameName: targetGame.name,
      sensitivity: Number(result.targetSens.toFixed(targetGame.sensPrecision)),
      dpi: activeTargetDpi,
      cm360: Number(result.targetCm360.toFixed(2)),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <section id="converter" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Section Title */}
        <div className="section-header">
          <span className="section-tag">Zero Drift Math Engine</span>
          <h2 className="section-title">Sensitivity Converter</h2>
          <p className="section-desc">
            Instantly translate your aiming sensitivity between 25 verified games while maintaining exact physical distance on your mousepad.
          </p>
        </div>

        {/* Recent Pairs Quick Select */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Frequent:</span>
          {recentPairs.map((pair, idx) => {
            const sG = GAMES_DATABASE.find((g) => g.id === pair.sourceId);
            const tG = GAMES_DATABASE.find((g) => g.id === pair.targetId);
            if (!sG || !tG) return null;
            const isActive = sourceGameId === pair.sourceId && targetGameId === pair.targetId;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSourceGameId(pair.sourceId);
                  setTargetGameId(pair.targetId);
                }}
                className="btn btn-secondary btn-sm"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.65rem',
                  borderColor: isActive ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  background: isActive ? 'var(--bg-tag)' : 'var(--bg-card)',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                }}
              >
                {sG.name} → {tG.name}
              </button>
            );
          })}
        </div>

        {/* Converter Glass Card */}
        <div className="glass-panel" style={{
          maxWidth: '1020px',
          margin: '0 auto',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top Glow Accent Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-blue), var(--accent-purple))',
          }} />

          {/* Dual Game Picker Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '1rem',
            alignItems: 'end',
            marginBottom: '2rem',
          }} className="game-select-grid">
            {/* Source Game Picker */}
            <div className="input-group">
              <label className="input-label">
                <span>Current Game (From)</span>
                <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>{sourceGame.engine}</span>
              </label>
              <select
                value={sourceGameId}
                onChange={(e) => {
                  setSourceGameId(e.target.value);
                  addRecentPair(e.target.value, targetGameId);
                }}
                className="input-field"
                style={{ fontWeight: 600 }}
              >
                <optgroup label="Competitive Tactical & Hero">
                  {GAMES_DATABASE.filter((g) => g.categories.includes('competitive')).map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Battle Royale & Fast FPS">
                  {GAMES_DATABASE.filter((g) => g.categories.includes('casual') && !g.categories.includes('competitive')).map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Singleplayer & Sandbox">
                  {GAMES_DATABASE.filter((g) => g.categories.includes('singleplayer')).map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Swap Button */}
            <div style={{ paddingBottom: '0.2rem', textAlign: 'center' }}>
              <button
                onClick={handleSwap}
                className="btn btn-secondary btn-icon"
                title="Swap source and target games"
                style={{
                  borderRadius: 'var(--radius-full)',
                  borderColor: 'var(--border-active)',
                  boxShadow: 'var(--glow-cyan)',
                }}
              >
                <ArrowLeftRight size={18} color="var(--accent-cyan)" />
              </button>
            </div>

            {/* Target Game Picker */}
            <div className="input-group">
              <label className="input-label">
                <span>Target Game (To)</span>
                <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>{targetGame.badge || targetGame.engine}</span>
              </label>
              <select
                value={targetGameId}
                onChange={(e) => {
                  setTargetGameId(e.target.value);
                  addRecentPair(sourceGameId, e.target.value);
                }}
                className="input-field"
                style={{ fontWeight: 600 }}
              >
                <optgroup label="Competitive Tactical & Hero">
                  {GAMES_DATABASE.filter((g) => g.categories.includes('competitive')).map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Battle Royale & Fast FPS">
                  {GAMES_DATABASE.filter((g) => g.categories.includes('casual') && !g.categories.includes('competitive')).map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Singleplayer & Sandbox">
                  {GAMES_DATABASE.filter((g) => g.categories.includes('singleplayer')).map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Sensitivity & DPI Inputs Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            padding: '1.5rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
          }}>
            {/* Current Sensitivity Input */}
            <div className="input-group">
              <div className="input-label">
                <span>Current Sensitivity</span>
                <span className="mono" style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>
                  {sourceGame.calculationType === 'minecraft_cubic' ? '0.0 – 1.0 (Options.txt)' : `Min: ${sourceGame.minSens}`}
                </span>
              </div>
              <input
                type="number"
                step={sourceGame.sensStep}
                min={sourceGame.minSens}
                max={sourceGame.maxSens}
                value={sourceSens}
                onChange={(e) => setSourceSens(Math.max(0.001, parseFloat(e.target.value) || 0.001))}
                className="input-field mono"
                placeholder="e.g. 0.35"
              />
            </div>

            {/* Current DPI Input */}
            <div className="input-group">
              <div className="input-label">
                <span>Current Mouse DPI</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[400, 800, 1600].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSourceDpi(preset)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        padding: '0.1rem 0.35rem',
                        fontSize: '0.65rem',
                        borderColor: sourceDpi === preset ? 'var(--accent-cyan)' : 'transparent',
                        color: sourceDpi === preset ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="number"
                step="50"
                min="100"
                max="32000"
                value={sourceDpi}
                onChange={(e) => setSourceDpi(Math.max(100, parseInt(e.target.value) || 800))}
                className="input-field mono"
                placeholder="800"
              />
            </div>

            {/* Target DPI Setting */}
            <div className="input-group">
              <div className="input-label">
                <span>Target Mouse DPI</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={matchTargetDpi}
                    onChange={(e) => setMatchTargetDpi(e.target.checked)}
                    style={{ accentColor: 'var(--accent-cyan)' }}
                  />
                  <span>Same as Source</span>
                </label>
              </div>
              <input
                type="number"
                step="50"
                min="100"
                max="32000"
                disabled={matchTargetDpi}
                value={activeTargetDpi}
                onChange={(e) => setTargetDpi(Math.max(100, parseInt(e.target.value) || 800))}
                className="input-field mono"
                style={{ opacity: matchTargetDpi ? 0.6 : 1 }}
                placeholder="800"
              />
            </div>
          </div>

          {/* Tarkov Gear Penalty Slider (Active if source or target is Tarkov) */}
          {(sourceGameId === 'tarkov' || targetGameId === 'tarkov') && (
            <div style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={16} color="#f59e0b" />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f59e0b' }}>
                    Tarkov Armor Turn Rate Penalty Compensator
                  </span>
                </div>
                <span className="mono" style={{ fontWeight: 700, color: '#f59e0b' }}>
                  -{tarkovGearPenalty}% Turn Penalty
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="1"
                value={tarkovGearPenalty}
                onChange={(e) => setTarkovGearPenalty(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                <span>0% (Naked / Light Rig)</span>
                <span>-12% (Class 4 / Trooper)</span>
                <span>-25% (Class 5/6 Korund / Defender)</span>
                <span>-35% (Altyn + Fort Heavy Kit)</span>
              </div>
            </div>
          )}

          {/* Main Prominent Result Display */}
          <div style={{
            padding: '2rem',
            background: 'linear-gradient(180deg, rgba(16, 23, 38, 0.9) 0%, rgba(9, 14, 24, 0.95) 100%)',
            border: '1px solid var(--border-active)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-elevated)',
            position: 'relative',
            marginBottom: '2rem',
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
            }}>
              {/* Target Sens Value */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                    Target Sensitivity in {targetGame.name}
                  </span>
                  <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>
                    {result.isExact ? '100% Exact Yaw' : 'Calibrated Approximation'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
                  <span className="mono" style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    fontWeight: 900,
                    color: 'var(--accent-cyan)',
                    letterSpacing: '-0.03em',
                    textShadow: '0 0 30px rgba(0, 240, 255, 0.4)',
                  }}>
                    {result.formattedTargetSens}
                  </span>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="btn btn-primary"
                    style={{ padding: '0.55rem 1rem', fontSize: '0.875rem' }}
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy Sensitivity</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleSave}
                  className="btn btn-secondary btn-sm"
                  title="Save configuration to local profiles"
                >
                  <Bookmark size={15} color={saveSuccess ? '#10b981' : 'var(--text-accent)'} />
                  <span>{saveSuccess ? 'Saved to Profiles!' : 'Save Profile'}</span>
                </button>

                <button
                  onClick={() => onSendToPsa(targetGame, result.targetSens, activeTargetDpi)}
                  className="btn btn-outline btn-sm"
                  title="Refine with PSA calibration"
                >
                  <Sparkles size={15} />
                  <span>Calibrate in PSA</span>
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginTop: '1.75rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Distance / 360°
                </div>
                <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {result.targetCm360.toFixed(1)} cm{' '}
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ({result.inches360.toFixed(1)} in)
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Speed Tier
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: result.speedTier.color,
                    boxShadow: `0 0 8px ${result.speedTier.color}`,
                  }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: result.speedTier.color }}>
                    {result.speedTier.label}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {targetGame.supportsEdpi ? `${targetGame.name} eDPI` : 'Source eDPI'}
                </div>
                <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {targetGame.supportsEdpi && result.targetEdpi
                    ? result.targetEdpi
                    : result.sourceEdpi
                    ? `${result.sourceEdpi} (Source)`
                    : 'N/A'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Mousepad Width Required
                </div>
                <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ≥ {result.recommendedMousepadWidthCm} cm{' '}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(180° flick)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ADS / Scoped Sensitivity Multiplier Box (if target supports ADS) */}
          {targetGame.supportsAds && targetGame.adsSettings && targetGame.adsSettings.length > 0 && (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Maximize2 size={16} color="var(--accent-blue)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  {targetGame.name} ADS & Scoped Aim Settings
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {targetGame.adsSettings.map((ads, idx) => (
                  <div key={idx} style={{
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-input)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{ads.label}</span>
                      <span className="mono badge" style={{ fontSize: '0.75rem' }}>{ads.factor}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ads.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mathematical Proof & Engine Mechanics Accordion */}
          <div style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}>
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                backgroundColor: 'var(--bg-secondary)',
                border: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={16} color="var(--accent-cyan)" />
                <span>Conversion Physics & Mathematical Explanation</span>
              </div>
              {showFormulaDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showFormulaDetails && (
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-input)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>
                  {result.explanation}
                </p>

                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1rem',
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Executed Formula:</div>
                  <code className="mono" style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>
                    {result.formulaDisplay}
                  </code>
                </div>

                {targetGame.configFile && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <FileCode size={15} color="var(--accent-blue)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: 'var(--text-secondary)' }}>Config Location: </strong>
                      <span className="mono">{targetGame.configFile}</span>
                      {targetGame.configParam && (
                        <div>
                          <strong style={{ color: 'var(--text-secondary)' }}>Command/Parameter: </strong>
                          <span className="mono">{targetGame.configParam}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {targetGame.limitations && (
                  <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Shield size={14} />
                    <span><strong>Engine Note:</strong> {targetGame.limitations}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .game-select-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </section>
  );
};
