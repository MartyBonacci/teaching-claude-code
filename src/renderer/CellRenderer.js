import * as THREE from 'three';
import { GRID_SIZE, CELL_SIZE, CELL_SPACING, CELL_COLOR } from '../utils/constants.js';

export class CellRenderer {
  constructor(scene) {
    this.scene = scene;

    // Calculate offset to center grid at origin
    this.offset = -(GRID_SIZE * CELL_SPACING) / 2 + CELL_SPACING / 2;

    // Max cells we might render (small percentage of total)
    this.maxCells = Math.floor(GRID_SIZE * GRID_SIZE * GRID_SIZE * 0.2);

    this.createInstancedMesh();
  }

  createInstancedMesh() {
    const geometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);
    const material = new THREE.MeshStandardMaterial({
      color: CELL_COLOR,
      metalness: 0.3,
      roughness: 0.7
    });

    this.mesh = new THREE.InstancedMesh(geometry, material, this.maxCells);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.count = 0; // Start with no visible instances

    this.scene.add(this.mesh);

    // Reusable Object3D for matrix calculations
    this.dummy = new THREE.Object3D();
  }

  // Convert grid coordinates to world position
  gridToWorld(x, y, z) {
    return {
      x: x * CELL_SPACING + this.offset,
      y: y * CELL_SPACING + this.offset,
      z: z * CELL_SPACING + this.offset
    };
  }

  // Convert world position to grid coordinates
  worldToGrid(wx, wy, wz) {
    return {
      x: Math.round((wx - this.offset) / CELL_SPACING),
      y: Math.round((wy - this.offset) / CELL_SPACING),
      z: Math.round((wz - this.offset) / CELL_SPACING)
    };
  }

  // Update mesh to show current live cells
  update(liveCells) {
    let index = 0;

    for (const { x, y, z } of liveCells) {
      if (index >= this.maxCells) break;

      const world = this.gridToWorld(x, y, z);
      this.dummy.position.set(world.x, world.y, world.z);
      this.dummy.updateMatrix();
      this.mesh.setMatrixAt(index, this.dummy.matrix);
      index++;
    }

    this.mesh.count = index;
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  // Change cell color
  setColor(color) {
    this.mesh.material.color.setHex(color);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
    this.scene.remove(this.mesh);
  }
}
