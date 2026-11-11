import * as ort from 'onnxruntime-web/wasm';
import { byAiIndex } from './catalog';

const SIZE = 224;
const MEAN = [0.485, 0.456, 0.406];
const STD = [0.229, 0.224, 0.225];
export const CONFIDENT = 0.55;

let sessionPromise;

function session() {
  if (!sessionPromise) {
    ort.env.wasm.wasmPaths = new URL('ort/', document.baseURI).href;
    ort.env.wasm.numThreads = 1;
    sessionPromise = ort.InferenceSession.create(new URL('models/cars-int8.onnx', document.baseURI).href, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' })
      .catch(error => { sessionPromise = undefined; throw error; });
  }
  return sessionPromise;
}

export function toTensorData(rgba) {
  const plane = SIZE * SIZE;
  const input = new Float32Array(3 * plane);
  for (let i = 0; i < plane; i++) {
    for (let c = 0; c < 3; c++) input[c * plane + i] = (rgba[i * 4 + c] / 255 - MEAN[c]) / STD[c];
  }
  return input;
}

export function softmaxTop(logits, k = 5) {
  const max = Math.max(...logits);
  const exps = logits.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e, index) => ({ index, confidence: e / sum }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, k)
    .map(r => ({ ...r, car: byAiIndex.get(r.index) || null }));
}

// The model was validated with a plain 224×224 resize (no centre crop), which keeps the whole car in frame.
export async function recognize(dataUrl) {
  const s = await session();
  const image = new Image();
  image.src = dataUrl;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, SIZE, SIZE);
  const data = toTensorData(ctx.getImageData(0, 0, SIZE, SIZE).data);
  const out = await s.run({ [s.inputNames[0]]: new ort.Tensor('float32', data, [1, 3, SIZE, SIZE]) });
  return softmaxTop([...out[s.outputNames[0]].data]);
}

export function preload() {
  session().catch(() => {});
}
