/*
 * ShlokaSvara content data.
 * Kept separate from markup/logic so new items can be added without
 * touching HTML or JS elsewhere. Shape is CMS-ready per the brand brief:
 * every playable item carries id/title/category/description/image/audio/
 * duration/artist/type; shlokas additionally carry sanskrit/transliteration/
 * englishMeaning/hindiMeaning.
 */

const musicItems = [
  { id: 1, type: 'music', title: 'Morning Devotion', category: 'Morning', duration: '32 min', description: 'Sacred morning prayers to begin the day with gratitude and light.', artist: 'ShlokaSvara', image: '', audio: '' },
  { id: 2, type: 'music', title: 'Peace & Meditation', category: 'Meditation', duration: '45 min', description: 'Deep stillness for a peaceful, undisturbed mind.', artist: 'ShlokaSvara', image: '', audio: '' },
  { id: 3, type: 'music', title: 'Powerful Mantras', category: 'Mantras', duration: '28 min', description: 'Ancient mantras for inner strength and mental clarity.', artist: 'ShlokaSvara', image: '', audio: '' },
  { id: 4, type: 'music', title: 'Evening Bhakti', category: 'Bhakti', duration: '38 min', description: 'Surrender to devotion as the day draws to a close.', artist: 'ShlokaSvara', image: '', audio: '' },
  { id: 5, type: 'music', title: 'Divine Instrumentals', category: 'Instrumental', duration: '52 min', description: 'Soulful instrumental soundscapes for the contemplative heart.', artist: 'ShlokaSvara', image: '', audio: '' },
  { id: 6, type: 'music', title: 'Sleep & Relaxation', category: 'Sleep', duration: '60 min', description: 'Gentle, calming sounds to carry you into peaceful rest.', artist: 'ShlokaSvara', image: '', audio: '' },
];

const shlokas = [
  { id: 1, type: 'shloka', title: 'Ganesh Shloka', sanskrit: 'वक्रतुण्ड महाकाय\nसूर्यकोटि समप्रभः\nनिर्विघ्नं कुरु मे देव\nशुभकार्येषु सर्वदा॥', transliteration: 'Vakratunda Mahakaya', englishMeaning: 'A sacred prayer to Lord Ganesha, seeking his blessings for an auspicious and obstacle-free beginning.', hindiMeaning: '', category: 'Ganesh', image: '', audio: '' },
  { id: 2, type: 'shloka', title: 'Gayatri Mantra', sanskrit: 'ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात्॥', transliteration: 'Om Bhur Bhuva Svaha', englishMeaning: 'The most revered Vedic mantra — a prayer to the divine sun for illumination of the mind and intelligence.', hindiMeaning: '', category: 'Vedic', image: '', audio: '' },
  { id: 3, type: 'shloka', title: 'Karaagre Vasate Lakshmi', sanskrit: 'कराग्रे वसते लक्ष्मी\nकरमध्ये सरस्वती\nकरमूले तु गोविन्दः\nप्रभाते करदर्शनम्॥', transliteration: 'Karaagre Vasate Lakshmi', englishMeaning: "A morning prayer acknowledging the divine presence of Lakshmi, Saraswati and Govinda in one's hands upon waking.", hindiMeaning: '', category: 'Morning', image: '', audio: '' },
  { id: 4, type: 'shloka', title: 'Guru Stotram', sanskrit: 'गुरुर्ब्रह्मा गुरुर्विष्णुः\nगुरुर्देवो महेश्वरः\nगुरुः साक्षात् परं ब्रह्म\nतस्मै श्री गुरवे नमः॥', transliteration: 'Gurur Brahma Gurur Vishnu', englishMeaning: 'A profound verse of reverence to the Guru — revered as the embodiment of the divine Trinity of Brahma, Vishnu and Shiva.', hindiMeaning: '', category: 'Guru', image: '', audio: '' },
  { id: 5, type: 'shloka', title: 'Sarve Bhavantu Sukhinah', sanskrit: 'सर्वे भवन्तु सुखिनः\nसर्वे सन्तु निरामयाः\nसर्वे भद्राणि पश्यन्तु\nमा कश्चित् दुःखभाग्भवेत्॥', transliteration: 'Sarve Bhavantu Sukhinah', englishMeaning: 'A universal prayer for the happiness, health and liberation of all beings everywhere.', hindiMeaning: '', category: 'Universal', image: '', audio: '' },
];

