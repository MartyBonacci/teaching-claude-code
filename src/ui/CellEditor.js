import * as THREE from 'three';
import { GRID_SIZE, CELL_SPACING, CELL_SIZE } from '../utils/constants.js';

export class CellEditor {
  constructor(scene, camera, renderer, grid, cellRenderer, onUpdate) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.grid = grid;
    this.cellRenderer = cellRenderer;
    this.onUpdate = onUpdate;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Edit mode state
    this.editMode = false;
    this.editZ = Math.floor(GRID_SIZE / 2); // Default to middle layer

    // Calculate grid offset (to center at origin)
    this.offset = -(GRID_SIZE * CELL_SPACING) / 2 + CELL_SPACING / 2;

    this.createEditPlane();
    this.createHoverIndicator();
    this.bindEvents();
  }

  createEditPlane() {
    // Create a visible plane at current Z depth for editing
    const size = GRID_SIZE * CELL_SPACING;
    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide
    });

    this.editPlane = new THREE.Mesh(geometry, material);
    this.editPlane.rotation.x = -Math.PI / 2; // Rotate to be horizontal (XZ plane)
    this.updateEditPlanePosition();
    this.editPlane.visible = false; // Hidden until edit mode enabled
    this.scene.add(this.editPlane);

    // Create grid lines on the edit plane
    const gridHelper = new THREE.GridHelper(size, GRID_SIZE, 0x00ff88, 0x00ff88);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.15;
    this.editGrid = gridHelper;
    this.editGrid.visible = false;
    this.scene.add(this.editGrid);
  }

  createHoverIndicator() {
    const geometry = new THREE.BoxGeometry(CELL_SIZE * 1.05, CELL_SIZE * 1.05, CELL_SIZE * 1.05);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      wireframe: true
    });
    this.hoverIndicator = new THREE.Mesh(geometry, material);
    this.hoverIndicator.visible = false;
    this.scene.add(this.hoverIndicator);
  }

  updateEditPlanePosition() {
    const y = this.editZ * CELL_SPACING + this.offset;
    this.editPlane.position.y = y;
    if (this.editGrid) {
      this.editGrid.position.y = y;
    }
  }

  setEditZ(z) {
    this.editZ = Math.max(0, Math.min(GRID_SIZE - 1, z));
    this.updateEditPlanePosition();
  }

  setEditMode(enabled) {
    this.editMode = enabled;
    this.editPlane.visible = enabled;
    this.editGrid.visible = enabled;
    if (!enabled) {
      this.hoverIndicator.visible = false;
    }
  }

  bindEvents() {
    const canvas = this.renderer.domElement;
    canvas.addEventListener('click', (e) => this.onClick(e));
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
  }

  updateMouse(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  getIntersectedCell() {
    if (!this.editMode) return null;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // First check against existing cells (to allow toggling them off)
    const cellIntersects = this.raycaster.intersectObject(this.cellRenderer.mesh);
    if (cellIntersects.length > 0) {
      const point = cellIntersects[0].point;
      const gridCoords = this.cellRenderer.worldToGrid(point.x, point.y, point.z);
      // Only return if on current edit plane
      if (gridCoords.y === this.editZ) {
        return gridCoords;
      }
    }

    // Then check against the edit plane for adding new cells
    const planeIntersects = this.raycaster.intersectObject(this.editPlane);
    if (planeIntersects.length > 0) {
      const point = planeIntersects[0].point;

      // Convert world position to grid coordinates
      const x = Math.round((point.x - this.offset) / CELL_SPACING);
      const z = Math.round((point.z - this.offset) / CELL_SPACING);

      // Clamp to valid grid coordinates
      if (x >= 0 && x < GRID_SIZE && z >= 0 && z < GRID_SIZE) {
        return { x, y: this.editZ, z };
      }
    }

    return null;
  }

  onClick(event) {
    if (!this.editMode) return;

    this.updateMouse(event);
    const cell = this.getIntersectedCell();

    if (cell) {
      this.grid.toggleCell(cell.x, cell.y, cell.z);
      this.onUpdate();
    }
  }

  onMouseMove(event) {
    if (!this.editMode) {
      this.hoverIndicator.visible = false;
      return;
    }

    this.updateMouse(event);
    const cell = this.getIntersectedCell();

    if (cell) {
      const world = this.cellRenderer.gridToWorld(cell.x, cell.y, cell.z);
      this.hoverIndicator.position.set(world.x, world.y, world.z);
      this.hoverIndicator.visible = true;
    } else {
      this.hoverIndicator.visible = false;
    }
  }

  dispose() {
    this.scene.remove(this.editPlane);
    this.scene.remove(this.editGrid);
    this.scene.remove(this.hoverIndicator);
    this.editPlane.geometry.dispose();
    this.editPlane.material.dispose();
    this.editGrid.geometry.dispose();
    this.editGrid.material.dispose();
    this.hoverIndicator.geometry.dispose();
    this.hoverIndicator.material.dispose();
  }
}
