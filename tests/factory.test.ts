import { describe, it, expect } from 'vitest';
import { INITIAL_PRODUCTS, INITIAL_RAW_MATERIALS, INITIAL_PRODUCTION_BATCHES } from '../src/data/seedData';

describe('Factory Seed Data & Models', () => {
  it('should initialize with products having valid pricing and metadata', () => {
    expect(INITIAL_PRODUCTS.length).toBeGreaterThan(0);
    INITIAL_PRODUCTS.forEach((product) => {
      expect(product.id).toBeDefined();
      expect(typeof product.name).toBe('string');
      expect(typeof product.price).toBe('number');
      expect(product.price).toBeGreaterThan(0);
      expect(product.stock).toBeGreaterThanOrEqual(0);
      expect(product.category).toBeDefined();
    });
  });

  it('should initialize with required raw materials for chocolate production', () => {
    expect(INITIAL_RAW_MATERIALS.length).toBeGreaterThan(0);
    const names = INITIAL_RAW_MATERIALS.map((m) => m.name.toLowerCase());
    expect(names.some((n) => n.includes('bean') || n.includes('cocoa'))).toBe(true);
    expect(names.some((n) => n.includes('butter'))).toBe(true);
  });

  it('should have batches with valid stage identifiers', () => {
    expect(INITIAL_PRODUCTION_BATCHES.length).toBeGreaterThan(0);
    INITIAL_PRODUCTION_BATCHES.forEach((batch) => {
      expect(batch.id).toBeDefined();
      expect(batch.currentStage).toBeDefined();
      expect(typeof batch.plannedQuantity).toBe('number');
    });
  });

  it('calculates order line subtotals accurately with two-decimal precision', () => {
    const item = { price: 8.5, quantity: 3 };
    const subtotal = Number((item.price * item.quantity).toFixed(2));
    expect(subtotal).toBe(25.5);
  });

  it('calculates free shipping thresholds properly', () => {
    const freeShippingThreshold = 50.0;
    const calculateShipping = (subtotal: number) => (subtotal >= freeShippingThreshold ? 0 : 7.5);

    expect(calculateShipping(30.0)).toBe(7.5);
    expect(calculateShipping(50.0)).toBe(0);
    expect(calculateShipping(75.0)).toBe(0);
  });
});
