/*
 * ShlokaSvara homepage — rendering + interactions.
 * Cards are rendered from js/data.js so new content can be added there
 * without touching this file. Player wiring lives in js/player.js.
 */

const ART_GRADIENTS = {
  Morning: 'linear-gradient(145deg,#1a0e00,#5a3000,#8b5500)',
  Meditation: 'linear-gradient(145deg,#060d1e,#0a1628,#0d2040)',
  Mantras: 'linear-gradient(145deg,#12062a,#250a50,#3d1278)',
  Bhakti: 'linear-gradient(145deg,#1a0500,#4a1200,#7a2000)',
  Instrumental: 'linear-gradient(145deg,#030e08,#082018,#0a3020)',
  Sleep: 'linear-gradient(145deg,#050710,#0a1030,#0f1848)',
};

const BHAJAN_GRADIENTS = {
  Krishna: 'linear-gradient(145deg,#0a1a35,#1a3060)',
  Shiva: 'linear-gradient(145deg,#150828,#2a1050)',
  Ram: 'linear-gradient(145deg,#1a0a02,#3a1805)',
  Hanuman: 'linear-gradient(145deg,#251002,#4a2005)',
  Devi: 'linear-gradient(145deg,#200520,#450840)',
};

const JOURNEY_GRADIENTS = [
  'linear-gradient(160deg,#1a1000,#0a0712)',
  'linear-gradient(160deg,#0d0520,#04060e)',
  'linear-gradient(160deg,#150600,#04060e)',
  'linear-gradient(160deg,#020e20,#04060e)',
  'linear-gradient(160deg,#041008,#04060e)',
];

const DEITY_COLORS = {
  Shiva: '#5b8dd9', Vishnu: '#5da070', Shakti: '#c44b88',
  Ganesh: '#e07a30', Hanuman: '#d47820', Meditation: '#8060c0',
};

let activeMantraFilter = 'All';

/* ---------------------------------------------------------------------- */
/* Rendering                                                              */
/* ---------------------------------------------------------------------- */

function renderMusicGrid() {
  const grid = document.getElementById('musicGrid');
  grid.innerHTML = '';
  musicItems.forEach((item) => {
    const trackId = `music-${item.id}`;
    const card = document.createElement('div');
    card.className = 'music-card';
    card.innerHTML = `
      <div class="music-card-art" style="background:${ART_GRADIENTS[item.category] || ART_GRADIENTS.Meditation}">
        <div class="music-card-art-icon">ॐ</div>
        <div class="music-card-overlay">
          <button type="button" class="music-card-play" data-play="${trackId}" aria-label="Play ${item.title}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </button>
        </div>
      </div>
      <div class="music-card-body">
        <div class="music-card-meta">
          <span class="music-card-category">${item.category}</span>
          <span class="music-card-duration">${item.duration}</span>
        </div>
        <h3 class="music-card-title">${item.title}</h3>
        <p class="music-card-desc">${item.description}</p>
        <button type="button" class="pill-btn" data-play="${trackId}">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Play
        </button>
      </div>`;
    grid.appendChild(card);
  });
}

