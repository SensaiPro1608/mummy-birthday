const modal = document.getElementById('surpriseModal');
const toast = document.getElementById('toast');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function openSurprise() {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('closeModal').focus();
}
function closeSurprise() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-surprise]').forEach(button => {
  button.addEventListener('click', openSurprise);
});
document.getElementById('closeModal').addEventListener('click', closeSurprise);
modal.addEventListener('click', event => {
  if (event.target === modal) closeSurprise();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !modal.hidden) closeSurprise();
});

document.querySelectorAll('[data-scroll]').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById(button.dataset.scroll).scrollIntoView({ behavior: 'smooth' });
  });
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.getElementById('loveButton').addEventListener('click', () => {
  showToast('💗 Sending Mom a big hug and a million kisses!');
  burstHearts();
});
document.getElementById('celebrateButton').addEventListener('click', () => {
  closeSurprise();
  burstHearts();
  showToast('🎉 Happy Birthday, Mom! You deserve all the happiness!');
});

document.querySelectorAll('.memory-tile').forEach(tile => {
  tile.addEventListener('click', () => showToast(tile.dataset.caption));
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-links a').forEach(item => item.classList.remove('active'));
    link.classList.add('active');
  });
});

// Play the familiar "Happy Birthday" melody with Web Audio (no external file needed).
let audioContext = null;
let musicPlaying = false;
let musicRunId = 0;
let activeMusicNodes = [];
const musicCard = document.getElementById('musicCard');
const musicStatus = document.getElementById('musicStatus');

// Notes for the Happy Birthday tune, with durations in seconds.
const birthdayMelody = [
  [523.25,.34],[523.25,.18],[587.33,.52],[523.25,.52],[698.46,.52],[659.25,.95],
  [523.25,.34],[523.25,.18],[587.33,.52],[523.25,.52],[783.99,.52],[698.46,.95],
  [523.25,.34],[523.25,.18],[1046.50,.52],[880.00,.52],[698.46,.52],[659.25,.52],[587.33,.95],
  [932.33,.34],[932.33,.18],[880.00,.52],[698.46,.52],[783.99,.52],[698.46,1.05]
];
function stopBirthdaySong() {
  musicPlaying = false;
  musicRunId++;
  activeMusicNodes.forEach(node => { try { node.stop(); } catch (_) {} });
  activeMusicNodes = [];
  musicStatus.textContent = 'Tap to play Happy Birthday';
}
function scheduleBirthdayPhrase(runId) {
  if (!musicPlaying || runId !== musicRunId || !audioContext) return;
  let cursor = audioContext.currentTime + 0.08;
  birthdayMelody.forEach(([frequency, duration]) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, cursor);
    gain.gain.setValueAtTime(0.0001, cursor);
    gain.gain.exponentialRampToValueAtTime(0.16, cursor + 0.025);
    gain.gain.setValueAtTime(0.12, Math.max(cursor + 0.03, cursor + duration - 0.07));
    gain.gain.exponentialRampToValueAtTime(0.0001, cursor + duration - 0.015);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(cursor);
    oscillator.stop(cursor + duration);
    activeMusicNodes.push(oscillator);
    oscillator.onended = () => { activeMusicNodes = activeMusicNodes.filter(node => node !== oscillator); };
    cursor += duration;
  });
  const phraseLength = birthdayMelody.reduce((sum, note) => sum + note[1], 0);
  window.setTimeout(() => scheduleBirthdayPhrase(runId), phraseLength * 1000 + 80);
}
musicCard.addEventListener('click', async () => {
  if (musicPlaying) {
    stopBirthdaySong();
    showToast('Birthday song stopped. Tap to play it again!');
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    showToast('Your browser does not support audio playback.');
    return;
  }
  try {
    audioContext = audioContext || new AudioContextClass();
    await audioContext.resume();
    musicPlaying = true;
    const runId = ++musicRunId;
    musicStatus.textContent = '♪ Playing Happy Birthday…';
    showToast('🎂 Happy Birthday melody is playing!');
    scheduleBirthdayPhrase(runId);
  } catch (error) {
    stopBirthdaySong();
    showToast('Please click the music button again to enable sound.');
  }
});

function burstHearts() {
  const symbols = ['💗', '💖', '💕', '✨', '♥'];
  for (let i = 0; i < 18; i++) {
    const heart = document.createElement('span');
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.position = 'fixed';
    heart.style.left = (10 + Math.random() * 80) + 'vw';
    heart.style.top = (35 + Math.random() * 45) + 'vh';
    heart.style.zIndex = '70';
    heart.style.pointerEvents = 'none';
    heart.style.fontSize = (18 + Math.random() * 22) + 'px';
    heart.style.transition = 'transform 1.6s ease, opacity 1.6s ease';
    document.body.appendChild(heart);
    requestAnimationFrame(() => {
      heart.style.transform = `translate(${(Math.random() - .5) * 150}px, -${80 + Math.random() * 180}px) rotate(${Math.random() * 90 - 45}deg)`;
      heart.style.opacity = '0';
    });
    setTimeout(() => heart.remove(), 1700);
  }
}

// Update the active navigation item as the page is scrolled.
const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const matchingLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (matchingLink) {
          document.querySelectorAll('.nav-links a').forEach(item => item.classList.remove('active'));
          matchingLink.classList.add('active');
        }
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(section => observer.observe(section));
}


// Clickable personal photo gallery with next/previous controls.
const photoButtons = [...document.querySelectorAll('[data-photo]')];
const photoLightbox = document.getElementById('photoLightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
let currentPhoto = 0;
function showPhoto(index) {
  currentPhoto = (index + photoButtons.length) % photoButtons.length;
  const button = photoButtons[currentPhoto];
  lightboxImage.src = button.dataset.photo;
  lightboxImage.alt = button.querySelector('img').alt;
  lightboxCaption.textContent = button.dataset.caption || '';
}
function openPhoto(index) {
  showPhoto(index);
  photoLightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('photoLightboxClose').focus();
}
function closePhoto() {
  photoLightbox.hidden = true;
  lightboxImage.src = '';
  document.body.style.overflow = '';
}
photoButtons.forEach((button, index) => button.addEventListener('click', () => openPhoto(index)));
document.getElementById('photoLightboxClose').addEventListener('click', closePhoto);
document.getElementById('photoPrev').addEventListener('click', () => showPhoto(currentPhoto - 1));
document.getElementById('photoNext').addEventListener('click', () => showPhoto(currentPhoto + 1));
photoLightbox.addEventListener('click', event => { if (event.target === photoLightbox) closePhoto(); });
document.addEventListener('keydown', event => {
  if (photoLightbox.hidden) return;
  if (event.key === 'Escape') closePhoto();
  if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
  if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
});
