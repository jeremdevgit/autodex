import editorialRows from './data/codex-rows.txt?raw';
import extraRows from './data/extra-rows.txt?raw';
import aiRows from './data/ai-rows.txt?raw';
import { brandPaints, genericPaints } from './data/paints';

export const TYPES = ['city', 'compact', 'sedan', 'wagon', 'coupe', 'convertible', 'minivan', 'suv', 'pickup', 'van', 'sports', 'supercar'];
export const ENERGIES = ['petrol', 'diesel', 'hybrid', 'electric'];
export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
export const VALUE_BANDS = [[0, 10000], [10000, 30000], [30000, 100000], [100000, 500000], [500000, Infinity]];

const TYPE_BONUS = { supercar: 1, sports: 0.5, convertible: 0.5, coupe: 0.25, van: -0.5, pickup: -0.25 };

export function rarityOf(value, type, popular) {
  const tiers = [10000, 20000, 50000, 150000, 500000];
  let score = tiers.filter(t => value >= t).length;
  score += TYPE_BONUS[type] || 0;
  if (popular) score -= 0.5;
  const index = Math.max(0, Math.min(4, Math.floor(score)));
  return RARITIES[index];
}

const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function parse(text, popular) {
  return text.trim().split('\n').map(line => {
    const [brand, model, year, type, value, hp, energy, ai] = line.split('|');
    return { brand, model, year: Number(year), type, value: Number(value), hp: Number(hp), energy, ai: ai === '' ? null : Number(ai), popular };
  });
}

export const catalog = [...parse(editorialRows, true), ...parse(extraRows, true), ...parse(aiRows, false)]
  .map(car => ({
    ...car,
    id: slug(`${car.brand}-${car.model}-${car.year}`),
    rarity: rarityOf(car.value, car.type, car.popular),
    paints: (brandPaints[car.brand] || genericPaints).map(([name, hex]) => ({ name, hex, generic: !brandPaints[car.brand] })),
  }))
  .sort((a, b) => a.year - b.year || a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));

export const byId = new Map(catalog.map(car => [car.id, car]));
export const byAiIndex = new Map(catalog.filter(car => car.ai !== null).map(car => [car.ai, car]));
export const brands = [...new Set(catalog.map(car => car.brand))].sort((a, b) => a.localeCompare(b));
export const years = [...new Set(catalog.map(car => car.year))].sort((a, b) => b - a);
export const rarityRank = Object.fromEntries(RARITIES.map((r, i) => [r, i]));