function renderShlokaGrid() {
  const grid = document.getElementById('shlokaGrid');
  grid.innerHTML = '';
  shlokas.forEach((s) => {
    const trackId = `shloka-${s.id}`;
    const card = document.createElement('div');
    card.className = 'shloka-card';
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
      <div class="shloka-category">${s.category}</div>
      <div class="shloka-sanskrit">${s.sanskrit}</div>
      <div class="shloka-translit">${s.transliteration}</div>
      <p class="shloka-meaning">${s.englishMeaning}</p>
      <div class="shloka-actions">
        <button type="button" class="pill-btn-indigo" data-play="${trackId}">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Listen
        </button>
        <a href="shloka-detail.html" class="pill-btn-outline">Read</a>
        <button type="button" class="save-btn" aria-label="Save ${s.title}" aria-pressed="false" data-save>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>`;
    grid.appendChild(card);
  });
}

function renderMantraFilters() {
  const wrap = document.getElementById('mantraFilters');
  wrap.innerHTML = '';
  mantraDeities.forEach((f) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-btn' + (f === activeMantraFilter ? ' is-active' : '');
    btn.textContent = f;
    btn.setAttribute('aria-pressed', String(f === activeMantraFilter));
    btn.addEventListener('click', () => {
      activeMantraFilter = f;
      renderMantraFilters();
      renderMantraGrid();
    });
    wrap.appendChild(btn);
  });
}

function renderMantraGrid() {
  const grid = document.getElementById('mantraGrid');
  grid.innerHTML = '';
  const list = activeMantraFilter === 'All' ? mantras : mantras.filter((m) => m.deity === activeMantraFilter);
  list.forEach((m) => {
    const trackId = `mantra-${m.id}`;
    const color = DEITY_COLORS[m.deity] || '#c9a45a';
    const card = document.createElement('div');
    card.className = 'mantra-card';
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
      <div class="mantra-tag" style="background:${color}22;color:${color};border:1px solid ${color}40">${m.deity}</div>
      <div class="mantra-sanskrit">${m.sanskrit}</div>
      <h3 class="mantra-title">${m.title}</h3>
      <p class="mantra-desc">${m.description}</p>
      <div class="mantra-footer">
        <button type="button" class="mantra-play" data-play="${trackId}">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Play
        </button>
        <span class="mantra-duration">${m.duration}</span>
      </div>`;
    grid.appendChild(card);
    // Filter clicks re-render this grid after the initial observer setup,
    // so newly added cards need to be handed to the existing observer
    // directly instead of waiting for the one-time querySelectorAll pass.
    if (revealObserver) revealObserver.observe(card);
  });
}

