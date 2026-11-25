// @ts-nocheck -- imported code written for looser compiler settings
import * as THREE from 'three';
import { ScreenProgramType, renderScreenProgram } from './screenPrograms';

export interface CrtTvRig {
  group: THREE.Group;
  hitbox: THREE.Mesh;
  screenMaterial: THREE.MeshStandardMaterial;
  screenTexture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  program: ScreenProgramType;
  backdropImg: HTMLImageElement | null;
  channelIndex: number;
  basePos: THREE.Vector3;
  baseRot: THREE.Euler;
  phaseOffset: number;
  updateScreen: (time: number) => void;
  dispose: () => void;
}

/**
 * Generates a curved convex CRT tube geometry by displacing a subdivided plane
 * along +Z using a smooth spherical falloff toward the bezel edges.
 */
function createCurvedTubeGeometry(
  width: number,
  height: number,
  bulgeDepth: number,
): THREE.PlaneGeometry {
  const geo = new THREE.PlaneGeometry(width, height, 20, 16);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const nx = x / (width * 0.5);
    const ny = y / (height * 0.5);
    const r2 = Math.min(1, nx * nx * 0.85 + ny * ny * 0.85);
    const z = Math.cos(r2 * Math.PI * 0.5) * bulgeDepth;
    pos.setZ(i, z);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates a rounded rectangular outer cabinet frame with an inner beveled cutout
 * for the CRT tube bezel.
 */
function createBezelFrameGeometry(
  outerW: number,
  outerH: number,
  innerW: number,
  innerH: number,
  depth: number,
): THREE.ExtrudeGeometry {
  const r = 0.08;
  const shape = new THREE.Shape();
  const hw = outerW * 0.5;
  const hh = outerH * 0.5;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo(hw - r, -hh);
  shape.quadraticCurveTo(hw, -hh, hw, -hh + r);
  shape.lineTo(hw, hh - r);
  shape.quadraticCurveTo(hw, hh, hw - r, hh);
  shape.lineTo(-hw + r, hh);
  shape.quadraticCurveTo(-hw, hh, -hw, hh - r);
  shape.lineTo(-hw, -hh + r);
  shape.quadraticCurveTo(-hw, -hh, -hw + r, -hh);

  // Inner aperture hole
  const hole = new THREE.Path();
  const ir = 0.06;
  const ihw = innerW * 0.5;
  const ihh = innerH * 0.5;
  const offsetX = -0.11; // Offset screen slightly left to leave room for right control strip
  hole.moveTo(offsetX - ihw + ir, -ihh);
  hole.lineTo(offsetX + ihw - ir, -ihh);
  hole.quadraticCurveTo(offsetX + ihw, -ihh, offsetX + ihw, -ihh + ir);
  hole.lineTo(offsetX + ihw, ihh - ir);
  hole.quadraticCurveTo(offsetX + ihw, ihh, offsetX + ihw - ir, ihh);
  hole.lineTo(offsetX - ihw + ir, ihh);
  hole.quadraticCurveTo(offsetX - ihw, ihh, offsetX - ihw, ihh - ir);
  hole.lineTo(offsetX - ihw, -ihh + ir);
  hole.quadraticCurveTo(offsetX - ihw, -ihh, offsetX - ihw + ir, -ihh);
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelSegments: 3,
  });
  geo.center();
  return geo;
}

