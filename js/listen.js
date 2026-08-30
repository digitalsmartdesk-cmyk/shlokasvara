/*
 * Listen page — full catalog browser with an inline hero player (vinyl +
 * seek bar) instead of the homepage's persistent bottom player.
 */

const CAT_COLORS = { Mantras: '#5b8dd9', Bhajans: '#c44b88', Music: '#c9a45a', Shlokas: '#5da070', Meditation: '#8060c0' };

const allTracks = [
  { id: 1, title: 'Gayatri Mantra', artist: 'ShlokaSvara', category: 'Mantras', duration: '5:30', gradient: 'linear-gradient(135deg,#1a1a40,#0a0a20)', audio: '' },
  { id: 2, title: 'Om Namah Shivaya', artist: 'ShlokaSvara', category: 'Mantras', duration: '3:22', gradient: 'linear-gradient(135deg,#250a50,#120520)', audio: '' },
  { id: 3, title: 'Hanuman Chalisa', artist: 'ShlokaSvara', category: 'Bhajans', duration: '8:30', gradient: 'linear-gradient(135deg,#3a1805,#1a0802)', audio: '' },
  { id: 4, title: 'Morning Devotion', artist: 'ShlokaSvara', category: 'Music', duration: '32:00', gradient: 'linear-gradient(135deg,#5a3000,#200e00)', audio: '' },
  { id: 5, title: 'Maha Mrityunjaya', artist: 'ShlokaSvara', category: 'Mantras', duration: '4:15', gradient: 'linear-gradient(135deg,#0d2040,#030a18)', audio: '' },
  { id: 6, title: 'Vakratunda Mahakaya', artist: 'ShlokaSvara', category: 'Shlokas', duration: '2:30', gradient: 'linear-gradient(135deg,#302010,#100800)', audio: '' },
  { id: 7, title: 'Peace & Meditation', artist: 'ShlokaSvara', category: 'Music', duration: '45:00', gradient: 'linear-gradient(135deg,#0a1628,#030810)', audio: '' },
  { id: 8, title: 'Durga Stuti', artist: 'ShlokaSvara', category: 'Bhajans', duration: '5:12', gradient: 'linear-gradient(135deg,#200520,#090209)', audio: '' },
  { id: 9, title: 'Achyutam Keshavam', artist: 'ShlokaSvara', category: 'Bhajans', duration: '6:15', gradient: 'linear-gradient(135deg,#0a1a35,#030810)', audio: '' },
  { id: 10, title: 'Om Namo Narayanaya', artist: 'ShlokaSvara', category: 'Mantras', duration: '3:05', gradient: 'linear-gradient(135deg,#082018,#020a06)', audio: '' },
  { id: 11, title: 'Sarve Bhavantu Sukhinah', artist: 'ShlokaSvara', category: 'Shlokas', duration: '4:40', gradient: 'linear-gradient(135deg,#1a0f30,#080413)', audio: '' },
  { id: 12, title: 'Evening Bhakti', artist: 'ShlokaSvara', category: 'Music', duration: '38:00', gradient: 'linear-gradient(135deg,#4a1200,#150500)', audio: '' },
  { id: 13, title: 'Raghupati Raghava', artist: 'ShlokaSvara', category: 'Bhajans', duration: '3:55', gradient: 'linear-gradient(135deg,#1a0a02,#080400)', audio: '' },
  { id: 14, title: 'Karaagre Vasate', artist: 'ShlokaSvara', category: 'Shlokas', duration: '2:10', gradient: 'linear-gradient(135deg,#102810,#040e04)', audio: '' },
  { id: 15, title: 'Sleep & Relaxation', artist: 'ShlokaSvara', category: 'Meditation', duration: '60:00', gradient: 'linear-gradient(135deg,#0f1848,#030510)', audio: '' },
  { id: 16, title: 'Guru Stotram', artist: 'ShlokaSvara', category: 'Shlokas', duration: '3:15', gradient: 'linear-gradient(135deg,#201808,#080600)', audio: '' },
];

