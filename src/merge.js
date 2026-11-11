export const FORMAT = 'autodex';
export const VERSION = 2;
export const MAX_SIGHTINGS = 20000;
export const MAX_PHOTO_CHARS = 3_000_000;

const ID = /^[a-z0-9-]{1,80}$/;
const PHOTO = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;

export function emptyState() {
  return { format: FORMAT, version: VERSION, sightings: [], updatedAt: null };
}

function cleanSighting(s) {
  if (!s || typeof s !== 'object') return null;
  if (typeof s.id !== 'string' || !ID.test(s.id)) return null;
  if (typeof s.carId !== 'string' || !ID.test(s.carId)) return null;
  const updatedAt = Date.parse(s.updatedAt);
  const createdAt = Date.parse(s.createdAt);
  if (!Number.isFinite(updatedAt) || !Number.isFinite(createdAt)) return null;
  const out = {
    id: s.id,
    carId: s.carId,
    createdAt: new Date(createdAt).toISOString(),
    updatedAt: new Date(updatedAt).toISOString(),
    method: s.method === 'ai' ? 'ai' : 'manual',
    deleted: s.deleted === true,
  };
  if (!out.deleted) {
    if (typeof s.photo !== 'string' || s.photo.length > MAX_PHOTO_CHARS || !PHOTO.test(s.photo)) return null;
    out.photo = s.photo;
    if (out.method === 'ai') {
      const c = Number(s.confidence);
      out.confidence = Number.isFinite(c) ? Math.min(1, Math.max(0, c)) : 0;
    }
    if (typeof s.note === 'string') out.note = s.note.slice(0, 500);
  }
  return out;
}

// Accepts version 1 exports from the first prototype as well.
export function validateState(input) {
  if (!input || typeof input !== 'object' || !Array.isArray(input.sightings)) throw new Error('invalid');
  if (input.version !== 1 && input.version !== VERSION) throw new Error('invalid');
  if (input.sightings.length > MAX_SIGHTINGS) throw new Error('too_large');
  const sightings = [];
  for (const raw of input.sightings) {
    const s = cleanSighting(raw);
    if (!s) throw new Error('invalid');
    sightings.push(s);
  }
  return { format: FORMAT, version: VERSION, sightings, updatedAt: input.updatedAt ?? null };
}

export function mergeStates(a, b) {
  const byId = new Map();
  for (const s of [...a.sightings, ...b.sightings]) {
    const current = byId.get(s.id);
    if (!current || Date.parse(s.updatedAt) > Date.parse(current.updatedAt)) byId.set(s.id, s);
  }
  return {
    format: FORMAT,
    version: VERSION,
    sightings: [...byId.values()].sort((x, y) => x.createdAt.localeCompare(y.createdAt)),
    updatedAt: new Date().toISOString(),
  };
}

export function liveSightings(state) {
  return state.sightings.filter(s => !s.deleted);
}
