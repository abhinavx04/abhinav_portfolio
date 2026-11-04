"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

const DIRECTOR = "/models/director.glb";
const THINKER = "/models/thinker.glb";
const SPEEDSTER = "/models/speedster.glb";

// Scene units are metres. The Director is 1.6 tall; the other two are scaled to the film's proportions.
const THINKER_H = 1.02;
const SPEEDSTER_H = 1.14;
const RX = 1.3; // orbit half-width
const RZ = 0.95; // orbit half-depth
const SPEED = 0.38; // radians per second

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const easeOutBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const lerpAngle = (a: number, b: number, k: number) => {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * k;
};

/** Pointer position in -1..1, tracked on the window (the canvas itself ignores the pointer). */
function usePointer() {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
  return p;
}

/** The generated PBR maps carry faint metallic streaks; flatten them so cloth and plastic read as matte-glossy. */
function tame(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const m = mesh.material as THREE.MeshStandardMaterial;
    m.metalness = 0;
    m.metalnessMap = null;
    m.roughness = 1;
    m.normalScale?.setScalar(0.6);
    m.needsUpdate = true;
  });
}

/** Scales a model to `height`, centres it on x/z and puts its feet on y = 0. */
function fit(root: THREE.Object3D, height: number) {
  root.scale.setScalar(1);
  root.position.set(0, 0, 0);
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const s = height / size.y;
  const c = box.getCenter(new THREE.Vector3());
  root.scale.setScalar(s);
  root.position.set(-c.x * s, -box.min.y * s, -c.z * s);
}

/* ------------------------------------------------------------------ the Director */

const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _t = new THREE.Vector3();
const _d = new THREE.Quaternion();

/** Points `localDir` (in the bone's own space) at the world direction `target`; returns the bone's new local rotation. */
function aim(bone: THREE.Object3D, localDir: THREE.Vector3, target: THREE.Vector3, out: THREE.Quaternion) {
  bone.updateWorldMatrix(true, false);
  bone.getWorldQuaternion(_q);
  _v.copy(localDir).applyQuaternion(_q).normalize();
  _d.setFromUnitVectors(_v, target);
  _d.multiply(_q); // new world rotation
  bone.parent!.getWorldQuaternion(_q2).invert();
  return out.copy(_q2.multiply(_d));
}

function Director({ pointer }: { pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF(DIRECTOR);
  const root = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const group = useRef<THREE.Group>(null);

  const rig = useMemo(() => {
    tame(root);
    fit(root, 1.6);
    const bones: Record<string, THREE.Bone> = {};
    root.traverse((o) => {
      if ((o as THREE.Bone).isBone) bones[o.name] = o as THREE.Bone;
    });
    root.updateMatrixWorld(true);
    // The thumb of the right hand points up at rest; remember that in the hand's own space.
    const handQ = bones.RightHand.getWorldQuaternion(new THREE.Quaternion());
    const thumbLocal = new THREE.Vector3(0, 1, 0).applyQuaternion(handQ.invert());
    return {
      arm: bones.RightArm,
      fore: bones.RightForeArm,
      hand: bones.RightHand,
      rest: { arm: bones.RightArm.quaternion.clone(), fore: bones.RightForeArm.quaternion.clone(), hand: bones.RightHand.quaternion.clone() },
      toFore: bones.RightForeArm.position.clone().normalize(),
      toHand: bones.RightHand.position.clone().normalize(),
      thumbLocal,
      tgt: { arm: new THREE.Quaternion(), fore: new THREE.Quaternion(), hand: new THREE.Quaternion() },
    };
  }, [root]);

  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const dirU = useMemo(() => new THREE.Vector3(), []);
  const dirF = useMemo(() => new THREE.Vector3(), []);
  const rootQ = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // Arrive: pop in, then raise the arm.
    const pop = easeOutBack(clamp01((t - 0.1) / 0.9));
    g.scale.setScalar(Math.max(pop, 0.0001));
    const raise = easeOutBack(clamp01((t - 0.9) / 1.0));

    // Look toward the pointer; breathe and shift weight a little.
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, pointer.current.x * 0.34, 3.5, dt);
    g.rotation.z = Math.sin(t * 0.7) * 0.012;
    g.scale.y *= 1 + Math.sin(t * 1.9) * 0.004;

    // The thumbs-up: a pump every few seconds.
    const phase = (t - 2.4) % 3.4;
    const pump = t > 2.4 && phase < 0.55 ? Math.sin((phase / 0.55) * Math.PI) : 0;
    root.getWorldQuaternion(rootQ);
    dirU.set(-0.35 + Math.sin(t * 1.3) * 0.02, -0.55 + 0.12 * pump, 0.76).normalize().applyQuaternion(rootQ);
    dirF.set(-0.1 + Math.sin(t * 1.7) * 0.03, 0.45 + 0.32 * pump, 0.89).normalize().applyQuaternion(rootQ);

    // Start from the rest pose each frame, then aim the arm, forearm and thumb in that order.
    rig.arm.quaternion.copy(rig.rest.arm);
    rig.fore.quaternion.copy(rig.rest.fore);
    rig.hand.quaternion.copy(rig.rest.hand);
    rig.arm.updateMatrixWorld(true);

    aim(rig.arm, rig.toFore, dirU, rig.tgt.arm);
    rig.arm.quaternion.slerpQuaternions(rig.rest.arm, rig.tgt.arm, raise);
    rig.arm.updateMatrixWorld(true);

    aim(rig.fore, rig.toHand, dirF, rig.tgt.fore);
    rig.fore.quaternion.slerpQuaternions(rig.rest.fore, rig.tgt.fore, raise);
    rig.fore.updateMatrixWorld(true);

    // Thumb straight up in the world, whatever the forearm is doing.
    rig.hand.getWorldQuaternion(_q);
    _t.copy(rig.thumbLocal).applyQuaternion(_q).normalize();
    _d.setFromUnitVectors(_t, up).multiply(_q);
    rig.hand.parent!.getWorldQuaternion(_q2).invert();
    rig.tgt.hand.copy(_q2.multiply(_d));
    rig.hand.quaternion.slerpQuaternions(rig.rest.hand, rig.tgt.hand, raise);
  });

  return (
    <group ref={group}>
      <primitive object={root} />
    </group>
  );
}

