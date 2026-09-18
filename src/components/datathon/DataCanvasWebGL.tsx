"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { Camera, Geometry, Mesh, Program, Renderer, Transform } from "ogl";

type Point3D = {
  cluster: number;
  size: number;
  targets: { x: number; y: number; z: number }[];
};

const COUNT = 110;
const PHASES = 4;

// brand-300 / brand-400 / brand-500 / brand-200, as 0..1 rgb - see tailwind.config.ts
const COLORS: [number, number, number][] = [
  [168 / 255, 183 / 255, 209 / 255],
  [138 / 255, 157 / 255, 190 / 255],
  [115 / 255, 136 / 255, 176 / 255],
  [203 / 255, 214 / 255, 231 / 255],
];

// Once clusters separate they sit on distinct depth layers, so the camera
// dolly below reveals real (not simulated) parallax between them.
const CLUSTER_DEPTH = [-1.1, 0.9, -0.25];

/** Deterministic pseudo-random so the layout is stable between renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function buildPoints(): Point3D[] {
  const centres = [
    { x: -0.62, y: 0.4 },
    { x: 0.58, y: 0.46 },
    { x: 0.02, y: -0.58 },
  ];

  return Array.from({ length: COUNT }, (_, i) => {
    const a = rand(i + 1);
    const b = rand(i + 101);
    const c = rand(i + 211);
    const cluster = i % 3;
    const centre = centres[cluster];

    // 0: noise, 1: a correlation emerges, 2: clusters form, 3: it converges
    return {
      cluster,
      size: 3.2 + c * 4.4,
      targets: [
        { x: (a - 0.5) * 2.1, y: (b - 0.5) * 1.7, z: (c - 0.5) * 3.4 },
        {
          x: (a - 0.5) * 2.0,
          y: -0.85 + a * 1.55 + (b - 0.5) * 0.4,
          z: (c - 0.5) * 1.4,
        },
        {
          x: centre.x + (a - 0.5) * 0.55,
          y: centre.y + (b - 0.5) * 0.6,
          z: CLUSTER_DEPTH[cluster] + (c - 0.5) * 0.3,
        },
        {
          x: (a - 0.5) * 1.1,
          y: (b - 0.5) * 0.75 - (a - 0.5) * 0.4,
          z: (c - 0.5) * 0.35,
        },
      ],
    };
  });
}

const POINT_VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute vec3 color;
  attribute float size;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uPixelRatio;

  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    // Perspective size falloff - this is what makes the camera dolly read as
    // genuine depth rather than a flat sprite scale.
    gl_PointSize = size * uPixelRatio * (9.0 / -mvPosition.z);
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.08, d) * 0.95;
    float halo = smoothstep(0.5, 0.0, d) * 0.28;
    gl_FragColor = vec4(vColor, max(core, halo));
  }
`;

const LINE_VERTEX = /* glsl */ `
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LINE_FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uAlpha;

  void main() {
    gl_FragColor = vec4(uColor, uAlpha);
  }
`;

/**
 * Real-WebGL twin of DataCanvas: the same four-phase story (noise -> a
 * correlation emerges -> clusters form -> it converges), but the points live
 * in true 3D space and the camera dollies along Z as the section scrolls, so
 * the depth is genuine parallax rather than a simulated one.
 *
 * Desktop-only fast path - see DataCanvas.tsx for the capability gate. Any
 * failure here (context creation, shader compile, mid-scroll context loss)
 * calls `onError` so the caller can fall back to the 2D canvas; it never
 * throws past this component.
 */
