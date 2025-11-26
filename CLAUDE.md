# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A web-based 3D visualization of Conway's Game of Life using Three.js. Features true 3D cellular automaton rules (6-neighbor Von Neumann neighborhood), interactive camera controls, click-to-toggle cell editing, preset patterns, and configurable birth/survival rules.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

```
src/
├── core/           # Simulation logic
│   ├── Grid3D.js      # Sparse 3D grid (Map-based for efficiency)
│   ├── Rules.js       # Birth/survival rule engine
│   └── Simulation.js  # Generation stepping, timing control
├── renderer/       # Three.js visualization
│   ├── SceneManager.js    # Scene, camera, lights, renderer
│   ├── CellRenderer.js    # InstancedMesh for performance
│   ├── CameraController.js # OrbitControls wrapper
│   └── GridHelper.js      # Boundary wireframe
├── ui/             # DOM-based controls
│   ├── ControlPanel.js    # Play/pause/speed/stats
│   └── CellEditor.js      # Raycasting for click-to-toggle
├── patterns/       # Preset 3D patterns
└── utils/          # Constants and configuration
```

## Key Implementation Details

- **Grid**: 32x32x32 toroidal (wrap-around edges), sparse Map storage
- **Rules**: 6-neighbor (faces only), default 4/4 Life (birth=4, survive=4)
- **Rendering**: InstancedMesh for single draw call with thousands of cells
- **Loops**: Render at 60fps (requestAnimationFrame), simulation at configurable speed (setInterval)

## License

Apache License 2.0
