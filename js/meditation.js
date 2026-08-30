/*
 * Meditation page — box-breathing timer, session filters, ambient sound
 * toggles, and a lightweight mini player for session playback.
 */

const TYPE_COLORS = { Guided: '#5b8dd9', Silent: '#8060c0', Breathwork: '#5da070' };
const TOTAL_CYCLES = 5;
const PHASES = [{ name: 'Inhale', secs: 4 }, { name: 'Hold', secs: 4 }, { name: 'Exhale', secs: 4 }, { name: 'Hold', secs: 4 }];

const sessionsData = [
  { id: 1, title: 'Morning Awakening', type: 'Guided', duration: '10 min', description: 'Begin your day with gentle awareness, intention-setting and a short breath practice.' },
  { id: 2, title: 'Deep Stillness', type: 'Silent', duration: '20 min', description: 'A pure silent sitting meditation with interval bells to guide your practice.' },
  { id: 3, title: 'Yoga Nidra', type: 'Guided', duration: '30 min', description: 'A deeply restorative body-scan meditation for release, rest and inner peace.' },
  { id: 4, title: 'Pranayama Flow', type: 'Breathwork', duration: '15 min', description: 'A guided breathing sequence combining Nadi Shodhana and Bhramari techniques.' },
  { id: 5, title: 'Mantra Meditation', type: 'Guided', duration: '20 min', description: 'A seated mantra meditation with Om Namah Shivaya as the anchor for awareness.' },
  { id: 6, title: 'Evening Release', type: 'Guided', duration: '25 min', description: 'Let the day dissolve. A gentle evening practice for rest, gratitude and surrender.' },
];

const ambientsData = [
  { id: 1, emoji: '🔔', title: 'Temple Bells', subtitle: 'Sacred resonance' },
  { id: 2, emoji: '🌊', title: 'Ocean Waves', subtitle: 'Rhythmic calm' },
  { id: 3, emoji: '🌧', title: 'Rain on Leaves', subtitle: 'Soft stillness' },
  { id: 4, emoji: '🪗', title: 'Singing Bowls', subtitle: 'Tibetan healing' },
  { id: 5, emoji: '🌬', title: 'Forest Wind', subtitle: 'Natural peace' },
  { id: 6, emoji: '✦', title: 'Om Drone', subtitle: 'Pure vibration' },
];

const guideStepsData = [
  { num: '01', title: 'Find a Still Place', desc: 'Sit comfortably with your spine erect. Choose a quiet, dedicated space for your practice.' },
  { num: '02', title: 'Set an Intention', desc: 'Before sitting, hold a clear intention in your heart — healing, peace, devotion or clarity.' },
  { num: '03', title: 'Breathe and Begin', desc: 'Take three slow breaths. Begin your session, letting each moment flow naturally.' },
  { num: '04', title: '108 Repetitions', desc: 'For mantra practice, 108 repetitions completes one full cycle of the mantra japa.' },
];

let breatheRunning = false;
let breathePhase = 'Inhale';
let breatheCount = 4;
let breatheCycles = 0;
let breatheTimer = null;

let activeType = 'All';
let activeAmbients = {};

let currentTrack = null;
let isPlaying = false;
let playerVisible = false;

const els = {};

/* ---------------------------------------------------------------------- */
/* Box breathing                                                          */
/* ---------------------------------------------------------------------- */

function updateBreatheUI() {
  const orbScale = breathePhase === 'Inhale' ? 1.28 : breathePhase === 'Exhale' ? 0.78 : 1;
  els.breathePhase.textContent = breathePhase;
  els.breatheCount.textContent = String(breatheCount);
  els.breatheOrb.style.transform = `scale(${orbScale})`;
  els.breatheRing.classList.toggle('is-running', breatheRunning);
  const isFreshStart = breatheCycles === 0 && breatheCount === 4 && breathePhase === 'Inhale';
  els.breatheToggle.textContent = breatheRunning ? 'Pause' : (isFreshStart ? 'Start' : 'Resume');
  els.breatheCyclesLabel.textContent = `${breatheCycles} / ${TOTAL_CYCLES} cycles`;
  els.breatheDots.querySelectorAll('.breathe-dot').forEach((dot, i) => dot.classList.toggle('is-done', i < breatheCycles));
}

function renderBreatheDots() {
  els.breatheDots.innerHTML = '';
  for (let i = 0; i < TOTAL_CYCLES; i++) {
    const dot = document.createElement('div');
    dot.className = 'breathe-dot';
    els.breatheDots.appendChild(dot);
  }
}

function tickBreathe() {
  if (!breatheRunning) return;
  breatheTimer = setTimeout(() => {
    if (!breatheRunning) return;
    if (breatheCount > 1) {
      breatheCount -= 1;
    } else {
      const idx = PHASES.findIndex((p) => p.name === breathePhase);
      const next = PHASES[(idx + 1) % PHASES.length];
      const doneCycle = idx === PHASES.length - 1;
      breathePhase = next.name;
      breatheCount = next.secs;
      if (doneCycle) breatheCycles += 1;
    }
    updateBreatheUI();
    tickBreathe();
  }, 1000);
}

function toggleBreathe() {
  if (breatheRunning) {
    clearTimeout(breatheTimer);
    breatheRunning = false;
  } else {
    breatheRunning = true;
    tickBreathe();
  }
  updateBreatheUI();
}

