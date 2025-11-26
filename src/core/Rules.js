import { RULE_PRESETS, DEFAULT_RULE, NEIGHBOR_OFFSETS } from '../utils/constants.js';

export class Rules {
  constructor() {
    this.presets = RULE_PRESETS;
    this.setRule(DEFAULT_RULE);
  }

  // Set rule by preset name
  setRule(presetName) {
    const preset = this.presets[presetName];
    if (preset) {
      this.birth = new Set(preset.birth);
      this.survival = new Set(preset.survival);
      this.currentPreset = presetName;
    }
  }

  // Set custom rule
  setCustomRule(birthCounts, survivalCounts) {
    this.birth = new Set(birthCounts);
    this.survival = new Set(survivalCounts);
    this.currentPreset = 'Custom';
  }

  // Determine if cell should be alive next generation
  getNextState(isAlive, neighborCount) {
    if (isAlive) {
      return this.survival.has(neighborCount);
    } else {
      return this.birth.has(neighborCount);
    }
  }

  // Get all cells that need to be checked (live cells + their neighbors)
  getCellsToCheck(grid) {
    const toCheck = new Set();

    for (const { x, y, z } of grid.getLiveCells()) {
      // Add the live cell itself
      toCheck.add(grid.getKey(x, y, z));

      // Add all neighbors
      for (const [dx, dy, dz] of NEIGHBOR_OFFSETS) {
        const nx = grid.wrap(x + dx);
        const ny = grid.wrap(y + dy);
        const nz = grid.wrap(z + dz);
        toCheck.add(grid.getKey(nx, ny, nz));
      }
    }

    return toCheck;
  }

  // Get formatted rule string (e.g., "B4/S4")
  getRuleString() {
    const birth = [...this.birth].sort().join('');
    const survival = [...this.survival].sort().join('');
    return `B${birth}/S${survival}`;
  }

  // Get list of preset names
  getPresetNames() {
    return Object.keys(this.presets);
  }
}
