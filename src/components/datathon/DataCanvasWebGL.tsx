"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { Camera, Geometry, Mesh, Program, Renderer, Transform } from "ogl";

type Point3D = {
  cluster: number;
  size: number;
  targets: { x: number; y: number; z: number }[];
};

type Edge = { a: number; b: number; bridge: boolean };

const COUNT = 110;
const PHASES = 4;

// brand-300 / brand-400 / brand-500 / brand-200, as 0..1 rgb - see tailwind.config.ts
const COLORS: [number, number, number][] = [
  [168 / 255, 183 / 255, 209 / 255],
  [138 / 255, 157 / 255, 190 / 255],
  [115 / 255, 136 / 255, 176 / 255],
  [203 / 255, 214 / 255, 231 / 255],
];

// brand-100/white - reserved for the single node the pitch phase converges on.
const HIGHLIGHT_COLOR: [number, number, number] = [1, 1, 1];

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

/**
 * A modest, fixed knowledge-graph skeleton over the point cloud: a handful of
 * nearest-neighbour edges inside each cluster (using the phase-2 "clusters
 * form" layout, where distance is meaningful), plus a hub-and-spoke of
 * bridge edges radiating from one "pitch" node out to its closest neighbour
 * in each of the other clusters. That same node is the one the pitch phase
 * (phase 4) highlights and grows - the bridge edges already converge on it,
 * so the phase-4 "everything narrows onto one point" beat falls out of the
 * static graph for free instead of needing bespoke wiring.
 */
function buildEdges(points: Point3D[]): { edges: Edge[]; pitchIndex: number } {
  const dist = (i: number, j: number) => {
    const pi = points[i].targets[2];
    const pj = points[j].targets[2];
    const dx = pi.x - pj.x;
    const dy = pi.y - pj.y;
    const dz = pi.z - pj.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  const byCluster: number[][] = [[], [], []];
  points.forEach((point, i) => byCluster[point.cluster].push(i));

  const edges: Edge[] = [];
  const seen = new Set<string>();
  const addEdge = (a: number, b: number, bridge: boolean) => {
    if (a === b) return;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ a, b, bridge });
  };

  // Intra-cluster: a spread sample of points per cluster, each linked to its
  // nearest neighbour within the same cluster - a light k-NN, not a full graph.
  byCluster.forEach((indices) => {
    const sample = indices.filter((_, k) => k % 4 === 0);
    sample.forEach((i) => {
      let best = -1;
      let bestDist = Infinity;
      indices.forEach((j) => {
        if (j === i) return;
        const d = dist(i, j);
        if (d < bestDist) {
          bestDist = d;
          best = j;
        }
      });
      if (best !== -1) addEdge(i, best, false);
    });
  });

  // The pitch node: whichever point sits closest to the origin once the
  // story converges (phase 4) - the natural place for bridges to gather.
  let pitchIndex = 0;
  let pitchDist = Infinity;
  points.forEach((point, i) => {
    const t = point.targets[3];
    const d = Math.sqrt(t.x * t.x + t.y * t.y + t.z * t.z);
    if (d < pitchDist) {
      pitchDist = d;
      pitchIndex = i;
    }
  });

  // Bridges: pitch node out to its nearest point in each other cluster, plus
  // one edge closing the triangle between those two - reads as convergence.
  const otherClusters = [0, 1, 2].filter((c) => c !== points[pitchIndex].cluster);
  const reps: number[] = [];
  otherClusters.forEach((c) => {
    const indices = byCluster[c];
    let best = -1;
    let bestDist = Infinity;
    indices.forEach((j) => {
      const d = dist(pitchIndex, j);
      if (d < bestDist) {
        bestDist = d;
        best = j;
      }
    });
    if (best !== -1) {
      reps.push(best);
      addEdge(pitchIndex, best, true);
    }
  });
  if (reps.length === 2) addEdge(reps[0], reps[1], true);

  return { edges, pitchIndex };
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

// Same attribute-driven colour pattern as the point shader above, plus a
// per-vertex alpha so intra-cluster and bridge edges can fade independently
// within a single draw call.
const EDGE_VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute vec3 color;
  attribute float alpha;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = color;
    vAlpha = alpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EDGE_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(vColor, vAlpha);
  }