function renderJourneyGrid() {
  const grid = document.getElementById('journeyGrid');
  grid.innerHTML = '';
  journeys.forEach((j, i) => {
    const card = document.createElement('a');
    card.href = 'listen.html';
    card.className = 'journey-card';
    card.style.background = JOURNEY_GRADIENTS[i % JOURNEY_GRADIENTS.length];
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
      <div class="journey-card-body">
        <div class="journey-meta">${j.tracks} tracks · ${j.duration}</div>
        <div>
          <h3 class="journey-title">${j.title}</h3>
          <p class="journey-desc">${j.description}</p>
          <span class="journey-link">
            Begin Journey
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function renderBhajanScroll() {
  const scroll = document.getElementById('bhajanScroll');
  scroll.innerHTML = '';
  bhajans.forEach((b) => {
    const trackId = `bhajan-${b.id}`;
    const card = document.createElement('div');
    card.className = 'bhajan-card';
    card.innerHTML = `
      <div class="bhajan-art" style="background:${BHAJAN_GRADIENTS[b.category] || 'linear-gradient(145deg,#0a0a20,#1a1a40)'}">
        <div class="bhajan-art-icon">ॐ</div>
      </div>
      <div class="bhajan-body">
        <div class="bhajan-category">${b.category}</div>
        <h3 class="bhajan-title">${b.title}</h3>
        <p class="bhajan-deity">${b.deity}</p>
        <div class="bhajan-footer">
          <button type="button" class="bhajan-play" data-play="${trackId}">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Play
          </button>
          <span class="bhajan-duration">${b.duration}</span>
        </div>
      </div>`;
    scroll.appendChild(card);
  });
}

function renderWhyGrid() {
  const grid = document.getElementById('whyGrid');
  grid.innerHTML = '';
  whyFeatures.forEach((f) => {
    const block = document.createElement('div');
    block.className = 'feature-block';
    block.setAttribute('data-reveal', '');
    block.innerHTML = `
      <div class="feature-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9a45a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${f.iconPath}"></path></svg>
      </div>
      <div>
        <h3 class="feature-title">${f.title}</h3>
        <p class="feature-desc">${f.desc}</p>
      </div>`;
    grid.appendChild(block);
  });
}

function renderShlokaOfTheDay() {
  document.getElementById('sotdSanskrit').textContent = shlokaOfTheDay.sanskrit;
  document.getElementById('sotdTranslit').textContent = shlokaOfTheDay.transliteration;
  document.getElementById('sotdMeaning').textContent = shlokaOfTheDay.englishMeaning;
}

function renderWaveform() {
  const el = document.getElementById('heroWaveform');
  const heights = [0.45, 0.8, 0.35, 1, 0.6, 0.85, 0.3, 0.7, 0.5, 0.9, 0.4, 0.65];
  el.innerHTML = '';
  heights.forEach((h, i) => {
    const bar = document.createElement('span');
    bar.style.height = `${Math.round(h * 22 + 4)}px`;
    bar.style.animationDuration = `1.${(i % 6) + 2}s`;
    bar.style.animationDelay = `${(i * 0.07).toFixed(2)}s`;
    el.appendChild(bar);
  });
}

function renderSearchSuggestions() {
  const wrap = document.getElementById('searchSuggestions');
  wrap.innerHTML = '';
  suggestedSearches.forEach((s) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'search-suggestion';
    btn.textContent = s;
    btn.addEventListener('click', () => {
      const input = document.getElementById('searchInput');
      input.value = s;
      handleSearch(s);
      input.focus();
    });
    wrap.appendChild(btn);
  });
}

/* ---------------------------------------------------------------------- */
/* Reveal-on-scroll                                                       */
/* ---------------------------------------------------------------------- */

let revealObserver;

function setupRevealObserver() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
}

/* ---------------------------------------------------------------------- */
/* Header / hero / scroll effects                                         */
/* ---------------------------------------------------------------------- */

function setupHeaderScroll() {
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function revealHero() {
  requestAnimationFrame(() => {
    setTimeout(() => document.getElementById('heroContent').classList.add('is-visible'), 100);
  });
}

/* ---------------------------------------------------------------------- */
/* Play button delegation                                                 */
/* ---------------------------------------------------------------------- */

function getAllTracks() {
  return [
    ...musicItems.map((t) => ({ ...t, trackId: `music-${t.id}` })),
    ...shlokas.map((t) => ({ ...t, trackId: `shloka-${t.id}`, title: t.title, artist: t.transliteration })),
    ...mantras.map((t) => ({ ...t, trackId: `mantra-${t.id}`, artist: t.deity })),
    ...bhajans.map((t) => ({ ...t, trackId: `bhajan-${t.id}`, artist: t.deity })),
  ];
}

function setupPlayDelegation() {
  const allTracks = getAllTracks();
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-play]');
    if (!btn) return;
    const track = allTracks.find((t) => t.trackId === btn.getAttribute('data-play'));
    if (!track) return;
    Player.play(track);
    if (btn.closest('#searchOverlay')) closeSearchOverlay();
  });
  return allTracks;
}

/* ---------------------------------------------------------------------- */
/* Save / share (shloka of the day + shloka cards)                        */
/* ---------------------------------------------------------------------- */

