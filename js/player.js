/*
 * ShlokaSvara persistent music player.
 * Wraps the HTML5 Audio API. Tracks with no `audio` source (all demo
 * content ships without real audio files) play visually but surface a
 * "Demo audio unavailable" status instead of throwing or looking broken.
 */

const Player = (() => {
  const audio = new Audio();
  let playlist = [];
  let currentTrack = null;
  let isPlaying = false;

  let els = {};

  function cacheEls() {
    els = {
      player: document.getElementById('musicPlayer'),
      spacer: document.getElementById('playerSpacer'),
      artwork: document.getElementById('playerArtwork'),
      title: document.getElementById('playerTrackTitle'),
      artist: document.getElementById('playerTrackArtist'),
      toggle: document.getElementById('playerToggle'),
      iconPlay: document.getElementById('playerIconPlay'),
      iconPause: document.getElementById('playerIconPause'),
      prev: document.getElementById('playerPrev'),
      next: document.getElementById('playerNext'),
      seekTrack: document.getElementById('playerSeek'),
      progressFill: document.getElementById('playerProgressFill'),
      currentTime: document.getElementById('playerCurrentTime'),
      duration: document.getElementById('playerDuration'),
      status: document.getElementById('playerStatus'),
      volume: document.getElementById('playerVolume'),
      close: document.getElementById('playerClose'),
    };
  }

  function formatTime(secs) {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function updateIcons() {
    els.iconPlay.hidden = isPlaying;
    els.iconPause.hidden = !isPlaying;
    els.toggle.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
  }

  function updateTrackInfo() {
    els.title.textContent = currentTrack ? currentTrack.title : 'Select a track to begin';
    els.artist.textContent = currentTrack ? (currentTrack.artist || 'ShlokaSvara') : '';
    els.status.hidden = !(currentTrack && !currentTrack.audio);
  }

  function showPlayer() {
    els.player.classList.add('is-visible');
    els.spacer.classList.add('is-visible');
  }

  function play(track) {
    if (currentTrack && currentTrack.trackId === track.trackId) {
      togglePlay();
      return;
    }
    audio.pause();
    audio.src = track.audio || '';
    currentTrack = track;
    isPlaying = !!track.audio;
    if (track.audio) audio.play().catch(() => {});
    audio.currentTime = 0;
    els.progressFill.style.width = '0%';
    els.currentTime.textContent = '0:00';
    els.duration.textContent = '0:00';
    updateTrackInfo();
    updateIcons();
    showPlayer();
  }

  function togglePlay() {
    if (!currentTrack) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else if (currentTrack.audio) {
      audio.play().catch(() => {});
      isPlaying = true;
    }
    updateIcons();
  }

  function playPrev() {
    if (!currentTrack) return;
    const idx = playlist.findIndex((t) => t.trackId === currentTrack.trackId);
    if (idx > 0) play(playlist[idx - 1]);
  }

  function playNext() {
    if (!currentTrack) return;
    const idx = playlist.findIndex((t) => t.trackId === currentTrack.trackId);
    if (idx >= 0 && idx < playlist.length - 1) play(playlist[idx + 1]);
  }

  function closePlayer() {
    audio.pause();
    isPlaying = false;
    currentTrack = null;
    els.player.classList.remove('is-visible');
    els.spacer.classList.remove('is-visible');
    updateTrackInfo();
    updateIcons();
  }

  function seekTo(e) {
    if (!currentTrack || !audio.duration) return;
    const rect = els.seekTrack.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    els.progressFill.style.width = `${ratio * 100}%`;
  }

  function setVolume(e) {
    audio.volume = Number(e.target.value) / 100;
  }

  function bindEvents() {
    audio.addEventListener('timeupdate', () => {
      if (!audio.duration) return;
      els.progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
      els.currentTime.textContent = formatTime(audio.currentTime);
    });
    audio.addEventListener('loadedmetadata', () => {
      els.duration.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('ended', () => {
      isPlaying = false;
      els.progressFill.style.width = '0%';
      els.currentTime.textContent = '0:00';
      updateIcons();
    });

    els.toggle.addEventListener('click', togglePlay);
    els.prev.addEventListener('click', playPrev);
    els.next.addEventListener('click', playNext);
    els.close.addEventListener('click', closePlayer);
    els.seekTrack.addEventListener('click', seekTo);
    els.volume.addEventListener('input', setVolume);
  }

  function init(allTracks) {
    playlist = allTracks;
    cacheEls();
    audio.volume = Number(els.volume.value) / 100;
    bindEvents();
  }

  return { init, play };
})();
