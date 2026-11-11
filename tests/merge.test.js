import { describe, expect, it } from 'vitest';
import { emptyState, mergeStates, validateState, liveSightings } from '../src/merge.js';

const photo = 'data:image/jpeg;base64,AAAA';
const s = (id, updatedAt, extra = {}) => ({ id, carId: 'peugeot-205-1983', photo, method: 'manual', createdAt: '2026-01-01T00:00:00.000Z', updatedAt, ...extra });
const state = sightings => ({ format: 'autodex', version: 2, sightings, updatedAt: null });

describe('validateState', () => {
  it('accepts a valid state and normalises fields', () => {
    const out = validateState(state([s('a', '2026-01-02T00:00:00Z', { method: 'ai', confidence: 4 })]));
    expect(out.sightings[0].confidence).toBe(1);
    expect(out.sightings[0].updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });
  it('accepts the version 1 prototype format', () => {
    expect(validateState({ version: 1, sightings: [] }).version).toBe(2);
  });
  it('rejects bad ids, foreign photos and unknown versions', () => {
    expect(() => validateState(state([s('../x', '2026-01-01T00:00:00Z')]))).toThrow();
    expect(() => validateState(state([s('a', '2026-01-01T00:00:00Z', { photo: 'https://evil.example/x.jpg' })]))).toThrow();
    expect(() => validateState(state([s('a', '2026-01-01T00:00:00Z', { photo: 'data:image/svg+xml;base64,AAAA' })]))).toThrow();
    expect(() => validateState({ version: 9, sightings: [] })).toThrow();
    expect(() => validateState(null)).toThrow();
  });
  it('drops unknown properties', () => {
    const out = validateState(state([s('a', '2026-01-01T00:00:00Z', { evil: '<script>' })]));
    expect(out.sightings[0]).not.toHaveProperty('evil');
  });
});

describe('mergeStates', () => {
  it('keeps the most recent version of each sighting', () => {
    const a = state([s('a', '2026-01-02T00:00:00.000Z', { note: 'old' })]);
    const b = state([s('a', '2026-01-03T00:00:00.000Z', { note: 'new' }), s('b', '2026-01-01T00:00:00.000Z')]);
    const m = mergeStates(a, b);
    expect(m.sightings).toHaveLength(2);
    expect(m.sightings.find(x => x.id === 'a').note).toBe('new');
  });
  it('propagates deletions (tombstones) and is order independent', () => {
    const live = state([s('a', '2026-01-02T00:00:00.000Z')]);
    const dead = state([{ ...s('a', '2026-01-05T00:00:00.000Z'), photo: undefined, deleted: true }]);
    expect(liveSightings(mergeStates(live, dead))).toHaveLength(0);
    expect(liveSightings(mergeStates(dead, live))).toHaveLength(0);
  });
  it('merging with an empty state changes nothing', () => {
    const a = state([s('a', '2026-01-02T00:00:00.000Z')]);
    expect(mergeStates(emptyState(), a).sightings).toEqual(a.sightings);
  });
});
