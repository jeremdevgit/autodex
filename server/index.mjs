// AutoDex self-hosted server: serves the web app and keeps one shared collection for phones and computers.
// Usage: npm run build && npm run server   (PORT, HOST and AUTODEX_DATA_DIR can be set in the environment)
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { emptyState, mergeStates, validateState } from '../src/merge.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const dataDir = path.resolve(process.env.AUTODEX_DATA_DIR || path.join(root, 'data'));
const dataFile = path.join(dataDir, 'collection.json');
const codeFile = path.join(dataDir, 'pairing-code.txt');
const port = Number(process.env.PORT || 4174);
const host = process.env.HOST || '0.0.0.0';
const MAX_BODY = 250_000_000;
const MAX_FAILURES = 10;
const FAILURE_WINDOW = 10 * 60 * 1000;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.wasm': 'application/wasm', '.onnx': 'application/octet-stream',
};
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
};
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-AutoDex-Code',
  'Access-Control-Max-Age': '600',
};

export function newCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

export function sameCode(given, expected) {
  const a = Buffer.from(String(given || '').trim().toUpperCase());
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function createLimiter(max = MAX_FAILURES, windowMs = FAILURE_WINDOW, now = Date.now) {
  const failures = new Map();
  return {
    blocked(ip) {
      const list = (failures.get(ip) || []).filter(t => now() - t < windowMs);
      failures.set(ip, list);
      return list.length >= max;
    },
    fail(ip) { failures.set(ip, [...(failures.get(ip) || []), now()]); },
    reset(ip) { failures.delete(ip); },
  };
}

// Resolves a URL path inside dist, refusing anything that escapes it.
export function safePath(base, urlPath) {
  let decoded;
  try { decoded = decodeURIComponent(urlPath); } catch { return null; }
  if (decoded.includes('\0')) return null;
  const target = path.resolve(base, '.' + (decoded === '/' ? '/index.html' : decoded));
  return target.startsWith(base + path.sep) ? target : null;
}

async function loadState() {
  try { return validateState(JSON.parse(await fs.readFile(dataFile, 'utf8'))); } catch { return emptyState(); }
}

async function loadCode() {
  try {
    const code = (await fs.readFile(codeFile, 'utf8')).trim();
    if (/^[0-9A-F]{8}$/.test(code)) return code;
  } catch { /* first start */ }
  const code = newCode();
  await fs.writeFile(codeFile, code, { mode: 0o600 });
  return code;
}

export async function startServer({ quiet = false } = {}) {
  await fs.mkdir(dataDir, { recursive: true });
  const code = await loadCode();
  let state = await loadState();
  let writeQueue = Promise.resolve();
  const limiter = createLimiter();

  const send = (res, status, body, headers = {}) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...SECURITY_HEADERS, ...headers });
    res.end(JSON.stringify(body));
  };

  async function readBody(req) {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > MAX_BODY) throw Object.assign(new Error('too_large'), { status: 413 });
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
  }

  async function api(req, res, url) {
    if (req.method === 'OPTIONS') { res.writeHead(204, { ...CORS, ...SECURITY_HEADERS }); return res.end(); }
    if (url.pathname === '/api/ping') return send(res, 200, { autodex: true, version: 2 }, CORS);
    if (url.pathname !== '/api/state') return send(res, 404, { error: 'not_found' }, CORS);
    const ip = req.socket.remoteAddress || '?';
    if (limiter.blocked(ip)) return send(res, 429, { error: 'rate_limited' }, CORS);
    if (!sameCode(req.headers['x-autodex-code'], code)) { limiter.fail(ip); return send(res, 401, { error: 'bad_code' }, CORS); }
    limiter.reset(ip);
    if (req.method === 'GET') return send(res, 200, state, CORS);
    if (req.method !== 'PUT') return send(res, 405, { error: 'method' }, CORS);
    let incoming;
    try { incoming = validateState(JSON.parse(await readBody(req))); }
    catch (e) { return send(res, e.status || 400, { error: e.status ? 'too_large' : 'invalid' }, CORS); }
    state = mergeStates(state, incoming);
    const snapshot = JSON.stringify(state);
    writeQueue = writeQueue.then(async () => {
      const tmp = `${dataFile}.tmp`;
      await fs.writeFile(tmp, snapshot, { mode: 0o600 });
      await fs.rename(tmp, dataFile);
    });
    await writeQueue;
    return send(res, 200, state, CORS);
  }

  async function staticFile(req, res, url) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'method' });
    let file = safePath(dist, url.pathname);
    if (!file) return send(res, 403, { error: 'forbidden' });
    try { if (!(await fs.stat(file)).isFile()) throw new Error(); } catch { file = path.join(dist, 'index.html'); }
    const content = await fs.readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': file.endsWith('index.html') ? 'no-cache' : 'public, max-age=86400',
      ...SECURITY_HEADERS,
    });
    res.end(req.method === 'HEAD' ? undefined : content);
  }

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      if (url.pathname.startsWith('/api/')) await api(req, res, url);
      else await staticFile(req, res, url);
    } catch {
      if (!res.headersSent) send(res, 500, { error: 'server' });
      else res.end();
    }
  });

  await new Promise(resolve => server.listen(port, host, resolve));
  if (!quiet) {
    const actual = server.address().port;
    console.log(`AutoDex: http://localhost:${actual}`);
    for (const list of Object.values(os.networkInterfaces())) {
      for (const a of list || []) if (a.family === 'IPv4' && !a.internal) console.log(`Same Wi-Fi: http://${a.address}:${actual}`);
    }
    console.log(`Pairing code: ${code}`);
  }
  return { server, code };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startServer().catch(error => { console.error(error.message); process.exit(1); });
}