const mantras = [
  { id: 1, type: 'mantra', title: 'Om Namah Shivaya', sanskrit: 'ॐ नमः शिवाय', deity: 'Shiva', description: 'The Panchakshara — the five-syllable mantra of Lord Shiva', duration: '3:22', image: '', audio: '' },
  { id: 2, type: 'mantra', title: 'Maha Mrityunjaya', sanskrit: 'ॐ त्र्यम्बकं यजामहे', deity: 'Shiva', description: 'The great Vedic mantra of victory over death and suffering', duration: '4:15', image: '', audio: '' },
  { id: 3, type: 'mantra', title: 'Gayatri Mantra', sanskrit: 'ॐ भूर्भुवः स्वः', deity: 'Meditation', description: 'The supreme Vedic mantra for wisdom and enlightenment', duration: '2:48', image: '', audio: '' },
  { id: 4, type: 'mantra', title: 'Hanuman Chalisa', sanskrit: 'जय हनुमान ज्ञान गुण', deity: 'Hanuman', description: 'Forty sacred verses of devotion to Lord Hanuman', duration: '8:30', image: '', audio: '' },
  { id: 5, type: 'mantra', title: 'Om Namo Narayanaya', sanskrit: 'ॐ नमो नारायणाय', deity: 'Vishnu', description: 'The Ashtakshara — the eight-syllable mantra of Lord Vishnu', duration: '3:05', image: '', audio: '' },
  { id: 6, type: 'mantra', title: 'Om Mahalakshmyai', sanskrit: 'ॐ महालक्ष्म्यै नमः', deity: 'Shakti', description: 'A sacred prayer to the divine goddess of abundance and grace', duration: '2:55', image: '', audio: '' },
  { id: 7, type: 'mantra', title: 'Durga Stuti', sanskrit: 'या देवी सर्वभूतेषु', deity: 'Shakti', description: 'A hymn to the all-pervading divine mother Durga', duration: '5:12', image: '', audio: '' },
  { id: 8, type: 'mantra', title: 'Vakratunda Mahakaya', sanskrit: 'वक्रतुण्ड महाकाय', deity: 'Ganesh', description: 'Sacred prayer to Lord Ganesha for auspicious beginnings', duration: '2:30', image: '', audio: '' },
];

const mantraDeities = ['All', 'Shiva', 'Vishnu', 'Shakti', 'Ganesh', 'Hanuman', 'Meditation'];

const journeys = [
  { id: 1, title: 'Morning Peace', description: '"Begin your day with calm and clarity."', duration: '45 min', tracks: 8 },
  { id: 2, title: 'Shiva Sadhana', description: '"Sacred sounds for devotion and deep reflection."', duration: '60 min', tracks: 12 },
  { id: 3, title: 'Evening Serenity', description: '"Slow down. Breathe. Listen."', duration: '35 min', tracks: 7 },
  { id: 4, title: 'Deep Meditation', description: '"Sounds for stillness and absolute focus."', duration: '50 min', tracks: 6 },
  { id: 5, title: 'Daily Bhakti', description: '"A devotional journey through sacred sound."', duration: '40 min', tracks: 10 },
];

const bhajans = [
  { id: 1, type: 'bhajan', title: 'Achyutam Keshavam', deity: 'Krishna', category: 'Krishna', duration: '6:15', image: '', audio: '' },
  { id: 2, type: 'bhajan', title: 'Om Namah Shivaya', deity: 'Shiva', category: 'Shiva', duration: '5:45', image: '', audio: '' },
  { id: 3, type: 'bhajan', title: 'Jai Raghunandan', deity: 'Ram', category: 'Ram', duration: '4:30', image: '', audio: '' },
  { id: 4, type: 'bhajan', title: 'Jai Hanuman Gyan Gun', deity: 'Hanuman', category: 'Hanuman', duration: '7:20', image: '', audio: '' },
  { id: 5, type: 'bhajan', title: 'Durge Durgati Nasini', deity: 'Devi', category: 'Devi', duration: '5:10', image: '', audio: '' },
  { id: 6, type: 'bhajan', title: 'Raghupati Raghava', deity: 'Ram', category: 'Ram', duration: '3:55', image: '', audio: '' },
];

const whyFeatures = [
  { id: 1, title: 'Sacred Tradition', desc: "Rooted in India's timeless spiritual traditions, from ancient Vedic chants to living devotional practice.", iconPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { id: 2, title: 'Soulful Sound', desc: 'Beautifully crafted devotional music and soundscapes that speak directly to the heart.', iconPath: 'M9 18V5l12-2v13M9 9l12-2' },
  { id: 3, title: 'Meaning & Understanding', desc: 'Explore the profound meaning behind every shloka, mantra and sacred verse.', iconPath: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
  { id: 4, title: 'Peace in Everyday Life', desc: 'Bring moments of calm, reflection and sacred connection into the rhythm of daily life.', iconPath: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
];

const suggestedSearches = ['Ganesh', 'Shiva', 'Krishna', 'Hanuman', 'Morning', 'Meditation', 'Peace'];

const shlokaOfTheDay = shlokas[0];
