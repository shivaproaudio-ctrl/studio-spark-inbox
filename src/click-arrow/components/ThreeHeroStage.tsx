// @ts-nocheck -- imported code written for looser compiler settings
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SERVICES_CHANNELS, STUDIO_ASSETS } from '../data/clickArrowData';
import { createClickArrowSculpture } from '../three/arrowBuilder';
import { CrtTvRig, createCRTTelevision } from '../three/crtBuilder';

interface ThreeHeroStageProps {
  onSelectChannel: (channelIndex: number) => void;
  onHoverChannel: (channelIndex: number | null) => void;
  modalOpen: boolean;
}

// Module-level reusable math helpers (zero GC inside animation loop)
const _mouseVec = new THREE.Vector2();
const _targetVec = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function ThreeHeroStage({
  onSelectChannel,
  onHoverChannel,
  modalOpen,
}: ThreeHeroStageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);
  const callbacksRef = useRef({ onSelectChannel, onHoverChannel, modalOpen });
  callbacksRef.current = { onSelectChannel, onHoverChannel, modalOpen };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const isSoftwareGl = detectSoftwareWebGL();
    const isMobile = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      80,
    );
    camera.position.set(0, 0, isMobile ? 13.5 : 10.2);

    // Mandatory studio environment reflection map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // 3-Point Studio Lighting Rig (strictly Red & White illumination)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1a0003, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(6, 7, 8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -8;
      keyLight.shadow.camera.right = 8;
      keyLight.shadow.camera.top = 8;
      keyLight.shadow.camera.bottom = -8;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const redRimLight = new THREE.DirectionalLight(0xe80012, 3.2);
    redRimLight.position.set(-7, 2, -4);
    scene.add(redRimLight);

    const frontFill = new THREE.PointLight(0xe80012, 4.5, 22, 1.8);
    frontFill.position.set(0, -3, 6);
    scene.add(frontFill);

    // Build 5 Floating Composite 3D CRT Televisions for Hero & Closing Choreography
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const tvConfigs = [
      {
        channelIndex: 0,
        pos: new THREE.Vector3(-4.2, 2.05, -0.6),
        rot: new THREE.Euler(0.14, 0.42, -0.08),
        scale: 0.92,
        phase: 0.2,
      },
      {
        channelIndex: 1,
        pos: new THREE.Vector3(4.35, 1.85, -1.1),
        rot: new THREE.Euler(0.12, -0.48, 0.09),
        scale: 0.88,
        phase: 1.5,
      },
      {
        channelIndex: 2,
        pos: new THREE.Vector3(-4.6, -1.75, -0.9),
        rot: new THREE.Euler(-0.14, 0.36, 0.07),
        scale: 0.84,
        phase: 2.7,
      },
      {
        channelIndex: 4,
        pos: new THREE.Vector3(4.15, -1.85, -0.35),
        rot: new THREE.Euler(-0.1, -0.38, -0.06),
        scale: 0.96,
        phase: 3.9,
      },
      {
        channelIndex: 3,
        pos: new THREE.Vector3(0.15, 2.75, -3.4),
        rot: new THREE.Euler(0.24, -0.08, 0.03),
        scale: 0.72,
        phase: 5.1,
      },
    ];

    const backdropUrls = [
      STUDIO_ASSETS.identitySystem,
      STUDIO_ASSETS.lifestyleEditorial,
      STUDIO_ASSETS.spatialScreens,
      STUDIO_ASSETS.brandFilm,
      STUDIO_ASSETS.productCampaign,
    ];

    const tvRigs: CrtTvRig[] = tvConfigs.map((cfg, idx) => {
      const ch = SERVICES_CHANNELS[cfg.channelIndex];
      const rig = createCRTTelevision({
        channelIndex: cfg.channelIndex,
        program: ch.programType,
        backdropUrl: backdropUrls[idx],
        maxAnisotropy,
        isSoftwareGl,
        basePos: cfg.pos,
        baseRot: cfg.rot,
        phaseOffset: cfg.phase,
      });
      rig.group.scale.setScalar(isMobile ? cfg.scale * 0.68 : cfg.scale);
      scene.add(rig.group);
      return rig;
    });

    // Build Custom 3D Click Arrow Sculpture
    const arrow = createClickArrowSculpture();
    arrow.group.position.set(0, 0, -4.5);
    arrow.group.scale.setScalar(isMobile ? 0.65 : 0.9);
    scene.add(arrow.group);

    // Pre-warm shaders when running on real GPU
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer & Scroll State
    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;
    let hoveredRig: CrtTvRig | null = null;
    let lastRaycastTime = 0;
    let lastScreenDrawTime = 0;

    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const hitTargets = tvRigs.map((r) => r.hitbox);

    const updateMouseFromEvent = (e: PointerEvent | MouseEvent) => {
      _mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      _mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouseX = _mouseVec.x;
      targetMouseY = _mouseVec.y;
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateMouseFromEvent(e);
      if (callbacksRef.current.modalOpen) return;

      const now = performance.now();
      if (now - lastRaycastTime < 55) return;
      lastRaycastTime = now;

      const targetEl = e.target as HTMLElement | null;
      if (targetEl && targetEl.closest('button, a, input, textarea, select, [data-no-3d]')) {
        if (hoveredRig) {
          hoveredRig = null;
          callbacksRef.current.onHoverChannel(null);
        }
        return;
      }

      raycaster.setFromCamera(_mouseVec, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);
      if (hits.length > 0) {
        const hitBox = hits[0].object;
        const found = tvRigs.find((r) => r.hitbox === hitBox) || null;
        if (found !== hoveredRig) {
          hoveredRig = found;
          callbacksRef.current.onHoverChannel(found ? found.channelIndex : null);
        }
      } else if (hoveredRig) {
        hoveredRig = null;
        callbacksRef.current.onHoverChannel(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (callbacksRef.current.modalOpen) return;
      const targetEl = e.target as HTMLElement | null;
      if (targetEl && targetEl.closest('button, a, input, textarea, select, [data-no-3d]')) {
        return;
      }

      _mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      _mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(_mouseVec, camera);
      const hits = raycaster.intersectObjects(hitTargets, false);
      if (hits.length > 0) {
        const idx = hits[0].object.userData.channelIndex;
        if (typeof idx === 'number') {
          callbacksRef.current.onSelectChannel(idx);
        }
      }
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
      );
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    const handleContextRestored = () => {
      setWebglFailed(false);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;

      if (document.hidden) {
        if (!isSoftwareGl) {
          frameId = requestAnimationFrame(tick);
        } else {
          frameId = window.setTimeout(tick, 200);
        }
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = prefersReducedMotion ? 0 : clock.getElapsedTime();

      // Normalized page scroll progress 0..1
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const scrollP = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1);

      smoothMouseX = THREE.MathUtils.damp(smoothMouseX, targetMouseX, 5, delta);
      smoothMouseY = THREE.MathUtils.damp(smoothMouseY, targetMouseY, 5, delta);

      // Section phase weights:
      // Hero: 0.0 -> 0.15
      // Attention + About (Arrow centerpiece): 0.14 -> 0.36
      // Mid sections (subtle ambient background): 0.36 -> 0.84
      // Closing Contact Convergence: 0.84 -> 1.0
      const heroWeight = 1 - THREE.MathUtils.smoothstep(scrollP, 0.04, 0.18);
      const aboutWeight =
        THREE.MathUtils.smoothstep(scrollP, 0.12, 0.22) *
        (1 - THREE.MathUtils.smoothstep(scrollP, 0.33, 0.44));
      const closingWeight = THREE.MathUtils.smoothstep(scrollP, 0.8, 0.96);

      // Update floating CRT TVs
      const tvActiveWeight = Math.max(heroWeight, closingWeight * 0.92);

      // Throttle canvas texture redraws to ~18fps for authentic CRT cadence & low CPU
      const nowMs = performance.now();
      const shouldRedrawScreens =
        !prefersReducedMotion &&
        tvActiveWeight > 0.08 &&
        nowMs - lastScreenDrawTime > 55;
      if (shouldRedrawScreens) {
        lastScreenDrawTime = nowMs;
      }

      for (let i = 0; i < tvRigs.length; i++) {
        const rig = tvRigs[i];
        const isHovered = hoveredRig === rig;

        // Scroll dispersion: as user scrolls out of hero, TVs sweep outward/behind
        const outSpread = (1 - tvActiveWeight) * 7.5;
        const sideSign = rig.basePos.x >= 0 ? 1 : -1;
        const floatY = Math.sin(elapsed * 0.9 + rig.phaseOffset) * 0.18;
        const floatX = Math.cos(elapsed * 0.65 + rig.phaseOffset) * 0.12;

        // Closing formation pulls TVs slightly tighter in balanced frame
        const closingOffset = closingWeight * (sideSign * -0.55);

        const destX =
          rig.basePos.x +
          floatX +
          sideSign * outSpread +
          closingOffset +
          smoothMouseX * (0.35 + i * 0.06);
        const destY =
          rig.basePos.y +
          floatY -
          (1 - tvActiveWeight) * 1.4 +
          smoothMouseY * 0.25;
        const destZ =
          rig.basePos.z +
          (isHovered ? 0.95 : 0) -
          (1 - tvActiveWeight) * 3.8;

        rig.group.position.x = THREE.MathUtils.damp(rig.group.position.x, destX, 6, delta);
        rig.group.position.y = THREE.MathUtils.damp(rig.group.position.y, destY, 6, delta);
        rig.group.position.z = THREE.MathUtils.damp(rig.group.position.z, destZ, 6, delta);

        const destRotY =
          rig.baseRot.y +
          smoothMouseX * 0.16 +
          Math.sin(elapsed * 0.5 + rig.phaseOffset) * 0.05 +
          (1 - tvActiveWeight) * sideSign * 0.6;
        const destRotX =
          rig.baseRot.x -
          smoothMouseY * 0.12 +
          Math.cos(elapsed * 0.45 + rig.phaseOffset) * 0.03;

        rig.group.rotation.y = THREE.MathUtils.damp(rig.group.rotation.y, destRotY, 6, delta);
        rig.group.rotation.x = THREE.MathUtils.damp(rig.group.rotation.x, destRotX, 6, delta);

        const targetEmissive = isHovered ? 1.55 : 0.95;
        rig.screenMaterial.emissiveIntensity = THREE.MathUtils.damp(
          rig.screenMaterial.emissiveIntensity,
          targetEmissive,
          8,
          delta,
        );

        rig.group.visible = tvActiveWeight > 0.03;

        if (shouldRedrawScreens) {
          rig.updateScreen(elapsed);
        }
      }

      // Update Custom 3D Click Arrow Sculpture
      const arrowPresence = Math.max(
        heroWeight * 0.22,
        aboutWeight,
        closingWeight * 0.72,
      );
      const targetArrowX =
        aboutWeight * (isMobile ? 0 : 2.1) +
        closingWeight * (isMobile ? 0 : -0.2) +
        smoothMouseX * 0.45;
      const targetArrowY =
        (1 - aboutWeight - closingWeight) * -1.2 +
        Math.sin(elapsed * 1.1) * 0.16 +
        smoothMouseY * 0.3;
      const targetArrowZ =
        aboutWeight * 1.2 +
        closingWeight * -0.8 +
        (1 - Math.max(aboutWeight, closingWeight)) * -6.5;

      arrow.group.position.x = THREE.MathUtils.damp(arrow.group.position.x, targetArrowX, 5, delta);
      arrow.group.position.y = THREE.MathUtils.damp(arrow.group.position.y, targetArrowY, 5, delta);
      arrow.group.position.z = THREE.MathUtils.damp(arrow.group.position.z, targetArrowZ, 5, delta);

      const targetArrowScale = isMobile
        ? 0.55 + arrowPresence * 0.45
        : 0.62 + arrowPresence * 0.72;
      _targetVec.setScalar(targetArrowScale);
      arrow.group.scale.lerp(_targetVec, 1 - Math.exp(-5 * delta));

      arrow.coreGroup.rotation.y = THREE.MathUtils.damp(
        arrow.coreGroup.rotation.y,
        scrollP * Math.PI * 3.2 + smoothMouseX * 0.55 + elapsed * 0.25,
        5,
        delta,
      );
      arrow.coreGroup.rotation.x = THREE.MathUtils.damp(
        arrow.coreGroup.rotation.x,
        Math.sin(elapsed * 0.6) * 0.18 - smoothMouseY * 0.4,
        5,
        delta,
      );
      arrow.outerRing.rotation.z = elapsed * 0.35 + scrollP * 2.5;
      arrow.innerRing.rotation.z = -elapsed * 0.5 - scrollP * 3.2;

      arrow.group.visible = arrowPresence > 0.05;

      // Subtle camera breathing
      camera.position.x = THREE.MathUtils.damp(camera.position.x, smoothMouseX * 0.35, 4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, smoothMouseY * 0.22, 4, delta);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (isSoftwareGl) {
      tick();
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      tvRigs.forEach((r) => r.dispose());
      arrow.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (webglFailed) {
    return null;
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[2]"
    />
  );
}
