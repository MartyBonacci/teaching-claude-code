import { MIN_SPEED, MAX_SPEED, RULE_PRESETS, GRID_SIZE } from '../utils/constants.js';
import { getPatternNames, getPattern } from '../patterns/presets.js';

export class ControlPanel {
  constructor(container, simulation, onUpdate, onEditModeChange, onEditZChange) {
    this.container = container;
    this.simulation = simulation;
    this.onUpdate = onUpdate;
    this.onEditModeChange = onEditModeChange;
    this.onEditZChange = onEditZChange;
    this.editMode = false;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="control-panel">
        <h3>Simulation</h3>
        <div class="control-row">
          <button class="btn btn-icon" id="playPauseBtn" title="Play/Pause (Space)">▶</button>
          <button class="btn btn-icon" id="stepBtn" title="Step (→)">⏭</button>
          <button class="btn" id="resetBtn" title="Reset (R)">Reset</button>
        </div>
        <div class="control-row">
          <label>Speed</label>
          <input type="range" id="speedSlider" min="${MIN_SPEED}" max="${MAX_SPEED}" value="${this.simulation.speed}">
          <span id="speedValue" class="stat-value">${this.simulation.speed}</span>
        </div>
        <div class="control-row">
          <span class="stat">Gen: <span id="genValue" class="stat-value">0</span></span>
          <span class="stat">Pop: <span id="popValue" class="stat-value">0</span></span>
        </div>
      </div>

      <div class="control-panel">
        <h3>Patterns</h3>
        <div class="control-row">
          <select id="patternSelect">
            ${getPatternNames().map(name => `<option value="${name}">${name}</option>`).join('')}
          </select>
          <button class="btn" id="loadPatternBtn">Load</button>
        </div>
        <div class="control-row">
          <label>Random</label>
          <input type="range" id="densitySlider" min="5" max="30" value="10">
          <button class="btn" id="randomBtn">Fill</button>
        </div>
      </div>

      <div class="control-panel">
        <h3>Rules</h3>
        <div class="control-row">
          <select id="ruleSelect">
            ${Object.keys(RULE_PRESETS).map(name => `<option value="${name}">${name}</option>`).join('')}
          </select>
        </div>
        <div class="control-row">
          <span class="stat">Rule: <span id="ruleValue" class="stat-value">${this.simulation.rules.getRuleString()}</span></span>
        </div>
      </div>

      <div class="control-panel">
        <h3>Edit Mode</h3>
        <div class="control-row">
          <button class="btn" id="editModeBtn">Edit: OFF</button>
        </div>
        <div class="control-row">
          <label>Y-Layer</label>
          <input type="range" id="editZSlider" min="0" max="${GRID_SIZE - 1}" value="${Math.floor(GRID_SIZE / 2)}">
          <span id="editZValue" class="stat-value">${Math.floor(GRID_SIZE / 2)}</span>
        </div>
        <div class="control-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="stat">Enable edit mode to add/remove cells</span>
          <span class="stat">Click on the green plane to toggle</span>
        </div>
      </div>

      <div class="control-panel">
        <h3>Camera</h3>
        <div class="control-row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
          <span class="stat">Drag: Rotate</span>
          <span class="stat">Scroll: Zoom</span>
          <span class="stat">Right-drag: Pan</span>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Play/Pause
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.addEventListener('click', () => {
      this.simulation.toggle();
      this.updatePlayButton();
    });

    // Step
    document.getElementById('stepBtn').addEventListener('click', () => {
      this.simulation.step();
      this.onUpdate();
    });

    // Reset
    document.getElementById('resetBtn').addEventListener('click', () => {
      this.simulation.reset();
      this.onUpdate();
    });

    // Speed slider
    const speedSlider = document.getElementById('speedSlider');
    speedSlider.addEventListener('input', (e) => {
      const speed = parseInt(e.target.value);
      this.simulation.setSpeed(speed);
      document.getElementById('speedValue').textContent = speed;
    });

    // Pattern selection
    document.getElementById('loadPatternBtn').addEventListener('click', () => {
      const patternName = document.getElementById('patternSelect').value;
      const pattern = getPattern(patternName);
      this.simulation.loadPattern(pattern);
      this.onUpdate();
    });

    // Random fill
    document.getElementById('randomBtn').addEventListener('click', () => {
      const density = parseInt(document.getElementById('densitySlider').value) / 100;
      this.simulation.randomFill(density);
      this.onUpdate();
    });

    // Rule selection
    document.getElementById('ruleSelect').addEventListener('change', (e) => {
      this.simulation.setRule(e.target.value);
      document.getElementById('ruleValue').textContent = this.simulation.rules.getRuleString();
    });

    // Edit mode toggle
    document.getElementById('editModeBtn').addEventListener('click', () => {
      this.editMode = !this.editMode;
      this.updateEditModeButton();
      if (this.onEditModeChange) {
        this.onEditModeChange(this.editMode);
      }
    });

    // Edit Z layer slider
    document.getElementById('editZSlider').addEventListener('input', (e) => {
      const z = parseInt(e.target.value);
      document.getElementById('editZValue').textContent = z;
      if (this.onEditZChange) {
        this.onEditZChange(z);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this.simulation.toggle();
          this.updatePlayButton();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.simulation.step();
          this.onUpdate();
          break;
        case 'KeyR':
          this.simulation.reset();
          this.onUpdate();
          break;
        case 'KeyE':
          this.editMode = !this.editMode;
          this.updateEditModeButton();
          if (this.onEditModeChange) {
            this.onEditModeChange(this.editMode);
          }
          break;
      }
    });
  }

  updateEditModeButton() {
    const btn = document.getElementById('editModeBtn');
    btn.textContent = this.editMode ? 'Edit: ON' : 'Edit: OFF';
    btn.style.background = this.editMode ? 'rgba(0, 255, 136, 0.4)' : '';
  }

  updatePlayButton() {
    const btn = document.getElementById('playPauseBtn');
    btn.textContent = this.simulation.isRunning ? '⏸' : '▶';
  }

  updateStats() {
    const stats = this.simulation.getStats();
    document.getElementById('genValue').textContent = stats.generation;
    document.getElementById('popValue').textContent = stats.population;
  }
}
