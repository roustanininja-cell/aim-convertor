import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { GameDefinition } from './data/games';
import { GAMES_DATABASE } from './data/games';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import type { SavedProfile } from './components/SensitivityConverter';
import { SensitivityConverter } from './components/SensitivityConverter';
import { SmartRecommender } from './components/SmartRecommender';
import { InteractiveCalibration } from './components/InteractiveCalibration';
import { QuickCompareTable } from './components/QuickCompareTable';
import { ToolsSection } from './components/ToolsSection';
import { GamesDatabaseGrid } from './components/GamesDatabaseGrid';
import { GameSettingsGuides } from './components/GameSettingsGuides';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { SavedProfilesModal } from './components/SavedProfilesModal';

const DEFAULT_PROFILES: SavedProfile[] = [
  {
    id: 'prof-val-1',
    name: 'Valorant Competitive (800 DPI)',
    gameId: 'valorant',
    gameName: 'Valorant',
    sensitivity: 0.35,
    dpi: 800,
    cm360: 46.65,
    date: '2026-10-23',
  },
  {
    id: 'prof-cs2-1',
    name: 'CS2 Faceit Arm Aim (400 DPI)',
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    sensitivity: 1.8,
    dpi: 400,
    cm360: 57.73,
    date: '2026-10-23',
  },
  {
    id: 'prof-apex-1',
    name: 'Apex Fast Tracking (800 DPI)',
    gameId: 'apex',
    gameName: 'Apex Legends',
    sensitivity: 1.4,
    dpi: 800,
    cm360: 37.11,
    date: '2026-10-23',
  },
];

export function App() {
  const [theme, toggleTheme] = useTheme();
  const [savedProfiles, setSavedProfiles] = useLocalStorage<SavedProfile[]>(
    'sensforge_saved_profiles',
    DEFAULT_PROFILES
  );
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState(false);

  // Converter state
  const [sourceGameId, setSourceGameId] = useState('valorant');
  const [targetGameId, setTargetGameId] = useState('cs2');
  const [currentSens, setCurrentSens] = useState(0.35);
  const [currentDpi, setCurrentDpi] = useState(800);
  const [converterKey, setConverterKey] = useState(0);
  const [psaKey, setPsaKey] = useState(0);

  // PSA calibration input state
  const [psaGame, setPsaGame] = useState<GameDefinition>(GAMES_DATABASE[0]);
  const [psaSens, setPsaSens] = useState<number>(0.35);
  const [psaDpi, setPsaDpi] = useState<number>(800);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveProfile = (newProf: Omit<SavedProfile, 'id' | 'date'>) => {
    const profileWithMeta: SavedProfile = {
      ...newProf,
      id: `prof-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setSavedProfiles((prev) => [profileWithMeta, ...prev]);
  };

  const handleDeleteProfile = (id: string) => {
    setSavedProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearAllProfiles = () => {
    setSavedProfiles([]);
  };

  const handleImportProfiles = (imported: SavedProfile[]) => {
    setSavedProfiles((prev) => [...imported, ...prev]);
  };

  const handleLoadProfile = (prof: SavedProfile) => {
    setSourceGameId(prof.gameId);
    setCurrentSens(prof.sensitivity);
    setCurrentDpi(prof.dpi);
    setConverterKey((k) => k + 1);
    const g = GAMES_DATABASE.find((item) => item.id === prof.gameId);
    if (g) {
      setPsaGame(g);
      setPsaSens(prof.sensitivity);
      setPsaDpi(prof.dpi);
      setPsaKey((k) => k + 1);
    }
    scrollTo('converter');
  };

  const handleSelectGameForConverter = (game: GameDefinition) => {
    setTargetGameId(game.id);
    setConverterKey((k) => k + 1);
    scrollTo('converter');
  };

  const handleApplyRecommendation = (game: GameDefinition, sens: number, dpi: number) => {
    setTargetGameId(game.id);
    setCurrentSens(Number(sens.toFixed(game.sensPrecision)));
    setCurrentDpi(dpi);
    setConverterKey((k) => k + 1);
    scrollTo('converter');
  };

  const handleSendToPsa = (game: GameDefinition, sens: number, dpi: number) => {
    setPsaGame(game);
    setPsaSens(Number(sens.toFixed(game.sensPrecision)));
    setPsaDpi(dpi);
    setPsaKey((k) => k + 1);
    scrollTo('calibration');
  };

  const handleApplyCalibratedSens = (game: GameDefinition, sens: number, dpi: number) => {
    setTargetGameId(game.id);
    setCurrentSens(Number(sens.toFixed(game.sensPrecision)));
    setCurrentDpi(dpi);
    setConverterKey((k) => k + 1);
    scrollTo('converter');
  };

  const currentSourceGame = GAMES_DATABASE.find((g) => g.id === sourceGameId) || GAMES_DATABASE[0];

  return (
    <div className="app-layout">
      {/* Sticky Header */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        savedCount={savedProfiles.length}
        onOpenProfiles={() => setIsProfilesModalOpen(true)}
      />

      {/* Main Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero onScrollTo={scrollTo} />

        {/* 2. Main Converter */}
        <SensitivityConverter
          key={converterKey}
          initialSourceGameId={sourceGameId}
          initialTargetGameId={targetGameId}
          initialSens={currentSens}
          initialDpi={currentDpi}
          onSaveProfile={handleSaveProfile}
          onSendToPsa={handleSendToPsa}
        />

        {/* 3. Multi-Game Compare Matrix */}
        <QuickCompareTable
          sourceGame={currentSourceGame}
          sourceSens={currentSens}
          sourceDpi={currentDpi}
          onSelectGame={handleSelectGameForConverter}
        />

        {/* 4. Smart Recommender */}
        <SmartRecommender
          onApplyRecommendation={handleApplyRecommendation}
          onSendToPsa={handleSendToPsa}
        />

        {/* 5. Aim Calibration & Mini-Benchmark */}
        <InteractiveCalibration
          key={psaKey}
          initialGame={psaGame}
          initialSens={psaSens}
          initialDpi={psaDpi}
          onApplyCalibratedSens={handleApplyCalibratedSens}
        />

        {/* 6. Precision Tools (eDPI, cm/360, DPI Shifter) */}
        <ToolsSection />

        {/* 7. Supported Games Database Grid */}
        <GamesDatabaseGrid onSelectGame={handleSelectGameForConverter} />

        {/* 8. Esports Aim & Windows Guides */}
        <GameSettingsGuides />

        {/* 9. FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Local Saved Profiles Modal */}
      <SavedProfilesModal
        isOpen={isProfilesModalOpen}
        onClose={() => setIsProfilesModalOpen(false)}
        profiles={savedProfiles}
        onDeleteProfile={handleDeleteProfile}
        onLoadProfile={handleLoadProfile}
        onImportProfiles={handleImportProfiles}
        onClearAll={handleClearAllProfiles}
      />
    </div>
  );
}

export default App;
