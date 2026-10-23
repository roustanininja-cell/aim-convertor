import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, ExternalLink } from 'lucide-react';
import type { GameDefinition, GameCategory } from '../data/games';
import { GAMES_DATABASE } from '../data/games';
import { calculateTargetSensitivity, calculateCm360, getSpeedTier } from '../engine/converter';

interface QuickCompareTableProps {
  sourceGame: GameDefinition;
  sourceSens: number;
  sourceDpi: number;
  onSelectGame: (game: GameDefinition) => void;
}

export const QuickCompareTable: React.FC<QuickCompareTableProps> = ({
  sourceGame,
  sourceSens,
  sourceDpi,
  onSelectGame,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredGames = useMemo(() => {
    return GAMES_DATABASE.filter((game) => {
      const matchesCategory = selectedCategory === 'all' || game.categories.includes(selectedCategory);
      const matchesSearch =
        game.name.toLowerCase().includes(search.toLowerCase()) ||
        game.genre.toLowerCase().includes(search.toLowerCase()) ||
        game.engine.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <section id="compare" style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Cross-Game Matrix</span>
          <h2 className="section-title">Multi-Game Comparison</h2>
          <p className="section-desc">
            See your exact sensitivity translated across all 25 PC games simultaneously. Calculated from your current{' '}
            <strong style={{ color: 'var(--accent-cyan)' }}>{sourceGame.name}</strong> sensitivity ({sourceSens} @ {sourceDpi} DPI).
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {(['all', 'competitive', 'casual', 'fps', 'singleplayer'] as GameCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn btn-sm"
                style={{
                  textTransform: 'capitalize',
                  backgroundColor: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--bg-card)',
                  color: selectedCategory === cat ? '#050811' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  fontWeight: 700,
                }}
              >
                {cat === 'all' ? 'All Games (25)' : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search games, engines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.4rem', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '0.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <th style={{ padding: '1rem' }}>Game & Genre</th>
                <th style={{ padding: '1rem' }}>Equivalent Sens</th>
                <th style={{ padding: '1rem' }}>cm/360°</th>
                <th style={{ padding: '1rem' }}>eDPI</th>
                <th style={{ padding: '1rem' }}>Engine & Yaw</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game) => {
                const targetSens = calculateTargetSensitivity(sourceGame, game, sourceSens, sourceDpi, sourceDpi);
                const cm360 = calculateCm360(game, targetSens, sourceDpi);
                const speed = getSpeedTier(cm360);

                let formattedSens: string;
                if (game.calculationType === 'minecraft_cubic') {
                  formattedSens = `${(targetSens * 200).toFixed(0)}% (s: ${targetSens.toFixed(3)})`;
                } else if (game.sensPrecision === 0) {
                  formattedSens = Math.round(targetSens).toString();
                } else {
                  formattedSens = targetSens.toFixed(game.sensPrecision);
                }

                const edpiVal = game.supportsEdpi ? Math.round(targetSens * sourceDpi) : '—';
                const isCurrentSource = game.id === sourceGame.id;

                return (
                  <tr
                    key={game.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: isCurrentSource ? 'var(--bg-tag)' : 'transparent',
                      transition: 'background-color var(--transition-fast)',
                    }}
                  >
                    {/* Game */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span>{game.name}</span>
                            {isCurrentSource && (
                              <span className="badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>Current</span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{game.genre}</div>
                        </div>
                      </div>
                    </td>

                    {/* Equivalent Sens */}
                    <td style={{ padding: '1rem' }}>
                      <span className="mono" style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: isCurrentSource ? 'var(--accent-cyan)' : 'var(--text-primary)',
                      }}>
                        {formattedSens}
                      </span>
                    </td>

                    {/* cm/360 */}
                    <td style={{ padding: '1rem' }}>
                      <div className="mono" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {cm360.toFixed(1)} cm
                      </div>
                      <div style={{ fontSize: '0.75rem', color: speed.color, fontWeight: 600 }}>
                        {speed.label.split('/')[0]}
                      </div>
                    </td>

                    {/* eDPI */}
                    <td style={{ padding: '1rem' }}>
                      <span className="mono" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {edpiVal}
                      </span>
                    </td>

                    {/* Engine & Yaw */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{game.engine}</div>
                      <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        yaw: {game.yaw}°
                      </div>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${game.verified ? 'badge-verified' : 'badge-warning'}`} style={{ fontSize: '0.7rem' }}>
                        {game.verified ? 'Verified Exact' : 'Approx.'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleCopy(game.id, formattedSens)}
                          className="btn btn-secondary btn-sm"
                          title="Copy sensitivity"
                        >
                          {copiedId === game.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => onSelectGame(game)}
                          className="btn btn-outline btn-sm"
                          title="Set as target in converter"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
