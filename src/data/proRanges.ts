export interface ProBenchmark {
  gameId: string;
  gameName: string;
  metric: 'eDPI' | 'cm360';
  metricUnit: string;
  proAverage: number;
  proLow: number;
  proHigh: number;
  description: string;
  notablePros: { name: string; value: string; team: string }[];
}

export const PRO_BENCHMARKS: ProBenchmark[] = [
  {
    gameId: 'valorant',
    gameName: 'Valorant',
    metric: 'eDPI',
    metricUnit: 'eDPI',
    proAverage: 280,
    proLow: 200,
    proHigh: 400,
    description: 'VCT pros heavily favor low sensitivities (35–65 cm/360°) to stabilize crosshair headshot placement.',
    notablePros: [
      { name: 'TenZ', value: '280 eDPI (0.35 @ 800 DPI)', team: 'Sentinels' },
      { name: 'nAts', value: '200 eDPI (0.25 @ 800 DPI)', team: 'Team Liquid' },
      { name: 'Chronicle', value: '184 eDPI (0.23 @ 800 DPI)', team: 'Fnatic' },
      { name: 'f0rsakeN', value: '568 eDPI (0.71 @ 800 DPI)', team: 'Paper Rex' },
    ],
  },
  {
    gameId: 'cs2',
    gameName: 'Counter-Strike 2',
    metric: 'eDPI',
    metricUnit: 'eDPI',
    proAverage: 800,
    proLow: 600,
    proHigh: 1050,
    description: 'CS2 pros predominantly utilize arm aiming (40–60 cm/360°) for consistent first-bullet accuracy.',
    notablePros: [
      { name: 'NiKo', value: '608 eDPI (1.52 @ 400 DPI)', team: 'Falcons' },
      { name: 'm0NESY', value: '800 eDPI (2.0 @ 400 DPI)', team: 'G2 Esports' },
      { name: 's1mple', value: '1236 eDPI (3.09 @ 400 DPI)', team: 'Legend' },
      { name: 'ZywOo', value: '800 eDPI (2.0 @ 400 DPI)', team: 'Vitality' },
    ],
  },
  {
    gameId: 'apex',
    gameName: 'Apex Legends',
    metric: 'cm360',
    metricUnit: 'cm/360°',
    proAverage: 42,
    proLow: 32,
    proHigh: 54,
    description: 'High tracking and movement dynamics necessitate faster 360° turnaround without sacrificing smooth recoil control.',
    notablePros: [
      { name: 'ImperialHal', value: '43.3 cm/360 (1.2 @ 800 DPI)', team: 'Falcons' },
      { name: 'sweetdreams', value: '37.1 cm/360 (1.4 @ 800 DPI)', team: 'LG' },
      { name: 'aceu', value: '32.5 cm/360 (1.6 @ 800 DPI)', team: 'Sentinels' },
    ],
  },
  {
    gameId: 'overwatch2',
    gameName: 'Overwatch 2',
    metric: 'eDPI',
    metricUnit: 'eDPI',
    proAverage: 4000,
    proLow: 2800,
    proHigh: 6000,
    description: 'Hitscan players (Cassidy, Widow) average ~3200 eDPI, while Tracer and Genji pros run 5000+ for fast 180 blinks.',
    notablePros: [
      { name: 'Lip', value: '3040 eDPI (3.8 @ 800 DPI)', team: 'Crazy Raccoon' },
      { name: 'Proper', value: '4400 eDPI (5.5 @ 800 DPI)', team: 'Team Falcons' },
      { name: 'Shu', value: '4000 eDPI (5.0 @ 800 DPI)', team: 'Crazy Raccoon' },
    ],
  },
  {
    gameId: 'fortnite',
    gameName: 'Fortnite',
    metric: 'cm360',
    metricUnit: 'cm/360°',
    proAverage: 30,
    proLow: 22,
    proHigh: 40,
    description: 'Fast build and editing resets require rapid 180° wrist turns with sufficient shotgun flick control.',
    notablePros: [
      { name: 'Bugha', value: '34 cm/360 (7.0% @ 800 DPI)', team: 'World Champion' },
      { name: 'Peterbot', value: '29 cm/360 (8.2% @ 800 DPI)', team: 'FNCS Champion' },
      { name: 'Mongraal', value: '31 cm/360 (7.6% @ 800 DPI)', team: 'Legend' },
    ],
  },
];
