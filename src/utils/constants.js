// Grid configuration
export const GRID_SIZE = 32;
export const CELL_SIZE = 0.9;
export const CELL_SPACING = 1.0;

// 26-neighbor offsets (Moore neighborhood - all adjacent cells including diagonals)
export const NEIGHBOR_OFFSETS = [];
for (let dx = -1; dx <= 1; dx++) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dz = -1; dz <= 1; dz++) {
      if (dx !== 0 || dy !== 0 || dz !== 0) {
        NEIGHBOR_OFFSETS.push([dx, dy, dz]);
      }
    }
  }
}

// Rule presets for 3D Game of Life (26-neighbor Moore neighborhood)
// These rules are known to produce long-lasting, interesting patterns
export const RULE_PRESETS = {
  '4-5/5 Pyroclastic': { birth: [4, 5], survival: [5] },              // Explosive growth then stabilizes
  '5-7/5-8 445': { birth: [5, 6, 7], survival: [5, 6, 7, 8] },        // Long-lasting organic shapes
  '6-7/5-7 Builder': { birth: [6, 7], survival: [5, 6, 7] },          // Builds stable structures
  '4-6/4-6 Symmetry': { birth: [4, 5, 6], survival: [4, 5, 6] },      // Symmetric patterns
  '5-6/4-7 Amoeba': { birth: [5, 6], survival: [4, 5, 6, 7] },        // Organic, shifting shapes
  '4/5-8 Crystal': { birth: [4], survival: [5, 6, 7, 8] },            // Crystal-like stable growth
  '6-9/4-9 Sponge': { birth: [6, 7, 8, 9], survival: [4, 5, 6, 7, 8, 9] } // Spongy, porous structures
};

// Default rule - known to produce long-lasting patterns
export const DEFAULT_RULE = '5-6/4-7 Amoeba';

// Simulation defaults
export const DEFAULT_SPEED = 4; // Generations per second
export const MIN_SPEED = 1;
export const MAX_SPEED = 30;

// Colors
export const CELL_COLOR = 0x00ff88;
export const GRID_COLOR = 0x444466;
export const BACKGROUND_COLOR = 0x1a1a2e;
