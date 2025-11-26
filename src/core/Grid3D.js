import { GRID_SIZE, NEIGHBOR_OFFSETS } from '../utils/constants.js';

export class Grid3D {
  constructor(size = GRID_SIZE) {
    this.size = size;
    this.cells = new Map(); // Sparse storage: "x,y,z" -> true
  }

  // Create key for map lookup
  getKey(x, y, z) {
    return `${x},${y},${z}`;
  }

  // Parse key back to coordinates
  parseKey(key) {
    const [x, y, z] = key.split(',').map(Number);
    return { x, y, z };
  }

  // Wrap coordinate for toroidal boundaries
  wrap(coord) {
    return ((coord % this.size) + this.size) % this.size;
  }

  // Check if cell is alive
  isAlive(x, y, z) {
    return this.cells.has(this.getKey(this.wrap(x), this.wrap(y), this.wrap(z)));
  }

  // Set cell state
  setCell(x, y, z, alive) {
    const key = this.getKey(this.wrap(x), this.wrap(y), this.wrap(z));
    if (alive) {
      this.cells.set(key, true);
    } else {
      this.cells.delete(key);
    }
  }

  // Toggle cell state
  toggleCell(x, y, z) {
    const alive = this.isAlive(x, y, z);
    this.setCell(x, y, z, !alive);
    return !alive;
  }

  // Count live neighbors (6-neighbor Von Neumann)
  getNeighborCount(x, y, z) {
    let count = 0;
    for (const [dx, dy, dz] of NEIGHBOR_OFFSETS) {
      if (this.isAlive(x + dx, y + dy, z + dz)) {
        count++;
      }
    }
    return count;
  }

  // Get all live cells as array of {x, y, z}
  getLiveCells() {
    const cells = [];
    for (const key of this.cells.keys()) {
      cells.push(this.parseKey(key));
    }
    return cells;
  }

  // Get count of live cells
  getPopulation() {
    return this.cells.size;
  }

  // Clear all cells
  clear() {
    this.cells.clear();
  }

  // Clone the grid
  clone() {
    const newGrid = new Grid3D(this.size);
    for (const key of this.cells.keys()) {
      newGrid.cells.set(key, true);
    }
    return newGrid;
  }

  // Fill grid randomly with given density (0-1)
  randomFill(density = 0.1) {
    this.clear();
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        for (let z = 0; z < this.size; z++) {
          if (Math.random() < density) {
            this.setCell(x, y, z, true);
          }
        }
      }
    }
  }

  // Load pattern at center of grid
  loadPattern(pattern) {
    this.clear();
    const offset = Math.floor(this.size / 2);
    for (const { x, y, z } of pattern) {
      this.setCell(x + offset, y + offset, z + offset, true);
    }
  }
}
