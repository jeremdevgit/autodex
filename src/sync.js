import { validateState } from './merge';

export const isDesktop = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export function normalizeUrl(url) {
  const u = new URL(url.trim());
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('bad_url');
  if (u.username || u.password) throw new Error('bad_url');
  return u.origin;
}

// True when this page is served by an AutoDex server (mobile mode).
export async function detectHostServer() {
  if (isDesktop() || !location.protocol.startsWith('http')) return false;
  try {
    const r = await fetch('./api/ping', { cache: 'no-store' });
    return r.ok && (await r.json()).autodex === true;
  } catch {
    return false;
  }
}

export async function syncWithServer(baseUrl, code, local) {
  const origin = baseUrl ? normalizeUrl(baseUrl) : location.origin;
  const r = await fetch(`${origin}/api/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-AutoDex-Code': code.trim().toUpperCase() },
    body: JSON.stringify(local),
  });
  if (r.status === 401) throw new Error('bad_code');
  if (r.status === 429) throw new Error('rate_limited');
  if (!r.ok) throw new Error('sync_failed');
  return validateState(await r.json());
}

async function invoke(cmd, args) {
  const { invoke: call } = await import('@tauri-apps/api/core');
  return call(cmd, args);
}

export const startDesktopServer = port => invoke('server_start', { port });
export const stopDesktopServer = () => invoke('server_stop');
export const desktopServerStatus = () => invoke('server_status');
