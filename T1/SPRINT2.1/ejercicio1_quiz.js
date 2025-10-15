const QUESTIONS = [
  { q: '¿Cuál es la capital de España?', choices: ['Barcelona','Madrid','Valencia','Sevilla'], a: 1 },
  { q: '2 + 2 = ?', choices: ['3','4','22','5'], a: 1 },
  { q: '¿Color primario?', choices: ['Verde','Azul','Naranja','Rosa'], a: 1 },
  { q: 'HTML significa', choices: ['HyperText Markup Language','HighText Markup Language','Hyperlinks and Text Markup','Hola Mundo'], a: 0 },
  { q: '¿Cuál es la lengua co-oficial en Galicia?', choices: ['Catalán','Gallego','Euskera','Valenciano'], a: 1 }
];

const TIME_PER_QUESTION = 10;

let idx = 0, score = 0, timerId = null, timeLeft = TIME_PER_QUESTION, locked = false;

const qtext = document.getElementById('questionText');
const optionsEl = document.getElementById('options');
const progressEl = document.getElementById('progress');
const timeEl = document.getElementById('time');
const qindexEl = document.getElementById('qindex');
const qtotalEl = document.getElementById('qtotal');
const feedbackEl = document.getElementById('feedback');
const summaryEl = document.getElementById('summary');
const restartBtn = document.getElementById('restart');

const questions = QUESTIONS.map(q => ({...q, choices: q.choices.slice()})).sort(() => Math.random() - 0.5);
qtotalEl.textContent = questions.length;

function startQuestion() {
  locked = false;
  timeLeft = TIME_PER_QUESTION;
  const cur = questions[idx];
  qtext.textContent = cur.q;
  optionsEl.innerHTML = '';
  feedbackEl.textContent = '';

  cur.choices.forEach((choice, i) => {
    const label = document.createElement('label');
    label.className = 'option';
    label.dataset.index = i;
    label.innerHTML = `<input type="radio" name="choice"> <span>${choice}</span>`;
    label.addEventListener('click', onSelect);
    optionsEl.appendChild(label);
  });

  qindexEl.textContent = idx + 1;
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timeEl.textContent = timeLeft;
  progressEl.style.width = '100%';
  timerId = setInterval(() => {
    timeLeft -= 0.1;
    if (timeLeft < 0) timeLeft = 0;
    timeEl.textContent = Math.ceil(timeLeft);
    progressEl.style.width = `${(timeLeft / TIME_PER_QUESTION) * 100}%`;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleTimeout();
    }
  }, 100);
}

function handleTimeout() {
  if (locked) return;
  locked = true;
  feedbackEl.textContent = 'Tiempo agotado';
  feedbackEl.style.color = 'var(--wrong)';
  markCorrectVisual();
  setTimeout(nextQuestion, 1000);
}

function onSelect(e) {
  if (locked) return;
  const chosen = Number(e.currentTarget.dataset.index);
  locked = true;
  clearInterval(timerId);
  const cur = questions[idx];
  if (chosen === cur.a) {
    e.currentTarget.classList.add('correct');
    feedbackEl.textContent = 'Correcto';
    feedbackEl.style.color = 'var(--correct)';
    score++;
  } else {
    e.currentTarget.classList.add('wrong');
    feedbackEl.textContent = 'Incorrecto';
    feedbackEl.style.color = 'var(--wrong)';
    markCorrectVisual();
  }
  setTimeout(nextQuestion, 900);
}

function markCorrectVisual() {
  const cur = questions[idx];
  [...optionsEl.children].forEach(label => {
    if (Number(label.dataset.index) === cur.a) label.classList.add('correct');
  });
}

function nextQuestion() {
  idx++;
  if (idx >= questions.length) showSummary();
  else startQuestion();
}

function showSummary() {
  clearInterval(timerId);
  document.getElementById('questionArea').style.display = 'none';
  summaryEl.style.display = 'block';
  summaryEl.innerHTML = `<div class="summary">Fin del quiz. Puntuación: <strong>${score}</strong> de ${questions.length}</div>`;
}

function restart() {
  idx = 0; score = 0;
  document.getElementById('questionArea').style.display = '';
  summaryEl.style.display = 'none';
  startQuestion();
}

restartBtn.addEventListener('click', restart);
startQuestion();