function setupSaveButtons() {
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-save]');
    if (!btn) return;
    const pressed = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', String(!pressed));
  });

  const sotdSave = document.getElementById('sotdSaveBtn');
  sotdSave.addEventListener('click', () => {
    const pressed = sotdSave.getAttribute('aria-pressed') === 'true';
    sotdSave.setAttribute('aria-pressed', String(!pressed));
  });

  document.getElementById('sotdShareBtn').addEventListener('click', async () => {
    const shareData = {
      title: 'Shloka of the Day — ShlokaSvara',
      text: `${shlokaOfTheDay.transliteration} — ${shlokaOfTheDay.englishMeaning}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url).catch(() => {});
    }
  });
}

/* ---------------------------------------------------------------------- */
/* Search overlay                                                         */
/* ---------------------------------------------------------------------- */

function handleSearch(query) {
  const suggestedWrap = document.getElementById('searchSuggested');
  const resultsWrap = document.getElementById('searchResultsWrap');
  const resultsEl = document.getElementById('searchResults');
  const q = query.trim().toLowerCase();

  if (!q) {
    suggestedWrap.hidden = false;
    resultsWrap.hidden = true;
    return;
  }

  suggestedWrap.hidden = true;
  resultsWrap.hidden = false;

  const results = [
    ...shlokas.filter((s) => s.title.toLowerCase().includes(q) || s.transliteration.toLowerCase().includes(q) || s.englishMeaning.toLowerCase().includes(q))
      .map((s) => ({ title: s.title, subtitle: s.transliteration, type: 'Shloka', trackId: `shloka-${s.id}` })),
    ...mantras.filter((m) => m.title.toLowerCase().includes(q) || m.deity.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
      .map((m) => ({ title: m.title, subtitle: m.deity, type: 'Mantra', trackId: `mantra-${m.id}` })),
    ...musicItems.filter((m) => m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q))
      .map((m) => ({ title: m.title, subtitle: m.category, type: 'Music', trackId: `music-${m.id}` })),
    ...bhajans.filter((b) => b.title.toLowerCase().includes(q) || b.deity.toLowerCase().includes(q))
      .map((b) => ({ title: b.title, subtitle: b.deity, type: 'Bhajan', trackId: `bhajan-${b.id}` })),
  ];

  resultsEl.innerHTML = '';
  if (results.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'search-empty';
    empty.textContent = `No results found for "${query}"`;
    resultsEl.appendChild(empty);
    return;
  }

  results.forEach((r) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'search-result';
    row.setAttribute('data-play', r.trackId);
    row.innerHTML = `
      <span>
        <span class="search-result-title">${r.title}</span><br>
        <span class="search-result-subtitle">${r.subtitle}</span>
      </span>
      <span class="search-result-type">${r.type}</span>`;
    resultsEl.appendChild(row);
  });
}

function closeSearchOverlay() {
  const overlay = document.getElementById('searchOverlay');
  const toggle = document.getElementById('searchToggle');
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  toggle.setAttribute('aria-expanded', 'false');
}

function setupSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  const toggle = document.getElementById('searchToggle');
  const close = document.getElementById('searchClose');
  const scrim = document.getElementById('searchScrim');

  function open() {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    input.value = '';
    handleSearch('');
    setTimeout(() => input.focus(), 50);
  }

  toggle.addEventListener('click', () => (overlay.classList.contains('is-open') ? closeSearchOverlay() : open()));
  close.addEventListener('click', closeSearchOverlay);
  scrim.addEventListener('click', closeSearchOverlay);
  input.addEventListener('input', (e) => handleSearch(e.target.value));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeSearchOverlay();
  });
}

/* ---------------------------------------------------------------------- */
/* Mobile menu                                                            */
/* ---------------------------------------------------------------------- */

function setupMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const openBtn = document.getElementById('hamburgerBtn');
  const closeBtn = document.getElementById('mobileMenuClose');

  function open() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    openBtn.setAttribute('aria-expanded', 'true');
  }

  function close() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    openBtn.setAttribute('aria-expanded', 'false');
  }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
  });
}

/* ---------------------------------------------------------------------- */
/* Newsletter                                                             */
/* ---------------------------------------------------------------------- */

function setupNewsletter() {
  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('newsletterEmail');
  const success = document.getElementById('newsletterSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    if (!valid) {
      input.classList.add('has-error');
      setTimeout(() => input.classList.remove('has-error'), 2500);
      return;
    }
    form.hidden = true;
    success.hidden = false;
  });
}

/* ---------------------------------------------------------------------- */
/* Init                                                                   */
/* ---------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  renderMusicGrid();
  renderShlokaGrid();
  renderMantraFilters();
  renderMantraGrid();
  renderJourneyGrid();
  renderBhajanScroll();
  renderWhyGrid();
  renderShlokaOfTheDay();
  renderWaveform();
  renderSearchSuggestions();

  setupRevealObserver();
  setupHeaderScroll();
  revealHero();
  const allTracks = setupPlayDelegation();
  setupSaveButtons();
  setupSearch();
  setupMobileMenu();
  setupNewsletter();

  Player.init(allTracks);
});
