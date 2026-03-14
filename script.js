// ════════════════════════════════════════════════════════════
//  Site Amour — script.js
// ════════════════════════════════════════════════════════════

// ── 📸 CONFIGURATION DES PHOTOS ──────────────────────────────
// Ajoute tes photos dans le dossier "images/" et liste les noms ici.
// Formats acceptés : .jpeg, .png, .webp, .gif

const PHOTOS_COUPLE = [
  'images/couple1.jpeg',
  'images/couple2.jpeg',
  'images/couple3.jpeg',
  'images/couple4.jpeg',
  'images/couple5.jpeg',
  'images/couple6.jpeg',
];

const PHOTO_DROLE = 'images/drole.jpeg';

// ── Emojis cœurs ─────────────────────────────────────────────
const HEARTS = ['❤️', '💕', '💖', '💗', '💓', '🌹', '💝', '🥰', '😘'];

// ── État du bouton Non ────────────────────────────────────────
let escapesCount = 0;
let heartsTimer  = null;

const NON_LABELS = [
  'Non 😅',
  'Non non ! 🏃',
  'Tu ne m\'attraperas pas ! 😂',
  'Jamais ! 🤪',
  'Au secours ! 😱',
  'Pitié pitié ! 😭',
  'OK ok... peut-être 🤔',
  'Bonne chance ! 😈',
];

// ── Références DOM ────────────────────────────────────────────
const btnOui    = document.getElementById('btn-oui');
const btnNon    = document.getElementById('btn-non');
const btnRetry  = document.getElementById('btn-retry');
const btnRetour = document.getElementById('btn-retour-oui');
const gallery   = document.getElementById('gallery');
const photoDrole = document.getElementById('photo-drole');

// ════════════════════════════════════════════════════════════
//  CŒURS FLOTTANTS
// ════════════════════════════════════════════════════════════

function spawnHeart(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const el       = document.createElement('span');
  el.className   = 'heart-fly';
  el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];

  el.style.left            = Math.random() * 100 + 'vw';
  el.style.fontSize        = (1 + Math.random() * 2) + 'rem';
  el.style.animationDuration = (4 + Math.random() * 5) + 's';

  container.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function startHearts(containerId, interval = 380) {
  if (heartsTimer) clearInterval(heartsTimer);
  heartsTimer = setInterval(() => spawnHeart(containerId), interval);
}

// ════════════════════════════════════════════════════════════
//  EXPLOSION DE CONFETTIS (clic Oui)
// ════════════════════════════════════════════════════════════

function confettiBurst(originX, originY) {
  const count = 30;
  for (let i = 0; i < count; i++) {
    const el     = document.createElement('span');
    el.className = 'confetti';
    el.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];

    const angle = (Math.PI * 2 * i) / count + (Math.random() - .5) * .5;
    const dist  = 80 + Math.random() * 220;

    el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--ty', Math.sin(angle) * dist - 60 + 'px');
    el.style.left            = originX + 'px';
    el.style.top             = originY + 'px';
    el.style.fontSize        = (.8 + Math.random() * 1.4) + 'rem';
    el.style.animationDuration = (.5 + Math.random() * .7) + 's';

    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

// ════════════════════════════════════════════════════════════
//  BOUTON NON QUI S'ÉCHAPPE
// ════════════════════════════════════════════════════════════

function fuirBoutonNon() {
  escapesCount++;

  // Changer le label
  const idx = Math.min(escapesCount, NON_LABELS.length - 1);
  btnNon.textContent = NON_LABELS[idx];

  // Calculer une position aléatoire
  const w   = btnNon.offsetWidth  || 130;
  const h   = btnNon.offsetHeight || 50;
  const pad = 24;
  const maxX = window.innerWidth  - w - pad;
  const maxY = window.innerHeight - h - pad;
  const newX = pad + Math.floor(Math.random() * maxX);
  const newY = pad + Math.floor(Math.random() * maxY);

  btnNon.style.position = 'fixed';
  btnNon.style.left     = newX + 'px';
  btnNon.style.top      = newY + 'px';
  btnNon.style.zIndex   = '9999';
}

function resetBoutonNon() {
  escapesCount      = 0;
  btnNon.textContent = 'Non 😅';
  btnNon.style.position = '';
  btnNon.style.left     = '';
  btnNon.style.top      = '';
  btnNon.style.zIndex   = '';
}

// ════════════════════════════════════════════════════════════
//  GALERIE PHOTOS
// ════════════════════════════════════════════════════════════

function buildGallery() {
  gallery.innerHTML = '';
  let photosLoaded  = 0;

  PHOTOS_COUPLE.forEach((src, i) => {
    const img = new Image();
    img.src   = src;

    img.onload = () => {
      img.className  = 'gallery-photo';
      img.alt        = `Photo ${i + 1}`;
      img.style.animationDelay = (photosLoaded * .15) + 's';
      gallery.appendChild(img);
      photosLoaded++;
    };

    img.onerror = () => {
      // Placeholder décoratif si image absente
      const div = document.createElement('div');
      div.className = 'gallery-placeholder';
      div.style.animationDelay = (photosLoaded * .15) + 's';
      div.innerHTML = `<span>❤️</span><p>Photo ${i + 1}</p>`;
      gallery.appendChild(div);
      photosLoaded++;
    };
  });
}

// Charge la photo drôle (essaie plusieurs formats)
function loadPhotoDrole() {
  const bases   = ['images/drole'];
  const exts    = ['.jpeg', '.png', '.webp', '.gif', '.svg'];
  const sources = [];
  bases.forEach(b => exts.forEach(e => sources.push(b + e)));

  let idx = 0;
  function tryNext() {
    if (idx >= sources.length) {
      // Aucune image trouvée : afficher emoji
      photoDrole.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.cssText = 'font-size:6rem; margin-bottom:16px;';
      fallback.textContent   = '😅';
      photoDrole.parentNode.insertBefore(fallback, photoDrole);
      return;
    }
    photoDrole.src     = sources[idx];
    photoDrole.onerror = () => { idx++; tryNext(); };
  }
  tryNext();
}

// ════════════════════════════════════════════════════════════
//  NAVIGATION ENTRE ÉCRANS
// ════════════════════════════════════════════════════════════

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Clic sur OUI ─────────────────────────────────────────────
btnOui.addEventListener('click', (e) => {
  confettiBurst(e.clientX, e.clientY);

  showScreen('screen-oui');
  startHearts('hearts-bg-oui', 300);
  buildGallery();
});

// ── Bouton Non : s'échappe au survol ─────────────────────────
btnNon.addEventListener('mouseenter', fuirBoutonNon);
btnNon.addEventListener('touchstart', fuirBoutonNon, { passive: true });

// ── Si on arrive quand même à cliquer sur Non ────────────────
btnNon.addEventListener('click', () => {
  if (heartsTimer) clearInterval(heartsTimer);
  resetBoutonNon();
  loadPhotoDrole();
  showScreen('screen-non');
});

// ── Bouton Réessayer ─────────────────────────────────────────
btnRetry.addEventListener('click', () => {
  showScreen('screen-question');
  startHearts('hearts-bg', 380);
});

// ── Bouton Retour depuis Oui ──────────────────────────────────
btnRetour.addEventListener('click', () => {
  if (heartsTimer) clearInterval(heartsTimer);
  showScreen('screen-question');
  startHearts('hearts-bg', 380);
});

// ════════════════════════════════════════════════════════════
//  DÉMARRAGE
// ════════════════════════════════════════════════════════════
startHearts('hearts-bg', 380);
