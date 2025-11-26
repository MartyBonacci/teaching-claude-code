import { SceneManager } from './renderer/SceneManager.js';
import { CameraController } from './renderer/CameraController.js';
import { GridHelper } from './renderer/GridHelper.js';
import { CellRenderer } from './renderer/CellRenderer.js';
import { Simulation } from './core/Simulation.js';
import { ControlPanel } from './ui/ControlPanel.js';
import { CellEditor } from './ui/CellEditor.js';

class App {
  constructor() {
    this.init();
  }

  init() {
    // Get DOM elements
    const canvas = document.getElementById('canvas');
    const controlsContainer = document.getElementById('controls');

    // Initialize Three.js scene
    this.sceneManager = new SceneManager(canvas);
    this.cameraController = new CameraController(
      this.sceneManager.camera,
      this.sceneManager.renderer.domElement
    );
    this.gridHelper = new GridHelper(this.sceneManager.scene);

    // Initialize simulation
    this.simulation = new Simulation();

    // Initialize cell renderer
    this.cellRenderer = new CellRenderer(this.sceneManager.scene);

    // Initialize cell editor (click to toggle)
    this.cellEditor = new CellEditor(
      this.sceneManager.scene,
      this.sceneManager.camera,
      this.sceneManager.renderer,
      this.simulation.grid,
      this.cellRenderer,
      () => this.updateVisuals()
    );

    // Initialize UI with edit mode callbacks
    this.controlPanel = new ControlPanel(
      controlsContainer,
      this.simulation,
      () => this.updateVisuals(),
      (editMode) => this.setEditMode(editMode),
      (z) => this.cellEditor.setEditZ(z)
    );

    // Set up simulation update callback
    this.simulation.onUpdate = () => this.updateVisuals();

    // Load initial pattern
    this.simulation.randomFill(0.15);
    this.updateVisuals();

    // Start render loop
    this.animate();
  }

  setEditMode(enabled) {
    this.cellEditor.setEditMode(enabled);
    if (enabled) {
      this.cameraController.disable();
    } else {
      this.cameraController.enable();
    }
  }

  updateVisuals() {
    this.cellRenderer.update(this.simulation.grid.getLiveCells());
    this.controlPanel.updateStats();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Update camera controls
    this.cameraController.update();

    // Render scene
    this.sceneManager.render();
  }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
