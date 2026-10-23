import type { GameDefinition } from '../data/games';
import { GAMES_DATABASE } from '../data/games';
import { calculateTargetSensitivity, getSpeedTier } from './converter';

export interface QuestionnaireAnswers {
  mainGameId: string;
  dpi: number;
  currentSens?: number;
  mousepadSize: 'small' | 'medium' | 'large' | 'deskmat';
  deskSpace: 'cramped' | 'standard' | 'generous';
  aimingPreference: 'precise' | 'balanced' | 'fast';
  engagementRange: 'close' | 'medium' | 'long' | 'mixed';
  aimStyle: 'tracking' | 'flicking' | 'onetap' | 'mixed';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'competitive';
  struggles: {
    overshooting: boolean;
    undershooting: boolean;
    shakyAim: boolean;
    panicCloseRange: boolean;
  };
}

export interface RecommendationResult {
  game: GameDefinition;
  dpi: number;
  startingSens: number;
  sensRangeMin: number;
  sensRangeMax: number;
  targetCm360: number;
  targetInches360: number;
  speedTier: {
    label: string;
    description: string;
    color: string;
  };
  reasoningPoints: {
    title: string;
    description: string;
    type: 'positive' | 'warning' | 'adjustment';
  }[];
  disclaimer: string;
  nextSteps: string[];
}