export default function DataCanvasWebGL({
  progress,
  className,
  onError,
}: {
  progress: MotionValue<number>;
  className?: string;
  onError?: () => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let cleanup = () => {};
    let cancelled = false;

    try {
      const renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: true,
        depth: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
      });
      const gl = renderer.gl;
      if (!gl) throw new Error("WebGL context unavailable");

      gl.clearColor(0, 0, 0, 0);

      const camera = new Camera(gl, { near: 0.1, far: 20, fov: 38 });
      camera.position.set(0, 0, 6);

      const scene = new Transform();
      const points = buildPoints();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const positionData = new Float32Array(COUNT * 3);
      const colorData = new Float32Array(COUNT * 3);
      const sizeData = new Float32Array(COUNT);

      points.forEach((point, i) => {
        const colour = COLORS[point.cluster % COLORS.length];
        colorData[i * 3] = colour[0];
        colorData[i * 3 + 1] = colour[1];
        colorData[i * 3 + 2] = colour[2];
        sizeData[i] = point.size;
      });

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      const geometry = new Geometry(gl, {
        position: { size: 3, data: positionData, usage: gl.DYNAMIC_DRAW },
        color: { size: 3, data: colorData },
        size: { size: 1, data: sizeData },
      });
      const program = new Program(gl, {
        vertex: POINT_VERTEX,
        fragment: POINT_FRAGMENT,
        transparent: true,
        depthTest: false,
        uniforms: { uPixelRatio: { value: pixelRatio } },
      });
      const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });
      mesh.setParent(scene);

      // The trend line that writes itself in while the correlation phase holds.
      const linePositionData = new Float32Array(2 * 3);
      const lineGeometry = new Geometry(gl, {
        position: { size: 3, data: linePositionData, usage: gl.DYNAMIC_DRAW },
      });
      const lineProgram = new Program(gl, {
        vertex: LINE_VERTEX,
        fragment: LINE_FRAGMENT,
        transparent: true,
        depthTest: false,
        uniforms: { uColor: { value: [1, 1, 1] }, uAlpha: { value: 0 } },
      });
      const lineMesh = new Mesh(gl, { geometry: lineGeometry, program: lineProgram, mode: gl.LINES });
      lineMesh.setParent(scene);

      let frame = 0;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));
        renderer.setSize(width, height);
        camera.perspective({ aspect: width / height });
      };

      const draw = () => {
        if (cancelled) return;
        try {
          const p = reduced ? 0.55 : Math.min(1, Math.max(0, progress.get()));
          const t = p * (PHASES - 1);
          const index = Math.min(PHASES - 2, Math.floor(t));
          const blend = smoothstep(t - index);

          for (let i = 0; i < COUNT; i++) {
            const point = points[i];
            const from = point.targets[index];
            const to = point.targets[index + 1];
            positionData[i * 3] = from.x + (to.x - from.x) * blend;
            positionData[i * 3 + 1] = from.y + (to.y - from.y) * blend;
            positionData[i * 3 + 2] = from.z + (to.z - from.z) * blend;
          }
          geometry.attributes.position.needsUpdate = true;

          // Dolly the camera in as the story resolves - depth here is real,
          // so this produces genuine parallax between the layers above.
          camera.position.z = 6 - p * 2.6;
          camera.position.x = Math.sin(p * Math.PI) * 0.16;
          camera.position.y = Math.cos(p * Math.PI * 0.5) * 0.05 - 0.05;
          camera.lookAt([0, 0, 0]);

          const lineIn = Math.min(1, Math.max(0, (p - 0.22) / 0.16));
          const lineOut = Math.min(1, Math.max(0, (p - 0.52) / 0.18));
          const lineAlpha = lineIn * (1 - lineOut) * 0.55;

          const x1 = -1.0;
          const y1 = -0.92;
          const x2 = 1.0;
          const y2 = 0.86;
          linePositionData[0] = x1;
          linePositionData[1] = y1;
          linePositionData[2] = 0;
          linePositionData[3] = x1 + (x2 - x1) * lineIn;
          linePositionData[4] = y1 + (y2 - y1) * lineIn;
          linePositionData[5] = 0;
          lineGeometry.attributes.position.needsUpdate = true;
          lineProgram.uniforms.uAlpha.value = lineAlpha;

          renderer.render({ scene, camera });
          frame = requestAnimationFrame(draw);
        } catch {
          cancelled = true;
          onError?.();
        }
      };

      resize();
      frame = requestAnimationFrame(draw);

      const observer = new ResizeObserver(resize);
      observer.observe(canvas);

      const loseContext = () => gl.getExtension("WEBGL_lose_context")?.loseContext();

      cleanup = () => {
        cancelled = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        geometry.remove();
        lineGeometry.remove();
        program.remove();
        lineProgram.remove();
        loseContext();
      };
    } catch {
      cancelled = true;
      onError?.();
    }

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [progress, onError]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
