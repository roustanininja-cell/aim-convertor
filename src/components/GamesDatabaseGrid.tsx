import React, { useState, useMemo } from 'react';
import { Search, Sliders } from 'lucide-react';
import type { GameDefinition, GameCategory } from '../data/games';
import { GAMES_DATABASE } from '../data/games';

interface GamesDatabaseGridProps {
  onSelectGame: (game: GameDefinition) => void;
}

export const GamesDatabaseGrid: React.FC<GamesDatabaseGridProps> = ({ onSelectGame }) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [search, setSearch] = useState('');

  const filteredGames = useMemo(() => {
    return GAMES_DATABASE.filter((game) => {
      const matchesCategory = selectedCategory === 'all' || game.categories.includes(selectedCategory);
      const matchesSearch =
        game.name.toLowerCase().includes(search.toLowerCase()) ||
        game.genre.toLowerCase().includes(search.toLowerCase()) ||
        game.engine.toLowerCase().includes(search.toLowerCase()) ||
        game.aliases.some((a) => a.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  return (
    <section id="games" style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">Supported Engines</span>
          <h2 className="section-title">Verified Game Database</h2>
          <p className="section-desc">
            Explore engine specifics, yaw values, config paths, and optical scaling for all 25 supported titles.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Games (25)' },
              { id: 'competitive', label: 'Competitive' },
              { id: 'casual', label: 'Casual Multiplayer' },
              { id: 'fps', label: 'First-Person Shooters' },
              { id: 'singleplayer', label: 'Offline / Single-Player' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as GameCategory)}
                className="btn btn-sm"
                style={{
                  backgroundColor: selectedCategory === cat.id ? 'var(--accent-cyan)' : 'var(--bg-card)',
                  color: selectedCategory === cat.id ? '#050811' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat.id ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  fontWeight: 700,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by game or engine..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.4rem', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {/* Game Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{game.name}</h3>
                  <span className={`badge ${game.verified ? 'badge-verified' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                    {game.badge || (game.verified ? 'Verified' : 'Approx')}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {game.genre} • <strong style={{ color: 'var(--text-secondary)' }}>{game.engine}</strong>
                </div>

                {/* Physics specs */}
                <div style={{
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '0.75rem',
                  fontSize: '0.75rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Yaw Scaling:</span>
                    <span className="mono" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {game.calculationType === 'minecraft_cubic' ? 'Cubic Inversion' : `${game.yaw}°/count`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Baseline Sens:</span>
                    <span className="mono" style={{ fontWeight: 700 }}>
                      {game.defaultSens}
                    </span>
                  </div>
                </div>

                {/* Limitations / Notes */}
                {game.limitations && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                    {game.limitations}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onSelectGame(game);
                  const el = document.getElementById('converter');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
              >
                <Sliders size={14} color="var(--accent-cyan)" />
                <span>Load in Converter</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
