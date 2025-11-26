// Preset 3D patterns for Game of Life
// Coordinates are relative to center of grid

export const PATTERN_PRESETS = {
  // Simple stable structure
  'Cube 2x2x2': [
    { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }, { x: 1, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 }, { x: 1, y: 0, z: 1 },
    { x: 0, y: 1, z: 1 }, { x: 1, y: 1, z: 1 }
  ],

  // Cross shape (7 cells)
  'Cross': [
    { x: 0, y: 0, z: 0 },  // center
    { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },  // X axis
    { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },  // Y axis
    { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }   // Z axis
  ],

  // Line of 3 (potential oscillator)
  'Line 3': [
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 }
  ],

  // Line of 5
  'Line 5': [
    { x: -2, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 }
  ],

  // 3D L-shape
  'L Shape': [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 }
  ],

  // Diagonal line
  'Diagonal': [
    { x: -2, y: -2, z: -2 },
    { x: -1, y: -1, z: -1 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 1, z: 1 },
    { x: 2, y: 2, z: 2 }
  ],

  // Small cluster
  'Cluster': [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 1, z: 1 }
  ],

  // Ring in XY plane
  'Ring': [
    { x: 0, y: -2, z: 0 },
    { x: 1, y: -1, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: 1, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 },
    { x: -1, y: 1, z: 0 },
    { x: -2, y: 0, z: 0 },
    { x: -1, y: -1, z: 0 }
  ],

  // Glider attempt (may or may not work with 3D rules)
  'Glider Seed': [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: 2, y: 1, z: 0 },
    { x: 1, y: 2, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 }
  ],

  // Hollow cube
  'Hollow Cube': [
    // Bottom face
    { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 }, { x: 2, y: 1, z: 0 },
    { x: 0, y: 2, z: 0 }, { x: 1, y: 2, z: 0 }, { x: 2, y: 2, z: 0 },
    // Middle edges
    { x: 0, y: 0, z: 1 }, { x: 2, y: 0, z: 1 },
    { x: 0, y: 2, z: 1 }, { x: 2, y: 2, z: 1 },
    // Top face
    { x: 0, y: 0, z: 2 }, { x: 1, y: 0, z: 2 }, { x: 2, y: 0, z: 2 },
    { x: 0, y: 1, z: 2 }, { x: 2, y: 1, z: 2 },
    { x: 0, y: 2, z: 2 }, { x: 1, y: 2, z: 2 }, { x: 2, y: 2, z: 2 }
  ]
};

// Get list of pattern names
export function getPatternNames() {
  return Object.keys(PATTERN_PRESETS);
}

// Get pattern by name
export function getPattern(name) {
  return PATTERN_PRESETS[name] || [];
}
