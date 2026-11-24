/**
 * Half Baked Words - Core Game Logic & UI Engine
 */

// --- Sound Synthesizer (Web Audio API) ---
class BakeryAudio {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('hbw_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('hbw_muted', this.muted);
    return this.muted;
  }

  playCrunch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Noise buffer for crunchy bite
    const bufferSize = this.ctx.sampleRate * 0.22;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(450, now + 0.18);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    // Sub thump for jaw bite
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noise.start(now);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playNibble() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.14;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(1000, now + 0.12);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  playDing() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Golden oven bell chime
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.06);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  playTap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    notes.forEach((freq, idx) => {
      const now = this.ctx.currentTime + idx * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });
  }
}

// --- Crumb Particle Physics Simulation ---
class CrumbSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawnCrumbs(x, y, count = 35) {
    const doughColors = ['#f3cca0', '#e3a869', '#c4803d', '#9e6328'];
    const chipColors = ['#2e1508', '#42200f', '#572d17'];

    for (let i = 0; i < count; i++) {
      const isChip = Math.random() < 0.28;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 2.5;
      const size = isChip ? (Math.random() * 4 + 2) : (Math.random() * 5 + 1.5);
      const color = isChip ? 
        chipColors[Math.floor(Math.random() * chipColors.length)] : 
        doughColors[Math.floor(Math.random() * doughColors.length)];

      this.particles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        gravity: 0.28,
        drag: 0.98,
        size: size,
        color: color,
        isChip: isChip,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.015 + 0.018
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  loop() {
    if (this.particles.length === 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animating = false;
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;
      p.alpha = Math.max(0, p.life);

      if (p.alpha <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;

      if (p.isChip) {
        // Organic chip shape
        this.ctx.beginPath();
        this.ctx.roundRect(-p.size/2, -p.size/2, p.size, p.size, p.size*0.3);
        this.ctx.fill();
      } else {
        // Dough crumb chunk
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }
}

// --- Letter Transformation Rules ---
const NIBBLE_RULES = {
  A: [{ to: 'V', type: 'nibble_rotate', label: 'Nibble & Rotate to V', desc: 'Bites top crossbar, flips upside down' }],
  B: [
    { to: 'P', type: 'nibble', label: 'Nibble to P', desc: 'Bites off bottom loop' },
    { to: 'R', type: 'nibble', label: 'Nibble to R', desc: 'Nibbles bottom loop opening' },
    { to: 'E', type: 'nibble', label: 'Nibble to E', desc: 'Nibbles loops into arms' },
    { to: 'F', type: 'nibble', label: 'Nibble to F', desc: 'Bites bottom completely' },
    { to: 'I', type: 'nibble', label: 'Nibble to I', desc: 'Bites all side loops' }
  ],
  D: [{ to: 'C', type: 'nibble_rotate', label: 'Nibble & Rotate to C', desc: 'Bites vertical backbone and rotates' }],
  E: [
    { to: 'F', type: 'nibble', label: 'Nibble to F', desc: 'Bites off bottom foot' },
    { to: 'L', type: 'nibble', label: 'Nibble to L', desc: 'Bites top & middle arms' },
    { to: 'I', type: 'nibble', label: 'Nibble to I', desc: 'Bites all three horizontal arms' }
  ],
  G: [{ to: 'C', type: 'nibble', label: 'Nibble to C', desc: 'Bites off inner hook' }],
  H: [{ to: ['I', 'I'], type: 'split', label: 'Split into two I cookies', desc: 'Bites crossbar in half: 2 cookies!' }],
  K: [{ to: 'I', type: 'nibble', label: 'Nibble to I', desc: 'Bites off diagonal arms' }],
  L: [{ to: 'I', type: 'nibble', label: 'Nibble to I', desc: 'Bites off horizontal base' }],
  M: [
    { to: 'V', type: 'nibble', label: 'Nibble to V', desc: 'Bites outside vertical legs' },
    { to: 'N', type: 'nibble', label: 'Nibble to N', desc: 'Bites one right-side leg' },
    { to: 'W', type: 'rotate', label: 'Rotate to W (Free!)', desc: 'Turn upside down (no bite cost!)' }
  ],
  N: [
    { to: 'V', type: 'nibble', label: 'Nibble to V', desc: 'Bites one upright stem' },
    { to: 'Z', type: 'rotate', label: 'Rotate to Z (Free!)', desc: 'Rotate 90 degrees (no bite cost!)' }
  ],
  O: [{ to: 'C', type: 'nibble', label: 'Nibble to C', desc: 'Takes a chomp out of right curve' }],
  P: [
    { to: 'F', type: 'nibble', label: 'Nibble to F', desc: 'Bites open loop into two arms' },
    { to: 'I', type: 'nibble', label: 'Nibble to I', desc: 'Bites off top loop' }
  ],
  Q: [
    { to: 'O', type: 'nibble', label: 'Nibble to O', desc: 'Bites off little tail' },
    { to: 'C', type: 'nibble', label: 'Nibble to C', desc: 'Bites side curve & tail' }
  ],
  R: [
    { to: 'F', type: 'nibble', label: 'Nibble to F', desc: 'Bites diagonal leg & opens loop' },
    { to: 'I', type: 'nibble', label: 'Nibble to I', desc: 'Bites loop and diagonal leg' },
    { to: 'P', type: 'nibble', label: 'Nibble to P', desc: 'Bites off diagonal leg' }
  ],
  T: [
    { to: 'L', type: 'nibble_rotate', label: 'Nibble & Rotate to L', desc: 'Bites one half of top bar & rotates' },
    { to: 'I', type: 'nibble', label: 'Nibble to I', desc: 'Bites entire top crossbar' }
  ],
  U: [{ to: 'J', type: 'nibble', label: 'Nibble to J', desc: 'Bites left top arm' }],
  V: [{ to: 'I', type: 'nibble', label: 'Nibble to I', desc: 'Bites one diagonal stem' }],
  W: [
    { to: ['V', 'V'], type: 'split', label: 'Split into two V cookies', desc: 'Bites middle seam: 2 cookies!' },
    { to: 'M', type: 'rotate', label: 'Rotate to M (Free!)', desc: 'Turn upside down (no bite cost!)' }
  ],
  X: [{ to: 'Y', type: 'nibble', label: 'Nibble to Y', desc: 'Bites off bottom-left leg' }],
  Z: [{ to: 'N', type: 'rotate', label: 'Rotate to N (Free!)', desc: 'Rotate 90 degrees (no bite cost!)' }]
};

// Letter Scores
const LETTER_POINTS = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8,
  K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1,
  U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

// Seeded PRNG (Mulberry32)
function mulberry32(a) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate Date Seed
function getDateSeed(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Cookie SVG letter renderer
function renderCookieSvg(letter, isNibbled = false, rotationDeg = 0) {
  // Deterministic seed for chocolate chip positions per letter
  const code = letter.charCodeAt(0);
  const chip1X = 24 + ((code * 7) % 20);
  const chip1Y = 22 + ((code * 11) % 18);
  const chip2X = 36 + ((code * 13) % 16);
  const chip2Y = 40 + ((code * 5) % 18);
  const chip3X = 20 + ((code * 17) % 18);
  const chip3Y = 42 + ((code * 3) % 16);

  const biteMarkup = isNibbled ? `
    <g class="cookie-bite-mark">
      <circle cx="58" cy="18" r="9" fill="#fdf5e6" />
      <circle cx="62" cy="28" r="7" fill="#fdf5e6" />
      <circle cx="56" cy="34" r="8" fill="#fdf5e6" />
      <!-- exposed crumb teeth dots -->
      <circle cx="50" cy="20" r="1.5" fill="#8f501e" />
      <circle cx="53" cy="28" r="1.2" fill="#542e12" />
      <circle cx="49" cy="32" r="1.4" fill="#8f501e" />
    </g>
  ` : '';

  return `
    <svg class="cookie-svg" viewBox="0 0 70 70" style="transform: rotate(${rotationDeg}deg)">
      <defs>
        <radialGradient id="doughGrad-${letter}" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#f8dcaf" />
          <stop offset="45%" stop-color="#e8ae6f" />
          <stop offset="85%" stop-color="#cb8a46" />
          <stop offset="100%" stop-color="#9b5f25" />
        </radialGradient>
        <filter id="shadow3d" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="1" dy="3" stdDeviation="2" flood-color="rgba(40,15,5,0.45)" />
        </filter>
        <radialGradient id="chipGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#5a2e16" />
          <stop offset="60%" stop-color="#341808" />
          <stop offset="100%" stop-color="#180b03" />
        </radialGradient>
      </defs>

      <!-- Main Cookie Biscuit Body -->
      <rect x="6" y="6" width="58" height="58" rx="18" fill="url(#doughGrad-${letter})" filter="url(#shadow3d)" stroke="#925723" stroke-width="2.5" />
      
      <!-- Biscuit Edge Texture / Crust speckles -->
      <circle cx="14" cy="14" r="1.5" fill="#a46933" opacity="0.6"/>
      <circle cx="56" cy="14" r="1.2" fill="#a46933" opacity="0.6"/>
      <circle cx="14" cy="56" r="1.2" fill="#a46933" opacity="0.6"/>
      <circle cx="56" cy="56" r="1.5" fill="#a46933" opacity="0.6"/>

      <!-- Chocolate Chips -->
      <ellipse cx="${chip1X}" cy="${chip1Y}" rx="3.5" ry="3.2" fill="url(#chipGrad)" />
      <ellipse cx="${chip2X}" cy="${chip2Y}" rx="4" ry="3.5" fill="url(#chipGrad)" />
      <ellipse cx="${chip3X}" cy="${chip3Y}" rx="3.2" ry="3.8" fill="url(#chipGrad)" />
      <!-- Chip highlights -->
      <circle cx="${chip1X - 1}" cy="${chip1Y - 1}" r="1" fill="#7d4422" opacity="0.8" />
      <circle cx="${chip2X - 1.2}" cy="${chip2Y - 1}" r="1.2" fill="#7d4422" opacity="0.8" />

      <!-- Cookie Cutout / Embossed Letter -->
      <text x="35" y="47" text-anchor="middle" font-family="'Fredoka', Arial Black, sans-serif" font-size="34" font-weight="900" fill="#44210c" stroke="#2a1205" stroke-width="1.2" opacity="0.95" style="letter-spacing: -1px;">${letter}</text>

      <!-- Nibbled bite mark (if transformed) -->
      ${biteMarkup}
    </svg>
  `;
}

// --- Main Game Engine ---
class HalfBakedWordsGame {
  constructor() {
    this.audio = new BakeryAudio();
    this.crumbCanvas = document.getElementById('crumb-canvas');
    this.crumbs = new CrumbSystem(this.crumbCanvas);

    // Dictionary structures
    this.wordSet = null;
    this.trie = null;

    // Game state
    this.mode = 'daily'; // 'daily' or 'free'
    this.currentDateStr = getDateSeed();
    this.score = 0;
    this.bakedWords = [];
    this.trayCookies = []; // array of { id, letter, isNibbled, rotation }
    this.rackCookies = []; // array of cookie ids currently on the rack
    this.bitesRemaining = 0;
    this.state = 'PLAYING'; // 'PLAYING', 'BITE_PHASE', 'GAME_OVER'
    this.selectedCookieForBite = null;

    // Drag & Drop tracking
    this.dragTargetId = null;
    this.dragGhost = null;

    this.initDictionary();
    this.setupUI();
    this.startNewGame(this.mode);
  }

  // Load Dictionary and build fast Trie
  initDictionary() {
    if (typeof RAW_WORDS !== 'undefined') {
      const words = RAW_WORDS.split(' ');
      this.wordSet = new Set(words);
      this.buildTrie(words);
    } else {
      console.error('RAW_WORDS dictionary not loaded!');
      this.wordSet = new Set();
      this.trie = {};
    }
  }

  buildTrie(words) {
    this.trie = {};
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      let curr = this.trie;
      for (let j = 0; j < w.length; j++) {
        const ch = w[j];
        if (!curr[ch]) curr[ch] = {};
        curr = curr[ch];
      }
      curr.$ = 1;
    }
  }

  // Check if any valid word of length >= 4 can be made with current cookies
  canFormAnyWord(cookies) {
    if (!this.trie || cookies.length < 4) return false;

    // Build letter frequency map, taking into account rotatable options
    // M can be W, W can be M, N can be Z, Z can be N
    const counts = {};
    for (const c of cookies) {
      counts[c.letter] = (counts[c.letter] || 0) + 1;
    }

    // Also collect all alternative representations due to free rotations
    const rotatable = [];
    for (const c of cookies) {
      if (c.letter === 'M') rotatable.push(['M', 'W']);
      else if (c.letter === 'W') rotatable.push(['W', 'M']);
      else if (c.letter === 'N') rotatable.push(['N', 'Z']);
      else if (c.letter === 'Z') rotatable.push(['Z', 'N']);
      else rotatable.push([c.letter]);
    }

    function dfs(node, depth, currentCounts) {
      if (node.$ && depth >= 4) return true;
      for (const ch in currentCounts) {
        if (currentCounts[ch] > 0 && node[ch]) {
          currentCounts[ch]--;
          if (dfs(node[ch], depth + 1, currentCounts)) {
            currentCounts[ch]++;
            return true;
          }
          currentCounts[ch]++;
        }
      }
      return false;
    }

    // Quick direct check first
    if (dfs(this.trie, 0, { ...counts })) return true;

    // If rotatable letters exist, check permutations with rotated versions
    const hasRot = cookies.some(c => ['M', 'W', 'N', 'Z'].includes(c.letter));
    if (hasRot) {
      // Test rotated combinations
      const altCounts = { ...counts };
      if (altCounts['M']) { altCounts['W'] = (altCounts['W'] || 0) + altCounts['M']; delete altCounts['M']; }
      if (dfs(this.trie, 0, altCounts)) return true;

      const altCounts2 = { ...counts };
      if (altCounts2['W']) { altCounts2['M'] = (altCounts2['M'] || 0) + altCounts2['W']; delete altCounts2['W']; }
      if (dfs(this.trie, 0, altCounts2)) return true;

      const altCounts3 = { ...counts };
      if (altCounts3['N']) { altCounts3['Z'] = (altCounts3['Z'] || 0) + altCounts3['N']; delete altCounts3['N']; }
      if (dfs(this.trie, 0, altCounts3)) return true;

      const altCounts4 = { ...counts };
      if (altCounts4['Z']) { altCounts4['N'] = (altCounts4['N'] || 0) + altCounts4['Z']; delete altCounts4['Z']; }
      if (dfs(this.trie, 0, altCounts4)) return true;
    }

    return false;
  }

  // Generate 16 balanced cookies
  generateCookies(seedNum) {
    const rng = mulberry32(seedNum);
    
    // Balanced bag
    const vowels = ['A','A','A','A','E','E','E','E','E','E','I','I','I','I','O','O','O','O','U','U','U'];
    const consonants = [
      'B','B','C','C','D','D','D','F','F','G','G','H','H','K','L','L','L','M','M',
      'N','N','N','P','P','Q','R','R','R','S','S','S','T','T','T','V','V','W','W','X','Y','Y','Z'
    ];

    // Pick 5 vowels and 11 consonants
    const picked = [];
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(rng() * vowels.length);
      picked.push(vowels[idx]);
    }
    for (let i = 0; i < 11; i++) {
      const idx = Math.floor(rng() * consonants.length);
      picked.push(consonants[idx]);
    }

    // Shuffle
    for (let i = picked.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [picked[i], picked[j]] = [picked[j], picked[i]];
    }

    return picked.map((letter, idx) => ({
      id: `cookie_${Date.now()}_${idx}`,
      letter: letter,
      isNibbled: false,
      rotation: 0
    }));
  }

  startNewGame(mode = 'daily') {
    this.mode = mode;
    this.score = 0;
    this.bakedWords = [];
    this.rackCookies = [];
    this.bitesRemaining = 0;
    this.state = 'PLAYING';

    let seedInt;
    if (mode === 'daily') {
      seedInt = parseInt(this.currentDateStr.replace(/-/g, ''), 10);
      document.getElementById('mode-badge').textContent = `Daily Bake • ${this.currentDateStr}`;
    } else {
      seedInt = Math.floor(Math.random() * 9999999);
      document.getElementById('mode-badge').textContent = `Free Bake #${Math.floor(seedInt % 1000)}`;
    }

    this.trayCookies = this.generateCookies(seedInt);
    this.updateStats();
    this.render();
    this.showStatus('Drag or tap cookie letters to bake a word (4+ letters)!');
  }

  setupUI() {
    // Buttons
    document.getElementById('btn-sound').addEventListener('click', () => {
      const muted = this.audio.toggleMute();
      document.getElementById('btn-sound').textContent = muted ? '🔇' : '🔊';
    });
    if (this.audio.muted) {
      document.getElementById('btn-sound').textContent = '🔇';
    }

    document.getElementById('btn-rules').addEventListener('click', () => this.openModal('rules-modal'));
    document.getElementById('btn-words-list').addEventListener('click', () => this.openWordsModal());
    document.getElementById('btn-clear-rack').addEventListener('click', () => this.clearRack());
    document.getElementById('btn-give-up').addEventListener('click', () => this.openModal('giveup-modal'));
    document.getElementById('btn-cancel-giveup').addEventListener('click', () => this.closeModal('giveup-modal'));
    document.getElementById('btn-confirm-giveup').addEventListener('click', () => this.giveUp());
    document.getElementById('btn-shuffle-tray').addEventListener('click', () => this.shuffleTray());
    document.getElementById('btn-send-word').addEventListener('click', () => this.sendCurrentWord());
    document.getElementById('btn-play-again').addEventListener('click', () => {
      this.closeModal('gameover-modal');
      this.startNewGame('free');
    });
    document.getElementById('btn-share-result').addEventListener('click', () => this.shareResult());

    // Switch between daily and free play
    document.getElementById('btn-mode-toggle').addEventListener('click', () => {
      const newMode = this.mode === 'daily' ? 'free' : 'daily';
      this.startNewGame(newMode);
    });

    // Close modals on clicking overlay or close button
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const modal = e.target.closest('.modal-overlay');
        if (modal) modal.classList.remove('open');
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('open');
      });
    });