function resetBreathe() {
  clearTimeout(breatheTimer);
  breatheRunning = false; breathePhase = 'Inhale'; breatheCount = 4; breatheCycles = 0;
  updateBreatheUI();
}

function openBreathe() {
  els.breathePanel.classList.add('is-open');
  setTimeout(() => els.breathePanel.scrollIntoView({ behavior: 'smooth' }), 50);
}

/* ---------------------------------------------------------------------- */
/* Sessions                                                                */
/* ---------------------------------------------------------------------- */

function renderSessionFilters() {
  const row = els.sessionFilters;
  row.innerHTML = '';
  ['All', 'Guided', 'Silent', 'Breathwork'].forEach((t) => {
    const active = t === activeType;
    const cc = TYPE_COLORS[t] || '#c9a45a';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill-filter';
    btn.textContent = t;
    btn.style.borderColor = active ? cc : 'rgba(255,255,255,.1)';
    btn.style.background = active ? `${cc}18` : 'transparent';
    btn.style.color = active ? cc : 'rgba(248,243,234,.45)';
    btn.addEventListener('click', () => { activeType = t; renderSessionFilters(); renderSessions(); });
    row.appendChild(btn);
  });
}

function renderSessions() {
  const grid = els.sessionsGrid;
  grid.innerHTML = '';
  const filtered = activeType === 'All' ? sessionsData : sessionsData.filter((s) => s.type === activeType);
  filtered.forEach((s) => {
    const cc = TYPE_COLORS[s.type] || '#c9a45a';
    const card = document.createElement('div');
    card.className = 'session-card';
    card.innerHTML = `
      <div class="session-card-body">
        <div class="session-card-head">
          <span class="session-type-badge" style="background:${cc}18;color:${cc};border:1px solid ${cc}30">${s.type}</span>
          <span class="session-card-duration">${s.duration}</span>
        </div>
        <h3 class="session-card-title">${s.title}</h3>
        <p class="session-card-desc">${s.description}</p>
        <button type="button" class="session-begin-btn" data-play>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Begin
        </button>
      </div>`;
    card.querySelector('[data-play]').addEventListener('click', () => playTrack(s));
    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------------------- */
/* Ambient sounds (visual toggle only — no bundled ambient audio yet)      */
/* ---------------------------------------------------------------------- */

function renderAmbients() {
  const grid = els.ambientGrid;
  grid.innerHTML = '';
  ambientsData.forEach((a) => {
    const on = !!activeAmbients[a.id];
    const card = document.createElement('div');
    card.className = 'ambient-card' + (on ? ' is-on' : '');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-pressed', String(on));
    card.innerHTML = `
      <div class="ambient-emoji">${a.emoji}</div>
      <h4 class="ambient-title">${a.title}</h4>
      <p class="ambient-subtitle">${a.subtitle}</p>
      <div class="ambient-footer">
        <span class="ambient-state">${on ? 'Playing' : 'Tap to play'}</span>
        <div class="ambient-knob">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
      </div>`;
    const toggle = () => { activeAmbients[a.id] = !activeAmbients[a.id]; renderAmbients(); };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------------------- */
/* Guide steps + mini player                                              */
/* ---------------------------------------------------------------------- */

function renderGuideSteps() {
  els.guideSteps.innerHTML = '';
  guideStepsData.forEach((step) => {
    const el = document.createElement('div');
    el.className = 'guide-step';
    el.innerHTML = `
      <div class="guide-step-num">${step.num}</div>
      <div>
        <h4>${step.title}</h4>
        <p>${step.desc}</p>
      </div>`;
    els.guideSteps.appendChild(el);
  });
}

function updatePlayerUI() {
  els.playerTitle.textContent = currentTrack ? currentTrack.title : '';
  els.miniPlayer.classList.toggle('is-visible', playerVisible);
  els.iconPlay.hidden = isPlaying;
  els.iconPause.hidden = !isPlaying;
  els.playerToggle.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
}

function playTrack(t) {
  currentTrack = t; isPlaying = true; playerVisible = true;
  updatePlayerUI();
}

function togglePlay() {
  isPlaying = !isPlaying;
  updatePlayerUI();
}

function closePlayer() {
  playerVisible = false; isPlaying = false; currentTrack = null;
  updatePlayerUI();
}

document.addEventListener('DOMContentLoaded', () => {
  ['openBreatheBtn', 'breathePanel', 'breatheRing', 'breatheOrb', 'breathePhase', 'breatheCount', 'breatheToggle',
    'breatheReset', 'breatheDots', 'breatheCyclesLabel', 'sessionFilters', 'sessionsGrid', 'ambientGrid', 'guideSteps',
    'miniPlayer', 'playerTitle', 'playerToggle', 'playerClose', 'iconPlay', 'iconPause']
    .forEach((id) => { els[id] = document.getElementById(id === 'breathePanel' ? 'breathe-section' : id); });

  els.openBreatheBtn.addEventListener('click', openBreathe);
  els.breatheToggle.addEventListener('click', toggleBreathe);
  els.breatheReset.addEventListener('click', resetBreathe);
  els.playerToggle.addEventListener('click', togglePlay);
  els.playerClose.addEventListener('click', closePlayer);

  renderBreatheDots();
  updateBreatheUI();
  renderSessionFilters();
  renderSessions();
  renderAmbients();
  renderGuideSteps();
});
