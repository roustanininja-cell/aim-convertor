import { describe, it, expect } from 'vitest';
import {
  calculateCm360,
  calculateTargetSensitivity,
  convertSensitivity,
  calculateDpiShift,
  getGameById,
} from '../engine/converter';
import { initializePsa, stepPsa } from '../engine/psa';

describe('Sensitivity Converter Math Engine', () => {
  const valorant = getGameById('valorant');
  const cs2 = getGameById('cs2');
  const apex = getGameById('apex');
  const overwatch2 = getGameById('overwatch2');
  const fortnite = getGameById('fortnite');
  const minecraft = getGameById('minecraft');
  const tarkov = getGameById('tarkov');

  it('calculates physical cm/360 correctly for Valorant', () => {
    // Valorant: sens 0.35, 800 DPI, yaw 0.07
    // cm/360 = 914.4 / (800 * 0.35 * 0.07) = 914.4 / 19.6 = 46.653 cm
    const cm360 = calculateCm360(valorant, 0.35, 800);
    expect(cm360).toBeCloseTo(46.653, 2);
  });

  it('calculates 1:1 conversion between CS2 and Apex Legends', () => {
    // Both CS2 and Apex use yaw 0.022
    const targetSens = calculateTargetSensitivity(cs2, apex, 1.25, 800, 800);
    expect(targetSens).toBeCloseTo(1.25, 4);

    const cs2Cm = calculateCm360(cs2, 1.25, 800);
    const apexCm = calculateCm360(apex, targetSens, 800);
    expect(cs2Cm).toBeCloseTo(apexCm, 3);
  });

  it('converts Valorant to CS2 with exact Riot 0.07 / 0.022 ratio (x3.1818)', () => {
    // 0.35 Valorant * (0.07 / 0.022) = 1.113636 CS2
    const targetSens = calculateTargetSensitivity(valorant, cs2, 0.35, 800, 800);
    expect(targetSens).toBeCloseTo(0.35 * (0.07 / 0.022), 4);
    expect(targetSens).toBeCloseTo(1.1136, 3);

    // Verify distance preservation
    const valCm = calculateCm360(valorant, 0.35, 800);
    const csCm = calculateCm360(cs2, targetSens, 800);
    expect(valCm).toBeCloseTo(csCm, 3);
  });

  it('converts CS2 to Valorant with exact (0.022 / 0.07 = 0.3142857) multiplier', () => {
    const targetSens = calculateTargetSensitivity(cs2, valorant, 1.5, 400, 400);
    expect(targetSens).toBeCloseTo(1.5 * (0.022 / 0.07), 4);
    expect(targetSens).toBeCloseTo(0.4714, 3);
  });

  it('converts Valorant to Overwatch 2 with 0.07 / 0.0066 = 10.606 ratio', () => {
    const targetSens = calculateTargetSensitivity(valorant, overwatch2, 0.3, 800, 800);
    expect(targetSens).toBeCloseTo(0.3 * (0.07 / 0.0066), 3);
    expect(targetSens).toBeCloseTo(3.1818, 2);
  });

  it('converts Valorant to Fortnite percentage correctly', () => {
    // Valorant 0.35 at 800 DPI yields 46.65 cm/360
    // Fortnite % = 914.4 / (800 * 46.653 * 0.00555555) = 4.41%
    const fnSens = calculateTargetSensitivity(valorant, fortnite, 0.35, 800, 800);
    expect(fnSens).toBeCloseTo(4.41, 1);
  });

  it('correctly handles different source and target DPI', () => {
    // 400 DPI sens 2.0 in CS2 converted to 800 DPI in CS2 should be 1.0
    const targetSens = calculateTargetSensitivity(cs2, cs2, 2.0, 400, 800);
    expect(targetSens).toBeCloseTo(1.0, 4);

    const oldCm = calculateCm360(cs2, 2.0, 400);
    const newCm = calculateCm360(cs2, targetSens, 800);
    expect(oldCm).toBeCloseTo(newCm, 3);
  });

  it('calculates non-linear Minecraft cubic curve and accurately inverts it', () => {
    // At options.txt sens 0.5 (100% in game):
    // factor = 0.6 * 0.5 + 0.2 = 0.5
    // delta = 1.2 * 0.5^3 = 0.15
    // cm/360 at 800 DPI = 914.4 / (800 * 0.15) = 7.62 cm
    const mcCm = calculateCm360(minecraft, 0.5, 800);
    expect(mcCm).toBeCloseTo(7.62, 2);

    // Now convert CS2 sens that has that exact cm/360 back to Minecraft
    const cs2Equiv = calculateTargetSensitivity(minecraft, cs2, 0.5, 800, 800);
    const backToMc = calculateTargetSensitivity(cs2, minecraft, cs2Equiv, 800, 800);
    expect(backToMc).toBeCloseTo(0.5, 3);
  });

  it('applies Tarkov armor penalty when toggled', () => {
    const baseCm = calculateCm360(tarkov, 0.5, 800, 0);
    const penalizedCm = calculateCm360(tarkov, 0.5, 800, 20); // 20% turn penalty
    // Penalized turning speed means less rotation per swipe, hence higher cm required for 360
    expect(penalizedCm).toBeGreaterThan(baseCm);
    expect(penalizedCm).toBeCloseTo(baseCm / 0.8, 2);
  });

  it('calculates DPI shifts accurately', () => {
    const shift = calculateDpiShift(0.8, 400, 800);
    expect(shift.newSens).toBe(0.4);
    expect(shift.percentChange).toBe(100);
  });

  it('formats complete conversion result with explanation and speed tier', () => {
    const result = convertSensitivity(valorant, cs2, 0.35, 800, 800);
    expect(result.sourceCm360).toBeCloseTo(46.65, 1);
    expect(result.targetCm360).toBeCloseTo(46.65, 1);
    expect(result.speedTier.label).toContain('Low / Arm Aiming');
    expect(result.isExact).toBe(true);
    expect(result.sourceEdpi).toBe(280);
    expect(result.targetEdpi).toBe(Math.round(result.targetSens * 800));
  });

  it('runs PSA calibration convergence', () => {
    let psa = initializePsa(0.4, 4);
    expect(psa.currentIteration).toBe(1);
    expect(psa.history[0].lowSens).toBeCloseTo(0.2, 2);
    expect(psa.history[0].highSens).toBeCloseTo(0.6, 2);

    // Pick low
    psa = stepPsa(psa, 'low');
    expect(psa.currentIteration).toBe(2);
    // Base should be (0.4 + 0.2) / 2 = 0.3
    expect(psa.history[1].baseSens).toBeCloseTo(0.3, 2);

    // Pick high
    psa = stepPsa(psa, 'high');
    // Pick low
    psa = stepPsa(psa, 'low');
    // Pick high
    psa = stepPsa(psa, 'high');
    expect(psa.isFinished).toBe(true);
    expect(psa.optimalSens).toBeGreaterThan(0.2);
    expect(psa.optimalSens).toBeLessThan(0.4);
  });
});

