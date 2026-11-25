import * as THREE from 'three';

export interface ClickArrowSculpture {
  group: THREE.Group;
  outerRing: THREE.Mesh;
  innerRing: THREE.Mesh;
  coreGroup: THREE.Group;
  dispose: () => void;
}

/**
 * Builds the bespoke Click Arrow 3D brand monolith:
 * A faceted beveled spear-chevron core in vivid Click Arrow Red (#E80012),
 * recessed pitch-black obsidian spine, crisp pure-white vector blades,
 * and precision gimbal rings.
 */
export function createClickArrowSculpture(): ClickArrowSculpture {
  const group = new THREE.Group();
  const coreGroup = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];

  const redMonolithMat = new THREE.MeshPhysicalMaterial({
    color: 0xe80012,
    emissive: 0x3b0004,
    emissiveIntensity: 0.45,
    roughness: 0.18,
    metalness: 0.25,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const obsidianSpineMat = new THREE.MeshStandardMaterial({
    color: 0x090909,
    roughness: 0.28,
    metalness: 0.78,
  });

  const whiteTrimMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.2,
    roughness: 0.2,
    metalness: 0.55,
  });

  disposables.push(redMonolithMat, obsidianSpineMat, whiteTrimMat);

  // 1. Primary Faceted Chevron Spearhead (Red)
  const chevronShape = new THREE.Shape();
  chevronShape.moveTo(-1.15, -1.05);
  chevronShape.lineTo(-0.25, -1.05);
  chevronShape.lineTo(1.25, 0);
  chevronShape.lineTo(-0.25, 1.05);
  chevronShape.lineTo(-1.15, 1.05);
  chevronShape.lineTo(-0.08, 0);
  chevronShape.closePath();

  const chevronGeo = new THREE.ExtrudeGeometry(chevronShape, {
    depth: 0.34,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.09,
    bevelSegments: 4,
  });
  chevronGeo.center();
  const chevronMesh = new THREE.Mesh(chevronGeo, redMonolithMat);
  coreGroup.add(chevronMesh);
  disposables.push(chevronGeo);

  // 2. Interlocking Inner Obsidian Vector Spine (Black)
  const spineShape = new THREE.Shape();
  spineShape.moveTo(-1.45, -0.22);
  spineShape.lineTo(0.45, -0.22);
  spineShape.lineTo(0.75, 0);
  spineShape.lineTo(0.45, 0.22);
  spineShape.lineTo(-1.45, 0.22);
  spineShape.lineTo(-1.18, 0);
  spineShape.closePath();

  const spineGeo = new THREE.ExtrudeGeometry(spineShape, {
    depth: 0.48,
    bevelEnabled: true,
    bevelThickness: 0.06,
    bevelSize: 0.04,
    bevelSegments: 2,
  });
  spineGeo.center();
  const spineMesh = new THREE.Mesh(spineGeo, obsidianSpineMat);
  spineMesh.position.set(-0.18, 0, 0);
  coreGroup.add(spineMesh);
  disposables.push(spineGeo);

  // 3. Crisp White Precision Edge Fin Blades (Top & Bottom Accent Rails)
  const bladeGeo = new THREE.BoxGeometry(1.15, 0.075, 0.56);
  const topBlade = new THREE.Mesh(bladeGeo, whiteTrimMat);
  topBlade.position.set(0.18, 0.62, 0);
  topBlade.rotation.z = -0.58;

  const bottomBlade = new THREE.Mesh(bladeGeo, whiteTrimMat);
  bottomBlade.position.set(0.18, -0.62, 0);
  bottomBlade.rotation.z = 0.58;
  coreGroup.add(topBlade, bottomBlade);
  disposables.push(bladeGeo);

  // 4. Trailing Micro-Arrow Stabilizer Wedge (White)
  const tailShape = new THREE.Shape();
  tailShape.moveTo(-0.32, -0.34);
  tailShape.lineTo(0.05, -0.34);
  tailShape.lineTo(0.42, 0);
  tailShape.lineTo(0.05, 0.34);
  tailShape.lineTo(-0.32, 0.34);
  tailShape.lineTo(-0.04, 0);
  tailShape.closePath();

  const tailGeo = new THREE.ExtrudeGeometry(tailShape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.03,
    bevelSegments: 2,
  });
  tailGeo.center();
  const tailMesh = new THREE.Mesh(tailGeo, whiteTrimMat);
  tailMesh.position.set(-1.35, 0, 0);
  coreGroup.add(tailMesh);
  disposables.push(tailGeo);

  group.add(coreGroup);

  // 5. Outer Precision White Gimbal Vector Ring
  const outerRingGeo = new THREE.TorusGeometry(2.05, 0.022, 16, 96);
  const outerRing = new THREE.Mesh(outerRingGeo, whiteTrimMat);
  outerRing.rotation.x = Math.PI * 0.36;
  outerRing.rotation.y = 0.22;
  group.add(outerRing);
  disposables.push(outerRingGeo);

  // 6. Inner Red Orbital Ring
  const innerRingGeo = new THREE.TorusGeometry(1.72, 0.028, 16, 84);
  const innerRing = new THREE.Mesh(innerRingGeo, redMonolithMat);
  innerRing.rotation.x = -Math.PI * 0.28;
  innerRing.rotation.y = -0.35;
  group.add(innerRing);
  disposables.push(innerRingGeo);

  return {
    group,
    outerRing,
    innerRing,
    coreGroup,
    dispose() {
      disposables.forEach((d) => d.dispose());
    },
  };
}
