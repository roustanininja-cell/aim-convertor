import type { GameDefinition } from '../data/games';
import { GAMES_DATABASE } from '../data/games';

export interface ConversionResult {
  sourceGame: GameDefinition;
  targetGame: GameDefinition;
  sourceSens: number;
  sourceDpi: number;
  targetDpi: number;
  targetSens: number;
  formattedTargetSens: string;
  sourceCm360: number;
  targetCm360: number;
  inches360: number;
  sourceEdpi: number | null;
  targetEdpi: number | null;
  speedTier: {
    label: string;
    description: string;
    color: string;
  };
  recommendedMousepadWidthCm: number;
  explanation: string;
  formulaDisplay: string;
  isExact: boolean;
  notes?: string;
  limitations?: string;
}

export function getGameById(id: string): GameDefinition {
  const game = GAMES_DATABASE.find((g) => g.id === id);
  if (!game) {
    throw new Error(`Game with id '${id}' not found in database.`);
  }
  return game;
}

/**
 * Calculates physical distance (cm) required on mousepad for a 360° in-game turn.
 * Formula: cm/360° = (360 * 2.54) / (DPI * sensitivity * yaw) = 914.4 / (DPI * sens * yaw)
 */
export function calculateCm360(
  game: GameDefinition,
  sensitivity: number,
  dpi: number,
  gearPenaltyPercent = 0
): number {
  if (dpi <= 0 || sensitivity <= 0) return 0;

  // Handle Minecraft Java non-linear cubic curve
  if (game.calculationType === 'minecraft_cubic') {
    // Clamped slider s in [0.0, 1.0]
    const s = Math.max(0.0001, Math.min(1.0, sensitivity));
    // Rotation degrees per mouse count delta = 1.2 * (0.6 * s + 0.2)^3
    const factor = 0.6 * s + 0.2;
    const delta = 1.2 * Math.pow(factor, 3);
    return (360 * 2.54) / (dpi * delta);
  }

  // Handle standard and percentage yaw
  let effectiveYaw = game.yaw;
  if (game.id === 'tarkov' && gearPenaltyPercent > 0) {
    const penaltyRatio = Math.max(0.1, 1 - gearPenaltyPercent / 100);
    effectiveYaw *= penaltyRatio;
  }

  const denominator = dpi * sensitivity * effectiveYaw;
  if (denominator <= 0) return 0;

  return 914.4 / denominator;
}

/**
 * Calculates equivalent sensitivity in target game to maintain identical cm/360°
 */
export function calculateTargetSensitivity(
  sourceGame: GameDefinition,
  targetGame: GameDefinition,
  sourceSens: number,
  sourceDpi: number,
  targetDpi: number,
  tarkovPenaltyPercent = 0
): number {
  if (sourceSens <= 0 || sourceDpi <= 0 || targetDpi <= 0) return 0;

  const sourceCm360 = calculateCm360(sourceGame, sourceSens, sourceDpi, tarkovPenaltyPercent);
  if (sourceCm360 <= 0) return 0;

  // If target game is Minecraft Java (cubic inversion)
  if (targetGame.calculationType === 'minecraft_cubic') {
    // delta = 914.4 / (targetDpi * sourceCm360)
    const delta = 914.4 / (targetDpi * sourceCm360);
    // delta = 1.2 * (0.6s + 0.2)^3 => (0.6s + 0.2) = cbrt(delta / 1.2)
    const cbrtVal = Math.cbrt(delta / 1.2);
    const s = (cbrtVal - 0.2) / 0.6;
    return Math.max(0.0, Math.min(1.0, s));
  }

  // Standard yaw or percentage yaw inversion
  let effectiveTargetYaw = targetGame.yaw;
  if (targetGame.id === 'tarkov' && tarkovPenaltyPercent > 0) {
    const penaltyRatio = Math.max(0.1, 1 - tarkovPenaltyPercent / 100);
    effectiveTargetYaw *= penaltyRatio;
  }

  const targetSens = 914.4 / (targetDpi * sourceCm360 * effectiveTargetYaw);
  return targetSens;
}

/**
 * Returns speed tier classification based on physical cm/360 distance
 */
export function getSpeedTier(cm360: number): { label: string; description: string; color: string } {
  if (cm360 <= 0) {
    return { label: 'Invalid', description: 'Enter valid sensitivity & DPI', color: '#6b7280' };
  }
  if (cm360 < 20) {
    return {
      label: 'Ultra Fast / Wrist',
      description: 'Extremely fast 360s (<20 cm). Best for fast arena shooters, lightning tracking, and tight desk space.',
      color: '#ef4444',
    };
  }
  if (cm360 < 30) {
    return {
      label: 'Fast / High Sens',
      description: 'Quick 180-degree snaps (20–30 cm). Ideal for Battle Royales like Fortnite, Apex, and Call of Duty.',
      color: '#f97316',
    };
  }
  if (cm360 <= 45) {
    return {
      label: 'Balanced / Medium Sens',
      description: 'The golden balance (30–45 cm). Excellent hybrid for both rapid tracking and precision crosshair placement.',
      color: '#00f0ff',
    };
  }
  if (cm360 <= 65) {
    return {
      label: 'Low / Arm Aiming',
      description: 'Standard tactical FPS range (45–65 cm). Maximizes headshot consistency and micro-adjustments in Valorant and CS2.',
      color: '#3b82f6',
    };
  }
  return {
    label: 'Ultra Low / Precision',
    description: 'Extremely low sensitivity (>65 cm). Requires large deskmat and full forearm sweeps. Maximum pixel precision.',
    color: '#8b5cf6',
  };
}

