import { Grid3D } from './Grid3D.js';
import { Rules } from './Rules.js';
import { DEFAULT_SPEED } from '../utils/constants.js';

export class Simulation {
  constructor() {
    this.grid = new Grid3D();
    this.rules = new Rules();
    this.generation = 0;
    this.isRunning = false;
    this.speed = DEFAULT_SPEED;
    this.intervalId = null;
    this.onUpdate = null; // Callback for when grid updates
  }

  // Advance one generation
  step() {
    const cellsToCheck = this.rules.getCellsToCheck(this.grid);
    const newGrid = new Grid3D(this.grid.size);

    for (const key of cellsToCheck) {
      const { x, y, z } = this.grid.parseKey(key);
      const isAlive = this.grid.isAlive(x, y, z);
      const neighborCount = this.grid.getNeighborCount(x, y, z);
      const nextState = this.rules.getNextState(isAlive, neighborCount);

      if (nextState) {
        newGrid.setCell(x, y, z, true);
      }
    }

    this.grid = newGrid;
    this.generation++;

    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  // Start continuous simulation
  play() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.step();
    }, 1000 / this.speed);
  }

  // Pause simulation
  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Toggle play/pause
  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.play();
    }
  }

  // Set simulation speed (generations per second)
  setSpeed(speed) {
    this.speed = speed;

    // Restart interval if running
    if (this.isRunning) {
      this.pause();
      this.play();
    }
  }

  // Reset to generation 0
  reset() {
    this.pause();
    this.grid.clear();
    this.generation = 0;

    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  // Set rule by preset name
  setRule(presetName) {
    this.rules.setRule(presetName);
  }

  // Set custom rule
  setCustomRule(birth, survival) {
    this.rules.setCustomRule(birth, survival);
  }

  // Load preset pattern
  loadPattern(pattern) {
    this.pause();
    this.grid.loadPattern(pattern);
    this.generation = 0;

    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  // Random fill
  randomFill(density) {
    this.pause();
    this.grid.randomFill(density);
    this.generation = 0;

    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  // Get current stats
  getStats() {
    return {
      generation: this.generation,
      population: this.grid.getPopulation(),
      rule: this.rules.getRuleString(),
      isRunning: this.isRunning,
      speed: this.speed
    };
  }
}
