const WORDS = ['NIÑO','CAMIÓN','PROGRAMAR','JAVASCRIPT','AHORCADO','ESPAÑA','PINGÜINO','MONTAÑA'];
const MAX_LIVES = 6;

let secret = '', revealed = [], lives = MAX_LIVES, used = new Set(), finished = false;

const maskedEl = document.getElementById('masked');
const messageEl = document.getElementById('message');
const livesEl = document.getElementById('lives');
const triesEl = document.getElementById('tries');
const keyboardEl = document.getElementById('keyboard');
const restartBtn = document.getElementById('restart');
const parts = ['part-head','part-body','part-larm','part-rarm','part-lleg','part-rleg'].map(id => document.getElementById(id));

function normalizeLetter(ch) {
  const map = { 'Á':'A','À':'A','Ä':'A','Â':'A','É':'E','È':'E','Ë':'E','Ê':'E','Í':'I','Ì':'I','Ï':'I','Î':'I','Ó':'O','Ò':'O','Ö':'O','Ô':'O','Ú':'U','Ù':'U','Ü':'U','Û':'U' };
  ch = ch.toUpperCase();
  return map[ch] || ch;
}

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function renderMasked() {
  maskedEl.textContent = revealed.map(c => c ? c : '_').join(' ');
}

function updateLives() {
  livesEl.textContent = lives;
  triesEl.textContent = used.size;
  const fails = MAX_LIVES - lives;
  parts.forEach((p,i) => p.style.opacity = i < fails ? 1 : 0);
}

function handleGuess(letter) {
  if (finished) return;
  letter = normalizeLetter(letter);
  if (!/^[A-ZÑ]$/.test(letter) || used.has(letter)) return;
  used.add(letter);
  const btn = keyboardEl.querySelector(`button[data-letter="${letter}"]`);
  if (btn) btn.disabled = true;

  let found = false;
  for (let i=0; i<secret.length; i++) {
    if (normalizeLetter(secret[i]) === letter) {
      revealed[i] = secret[i];
      found = true;
    }
  }

  messageEl.textContent = found ? 'Acertaste' : 'Fallo';
  messageEl.style.color = found ? 'green' : 'var(--danger)';
  if (!found) lives--;
  updateLives();
  renderMasked();
  checkEnd();
}

function checkEnd() {
  if (!revealed.includes(null)) {
    finished = true;
    messageEl.textContent = '¡Victoria!';
    lockKeyboard();
  } else if (lives <= 0) {
    finished = true;
    messageEl.textContent = 'Derrota. La palabra era: ' + secret;
    revealed = secret.split('');
    renderMasked();
    lockKeyboard();
  }
}

function lockKeyboard() {
  keyboardEl.querySelectorAll('button.key').forEach(b => b.disabled = true);
}

function buildKeyboard() {
  keyboardEl.innerHTML = '';
  const order = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  order.forEach(l => {
    const btn = document.createElement('button');
    btn.className = 'key';
    btn.textContent = l;
    btn.dataset.letter = l;
    btn.addEventListener('click', () => handleGuess(l));
    keyboardEl.appendChild(btn);
  });
}

function restart() {
  finished = false; used.clear();
  secret = pickWord();
  revealed = secret.split('').map(c => c === ' ' ? ' ' : null);
  lives = MAX_LIVES;
  messageEl.textContent = 'Comienza el juego';
  buildKeyboard();
  updateLives();
  renderMasked();
}

document.addEventListener('keydown', e => {
  if (finished) return;
  const key = e.key.toUpperCase();
  if (/^[A-ZÑ]$/.test(key)) handleGuess(key);
});

restartBtn.addEventListener('click', restart);
restart();
