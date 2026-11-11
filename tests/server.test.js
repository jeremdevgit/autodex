import { describe, expect, it } from 'vitest';
import path from 'node:path';
import { createLimiter, safePath, sameCode, newCode } from '../server/index.mjs';

describe('server helpers', () => {
  const base = path.resolve('/srv/autodex/dist');
  it('refuses path traversal', () => {
    expect(safePath(base, '/../secret')).toBeNull();
    expect(safePath(base, '/%2e%2e/%2e%2e/etc/passwd')).toBeNull();
    expect(safePath(base, '/%00')).toBeNull();
    expect(safePath(base, '/%E0%A4%A')).toBeNull();
    expect(safePath(base, '/assets/app.js')).toBe(path.join(base, 'assets/app.js'));
    expect(safePath(base, '/')).toBe(path.join(base, 'index.html'));
  });
  it('compares pairing codes in constant time and ignores case', () => {
    const code = newCode();
    expect(code).toMatch(/^[0-9A-F]{8}$/);
    expect(sameCode(code.toLowerCase(), code)).toBe(true);
    expect(sameCode('', code)).toBe(false);
    expect(sameCode(undefined, code)).toBe(false);
  });
  it('blocks an address after repeated failures, then forgets', () => {
    let now = 0;
    const l = createLimiter(3, 1000, () => now);
    for (let i = 0; i < 3; i++) l.fail('1.2.3.4');
    expect(l.blocked('1.2.3.4')).toBe(true);
    expect(l.blocked('5.6.7.8')).toBe(false);
    now = 2000;
    expect(l.blocked('1.2.3.4')).toBe(false);
  });
});
