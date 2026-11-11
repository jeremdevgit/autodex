import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { bodyOutline, glassOutline, profile, wheels } from './shapes';

function extrude(points, depth, material) {
  const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.06, bevelSegments: 2, steps: 1 });
  geometry.translate(0, 0, -depth / 2);
  return new THREE.Mesh(geometry, material);
}

function build(type, color) {
  const p = profile(type);
  const group = new THREE.Group();
  const paint = new THREE.MeshStandardMaterial({ color, metalness: 0.55, roughness: 0.32 });
  const glass = new THREE.MeshStandardMaterial({ color: '#16212a', metalness: 0.2, roughness: 0.08, transparent: true, opacity: 0.88 });
  const rubber = new THREE.MeshStandardMaterial({ color: '#111315', roughness: 0.9 });
  const rim = new THREE.MeshStandardMaterial({ color: '#c9ced2', metalness: 0.85, roughness: 0.25 });
  const light = new THREE.MeshStandardMaterial({ color: '#fff6d8', emissive: '#fff1c0', emissiveIntensity: 0.6 });
  const tail = new THREE.MeshStandardMaterial({ color: '#b3121c', emissive: '#7a0710', emissiveIntensity: 0.5 });

  group.add(extrude(bodyOutline(type), p.w - 0.12, paint));
  const g = extrude(glassOutline(type), p.w - 0.06, glass);
  group.add(g);

  const tire = new THREE.CylinderGeometry(p.r, p.r, 0.26, 28);
  tire.rotateX(Math.PI / 2);
  const hub = new THREE.CylinderGeometry(p.r * 0.62, p.r * 0.62, 0.28, 18);
  hub.rotateX(Math.PI / 2);
  for (const w of wheels(type)) {
    for (const side of [-1, 1]) {
      const z = side * (p.w / 2 - 0.05);
      const t = new THREE.Mesh(tire, rubber);
      t.position.set(w.cx, w.cy, z);
      const h = new THREE.Mesh(hub, rim);
      h.position.set(w.cx, w.cy, z + side * 0.01);
      group.add(t, h);
    }
  }
  const lamp = new THREE.BoxGeometry(0.06, 0.1, 0.36);
  for (const side of [-1, 1]) {
    const front = new THREE.Mesh(lamp, light);
    front.position.set(p.L / 2 + 0.06, p.hood - 0.22, side * (p.w / 2 - 0.35));
    const rear = new THREE.Mesh(lamp, tail);
    rear.position.set(-p.L / 2 - 0.06, p.tail - 0.32, side * (p.w / 2 - 0.35));
    group.add(front, rear);
  }
  group.traverse(o => { if (o.isMesh) o.castShadow = true; });
  return group;
}

export default function Car3D({ type, color }) {
  const host = useRef(null);
  const state = useRef({});

  useEffect(() => {
    const el = host.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    scene.add(new THREE.HemisphereLight('#f4f7ff', '#2a3036', 1.6));
    const sun = new THREE.DirectionalLight('#ffffff', 2.2);
    sun.position.set(4, 7, 5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    scene.add(sun);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(4.2, 48), new THREE.ShadowMaterial({ opacity: 0.28 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const pivot = new THREE.Group();
    scene.add(pivot);
    let angle = -0.7;
    let drag = null;
    let frame;
    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
    };
    const tick = () => {
      if (!drag) angle += 0.004;
      pivot.rotation.y = angle;
      const L = state.current.length || 4.5;
      camera.position.set(0, L * 0.55, L * 1.75);
      camera.lookAt(0, 0.7, 0);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    const down = e => { drag = { x: e.clientX, a: angle }; el.setPointerCapture(e.pointerId); };
    const move = e => { if (drag) angle = drag.a + (e.clientX - drag.x) * 0.01; };
    const up = () => { drag = null; };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    tick();
    state.current = { ...state.current, pivot, renderer };
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      scene.traverse(o => { o.geometry?.dispose(); o.material?.dispose?.(); });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const { pivot } = state.current;
    if (!pivot) return;
    pivot.children.forEach(c => c.traverse(o => { o.geometry?.dispose(); o.material?.dispose?.(); }));
    pivot.clear();
    const car = build(type, color);
    pivot.add(car);
    state.current.length = profile(type).L;
  }, [type, color]);

  return <div className="car3d" ref={host} aria-hidden="true" />;
}