    // Setup drag and drop / pointer events on document
    this.setupPointerEvents();
  }

  setupPointerEvents() {
    let activePointer = null;
    let initialX = 0, initialY = 0;
    let draggedCookie = null;
    let hasMoved = false;

    const handlePointerDown = (e) => {
      if (this.state === 'BITE_PHASE') return; // In bite phase, click is handled separately
      const item = e.target.closest('.cookie-item');
      if (!item) return;

      const cookieId = item.dataset.id;
      draggedCookie = this.getCookieById(cookieId);
      if (!draggedCookie) return;

      activePointer = e.pointerId;
      initialX = e.clientX;
      initialY = e.clientY;
      hasMoved = false;

      // Rotate badge check
      if (e.target.closest('.rotate-badge')) {
        this.rotateCookie(draggedCookie.id);
        return;
      }

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    };

    const handlePointerMove = (e) => {
      if (e.pointerId !== activePointer) return;
      const dx = e.clientX - initialX;
      const dy = e.clientY - initialY;

      if (!hasMoved && Math.hypot(dx, dy) > 8) {
        hasMoved = true;
        // Create ghost
        this.dragGhost = document.createElement('div');
        this.dragGhost.className = 'drag-ghost';
        this.dragGhost.innerHTML = renderCookieSvg(draggedCookie.letter, draggedCookie.isNibbled, draggedCookie.rotation);
        document.body.appendChild(this.dragGhost);
      }

      if (this.dragGhost) {
        this.dragGhost.style.left = `${e.clientX}px`;
        this.dragGhost.style.top = `${e.clientY}px`;
      }
    };

    const handlePointerUp = (e) => {
      if (e.pointerId !== activePointer) return;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      if (this.dragGhost) {
        this.dragGhost.remove();
        this.dragGhost = null;
      }

      if (!hasMoved) {
        // Simple tap: Toggle between tray and rack!
        this.toggleCookiePosition(draggedCookie.id);
      } else {
        // Drag dropped: Check drop target
        const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
        const rackTarget = dropTarget ? dropTarget.closest('.word-rack-section') : null;
        const trayTarget = dropTarget ? dropTarget.closest('.tray-parchment') : null;

        const isInRack = this.rackCookies.includes(draggedCookie.id);

        if (rackTarget && !isInRack) {
          this.moveToRack(draggedCookie.id);
        } else if (trayTarget && isInRack) {
          this.moveToTray(draggedCookie.id);
        } else if (rackTarget && isInRack) {
          // Reorder in rack based on target element
          const targetSlot = dropTarget.closest('.cookie-item');
          if (targetSlot && targetSlot.dataset.id !== draggedCookie.id) {
            const targetId = targetSlot.dataset.id;
            const fromIdx = this.rackCookies.indexOf(draggedCookie.id);
            const toIdx = this.rackCookies.indexOf(targetId);
            if (fromIdx !== -1 && toIdx !== -1) {
              this.rackCookies.splice(fromIdx, 1);
              this.rackCookies.splice(toIdx, 0, draggedCookie.id);
              this.audio.playTap();
              this.render();
            }
          }
        }
      }

      activePointer = null;
      draggedCookie = null;
    };

    document.addEventListener('pointerdown', handlePointerDown);
  }

  getCookieById(id) {
    return this.trayCookies.find(c => c.id === id);
  }

  toggleCookiePosition(id) {
    if (this.rackCookies.includes(id)) {
      this.moveToTray(id);
    } else {
      this.moveToRack(id);
    }
  }

  moveToRack(id) {
    if (!this.rackCookies.includes(id)) {
      this.rackCookies.push(id);
      this.audio.playTap();
      this.render();
    }
  }

  moveToTray(id) {
    const idx = this.rackCookies.indexOf(id);
    if (idx !== -1) {
      this.rackCookies.splice(idx, 1);
      this.audio.playTap();
      this.render();
    }
  }

  clearRack() {
    if (this.rackCookies.length > 0) {
      this.rackCookies = [];
      this.audio.playTap();
      this.render();
    }
  }

  shuffleTray() {
    // Shuffle cookies not in rack
    const available = this.trayCookies.filter(c => !this.rackCookies.includes(c.id));
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }
    // Reassemble
    const inRackCookies = this.trayCookies.filter(c => this.rackCookies.includes(c.id));
    this.trayCookies = [...available, ...inRackCookies];
    this.audio.playTap();
    this.render();
  }

  rotateCookie(id) {
    const cookie = this.getCookieById(id);
    if (!cookie) return;
    if (cookie.letter === 'M') {
      cookie.letter = 'W';
    } else if (cookie.letter === 'W') {
      cookie.letter = 'M';
    } else if (cookie.letter === 'N') {
      cookie.letter = 'Z';
    } else if (cookie.letter === 'Z') {
      cookie.letter = 'N';
    } else {
      cookie.rotation = (cookie.rotation + 90) % 360;
    }
    this.audio.playTap();
    this.render();
  }

  getCurrentWord() {
    return this.rackCookies.map(id => {
      const c = this.getCookieById(id);
      return c ? c.letter : '';
    }).join('');
  }

  calculateWordScore(word) {
    let pts = 0;
    for (let ch of word) {
      pts += (LETTER_POINTS[ch] || 1) * 3;
    }
    // Word length bonus
    if (word.length === 3) pts += 20;
    else if (word.length === 4) pts += 40;
    else if (word.length === 5) pts += 75;
    else if (word.length === 6) pts += 120;
    else if (word.length >= 7) pts += 180 + (word.length - 7) * 50;
    return pts;
  }

  validateRack() {
    const word = this.getCurrentWord();
    const sendBtn = document.getElementById('btn-send-word');
    const hintEl = document.getElementById('rack-hint');

    if (word.length < 4) {
      sendBtn.classList.add('hidden');
      hintEl.className = 'word-validation-hint';
      hintEl.textContent = word.length > 0 ? `${word.length}/4 letters needed` : '';
      return false;
    }

    const isValid = this.wordSet && this.wordSet.has(word);
    const alreadyBaked = this.bakedWords.some(b => b.word === word);

    if (alreadyBaked) {
      sendBtn.classList.add('hidden');
      hintEl.className = 'word-validation-hint invalid';
      hintEl.textContent = 'Already baked this game!';
      return false;
    }

    if (isValid) {
      const pts = this.calculateWordScore(word);
      sendBtn.classList.remove('hidden');
      sendBtn.innerHTML = `<span>Bake Word ✓</span> <span style="font-size:11px; opacity:0.9;">(+${pts})</span>`;
      hintEl.className = 'word-validation-hint valid';
      hintEl.textContent = `Valid Word! (+${pts} pts)`;
      return true;
    } else {
      sendBtn.classList.add('hidden');
      hintEl.className = 'word-validation-hint invalid';
      hintEl.textContent = 'Not in recipe book';
      return false;
    }
  }

  sendCurrentWord() {
    const word = this.getCurrentWord();
    if (!word || !this.wordSet || !this.wordSet.has(word)) return;
    if (this.bakedWords.some(b => b.word === word)) return;

    const pts = this.calculateWordScore(word);
    this.score += pts;
    this.bakedWords.push({ word, points: pts });

    this.audio.playDing();
    this.showFloatingScore(`+${pts}`);

    // Return cookies to tray
    this.rackCookies = [];
    this.updateStats();

    // Trigger Bite Phase!
    this.startBitePhase();
  }

  showFloatingScore(text) {
    const el = document.createElement('div');
    el.className = 'floating-score';
    el.textContent = text;
    const sendBtn = document.getElementById('btn-send-word');
    const rect = sendBtn.getBoundingClientRect();
    el.style.left = `${rect.left + rect.width / 2}px`;
    el.style.top = `${rect.top}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }

  startBitePhase() {
    this.state = 'BITE_PHASE';
    // Forced to bite 3 letters (or as many as available)
    this.bitesRemaining = Math.min(3, this.trayCookies.length);

    if (this.bitesRemaining <= 0) {
      this.checkEndgame();
      return;
    }

    this.showStatus(`CHOMP TIME! 🍪 Bite ${this.bitesRemaining} cookie${this.bitesRemaining > 1 ? 's' : ''} from your tray!`, true);
    this.render();
  }

  handleCookieClickInBitePhase(cookieId, event) {
    const cookie = this.getCookieById(cookieId);
    if (!cookie) return;

    this.selectedCookieForBite = cookie;
    const rect = event.currentTarget.getBoundingClientRect();
    this.selectedBiteCoords = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    const rules = NIBBLE_RULES[cookie.letter];
    if (rules && rules.length > 0) {
      // Show interactive nibble choice modal
      this.openBiteChoiceModal(cookie, rules);
    } else {
      // Letter has no nibble transformations: eat completely!
      this.executeBite(cookie, { type: 'eat' });
    }
  }

  openBiteChoiceModal(cookie, rules) {
    const modal = document.getElementById('bite-modal');
    const previewContainer = document.getElementById('bite-cookie-preview');
    const optionsContainer = document.getElementById('bite-options-container');

    previewContainer.innerHTML = renderCookieSvg(cookie.letter, cookie.isNibbled, cookie.rotation);
    optionsContainer.innerHTML = '';

    // Render nibble options
    rules.forEach(rule => {
      const btn = document.createElement('button');
      btn.className = 'bite-choice-btn';
      
      let targetDisplay = Array.isArray(rule.to) ? rule.to.join('+') : rule.to;
      btn.innerHTML = `
        <div class="choice-label-group">
          <div class="choice-target-icon">${targetDisplay}</div>
          <div>
            <div class="choice-desc">${rule.label}</div>
            <div class="choice-sub">${rule.desc}</div>
          </div>
        </div>
        <div style="font-size:18px;">✂️</div>
      `;
      btn.addEventListener('click', () => {
        this.closeModal('bite-modal');
        this.executeBite(cookie, rule);
      });
      optionsContainer.appendChild(btn);
    });

    // Option to eat whole
    const eatBtn = document.createElement('button');
    eatBtn.className = 'bite-choice-btn eat-whole';
    eatBtn.innerHTML = `
      <div class="choice-label-group">
        <div class="choice-target-icon">🍪</div>
        <div>
          <div class="choice-desc">Eat Entire Cookie</div>
          <div class="choice-sub">Crunch it to crumbs! Disappears completely</div>
        </div>
      </div>
      <div style="font-size:18px;">😋</div>
    `;
    eatBtn.addEventListener('click', () => {
      this.closeModal('bite-modal');
      this.executeBite(cookie, { type: 'eat' });
    });
    optionsContainer.appendChild(eatBtn);

    modal.classList.add('open');
  }

  executeBite(cookie, action) {
    const coords = this.selectedBiteCoords || { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    if (action.type === 'eat') {
      // Eat completely
      this.audio.playCrunch();
      this.crumbs.spawnCrumbs(coords.x, coords.y, 40);
      
      const idx = this.trayCookies.findIndex(c => c.id === cookie.id);
      if (idx !== -1) {
        this.trayCookies.splice(idx, 1);
      }
    } else if (action.type === 'nibble' || action.type === 'nibble_rotate') {
      // Morph into new letter with bite mark
      this.audio.playNibble();
      this.crumbs.spawnCrumbs(coords.x, coords.y, 25);
      cookie.letter = action.to;
      cookie.isNibbled = true;
      if (action.type === 'nibble_rotate') {
        cookie.rotation = (cookie.rotation + 180) % 360;
      }
    } else if (action.type === 'split') {
      // Split into two cookies (e.g. H -> I, I or W -> V, V)
      this.audio.playCrunch();
      this.crumbs.spawnCrumbs(coords.x, coords.y, 35);
      
      cookie.letter = action.to[0];
      cookie.isNibbled = true;

      // Add second cookie
      this.trayCookies.push({
        id: `cookie_${Date.now()}_split`,
        letter: action.to[1],
        isNibbled: true,
        rotation: 0
      });
    } else if (action.type === 'rotate') {
      this.audio.playTap();
      cookie.letter = action.to;
    }

    this.bitesRemaining--;

    if (this.bitesRemaining > 0 && this.trayCookies.length > 0) {
      this.showStatus(`CHOMP! 🍪 ${this.bitesRemaining} bite${this.bitesRemaining > 1 ? 's' : ''} left!`, true);
      this.render();
    } else {
      // Bite phase finished!
      this.state = 'PLAYING';
      this.showStatus('Bites complete! Bake your next word.', false);
      this.render();
      // Check if any words remain possible
      this.checkEndgame();
    }
  }

  checkEndgame() {
    const canForm = this.canFormAnyWord(this.trayCookies);
    if (!canForm) {
      this.state = 'GAME_OVER';
      this.audio.playFanfare();
      setTimeout(() => this.openGameOverModal(), 600);
    }
  }

  giveUp() {
    this.closeModal('giveup-modal');
    this.state = 'GAME_OVER';
    this.audio.playFanfare();
    this.openGameOverModal();
  }

  openGameOverModal() {
    const modal = document.getElementById('gameover-modal');
    document.getElementById('final-score-val').textContent = this.score;
    document.getElementById('final-words-count').textContent = this.bakedWords.length;
    
    // Calculate best word
    let bestWord = 'None';
    let maxPts = 0;
    this.bakedWords.forEach(b => {
      if (b.points > maxPts) {
        maxPts = b.points;
        bestWord = `${b.word} (${b.points} pts)`;
      }
    });
    document.getElementById('final-best-word').textContent = bestWord;

    // Rank title
    let rank = 'Apprentice Baker 🧁';
    if (this.score >= 450) rank = 'Legendary Pastry Grandmaster 👑';
    else if (this.score >= 320) rank = 'Master Baker 👨‍🍳';
    else if (this.score >= 200) rank = 'Artisan Baker 🥐';
    else if (this.score >= 100) rank = 'Cookie Enthusiast 🍪';
    document.getElementById('final-baker-rank').textContent = rank;

    modal.classList.add('open');
  }

  shareResult() {
    const dateText = this.mode === 'daily' ? `Daily ${this.currentDateStr}` : 'Free Bake';
    const text = `Half Baked Words 🍪 ${dateText}\n` +
                 `Score: ${this.score} pts | ${this.bakedWords.length} Words Baked\n` +
                 `Fresh from the oven! 🥐🥠🍪✨\n` +
                 `Can you beat my bake?`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Results copied to clipboard! Share it with friends!');
      });
    } else {
      alert(text);
    }
  }

  showStatus(msg, isBite = false) {
    const banner = document.getElementById('status-banner');
    banner.textContent = msg;
    if (isBite) {
      banner.classList.add('bite-active');
    } else {
      banner.classList.remove('bite-active');
    }
  }

  updateStats() {
    document.getElementById('stat-score').textContent = this.score;
    document.getElementById('stat-words').textContent = this.bakedWords.length;
    document.getElementById('stat-cookies-left').textContent = this.trayCookies.length;
  }

  openModal(modalId) {
    document.getElementById(modalId).classList.add('open');
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
  }

  openWordsModal() {
    const tbody = document.getElementById('words-list-tbody');
    tbody.innerHTML = '';
    if (this.bakedWords.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2" style="text-align:center; color:#cfb39b; font-style:italic;">No words baked yet. Get baking!</td></tr>';
    } else {
      this.bakedWords.forEach((b, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${idx + 1}. ${b.word}</td>
          <td class="word-tag-points">+${b.points} pts</td>
        `;
        tbody.appendChild(tr);
      });
    }
    this.openModal('words-modal');
  }

  render() {
    this.updateStats();

    // Render Rack
    const rackContainer = document.getElementById('word-plate-slots');
    rackContainer.innerHTML = '';

    if (this.rackCookies.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.className = 'empty-plate-text';
      placeholder.textContent = this.state === 'BITE_PHASE' ? 'Finish bites below' : 'Drag or tap cookies here to compose word (4+ letters)';
      rackContainer.appendChild(placeholder);
    } else {
      this.rackCookies.forEach(id => {
        const cookie = this.getCookieById(id);
        if (!cookie) return;
        const el = document.createElement('div');
        el.className = 'cookie-item in-rack';
        el.dataset.id = cookie.id;
        el.innerHTML = renderCookieSvg(cookie.letter, cookie.isNibbled, cookie.rotation);
        rackContainer.appendChild(el);
      });
    }

    // Validate rack
    const isValidWord = this.validateRack();
    if (isValidWord) {
      rackContainer.querySelectorAll('.cookie-item').forEach(item => {
        item.classList.add('valid-glow');
      });
    }

    // Render Tray
    const trayContainer = document.getElementById('cookie-grid');
    trayContainer.innerHTML = '';

    const availableCookies = this.trayCookies.filter(c => !this.rackCookies.includes(c.id));

    availableCookies.forEach(cookie => {
      const el = document.createElement('div');
      el.className = 'cookie-item';
      el.dataset.id = cookie.id;

      if (this.state === 'BITE_PHASE') {
        el.classList.add('bite-candidate');
        el.addEventListener('click', (e) => this.handleCookieClickInBitePhase(cookie.id, e));
      }

      el.innerHTML = renderCookieSvg(cookie.letter, cookie.isNibbled, cookie.rotation);

      // Add rotation badge if rotatable (M, W, N, Z)
      if (['M', 'W', 'N', 'Z'].includes(cookie.letter)) {
        const rotBadge = document.createElement('div');
        rotBadge.className = 'rotate-badge';
        rotBadge.title = 'Rotate cookie for free!';
        rotBadge.textContent = '🔄';
        rotBadge.addEventListener('click', (e) => {
          e.stopPropagation();
          this.rotateCookie(cookie.id);
        });
        el.appendChild(rotBadge);
      }

      trayContainer.appendChild(el);
    });

    document.getElementById('tray-count-label').textContent = `Tray Cookies (${availableCookies.length} ready)`;
  }
}

// Start Game on load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new HalfBakedWordsGame();
});