export function createCRTTelevision(options: {
  channelIndex: number;
  program: ScreenProgramType;
  backdropUrl?: string;
  maxAnisotropy: number;
  isSoftwareGl: boolean;
  basePos: THREE.Vector3;
  baseRot: THREE.Euler;
  phaseOffset: number;
}): CrtTvRig {
  const {
    channelIndex,
    program,
    backdropUrl,
    maxAnisotropy,
    isSoftwareGl,
    basePos,
    baseRot,
    phaseOffset,
  } = options;

  const group = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  // Shared calibrated PBR materials (strictly Black, White, Bright Red)
  const cabinetMat = new THREE.MeshStandardMaterial({
    color: 0x0e0e0e,
    roughness: 0.55,
    metalness: 0.14,
  });
  const bezelTrimMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.24,
    metalness: 0.65,
  });
  const chromeDialMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.18,
    metalness: 0.85,
  });
  const redAccentMat = new THREE.MeshStandardMaterial({
    color: 0xe80012,
    emissive: 0xe80012,
    emissiveIntensity: 1.4,
    roughness: 0.3,
    metalness: 0.2,
  });
  disposables.push(cabinetMat, bezelTrimMat, chromeDialMat, redAccentMat);

  // 1. Primary Silhouette: Main cabinet body (1.75 x 1.32 x 0.92)
  const bodyGeo = new THREE.BoxGeometry(1.75, 1.32, 0.72);
  const bodyMesh = new THREE.Mesh(bodyGeo, cabinetMat);
  bodyMesh.position.set(0, 0, -0.34);
  bodyMesh.castShadow = !isSoftwareGl;
  bodyMesh.receiveShadow = !isSoftwareGl;
  group.add(bodyMesh);
  disposables.push(bodyGeo);

  // 2. Tapered Cathode Ray Tube rear yoke housing
  const yokeGeo = new THREE.CylinderGeometry(0.42, 0.66, 0.52, 4);
  yokeGeo.rotateY(Math.PI / 4);
  yokeGeo.rotateX(Math.PI / 2);
  const yokeMesh = new THREE.Mesh(yokeGeo, cabinetMat);
  yokeMesh.position.set(-0.05, 0, -0.9);
  group.add(yokeMesh);
  disposables.push(yokeGeo);

  // 3. Stepped front bezel frame
  const bezelGeo = createBezelFrameGeometry(1.82, 1.38, 1.24, 0.98, 0.12);
  const bezelMesh = new THREE.Mesh(bezelGeo, bezelTrimMat);
  bezelMesh.position.set(0, 0, 0.04);
  bezelMesh.castShadow = !isSoftwareGl;
  group.add(bezelMesh);
  disposables.push(bezelGeo);

  // 4. Live Dynamic Canvas Texture for Curved CRT Screen
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  let backdropImg: HTMLImageElement | null = null;
  if (backdropUrl) {
    backdropImg = new Image();
    backdropImg.crossOrigin = 'anonymous';
    backdropImg.src = backdropUrl;
  }

  renderScreenProgram(ctx, canvas.width, canvas.height, program, phaseOffset, backdropImg);

  const screenTexture = new THREE.CanvasTexture(canvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  screenTexture.anisotropy = Math.min(maxAnisotropy, 8);
  screenTexture.minFilter = THREE.LinearFilter;
  screenTexture.magFilter = THREE.LinearFilter;
  disposables.push(screenTexture);

  const screenGeo = createCurvedTubeGeometry(1.26, 1.0, 0.085);
  const screenMaterial = new THREE.MeshStandardMaterial({
    map: screenTexture,
    emissiveMap: screenTexture,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.95,
    roughness: 0.2,
    metalness: 0.05,
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
  screenMesh.position.set(-0.11, 0, 0.01);
  group.add(screenMesh);
  disposables.push(screenGeo, screenMaterial);

  // 5. Outer Optical Curved Glass Reflection Layer
  const glassGeo = createCurvedTubeGeometry(1.27, 1.01, 0.095);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: isSoftwareGl ? 0.14 : 0.18,
    roughness: 0.05,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    depthWrite: false,
  });
  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.position.set(-0.11, 0, 0.025);
  glassMesh.renderOrder = 2;
  group.add(glassMesh);
  disposables.push(glassGeo, glassMat);

  // 6. Control Strip Plate + Dual Rotary Dials on Right Side
  const stripGeo = new THREE.BoxGeometry(0.24, 1.06, 0.04);
  const stripMesh = new THREE.Mesh(stripGeo, cabinetMat);
  stripMesh.position.set(0.69, 0, 0.08);
  group.add(stripMesh);
  disposables.push(stripGeo);

  const dialGeo = new THREE.CylinderGeometry(0.065, 0.072, 0.06, 20);
  dialGeo.rotateX(Math.PI / 2);
  const dialTop = new THREE.Mesh(dialGeo, chromeDialMat);
  dialTop.position.set(0.69, 0.34, 0.12);
  const dialBottom = new THREE.Mesh(dialGeo, chromeDialMat);
  dialBottom.position.set(0.69, 0.14, 0.12);
  group.add(dialTop, dialBottom);
  disposables.push(dialGeo);

  // 7. Precision Speaker Grille Slats (InstancedMesh)
  const slatGeo = new THREE.BoxGeometry(0.18, 0.014, 0.02);
  const slatCount = 10;
  const slats = new THREE.InstancedMesh(slatGeo, bezelTrimMat, slatCount);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < slatCount; i++) {
    dummy.position.set(0.69, -0.06 - i * 0.036, 0.1);
    dummy.updateMatrix();
    slats.setMatrixAt(i, dummy.matrix);
  }
  slats.instanceMatrix.needsUpdate = true;
  slats.computeBoundingSphere();
  group.add(slats);
  disposables.push(slatGeo);

  // 8. Bright Red Power LED Indicator Accent
  const ledGeo = new THREE.BoxGeometry(0.08, 0.022, 0.025);
  const ledMesh = new THREE.Mesh(ledGeo, redAccentMat);
  ledMesh.position.set(0.69, -0.47, 0.1);
  group.add(ledMesh);
  disposables.push(ledGeo);

  // 9. Twin Telescopic Dipole Antennas
  const antBaseGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.06, 16);
  const antBase = new THREE.Mesh(antBaseGeo, bezelTrimMat);
  antBase.position.set(-0.1, 0.71, -0.15);
  group.add(antBase);

  const rodGeo = new THREE.CylinderGeometry(0.011, 0.014, 0.75, 10);
  const tipGeo = new THREE.SphereGeometry(0.024, 12, 12);

  const leftRod = new THREE.Mesh(rodGeo, chromeDialMat);
  leftRod.position.set(-0.34, 1.01, -0.15);
  leftRod.rotation.z = 0.56;
  const leftTip = new THREE.Mesh(tipGeo, redAccentMat);
  leftTip.position.set(-0.54, 1.33, -0.15);

  const rightRod = new THREE.Mesh(rodGeo, chromeDialMat);
  rightRod.position.set(0.14, 1.01, -0.15);
  rightRod.rotation.z = -0.56;
  const rightTip = new THREE.Mesh(tipGeo, redAccentMat);
  rightTip.position.set(0.34, 1.33, -0.15);

  group.add(leftRod, leftTip, rightRod, rightTip);
  disposables.push(antBaseGeo, rodGeo, tipGeo);

  // Invisible Raycasting Proxy Box on Layer 1
  const hitGeo = new THREE.BoxGeometry(1.9, 1.48, 1.25);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitbox = new THREE.Mesh(hitGeo, hitMat);
  hitbox.position.set(0, 0, -0.25);
  hitbox.layers.set(1);
  hitbox.userData.channelIndex = channelIndex;
  group.add(hitbox);
  disposables.push(hitGeo, hitMat);

  group.position.copy(basePos);
  group.rotation.copy(baseRot);

  return {
    group,
    hitbox,
    screenMaterial,
    screenTexture,
    canvas,
    ctx,
    program,
    backdropImg,
    channelIndex,
    basePos: basePos.clone(),
    baseRot: baseRot.clone(),
    phaseOffset,
    updateScreen(time: number) {
      renderScreenProgram(
        ctx,
        canvas.width,
        canvas.height,
        program,
        time + phaseOffset,
        backdropImg,
      );
      screenTexture.needsUpdate = true;
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
