import * as THREE from 'three';
import { GRID_SIZE, CELL_SPACING, GRID_COLOR } from '../utils/constants.js';

export class GridHelper {
  constructor(scene) {
    this.scene = scene;
    this.createBoundaryBox();
  }

  createBoundaryBox() {
    const size = GRID_SIZE * CELL_SPACING;
    const halfSize = size / 2;

    // Create wireframe box showing grid boundaries
    const geometry = new THREE.BoxGeometry(size, size, size);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({
      color: GRID_COLOR,
      transparent: true,
      opacity: 0.5
    });

    this.boundaryBox = new THREE.LineSegments(edges, material);
    this.scene.add(this.boundaryBox);

    // Add subtle grid lines on the floor for orientation
    const gridHelper = new THREE.GridHelper(size, GRID_SIZE, GRID_COLOR, GRID_COLOR);
    gridHelper.position.y = -halfSize;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    this.gridHelper = gridHelper;
    this.scene.add(gridHelper);
  }

  setVisible(visible) {
    this.boundaryBox.visible = visible;
    this.gridHelper.visible = visible;
  }

  dispose() {
    this.boundaryBox.geometry.dispose();
    this.boundaryBox.material.dispose();
    this.gridHelper.geometry.dispose();
    this.gridHelper.material.dispose();
    this.scene.remove(this.boundaryBox);
    this.scene.remove(this.gridHelper);
  }
}
