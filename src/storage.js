import { emptyState, validateState, mergeStates } from './merge';

const DB_NAME = 'autodex-v1';
const STORE = 'state';
let dbPromise;

function db() {
  if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(mode, run) {
  return db().then(database => new Promise((resolve, reject) => {
    const t = database.transaction(STORE, mode);
    const request = run(t.objectStore(STORE));
    t.oncomplete = () => resolve(request?.result);
    t.onerror = () => reject(t.error);
  }));
}

export async function readState() {
  const raw = await tx('readonly', store => store.get('collection'));
  if (!raw) return emptyState();
  try { return validateState(raw); } catch { return emptyState(); }
}

export const writeState = state => tx('readwrite', store => store.put(state, 'collection'));

export async function readSettings() {
  return (await tx('readonly', store => store.get('settings'))) || {};
}

export const writeSettings = settings => tx('readwrite', store => store.put(settings, 'settings'));

export function newSighting(carId, photo, method, confidence) {
  const now = new Date().toISOString();
  const id = `s-${Date.now().toString(36)}-${crypto.getRandomValues(new Uint32Array(1))[0].toString(36)}`;
  return { id, carId, photo, method, confidence, createdAt: now, updatedAt: now, deleted: false };
}

export function deleteSighting(state, id) {
  const now = new Date().toISOString();
  return {
    ...state,
    sightings: state.sightings.map(s => s.id === id ? { id: s.id, carId: s.carId, createdAt: s.createdAt, updatedAt: now, method: s.method, deleted: true } : s),
  };
}

export async function importFile(file, current, mode) {
  if (file.size > 250_000_000) throw new Error('too_large');
  const incoming = validateState(JSON.parse(await file.text()));
  return mode === 'replace' ? incoming : mergeStates(current, incoming);
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `autodex-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function compressPhoto(file, maxSide = 960) {
  if (!file.type.startsWith('image/')) throw new Error('not_image');
  if (file.size > 40_000_000) throw new Error('too_large');
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return canvas.toDataURL('image/jpeg', 0.82);
}
