"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 52;
const LINK_DISTANCE = 2.1;
const BOUNDS = { x: 4.6, y: 2.3, z: 1.4 };
const HERO_INDEX = 3;
const MAX_TILT = 0.12; // ~7deg - a tilt toward the cursor, never a spin

const COLOR_A = new THREE.Color("#7388B0"); // brand-500
const COLOR_B = new THREE.Color("#A8B7D1"); // brand-300
const HERO_COLOR = new THREE.Color("#E7ECF4"); // brand-100, the one bright node

const POINT_VERTEX = /* glsl */ `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (320.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const POINT_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.0, d));
  }
`;

/** Deterministic pseudo-random so layout + drift are stable across remounts. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type NodeState = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  scatter: THREE.Vector3;
  size: number;
  color: THREE.Color;
};

function buildNodes(): NodeState[] {
  return Array.from({ length: NODE_COUNT }, (_, i) => {
    const a = rand(i + 1);
    const b = rand(i + 101);
    const c = rand(i + 211);
    const pos = new THREE.Vector3(
      (a - 0.5) * 2 * BOUNDS.x,
      (b - 0.5) * 2 * BOUNDS.y,
      (c - 0.5) * 2 * BOUNDS.z
    );
    const isHero = i === HERO_INDEX;
    return {
      pos: pos.clone(),
      vel: new THREE.Vector3(
        (rand(i + 301) - 0.5) * 0.1,
        (rand(i + 401) - 0.5) * 0.1,
        (rand(i + 501) - 0.5) * 0.06
      ),
      // Intro only: where each node starts before it assembles into `pos`.
      scatter: pos.clone().multiplyScalar(2.4 + rand(i + 601) * 1.6),
      size: isHero ? 78 : 34 + rand(i + 701) * 20,
      color: isHero ? HERO_COLOR.clone() : COLOR_A.clone().lerp(COLOR_B, rand(i + 801)),
    };
  });
}

function Network({ active }: { active: boolean }) {
  const nodes = useMemo(buildNodes, []);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const introStart = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const tilt = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => new Float32Array(NODE_COUNT * 3), []);
  const colors = useMemo(() => new Float32Array(NODE_COUNT * 3), []);
  const sizes = useMemo(() => new Float32Array(NODE_COUNT), []);
  const maxLinks = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
  const linkPositions = useMemo(() => new Float32Array(maxLinks * 2 * 3), [maxLinks]);
  const linkColors = useMemo(() => new Float32Array(maxLinks * 2 * 3), [maxLinks]);

  const { gl } = useThree();

  // Pointer tracked on window (the container is pointer-events-none so it never
  // blocks the CTA button beneath it) - only reacts when the cursor is actually
  // over the section's own bounding box, otherwise the network stays neutral.
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      const inside = nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1;
      pointer.current.x = inside ? nx : 0;
      pointer.current.y = inside ? ny : 0;
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [gl]);

  useFrame((state, delta) => {
    if (!active) return;
    if (introStart.current === null) introStart.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - introStart.current;
    const introT = Math.min(1, elapsed / 1.6);
    const introEase = 1 - Math.pow(1 - introT, 3);
    const linkT = Math.min(1, Math.max(0, (elapsed - 0.9) / 0.9));
    const pulse = 1 + 0.18 * Math.sin(state.clock.elapsedTime * 1.1);

    let linkCount = 0;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      // Idle drift, bouncing softly inside the bounds - never a rotation.
      n.pos.x += n.vel.x * delta;
      n.pos.y += n.vel.y * delta;
      n.pos.z += n.vel.z * delta;
      if (Math.abs(n.pos.x) > BOUNDS.x) n.vel.x *= -1;
      if (Math.abs(n.pos.y) > BOUNDS.y) n.vel.y *= -1;
      if (Math.abs(n.pos.z) > BOUNDS.z) n.vel.z *= -1;

      const shown = n.scatter.clone().lerp(n.pos, introEase);
      positions[i * 3] = shown.x;
      positions[i * 3 + 1] = shown.y;
      positions[i * 3 + 2] = shown.z;

      // Dissolve toward the edges instead of a hard cutoff.
      const radial = Math.min(1, shown.length() / (BOUNDS.x * 1.15));
      const isHero = i === HERO_INDEX;
      const fade = (1 - radial * 0.55) * introEase * (isHero ? pulse : 1);
      colors[i * 3] = n.color.r * fade;
      colors[i * 3 + 1] = n.color.g * fade;
      colors[i * 3 + 2] = n.color.b * fade;
      sizes[i] = n.size * (isHero ? pulse : 1);

      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dist = n.pos.distanceTo(m.pos);
        if (dist > LINK_DISTANCE) continue;
        const a = n.scatter.clone().lerp(n.pos, introEase);
        const b = m.scatter.clone().lerp(m.pos, introEase);
        const linkAlpha = (1 - dist / LINK_DISTANCE) * 0.4 * linkT;
        linkPositions[linkCount * 6] = a.x;
        linkPositions[linkCount * 6 + 1] = a.y;
        linkPositions[linkCount * 6 + 2] = a.z;
        linkPositions[linkCount * 6 + 3] = b.x;
        linkPositions[linkCount * 6 + 4] = b.y;
        linkPositions[linkCount * 6 + 5] = b.z;
        for (let k = 0; k < 2; k++) {
          linkColors[linkCount * 6 + k * 3] = COLOR_A.r * linkAlpha;
          linkColors[linkCount * 6 + k * 3 + 1] = COLOR_A.g * linkAlpha;
          linkColors[linkCount * 6 + k * 3 + 2] = COLOR_A.b * linkAlpha;
        }
        linkCount++;
      }
    }

    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.size as THREE.BufferAttribute).needsUpdate = true;
    }
    if (linesRef.current) {
      const geo = linesRef.current.geometry;
      geo.setDrawRange(0, linkCount * 2);
      (geo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (geo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }

    // Damped parallax tilt toward the cursor - eases back to neutral, no orbit.
    const damp = Math.min(1, delta * 2.5);
    tilt.current.x += (-pointer.current.y * MAX_TILT - tilt.current.x) * damp;
    tilt.current.y += (pointer.current.x * MAX_TILT - tilt.current.y) * damp;
    if (groupRef.current) {
      groupRef.current.rotation.x = tilt.current.x;
      groupRef.current.rotation.y = tilt.current.y;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        </bufferGeometry>
        <shaderMaterial
          vertexShader={POINT_VERTEX}
          fragmentShader={POINT_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linkPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[linkColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
}

/**
 * The composed, restrained 3D upgrade of Constellation - a bounded network that
 * assembles once on entry, breathes with idle drift, and tilts gently toward the
 * cursor. No auto-rotation, no orbit controls: it should read as ambient depth
 * behind the copy, not as a piece of a spinning demo scene.
 */
export default function Constellation3DScene({ active }: { active: boolean }) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.75]}
      style={{ pointerEvents: "none" }}
    >
      <Network active={active} />
    </Canvas>
  );
}
