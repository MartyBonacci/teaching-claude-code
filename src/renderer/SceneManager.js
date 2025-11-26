import * as THREE from 'three';
import { BACKGROUND_COLOR, GRID_SIZE } from '../utils/constants.js';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(BACKGROUND_COLOR);

    this.setupCamera();
    this.setupRenderer();
    this.setupLighting();
    this.setupResizeHandler();
  }

  setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);

    // Position camera to see entire grid
    const distance = GRID_SIZE * 1.5;
    this.camera.position.set(distance, distance * 0.8, distance);
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setupLighting() {
    // Ambient light for base illumination
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    // Main directional light
    const directional = new THREE.DirectionalLight(0xffffff, 0.8);
    directional.position.set(GRID_SIZE, GRID_SIZE * 2, GRID_SIZE);
    this.scene.add(directional);

    // Fill light from opposite side
    const fill = new THREE.DirectionalLight(0xffffff, 0.3);
    fill.position.set(-GRID_SIZE, -GRID_SIZE, -GRID_SIZE);
    this.scene.add(fill);
  }

  setupResizeHandler() {
    this.onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    };

    window.addEventListener('resize', this.onResize);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
