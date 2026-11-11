import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// onnxruntime-web references its .wasm through import.meta.url, so Vite emits a second copy in assets/.
// The app loads the runtime from ./ort/ instead (see recognition.js), so the duplicate is removed.
const dropDuplicateWasm = {
  name: 'autodex-drop-duplicate-wasm',
  apply: 'build',
  closeBundle() {
    const dir = path.resolve('dist/assets');
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) if (/^ort-wasm.*\.wasm$/.test(f)) fs.rmSync(path.join(dir, f));
  },
};

export default defineConfig({
  base: './',
  plugins: [react(), dropDuplicateWasm],
  build: { target: 'es2022', chunkSizeWarningLimit: 1500 },
  server: { host: '0.0.0.0' },
  test: { environment: 'node' },
});