const collections = [
  { id: 1, title: 'Morning Rituals', desc: 'Start with sacred intention', tracks: 6, duration: '42 min', bg: 'linear-gradient(160deg,#1a1000,#050310)' },
  { id: 2, title: 'Shiva Sadhana', desc: 'Deep Shiva devotion', tracks: 8, duration: '55 min', bg: 'linear-gradient(160deg,#0d0520,#030210)' },
  { id: 3, title: 'Sleep Sanctuary', desc: 'Peaceful drift into rest', tracks: 5, duration: '64 min', bg: 'linear-gradient(160deg,#020e20,#030408)' },
  { id: 4, title: 'Shakti Awakening', desc: 'Invoke the divine feminine', tracks: 7, duration: '48 min', bg: 'linear-gradient(160deg,#200520,#090209)' },
  { id: 5, title: 'Vedic Chants', desc: 'Ancient Vedic tradition', tracks: 9, duration: '61 min', bg: 'linear-gradient(160deg,#151000,#060508)' },
  { id: 6, title: 'Evening Gratitude', desc: 'Close the day in devotion', tracks: 6, duration: '38 min', bg: 'linear-gradient(160deg,#120600,#060306)' },
];

let activeTab = 'All';
let sortDir = 'asc';
let saved = {};
let currentTrack = null;
let isPlaying = false;

const audio = new Audio();
const els = {};

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60), s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getFilteredTracks() {
  const list = activeTab === 'All' ? allTracks : allTracks.filter((t) => t.category === activeTab);
  return sortDir === 'asc' ? list : [...list].reverse();
}

