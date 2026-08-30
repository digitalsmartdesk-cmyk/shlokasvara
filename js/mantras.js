/*
 * Mantras page — deity filters, per-card play/progress, and a chanting guide.
 */

const DEITY_COLORS = { Shiva: '#5b8dd9', Vishnu: '#5da070', Shakti: '#c44b88', Ganesh: '#e07a30', Hanuman: '#d47820', Meditation: '#8060c0' };
const CARD_GRADS = {
  Shiva: 'linear-gradient(160deg,rgba(20,8,44,.9),rgba(5,7,20,.95))',
  Vishnu: 'linear-gradient(160deg,rgba(6,22,14,.9),rgba(5,7,20,.95))',
  Shakti: 'linear-gradient(160deg,rgba(36,5,24,.9),rgba(5,7,20,.95))',
  Ganesh: 'linear-gradient(160deg,rgba(36,18,4,.9),rgba(5,7,20,.95))',
  Hanuman: 'linear-gradient(160deg,rgba(38,16,2,.9),rgba(5,7,20,.95))',
  Meditation: 'linear-gradient(160deg,rgba(22,14,44,.9),rgba(5,7,20,.95))',
};

const mantrasData = [
  { id: 1, title: 'Om Namah Shivaya', deity: 'Shiva', sanskrit: 'ॐ नमः शिवाय', description: 'The Panchakshara — the five sacred syllables dedicated to Lord Shiva.', benefit: 'Purifies the mind, dissolves ego and connects to divine consciousness.', duration: '3:22', audio: '' },
  { id: 2, title: 'Maha Mrityunjaya', deity: 'Shiva', sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्', description: 'The great Vedic mantra of victory over mortality and suffering.', benefit: 'Strengthens vitality, heals illness and protects from fear.', duration: '4:15', audio: '' },
  { id: 3, title: 'Gayatri Mantra', deity: 'Meditation', sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यम्', description: 'The supreme Vedic mantra for divine wisdom and illumination.', benefit: 'Sharpens intellect, dispels ignorance and invokes divine grace.', duration: '5:30', audio: '' },
  { id: 4, title: 'Om Namo Narayanaya', deity: 'Vishnu', sanskrit: 'ॐ नमो नारायणाय', description: 'The Ashtakshara — the eight sacred syllables of Lord Vishnu.', benefit: 'Bestows peace, prosperity and liberation from the cycle of rebirth.', duration: '3:05', audio: '' },
  { id: 5, title: 'Om Namo Bhagavate', deity: 'Vishnu', sanskrit: 'ॐ नमो भगवते वासुदेवाय', description: 'The twelve-syllable mantra of surrender to the divine Vasudeva.', benefit: 'Cultivates devotion, inner freedom and spiritual liberation.', duration: '4:40', audio: '' },
  { id: 6, title: 'Om Mahalakshmyai', deity: 'Shakti', sanskrit: 'ॐ महालक्ष्म्यै नमः', description: 'A sacred prayer to the divine goddess of abundance and grace.', benefit: 'Invites prosperity, beauty and the blessings of divine grace.', duration: '2:55', audio: '' },
  { id: 7, title: 'Durga Stuti', deity: 'Shakti', sanskrit: 'ॐ दुं दुर्गायै नमः', description: 'An invocation to the fierce and compassionate Durga Mata.', benefit: 'Destroys obstacles, grants courage and awakens inner strength.', duration: '5:12', audio: '' },
  { id: 8, title: 'Hanuman Chalisa', deity: 'Hanuman', sanskrit: 'जय हनुमान ज्ञान गुण सागर', description: 'Forty sacred verses of devotion to Lord Hanuman by Tulsidas.', benefit: 'Removes fear, grants protection and instills unwavering courage.', duration: '8:30', audio: '' },
  { id: 9, title: 'Vakratunda Mahakaya', deity: 'Ganesh', sanskrit: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः', description: 'The sacred invocation of Lord Ganesha before all endeavors.', benefit: 'Removes obstacles, bestows wisdom and blesses new beginnings.', duration: '2:30', audio: '' },
  { id: 10, title: 'Om Gam Ganapataye', deity: 'Ganesh', sanskrit: 'ॐ गं गणपतये नमः', description: 'A seed mantra for Lord Ganesha, packed with divine energy.', benefit: 'Clears the path ahead and awakens inner intelligence.', duration: '3:10', audio: '' },
];

const guideStepsData = [
  { num: '01', title: 'Find a Still Place', desc: 'Sit comfortably with your spine erect. Choose a quiet, dedicated space for your practice.' },
  { num: '02', title: 'Set an Intention', desc: 'Before chanting, hold a clear intention in your heart — healing, peace, devotion or clarity.' },
  { num: '03', title: 'Breathe and Begin', desc: 'Take three slow breaths. Begin chanting aloud or silently, letting each repetition flow naturally.' },
  { num: '04', title: '108 Repetitions', desc: 'The traditional count of 108 repetitions completes one full cycle of the mantra practice.' },
];

let activeDeity = 'All';
let currentTrackId = null;
let isPlaying = false;
let playerVisible = false;
let trackProgress = {};

const audio = new Audio();
const els = {};

function getDeities() {
  return ['All', ...new Set(mantrasData.map((m) => m.deity))];
}

function renderDeityFilters() {
  const row = els.deityRow;
  row.innerHTML = '';
  getDeities().forEach((d) => {
    const active = d === activeDeity;
    const cc = DEITY_COLORS[d] || '#c9a45a';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill-filter';
    btn.textContent = d;
    btn.style.borderColor = active ? cc : 'rgba(255,255,255,.1)';
    btn.style.background = active ? `${cc}18` : 'transparent';
    btn.style.color = active ? cc : 'rgba(248,243,234,.5)';
    btn.addEventListener('click', () => { activeDeity = d; renderDeityFilters(); renderGrid(); });
    row.appendChild(btn);
  });
}

function renderGrid() {
  const grid = els.mantraGrid;
  grid.innerHTML = '';
  const filtered = activeDeity === 'All' ? mantrasData : mantrasData.filter((m) => m.deity === activeDeity);
  els.sectionTitle.textContent = activeDeity === 'All' ? 'All Mantras' : `${activeDeity} Mantras`;
  els.countLabel.textContent = `${filtered.length} mantras`;

  filtered.forEach((m) => {
    const cc = DEITY_COLORS[m.deity] || '#c9a45a';
    const playing = isPlaying && currentTrackId === m.id;
    const progress = trackProgress[m.id] || 0;
    const card = document.createElement('div');
    card.className = 'mantra-card-page';
    card.style.background = CARD_GRADS[m.deity] || 'linear-gradient(160deg,rgba(15,10,30,.9),rgba(5,7,20,.95))';
    card.innerHTML = `
      <div class="mantra-card-page-body">
        <div class="mantra-card-head">
          <span class="shloka-cat-badge" style="background:${cc}18;color:${cc};border:1px solid ${cc}30">${m.deity}</span>
          <span class="mantra-card-duration">${m.duration}</span>
        </div>
        <div class="mantra-card-sanskrit">${m.sanskrit}</div>
        <h3 class="mantra-card-title">${m.title}</h3>
        <p class="mantra-card-desc">${m.description}</p>
        <p class="mantra-card-benefit">${m.benefit}</p>
        <div class="mantra-card-footer">
          <button type="button" class="mantra-card-play" style="background:${playing ? cc : cc + '18'};border:1px solid ${cc}40;color:${playing ? '#07091a' : cc}" data-play aria-label="${playing ? 'Pause' : 'Play'} ${m.title}">
            ${playing
              ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
              : '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>'}
          </button>
          <div class="mantra-card-progress-track">
            <div class="mantra-card-progress-fill" data-progress-for="${m.id}" style="width:${progress}%;background:linear-gradient(to right,${cc},${cc}88)"></div>
          </div>
        </div>
      </div>`;
    card.querySelector('[data-play]').addEventListener('click', () => playTrack(m));
    grid.appendChild(card);
  });
}

function updatePlayerUI() {
  const track = mantrasData.find((m) => m.id === currentTrackId);
  els.playerTitle.textContent = track ? track.title : '';
  els.miniPlayer.classList.toggle('is-visible', playerVisible);
  els.iconPlay.hidden = isPlaying;
  els.iconPause.hidden = !isPlaying;
  els.playerToggle.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
}

function playTrack(m) {
  if (currentTrackId === m.id) { togglePlay(); return; }
  audio.pause();
  audio.src = m.audio || '';
  currentTrackId = m.id;
  isPlaying = !!m.audio;
  if (m.audio) audio.play().catch(() => {});
  playerVisible = true;
  updatePlayerUI();
  renderGrid();
}

function togglePlay() {
  if (!currentTrackId) return;
  if (isPlaying) { audio.pause(); isPlaying = false; }
  else { audio.play().catch(() => {}); isPlaying = true; }
  updatePlayerUI();
  renderGrid();
}

function closePlayer() {
  audio.pause();
  playerVisible = false; isPlaying = false; currentTrackId = null;
  updatePlayerUI();
  renderGrid();
}

function renderGuideSteps() {
  const wrap = els.guideSteps;
  wrap.innerHTML = '';
  guideStepsData.forEach((step) => {
    const el = document.createElement('div');
    el.className = 'guide-step';
    el.innerHTML = `
      <div class="guide-step-num">${step.num}</div>
      <div>
        <h4>${step.title}</h4>
        <p>${step.desc}</p>
      </div>`;
    wrap.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  ['deityRow', 'mantraGrid', 'sectionTitle', 'countLabel', 'guideSteps', 'miniPlayer', 'playerTitle', 'playerToggle', 'playerClose', 'iconPlay', 'iconPause']
    .forEach((id) => { els[id] = document.getElementById(id); });

  audio.addEventListener('ended', () => { isPlaying = false; updatePlayerUI(); renderGrid(); });
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration || !currentTrackId) return;
    const progress = (audio.currentTime / audio.duration) * 100;
    trackProgress[currentTrackId] = progress;
    const fill = els.mantraGrid.querySelector(`[data-progress-for="${currentTrackId}"]`);
    if (fill) fill.style.width = `${progress}%`;
  });

  els.playerToggle.addEventListener('click', togglePlay);
  els.playerClose.addEventListener('click', closePlayer);

  renderDeityFilters();
  renderGrid();
  renderGuideSteps();
});
