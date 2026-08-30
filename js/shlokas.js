/*
 * Shlokas catalog page — category filters, save toggles, shloka-of-the-day
 * band, and a lightweight mini player (no seek/volume, matches the design).
 */

const CAT_COLORS = { Ganesh: '#e07a30', Vedic: '#5b8dd9', Morning: '#c9a45a', Guru: '#8060c0', Universal: '#5da070', Devotional: '#c44b88' };

const shlokaData = [
  { id: 1, title: 'Ganesh Shloka', sanskrit: 'वक्रतुण्ड महाकाय\nसूर्यकोटि समप्रभः\nनिर्विघ्नं कुरु मे देव\nशुभकार्येषु सर्वदा॥', transliteration: 'Vakratunda Mahakaya Suryakoti Samaprabha', meaning: 'A prayer to Lord Ganesha, the elephant-headed deity, asking for his divine blessings to remove all obstacles from auspicious undertakings.', category: 'Ganesh', audio: '' },
  { id: 2, title: 'Gayatri Mantra', sanskrit: 'ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात्॥', transliteration: 'Om Bhur Bhuva Svaha, Tat Savitur Varenyam', meaning: 'The most revered Vedic mantra, a prayer to the divine solar energy to illuminate our intellect and awaken our consciousness.', category: 'Vedic', audio: '' },
  { id: 3, title: 'Karaagre Vasate Lakshmi', sanskrit: 'कराग्रे वसते लक्ष्मी\nकरमध्ये सरस्वती\nकरमूले तु गोविन्दः\nप्रभाते करदर्शनम्॥', transliteration: 'Karaagre Vasate Lakshmi, Karamadhye Saraswati', meaning: 'A morning prayer acknowledging the presence of Lakshmi at the fingertips, Saraswati in the palm, and Govinda at the base of the hand.', category: 'Morning', audio: '' },
  { id: 4, title: 'Guru Stotram', sanskrit: 'गुरुर्ब्रह्मा गुरुर्विष्णुः\nगुरुर्देवो महेश्वरः\nगुरुः साक्षात् परं ब्रह्म\nतस्मै श्री गुरवे नमः॥', transliteration: 'Gurur Brahma Gurur Vishnu, Gurur Devo Maheshwara', meaning: 'A verse of profound reverence to the Guru, who is revered as the embodiment of the divine Trinity — Brahma the creator, Vishnu the sustainer, and Shiva the transformer.', category: 'Guru', audio: '' },
  { id: 5, title: 'Sarve Bhavantu Sukhinah', sanskrit: 'सर्वे भवन्तु सुखिनः\nसर्वे सन्तु निरामयाः\nसर्वे भद्राणि पश्यन्तु\nमा कश्चित् दुःखभाग्भवेत्॥', transliteration: 'Sarve Bhavantu Sukhinah, Sarve Santu Niramayah', meaning: 'A universal prayer for the well-being of all beings — may all be happy, may all be free from illness, and may none experience suffering.', category: 'Universal', audio: '' },
  { id: 6, title: 'Asato Ma Sadgamaya', sanskrit: 'असतो मा सद्गमय\nतमसो मा ज्योतिर्गमय\nमृत्योर्मा अमृतं गमय\nॐ शान्तिः शान्तिः शान्तिः॥', transliteration: 'Asato Ma Sad Gamaya, Tamaso Ma Jyotir Gamaya', meaning: 'Lead me from the unreal to the real, from darkness to light, from mortality to immortality. A profound Vedic invocation of the Brihadaranyaka Upanishad.', category: 'Vedic', audio: '' },
  { id: 7, title: 'Shanti Path', sanskrit: 'ॐ द्यौः शान्तिरन्तरिक्षं\nशान्तिः पृथिवी शान्तिः\nआपः शान्तिरोषधयः\nशान्तिः॥', transliteration: 'Om Dyauh Shantir Antariksha Shantihi', meaning: 'A Vedic peace chant invoking harmony in all planes of existence — the heavens, the space between, the earth, waters and all of nature.', category: 'Vedic', audio: '' },
  { id: 8, title: 'Tvameva Mata', sanskrit: 'त्वमेव माता च पिता त्वमेव\nत्वमेव बन्धुश्च सखा त्वमेव\nत्वमेव विद्या द्रविणं त्वमेव\nत्वमेव सर्वं मम देव देव॥', transliteration: 'Tvameva Mata Cha Pita Tvameva', meaning: 'You alone are my mother and father, my relative and friend, my knowledge and my wealth. You are everything to me, O Lord of Lords.', category: 'Devotional', audio: '' },
];

let activeCategory = 'All';
let saved = {};
let currentTrack = null;
let isPlaying = false;
let playerVisible = false;

const audio = new Audio();
const els = {};

function getCategories() {
  return ['All', ...new Set(shlokaData.map((s) => s.category))];
}