export function generateRecommendation(answers: QuestionnaireAnswers): RecommendationResult {
  const game = GAMES_DATABASE.find((g) => g.id === answers.mainGameId) || GAMES_DATABASE[0];
  const dpi = answers.dpi > 0 ? answers.dpi : 800;

  // 1. Establish genre baseline in cm/360°
  // Tactical shooters (Valorant, CS2, Tarkov, R6) thrive on 45–60 cm/360
  // Tracking / Hero / Movement shooters (Apex, OW2, Marvel Rivals, TF2) thrive on 30–42 cm/360
  // Fast BRs / Arena (Fortnite, Quake) thrive on 24–36 cm/360
  let baselineCm360 = 40.0;

  if (['valorant', 'cs2', 'csgo', 'r6siege', 'tarkov'].includes(game.id)) {
    baselineCm360 = 50.0; // Tactical precision
  } else if (['apex', 'overwatch2', 'marvelrivals', 'thefinals', 'codwarzone', 'codblackops', 'destiny2'].includes(game.id)) {
    baselineCm360 = 36.0; // Dynamic tracking & movement
  } else if (['fortnite', 'quake', 'tf2', 'doometernal'].includes(game.id)) {
    baselineCm360 = 30.0; // Fast vertical/horizontal agility
  } else if (['minecraft', 'roblox', 'gta5', 'rdr2', 'cyberpunk2077'].includes(game.id)) {
    baselineCm360 = 32.0; // Comfortable casual/open-world exploration
  }

  const reasoning: { title: string; description: string; type: 'positive' | 'warning' | 'adjustment' }[] = [];

  reasoning.push({
    title: `${game.name} Genre Baseline`,
    description: `Optimal competitive play in ${game.name} favors a baseline near ${baselineCm360.toFixed(0)} cm/360° for steady crosshair control.`,
    type: 'positive',
  });

  // 2. Adjust for aiming preference
  if (answers.aimingPreference === 'precise') {
    baselineCm360 *= 1.2; // Slower (more cm/360)
    reasoning.push({
      title: 'Precision-First Focus',
      description: 'Shifted sensitivity down ~20% to grant larger margin of error for micro-corrections and headshot clicks.',
      type: 'adjustment',
    });
  } else if (answers.aimingPreference === 'fast') {
    baselineCm360 *= 0.8; // Faster (less cm/360)
    reasoning.push({
      title: 'High Mobility Preference',
      description: 'Shifted sensitivity up ~20% to enable effortless 180° turns with wrist flicks.',
      type: 'adjustment',
    });
  }

  // 3. Adjust for engagement range
  if (answers.engagementRange === 'long') {
    baselineCm360 *= 1.1;
    reasoning.push({
      title: 'Long-Range Engagements',
      description: 'Minor deceleration applied to stabilize long-distance pixel tracking and minimize accidental over-rotation.',
      type: 'adjustment',
    });
  } else if (answers.engagementRange === 'close') {
    baselineCm360 *= 0.9;
    reasoning.push({
      title: 'Close-Quarter Combat Focus',
      description: 'Increased turning rate slightly to track close fast-moving targets without running out of mousepad.',
      type: 'adjustment',
    });
  }

  // 4. Adjust for aim style (tracking vs flicking vs onetap)
  if (answers.aimStyle === 'onetap') {
    baselineCm360 *= 1.1;
    reasoning.push({
      title: 'One-Tap & Crosshair Placement',
      description: 'Tuned for tactical stability when holding angles and clicking heads.',
      type: 'adjustment',
    });
  } else if (answers.aimStyle === 'tracking') {
    baselineCm360 = Math.min(baselineCm360, 42.0);
    reasoning.push({
      title: 'Smooth Tracking Dynamics',
      description: 'Optimized for fluid motor continuity without excessive arm fatigue during prolonged sprays.',
      type: 'adjustment',
    });
  }

  // 5. Adjust for physical hardware constraints (desk space & mousepad size)
  // Max possible cm/360 is constrained by physical swipe distance
  let maxPhysicalCm = 65;
  if (answers.mousepadSize === 'small' || answers.deskSpace === 'cramped') {
    maxPhysicalCm = 28;
    if (baselineCm360 > maxPhysicalCm) {
      baselineCm360 = maxPhysicalCm;
      reasoning.push({
        title: 'Physical Desk Space Limitation',
        description: `Your small mousepad or cramped desk space requires at least a 180° turn within ~${maxPhysicalCm / 2} cm. We adapted your sensitivity to prevent mousepad running-off.`,
        type: 'warning',
      });
    }
  } else if (answers.mousepadSize === 'medium') {
    maxPhysicalCm = 40;
    if (baselineCm360 > maxPhysicalCm) {
      baselineCm360 = maxPhysicalCm;
      reasoning.push({
        title: 'Medium Mousepad Accommodation',
        description: `Capped sensitivity around ${maxPhysicalCm} cm/360° to guarantee comfortable resets across medium surfaces.`,
        type: 'adjustment',
      });
    }
  } else {
    reasoning.push({
      title: 'Unrestricted Arm Mobility',
      description: 'Your spacious desk and large mousepad allow uninhibited low-sensitivity arm aiming for maximum accuracy.',
      type: 'positive',
    });
  }

  // 6. Adjust for mechanical struggles
  if (answers.struggles.overshooting) {
    baselineCm360 *= 1.12; // Slow it down
    reasoning.push({
      title: 'Overshooting Correction',
      description: 'You indicated passing past targets before adjusting back. Lowering sensitivity will give your hand more distance to brake.',
      type: 'adjustment',
    });
  }
  if (answers.struggles.shakyAim) {
    baselineCm360 *= 1.1; // Slow down jitter
    reasoning.push({
      title: 'Tremor & Shaky Aim Damping',
      description: 'Slightly lower sensitivity naturally filters out minor hand tremors and nervous tension during high-pressure clutches.',
      type: 'adjustment',
    });
  }
  if (answers.struggles.undershooting && !answers.struggles.overshooting) {
    baselineCm360 *= 0.92; // Speed it up slightly
    reasoning.push({
      title: 'Undershooting Assist',
      description: 'You indicated falling short of targets. A slight sensitivity bump reduces the muscular effort needed for standard snaps.',
      type: 'adjustment',
    });
  }
  if (answers.struggles.panicCloseRange) {
    baselineCm360 = Math.min(baselineCm360, 48.0);
    reasoning.push({
      title: 'Close-Range Panic Prevention',
      description: 'Ensuring you can perform a rapid defensive 180° turn with a single swipe without requiring multiple frantic resets.',
      type: 'adjustment',
    });
  }

  // Clamp within practical physical limits (18cm to 70cm)
  baselineCm360 = Math.max(18, Math.min(68, baselineCm360));

  // Invert cm/360 to target game sensitivity
  // Create a dummy game for standard cm/360 inversion
  const dummyGame: GameDefinition = {
    ...game,
    yaw: 0.022,
    calculationType: 'standard_yaw',
  };
  const cs2Sens = 914.4 / (dpi * baselineCm360 * 0.022);
  const startingSens = calculateTargetSensitivity(dummyGame, game, cs2Sens, dpi, dpi);

  // Range +/- 15%
  const sensRangeMin = calculateTargetSensitivity(dummyGame, game, cs2Sens * 0.85, dpi, dpi);
  const sensRangeMax = calculateTargetSensitivity(dummyGame, game, cs2Sens * 1.15, dpi, dpi);

  const targetInches360 = baselineCm360 / 2.54;
  const speedTier = getSpeedTier(baselineCm360);

  return {
    game,
    dpi,
    startingSens,
    sensRangeMin: Math.min(sensRangeMin, sensRangeMax),
    sensRangeMax: Math.max(sensRangeMin, sensRangeMax),
    targetCm360: baselineCm360,
    targetInches360,
    speedTier,
    reasoningPoints: reasoning,
    disclaimer:
      'Sensitivity is fundamentally personal and muscle-memory dependent. No questionnaire or algorithm can decree an "objectively perfect" sensitivity. Use this calculated starting point as your calibrated foundation, then refine it in the SensForge Interactive Calibration mode.',
    nextSteps: [
      `Set your mouse DPI to ${dpi} and in-game sensitivity to ${startingSens.toFixed(game.sensPrecision)}.`,
      'Verify that Windows "Enhance pointer precision" is disabled.',
      'Test this baseline for 10–15 minutes in deathmatch or practice range.',
      'Use SensForge Interactive Calibration mode to fine-tune between the recommended range.',
    ],
  };
}
