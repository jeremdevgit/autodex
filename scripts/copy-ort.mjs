// Copies the ONNX Runtime WebAssembly files into public/ort so the app works offline (no CDN).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'node_modules', 'onnxruntime-web', 'dist');
const out = path.join(root, 'public', 'ort');
fs.mkdirSync(out, { recursive: true });
for (const name of ['ort-wasm-simd-threaded.mjs', 'ort-wasm-simd-threaded.wasm']) {
  fs.copyFileSync(path.join(src, name), path.join(out, name));
}
console.log('ONNX Runtime files copied to public/ort');