/**
 * Full conversion routine with human-readable explanations and metadata
 */
export function convertSensitivity(
  sourceGame: GameDefinition,
  targetGame: GameDefinition,
  sourceSens: number,
  sourceDpi: number,
  targetDpi: number = sourceDpi,
  tarkovPenaltyPercent = 0
): ConversionResult {
  const sourceCm360 = calculateCm360(sourceGame, sourceSens, sourceDpi, tarkovPenaltyPercent);
  const targetSens = calculateTargetSensitivity(
    sourceGame,
    targetGame,
    sourceSens,
    sourceDpi,
    targetDpi,
    tarkovPenaltyPercent
  );
  const targetCm360 = calculateCm360(targetGame, targetSens, targetDpi, tarkovPenaltyPercent);

  const inches360 = targetCm360 / 2.54;
  const speedTier = getSpeedTier(targetCm360);

  // Formatted string according to precision rules
  let formattedTargetSens: string;
  if (targetGame.calculationType === 'minecraft_cubic') {
    formattedTargetSens = `${(targetSens * 200).toFixed(0)}% (slider: ${targetSens.toFixed(3)})`;
  } else if (targetGame.sensPrecision === 0) {
    formattedTargetSens = Math.round(targetSens).toString();
  } else {
    formattedTargetSens = targetSens.toFixed(targetGame.sensPrecision);
  }

  // eDPI calculations where applicable
  const sourceEdpi = sourceGame.supportsEdpi ? Math.round(sourceSens * sourceDpi) : null;
  const targetEdpi = targetGame.supportsEdpi ? Math.round(targetSens * targetDpi) : null;

  // Required mousepad width for a comfortable 180° turn (half of 360 distance + 20% margin)
  const recommendedMousepadWidthCm = Math.ceil((targetCm360 / 2) * 1.2);

  // Build educational explanation
  let explanation = '';
  let formulaDisplay = '';

  if (sourceGame.id === targetGame.id) {
    if (sourceDpi === targetDpi) {
      explanation = `Same game and identical DPI: your sensitivity remains ${sourceSens}.`;
      formulaDisplay = `Sens = ${sourceSens}`;
    } else {
      const ratio = sourceDpi / targetDpi;
      explanation = `Same game with DPI change (${sourceDpi} → ${targetDpi}): your sensitivity scales by ${ratio.toFixed(3)} to preserve exact physical mousepad distance.`;
      formulaDisplay = `Target Sens = ${sourceSens} × (${sourceDpi} / ${targetDpi}) = ${formattedTargetSens}`;
    }
  } else if (targetGame.calculationType === 'minecraft_cubic') {
    explanation = `Minecraft uses a cubic sensitivity function. SensForge calculated the exact cubic root inversion to match your ${sourceCm360.toFixed(1)} cm/360° turn distance.`;
    formulaDisplay = `s = (∛(Δx / 1.2) - 0.2) / 0.6 = ${targetSens.toFixed(3)}`;
  } else if (sourceGame.calculationType === 'standard_yaw' && targetGame.calculationType === 'standard_yaw') {
    const yawRatio = sourceGame.yaw / targetGame.yaw;
    const dpiRatio = sourceDpi / targetDpi;
    explanation = `${sourceGame.name} (yaw: ${sourceGame.yaw}°) converts to ${targetGame.name} (yaw: ${targetGame.yaw}°). Multiplier ratio is ${yawRatio.toFixed(4)}${dpiRatio !== 1 ? ` adjusted by DPI ratio (${dpiRatio.toFixed(2)})` : ''}.`;
    formulaDisplay = `Target Sens = ${sourceSens} × (${sourceGame.yaw} / ${targetGame.yaw}) × (${sourceDpi} / ${targetDpi}) = ${formattedTargetSens}`;
  } else {
    explanation = `Converted via physical distance: ${sourceGame.name} at ${sourceSens} (${sourceDpi} DPI) equals ${sourceCm360.toFixed(1)} cm/360°, which translates to ${formattedTargetSens} in ${targetGame.name}.`;
    formulaDisplay = `Target Sens = 914.4 / (${targetDpi} × ${sourceCm360.toFixed(2)} × ${targetGame.yaw}) = ${formattedTargetSens}`;
  }

  return {
    sourceGame,
    targetGame,
    sourceSens,
    sourceDpi,
    targetDpi,
    targetSens,
    formattedTargetSens,
    sourceCm360,
    targetCm360,
    inches360,
    sourceEdpi,
    targetEdpi,
    speedTier,
    recommendedMousepadWidthCm,
    explanation,
    formulaDisplay,
    isExact: targetGame.verified && sourceGame.verified,
    notes: targetGame.proUsageNotes,
    limitations: targetGame.limitations,
  };
}

/**
 * Calculates DPI sensitivity shift (changing mouse DPI without changing game)
 */
export function calculateDpiShift(
  currentSens: number,
  oldDpi: number,
  newDpi: number
): { newSens: number; percentChange: number } {
  if (oldDpi <= 0 || newDpi <= 0) return { newSens: currentSens, percentChange: 0 };
  const newSens = currentSens * (oldDpi / newDpi);
  const percentChange = ((newDpi - oldDpi) / oldDpi) * 100;
  return { newSens, percentChange };
}