/* ------------------------------------------------------------------ the two who run circles */

function Orbiter({ url, height, phase, kind }: { url: string; height: number; phase: number; kind: "tv" | "carton" }) {
  const { scene } = useGLTF(url);
  const root = useMemo(() => {
    const r = SkeletonUtils.clone(scene);
    tame(r);
    fit(r, height);
    return r;
  }, [scene, height]);
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const rx = useThree((s) => s.size.width) > 900 ? RX : 1.0; // a narrower orbit on phones

  useFrame((state) => {
    const g = group.current;
    const i = inner.current;
    if (!g || !i) return;
    const t = state.clock.elapsedTime;
    const a = t * SPEED + phase;
    g.position.set(Math.cos(a) * rx, 0, Math.sin(a) * RZ);

    // Mostly face the camera (the faces are the point), turning a little into the direction of travel.
    const heading = Math.atan2(-Math.sin(a) * rx, Math.cos(a) * RZ);
    g.rotation.y = lerpAngle(0, heading, 0.42);

    const born = easeOutBack(clamp01((t - (kind === "tv" ? 0.5 : 0.7)) / 0.9));
    g.scale.setScalar(Math.max(born, 0.0001));

    if (kind === "carton") {
      // Running: quick hops, leaning into the stride.
      const hop = Math.abs(Math.sin(t * 5.2 + phase));
      i.position.y = hop * 0.16;
      i.rotation.x = 0.1 + hop * 0.06;
      i.rotation.z = Math.sin(t * 5.2 + phase) * 0.06;
    } else {
      // Waddling: slower, heavier, rocking side to side.
      const hop = Math.abs(Math.sin(t * 3.1 + phase));
      i.position.y = hop * 0.09;
      i.rotation.z = Math.sin(t * 3.1 + phase) * 0.09;
      i.rotation.x = 0;
    }
  });

  return (
    <group ref={group}>
      <group ref={inner}>
        <primitive object={root} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ the stage */

function Stage() {
  const pointer = usePointer();
  // Desktop: shifted right of centre so the TV's far-left pass clears the name. Phones: centred.
  const shift = useThree((s) => s.size.width) > 900 ? 0.35 : 0;
  return (
    <>
      {/* Lit like the film: a warm key, an orange rim from one side and a violet rim from the other. */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 3.5, 5]} intensity={3.2} color="#fff4ea" />
      <pointLight position={[-4, 2.4, -2.5]} intensity={26} distance={16} decay={2} color="#ff9a6e" />
      <pointLight position={[4, 2.2, -2.5]} intensity={20} distance={16} decay={2} color="#a78bfa" />
      <Environment resolution={256} frames={1} environmentIntensity={1.15}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[10, 4, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2} position={[-5, 1.5, 3]} scale={[3, 6, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2} position={[5, 1.5, 3]} scale={[3, 6, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.4} position={[0, 1, -5]} scale={[10, 4, 1]} color="#ffd2b8" />
      </Environment>

      <group position={[shift, 0, 0]}>
        <Director pointer={pointer} />
        <Orbiter url={THINKER} height={THINKER_H} phase={0} kind="tv" />
        <Orbiter url={SPEEDSTER} height={SPEEDSTER_H} phase={Math.PI} kind="carton" />
      </group>

      <ContactShadows position={[shift, 0.002, 0]} opacity={0.55} scale={10} blur={2.4} far={2.4} resolution={256} frames={Infinity} color="#000000" />
    </>
  );
}

/** If the machine can't hold ~20 fps, hand the hero back to the still image rather than stutter. */
function FpsGuard({ onSlow }: { onSlow: () => void }) {
  const acc = useRef({ t: 0, n: 0, done: false });
  useFrame((state, dt) => {
    const a = acc.current;
    if (a.done || state.clock.elapsedTime < 3 || dt > 0.5) return; // let textures upload and shaders compile first
    a.t += dt;
    a.n++;
    if (a.t >= 3) {
      a.done = true;
      if (a.t / a.n > 0.05) onSlow();
    }
  });
  return null;
}

export default function HeroStage({
  active,
  onReady,
  onSlow,
}: {
  active: boolean;
  onReady: () => void;
  onSlow?: () => void;
}) {
  const ready = useRef(false);
  return (
    <Canvas
      flat
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: 26, position: [0, 1.0, 5.5], near: 0.1, far: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      onCreated={(state: RootState) => {
        state.camera.lookAt(0, 0.78, 0);
        state.gl.setClearColor(0x000000, 0);
      }}
      aria-hidden="true"
    >
      <Stage />
      {onSlow && <FpsGuard onSlow={onSlow} />}
      <ReadyPing onReady={() => {
        if (!ready.current) {
          ready.current = true;
          onReady();
        }
      }} />
    </Canvas>
  );
}

/** Tells the page the first real frame is on screen (models are loaded: Suspense resolved). */
function ReadyPing({ onReady }: { onReady: () => void }) {
  const n = useRef(0);
  useFrame(() => {
    if (++n.current === 3) onReady();
  });
  return null;
}

useGLTF.preload(DIRECTOR);
useGLTF.preload(THINKER);
useGLTF.preload(SPEEDSTER);