function renderCategories() {
  const row = els.categoryRow;
  row.innerHTML = '';
  getCategories().forEach((c) => {
    const active = c === activeCategory;
    const cc = CAT_COLORS[c] || '#c9a45a';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill-filter on-light';
    btn.textContent = c;
    btn.style.borderColor = active ? cc : 'rgba(15,19,53,.14)';
    btn.style.background = active ? `${cc}18` : 'transparent';
    btn.style.color = active ? cc : 'rgba(15,19,53,.5)';
    btn.addEventListener('click', () => { activeCategory = c; renderCategories(); renderGrid(); });
    row.appendChild(btn);
  });
}

function renderGrid() {
  const grid = els.shlokaGrid;
  grid.innerHTML = '';
  const filtered = activeCategory === 'All' ? shlokaData : shlokaData.filter((s) => s.category === activeCategory);
  els.sectionTitle.textContent = activeCategory === 'All' ? 'All Shlokas' : `${activeCategory} Shlokas`;
  els.countLabel.textContent = `${filtered.length} shlokas`;

  filtered.forEach((s) => {
    const cc = CAT_COLORS[s.category] || '#9e7830';
    const isSaved = !!saved[s.id];
    const card = document.createElement('article');
    card.className = 'shloka-card';
    card.innerHTML = `
      <div class="shloka-card-head">
        <span class="shloka-cat-badge" style="background:${cc}18;color:${cc};border:1px solid ${cc}30">${s.category}</span>
        <button type="button" class="shloka-save-btn" aria-label="${isSaved ? 'Unsave shloka' : 'Save shloka'}" aria-pressed="${isSaved}" style="color:${isSaved ? '#c9a45a' : 'rgba(15,19,53,.22)'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isSaved ? '#c9a45a' : 'none'}" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
      <div class="shloka-sanskrit">${s.sanskrit}</div>
      <div class="shloka-translit">${s.transliteration}</div>
      <p class="shloka-meaning-page">${s.meaning}</p>
      <div class="shloka-actions">
        <button type="button" class="pill-btn-indigo" data-play>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Listen
        </button>
        <button type="button" class="pill-btn-outline" data-share>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          Share
        </button>
      </div>`;
    card.querySelector('[data-play]').addEventListener('click', () => playTrack(s));
    card.querySelector('[data-share]').addEventListener('click', () => shareShloka(s));
    card.querySelector('.shloka-save-btn').addEventListener('click', () => { saved[s.id] = !saved[s.id]; renderGrid(); });
    grid.appendChild(card);
  });
}

function shareShloka(s) {
  const shareData = { title: `${s.title} — ShlokaSvara`, text: `${s.transliteration} — ${s.meaning}`, url: window.location.href };
  if (navigator.share) navigator.share(shareData).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(shareData.url).catch(() => {});
}

function updatePlayerUI() {
  els.playerTitle.textContent = currentTrack ? currentTrack.title : '';
  els.miniPlayer.classList.toggle('is-visible', playerVisible);
  els.iconPlay.hidden = isPlaying;
  els.iconPause.hidden = !isPlaying;
  els.playerToggle.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
}

function playTrack(track) {
  if (currentTrack && currentTrack.id === track.id) { togglePlay(); return; }
  audio.pause();
  audio.src = track.audio || '';
  currentTrack = track;
  isPlaying = !!track.audio;
  if (track.audio) audio.play().catch(() => {});
  playerVisible = true;
  updatePlayerUI();
}

function togglePlay() {
  if (!currentTrack) return;
  if (isPlaying) { audio.pause(); isPlaying = false; }
  else if (currentTrack.audio) { audio.play().catch(() => {}); isPlaying = true; }
  updatePlayerUI();
}

function closePlayer() {
  audio.pause();
  playerVisible = false; isPlaying = false; currentTrack = null;
  updatePlayerUI();
}

document.addEventListener('DOMContentLoaded', () => {
  ['categoryRow', 'shlokaGrid', 'sectionTitle', 'countLabel', 'sotdSanskrit', 'sotdTranslit', 'sotdMeaning',
    'sotdPlayBtn', 'miniPlayer', 'playerTitle', 'playerToggle', 'playerClose', 'iconPlay', 'iconPause']
    .forEach((id) => { els[id] = document.getElementById(id); });

  audio.addEventListener('ended', () => { isPlaying = false; updatePlayerUI(); });

  const sotd = shlokaData[0];
  els.sotdSanskrit.textContent = sotd.sanskrit;
  els.sotdTranslit.textContent = sotd.transliteration;
  els.sotdMeaning.textContent = sotd.meaning;
  els.sotdPlayBtn.addEventListener('click', () => playTrack(sotd));

  els.playerToggle.addEventListener('click', togglePlay);
  els.playerClose.addEventListener('click', closePlayer);

  renderCategories();
  renderGrid();
});
