import { describe, it, expect } from 'vitest';

describe('Quality Control & Confection Calculations', () => {
  it('validates moisture content limits for shelf stability (aw < 0.60, moisture < 1.5%)', () => {
    const isMoistureSafe = (moisturePct: number, aw: number) => moisturePct < 1.5 && aw < 0.60;

    expect(isMoistureSafe(1.1, 0.52)).toBe(true);
    expect(isMoistureSafe(1.8, 0.55)).toBe(false);
    expect(isMoistureSafe(1.2, 0.65)).toBe(false);
  });

  it('validates chocolate micron size for silkiness (target < 20 microns)', () => {
    const isMicronAcceptable = (microns: number) => microns <= 20;

    expect(isMicronAcceptable(16)).toBe(true);
    expect(isMicronAcceptable(19.5)).toBe(true);
    expect(isMicronAcceptable(26)).toBe(false);
  });

  it('verifies temper index slope for Beta Form V crystallization', () => {
    const getTemperingStatus = (temperIndex: number) => {
      if (temperIndex < 4.0) return 'Under-tempered';
      if (temperIndex > 6.5) return 'Over-tempered';
      return 'Optimally Tempered (Form V)';
    };

    expect(getTemperingStatus(5.2)).toBe('Optimally Tempered (Form V)');
    expect(getTemperingStatus(3.2)).toBe('Under-tempered');
    expect(getTemperingStatus(7.1)).toBe('Over-tempered');
  });
});
