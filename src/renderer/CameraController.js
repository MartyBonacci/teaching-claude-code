import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GRID_SIZE } from '../utils/constants.js';

export class CameraController {
  constructor(camera, domElement) {
    this.controls = new OrbitControls(camera, domElement);

    // Enable damping for smooth movement
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // Set zoom limits
    this.controls.minDistance = GRID_SIZE * 0.5;
    this.controls.maxDistance = GRID_SIZE * 4;

    // Set pan limits
    this.controls.enablePan = true;
    this.controls.panSpeed = 0.8;

    // Set rotation speed
    this.controls.rotateSpeed = 0.8;

    // Store initial position for reset
    this.initialPosition = camera.position.clone();
    this.initialTarget = this.controls.target.clone();
  }

  update() {
    this.controls.update();
  }

  reset() {
    this.controls.target.copy(this.initialTarget);
    this.controls.object.position.copy(this.initialPosition);
    this.controls.update();
  }

  enable() {
    this.controls.enabled = true;
  }

  disable() {
    this.controls.enabled = false;
  }

  isEnabled() {
    return this.controls.enabled;
  }

  dispose() {
    this.controls.dispose();
  }
}
