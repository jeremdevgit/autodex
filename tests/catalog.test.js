import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { catalog, byAiIndex, TYPES, ENERGIES, RARITIES, rarityOf } from '../src/catalog.js';
import { ROWS, TYPE_ROWS, LANGS, makeT, describe as describeCar } from '../src/i18n.js';

const labels = JSON.parse(fs.readFileSync(new URL('../public/models/labels.json', import.meta.url)));

describe('catalog', () => {
  it('has unique ids and sane values', () => {
    expect(new Set(catalog.map(c => c.id)).size).toBe(catalog.length);
    for (const c of catalog) {
      expect(c.year).toBeGreaterThanOrEqual(1980);
      expect(c.year).toBeLessThanOrEqual(2026);
      expect(TYPES).toContain(c.type);
      expect(ENERGIES).toContain(c.energy);
      expect(RARITIES).toContain(c.rarity);
      expect(c.value).toBeGreaterThan(0);
      expect(c.hp).toBeGreaterThan(0);
      expect(c.paints.length).toBeGreaterThan(0);
    }
  });
  it('maps every AI class to exactly one car', () => {
    expect(labels).toHaveLength(196);
    expect(byAiIndex.size).toBe(196);
    expect(catalog.filter(c => c.ai !== null)).toHaveLength(196);
    for (let i = 0; i < 196; i++) expect(byAiIndex.has(i)).toBe(true);
  });
  it('rates expensive supercars above cheap city cars', () => {
    expect(rarityOf(3_000_000, 'supercar', false)).toBe('legendary');
    expect(rarityOf(5000, 'city', true)).toBe('common');
  });
});

describe('i18n', () => {
  it('has 8 complete languages', () => {
    expect(LANGS).toHaveLength(8);
    for (const [key, row] of Object.entries(ROWS)) {
      expect(row, key).toHaveLength(8);
      for (const text of row) expect(typeof text === 'string' && text.length > 0, key).toBe(true);
    }
    for (const row of Object.values(TYPE_ROWS)) expect(row).toHaveLength(8);
  });
  it('covers every key used by the interface', () => {
    const app = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
    for (const [, key] of app.matchAll(/\bt\('([a-z_.]+)'/g)) expect(ROWS, key).toHaveProperty([key]);
    for (const p of ['type', 'energy', 'rarity']) for (const v of { type: TYPES, energy: ENERGIES, rarity: RARITIES }[p]) expect(ROWS).toHaveProperty([`${p}.${v}`]);
  });
  it('describes every car in every language', () => {
    for (const [code] of LANGS) {
      const t = makeT(code);
      expect(t('title')).toContain('AutoDex');
      for (const car of catalog.slice(0, 40)) expect(describeCar(code, car)).toContain(car.model);
    }
  });
});