function renderTabs() {
  const row = els.tabsRow;
  row.innerHTML = '';
  ['All', 'Music', 'Mantras', 'Shlokas', 'Bhajans', 'Meditation'].forEach((t) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill-filter' + (t === activeTab ? ' is-active' : '');
    btn.textContent = t;
    btn.addEventListener('click', () => { activeTab = t; renderTabs(); renderTracks(); });
    row.appendChild(btn);
  });
  const sortBtn = document.createElement('button');
  sortBtn.type = 'button';
  sortBtn.className = 'listen-sort-btn';
  sortBtn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
    ${sortDir === 'asc' ? 'A – Z' : 'Z – A'}`;
  sortBtn.addEventListener('click', () => { sortDir = sortDir === 'asc' ? 'desc' : 'asc'; renderTabs(); renderTracks(); });
  row.appendChild(sortBtn);
}

function renderTracks() {
  const list = els.trackList;
  list.innerHTML = '';
  const filtered = getFilteredTracks();
  filtered.forEach((t, i) => {
    const active = currentTrack && currentTrack.id === t.id;
    const cc = CAT_COLORS[t.category] || '#c9a45a';
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'track-row' + (active ? ' is-active' : '');
    row.innerHTML = `
      <span class="track-num">${active && isPlaying ? `<span class="track-wave">${[.7, .4, .9, .5, .8].map((h, j) => `<span style="height:${h * 14 + 3}px;animation-duration:1.${j + 2}s;animation-delay:${(j * .1).toFixed(2)}s"></span>`).join('')}</span>` : `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`}</span>
      <span class="track-main">
        <span class="track-art" style="background:${t.gradient}">ॐ</span>
        <span style="min-width:0">
          <span class="track-title" style="display:block">${t.title}</span>
          <span class="track-artist" style="display:block">${t.artist}</span>
        </span>
      </span>
      <span class="track-category"><span style="background:${cc}18;color:${cc};border:1px solid ${cc}35">${t.category}</span></span>
      <span class="track-duration">${t.duration}</span>
      <span class="track-save" role="button" tabindex="0" aria-label="Save" aria-pressed="${!!saved[t.id]}" data-save="${t.id}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${saved[t.id] ? '#c9a45a' : 'none'}" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </span>`;
    row.addEventListener('click', (e) => {
      if (e.target.closest('[data-save]')) return;
      playTrack(t);
    });
    const saveEl = row.querySelector('[data-save]');
    saveEl.addEventListener('click', (e) => {
      e.stopPropagation();
      saved[t.id] = !saved[t.id];
      renderTracks();
    });
    list.appendChild(row);
  });
}

function renderCollections() {
  const grid = els.collectionsGrid;
  grid.innerHTML = '';
  collections.forEach((c) => {
    const card = document.createElement('div');
    card.className = 'collection-card';
    card.style.background = c.bg;
    card.innerHTML = `
      <div class="collection-card-body">
        <div class="collection-meta">${c.tracks} tracks · ${c.duration}</div>
        <div>
          <h3 class="collection-title">${c.title}</h3>
          <p class="collection-desc">${c.desc}</p>
          <button type="button" class="pill-btn" data-play-collection="${c.id}">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Play All
          </button>
        </div>
      </div>`;
    card.querySelector('[data-play-collection]').addEventListener('click', () => { if (allTracks.length) playTrack(allTracks[0]); });
    grid.appendChild(card);
  });
}

function updateNowPlaying() {
  els.nowTitle.textContent = currentTrack ? currentTrack.title : 'ShlokaSvara';
  els.nowMeta.textContent = currentTrack ? `${currentTrack.category} · ${currentTrack.duration}` : 'Select a track to begin your devotional journey';
  els.vinyl.style.background = currentTrack ? currentTrack.gradient : 'linear-gradient(135deg,#1a1a40,#0a0a20)';
  els.vinyl.classList.toggle('is-spinning', isPlaying);
  els.iconPlay.hidden = isPlaying;
  els.iconPause.hidden = !isPlaying;
  els.btnPlay.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  els.seekThumb.style.opacity = currentTrack ? '1' : '0';
}

function playTrack(track) {
  if (currentTrack && currentTrack.id === track.id) {
    togglePlay();
    return;
  }
  audio.pause();
  audio.src = track.audio || '';
  currentTrack = track;
  isPlaying = !!track.audio;
  if (track.audio) audio.play().catch(() => {});
  els.seekFill.style.width = '0%';
  els.seekThumb.style.left = '0%';
  els.curTime.textContent = '0:00';
  els.durTime.textContent = '0:00';
  updateNowPlaying();
  renderTracks();
}

function togglePlay() {
  if (!currentTrack) { if (allTracks.length) playTrack(allTracks[0]); return; }
  if (isPlaying) { audio.pause(); isPlaying = false; }
  else if (currentTrack.audio) { audio.play().catch(() => {}); isPlaying = true; }
  updateNowPlaying();
  renderTracks();
}

function playPrev() {
  const list = getFilteredTracks();
  if (!currentTrack) { playTrack(list[0]); return; }
  const idx = list.findIndex((t) => t.id === currentTrack.id);
  if (idx > 0) playTrack(list[idx - 1]);
}

function playNext() {
  const list = getFilteredTracks();
  if (!currentTrack) { playTrack(list[0]); return; }
  const idx = list.findIndex((t) => t.id === currentTrack.id);
  if (idx < list.length - 1) playTrack(list[idx + 1]);
}

function seekTo(e) {
  const rect = els.seekTrack.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  if (audio.duration) audio.currentTime = ratio * audio.duration;
  els.seekFill.style.width = `${ratio * 100}%`;
  els.seekThumb.style.left = `${ratio * 100}%`;
}

document.addEventListener('DOMContentLoaded', () => {
  ['tabsRow', 'trackList', 'collectionsGrid', 'nowTitle', 'nowMeta', 'vinyl', 'seekTrack', 'seekFill', 'seekThumb',
    'curTime', 'durTime', 'btnPrev', 'btnPlay', 'btnNext', 'iconPlay', 'iconPause']
    .forEach((id) => { els[id] = document.getElementById(id); });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const ratio = audio.currentTime / audio.duration;
    els.seekFill.style.width = `${ratio * 100}%`;
    els.seekThumb.style.left = `${ratio * 100}%`;
    els.curTime.textContent = formatTime(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', () => { els.durTime.textContent = formatTime(audio.duration); });
  audio.addEventListener('ended', () => { isPlaying = false; updateNowPlaying(); renderTracks(); });

  els.btnPlay.addEventListener('click', togglePlay);
  els.btnPrev.addEventListener('click', playPrev);
  els.btnNext.addEventListener('click', playNext);
  els.seekTrack.addEventListener('click', seekTo);

  renderTabs();
  renderTracks();
  renderCollections();
  updateNowPlaying();
});