`;

// The single signature trend line from the pre-knowledge-graph version of
// this canvas (see git history a34afee~1) - kept alongside the edge network
// rather than folded into it, since it's a distinct beat (one line "writing
// itself in" during the correlation phase) rather than part of the graph
// story, and uses normal alpha blending (ogl's default for `transparent`
// programs) rather than the edges' additive blend.
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
 * A fixed knowledge-graph skeleton (see buildEdges) rides along on top of the
 * point cloud so the visual reads as a network/data-relationship story rather
 * than generic particles - same dataset, same phase timing, purely additive.
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
      // The canvas is sized by JS (see resize() below), not CSS - ogl's
      // Renderer defaults width/height to 300x150 and immediately calls
      // setSize(), which sets an inline style that would otherwise beat the
      // Tailwind h-full/w-full classes. Measuring the parent up front (and
      // everywhere else below) means that inline style is only ever set to
      // the real, intended size.
      const parent = canvas.parentElement;
      if (!parent) throw new Error("Canvas has no parent element to measure");

      const initialRect = parent.getBoundingClientRect();
      const renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: true,
        depth: false,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        width: Math.max(1, Math.round(initialRect.width)),
        height: Math.max(1, Math.round(initialRect.height)),
      });
      const gl = renderer.gl;
      if (!gl) throw new Error("WebGL context unavailable");

      gl.clearColor(0, 0, 0, 0);

      const camera = new Camera(gl, { near: 0.1, far: 20, fov: 38 });
      camera.position.set(0, 0, 6);

      const scene = new Transform();
      const points = buildPoints();
      const { edges, pitchIndex } = buildEdges(points);
      const edgeCount = edges.length;
      const pitchCluster = points[pitchIndex].cluster;
      const pitchBaseColour = COLORS[pitchCluster % COLORS.length];
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
      const pitchBaseSize = sizeData[pitchIndex];

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      const geometry = new Geometry(gl, {
        position: { size: 3, data: positionData, usage: gl.DYNAMIC_DRAW },
        color: { size: 3, data: colorData, usage: gl.DYNAMIC_DRAW },
        size: { size: 1, data: sizeData, usage: gl.DYNAMIC_DRAW },
      });
      const program = new Program(gl, {
        vertex: POINT_VERTEX,
        fragment: POINT_FRAGMENT,
        transparent: true,
        depthTest: false,
        uniforms: { uPixelRatio: { value: pixelRatio } },
      });
      const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

      // The edge network - a fixed, modest budget of line segments. Colour
      // is set once (edges don't change hue, only alpha, across phases);
      // position and alpha are rewritten every frame in the render loop.
      const edgePositionData = new Float32Array(edgeCount * 2 * 3);
      const edgeColorData = new Float32Array(edgeCount * 2 * 3);
      const edgeAlphaData = new Float32Array(edgeCount * 2);

      edges.forEach((edge, e) => {
        const colour = edge.bridge ? COLORS[0] : COLORS[1];
        for (let v = 0; v < 2; v++) {
          edgeColorData[(e * 2 + v) * 3] = colour[0];
          edgeColorData[(e * 2 + v) * 3 + 1] = colour[1];
          edgeColorData[(e * 2 + v) * 3 + 2] = colour[2];
        }
      });

      const edgeGeometry = new Geometry(gl, {
        position: { size: 3, data: edgePositionData, usage: gl.DYNAMIC_DRAW },
        color: { size: 3, data: edgeColorData, usage: gl.STATIC_DRAW },
        alpha: { size: 1, data: edgeAlphaData, usage: gl.DYNAMIC_DRAW },
      });
      const edgeProgram = new Program(gl, {
        vertex: EDGE_VERTEX,
        fragment: EDGE_FRAGMENT,
        transparent: true,
        depthTest: false,
      });
      // GL_LINES are 1px wide on virtually every desktop GPU/driver combo
      // (gl.lineWidth beyond 1 is silently ignored outside Firefox), so a
      // normal src-over blend at modest alpha reads as almost nothing
      // against the near-black brand-950 background. Additive blending
      // (src * alpha, dst kept in full) makes the same thin line actually
      // glow instead of just faintly tinting the background - this is what
      // makes the edge network and the phase-4 convergence legible at all.
      edgeProgram.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
      const edgeMesh = new Mesh(gl, { geometry: edgeGeometry, program: edgeProgram, mode: gl.LINES });

      // The single trend line - a 2-vertex segment that draws itself in
      // during the correlation phase, independent of the edge network above.
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

      // Edges first, points on top, so the bright dots never get buried
      // under their own connecting lines. The trend line sits above both.
      edgeMesh.setParent(scene);
      mesh.setParent(scene);
      lineMesh.setParent(scene);

      let frame = 0;

      const resize = () => {
        const rect = parent.getBoundingClientRect();
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

          // Smooth per-phase weights (they sum to 1 across p) driving the
          // graph story: isolated -> relationships emerge -> clusters
          // densify -> everything narrows onto the pitch node.
          const w1 = index === 0 ? blend : index === 1 ? 1 - blend : 0;
          const w2 = index === 1 ? blend : index === 2 ? 1 - blend : 0;
          const w3 = index === 2 ? blend : 0;

          // Phase 4: the pitch node brightens toward brand-100/white and
          // grows, as the substitute for a bespoke camera-targeting rig -
          // the bridge edges built in buildEdges already converge on it.
          colorData[pitchIndex * 3] = pitchBaseColour[0] + (HIGHLIGHT_COLOR[0] - pitchBaseColour[0]) * w3;
          colorData[pitchIndex * 3 + 1] = pitchBaseColour[1] + (HIGHLIGHT_COLOR[1] - pitchBaseColour[1]) * w3;
          colorData[pitchIndex * 3 + 2] = pitchBaseColour[2] + (HIGHLIGHT_COLOR[2] - pitchBaseColour[2]) * w3;
          // 1.9x read as barely-bigger noise against ~110 randomly-sized
          // points (base sizes already span 3.2-7.6). Grow it further so it
          // reads as a deliberate focal point rather than a slightly large dot.
          sizeData[pitchIndex] = pitchBaseSize * (1 + w3 * 2.6);

          geometry.attributes.position.needsUpdate = true;
          geometry.attributes.color.needsUpdate = true;
          geometry.attributes.size.needsUpdate = true;

          // Dolly the camera in as the story resolves - depth here is real,
          // so this produces genuine parallax between the layers above.
          camera.position.z = 6 - p * 2.6;
          camera.position.x = Math.sin(p * Math.PI) * 0.16;
          camera.position.y = Math.cos(p * Math.PI * 0.5) * 0.05 - 0.05;
          camera.lookAt([0, 0, 0]);

          // Phase 1: no edges, fully isolated points (w1/w2/w3 all 0 here).
          // Phase 2: a modest number of intra-cluster edges fade in.
          // Phase 3: intra-cluster edges densify/brighten; bridges stay dim.
          // Phase 4: most edges fade out except the bridges into the pitch
          // node, which pop to sell the "it converges" beat.
          // Additive blending (see edgeProgram above) means these alphas
          // are glow intensity, not a background tint - pushed well above
          // the old 0.06-0.42 range, which was invisible at 1px line width.
          const intraAlpha = w1 * 0.35 + w2 * 0.65 + w3 * 0.16;
          const bridgeAlpha = w1 * 0.22 + w2 * 0.34 + w3 * 0.85;

          for (let e = 0; e < edgeCount; e++) {
            const edge = edges[e];
            const ai = edge.a * 3;
            const bi = edge.b * 3;
            edgePositionData[e * 6] = positionData[ai];
            edgePositionData[e * 6 + 1] = positionData[ai + 1];
            edgePositionData[e * 6 + 2] = positionData[ai + 2];
            edgePositionData[e * 6 + 3] = positionData[bi];
            edgePositionData[e * 6 + 4] = positionData[bi + 1];
            edgePositionData[e * 6 + 5] = positionData[bi + 2];

            const a = edge.bridge ? bridgeAlpha : intraAlpha;
            edgeAlphaData[e * 2] = a;
            edgeAlphaData[e * 2 + 1] = a;
          }
          edgeGeometry.attributes.position.needsUpdate = true;
          edgeGeometry.attributes.alpha.needsUpdate = true;

          // The trend line writes itself in while the correlation phase
          // holds, then fades - same timing as the 2D-canvas fallback's
          // equivalent line in DataCanvas.tsx.
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
      observer.observe(parent);

      const loseContext = () => gl.getExtension("WEBGL_lose_context")?.loseContext();

      cleanup = () => {
        cancelled = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        geometry.remove();
        edgeGeometry.remove();
        lineGeometry.remove();
        program.remove();
        edgeProgram.remove();
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
