let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 600; // 10 minutes
let startTime;
let selectedOption = null;

// Load Questions
fetch('questions.json')
  .then(res => res.json())
  .then(data => questions = data);

// Start Quiz
document.getElementById('start-btn').onclick = () => {
  score = 0;
  currentQuestion = 0;
  selectedOption = null;
  document.getElementById('start-container').classList.add('hidden');
  document.getElementById('question-container').classList.remove('hidden');
  startTime = Date.now();
  startTimer();
  showQuestion();
};

// Show Question
function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('question').textContent = q.question;
  showOptions(q.options);
  updateButtons();
}

// Show Options
function showOptions(options) {
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  options.forEach((opt, i) => {
    const button = document.createElement('button');
    button.textContent = opt;
    button.onclick = () => selectOption(i);
    if (i === selectedOption) button.classList.add('selected');
    optionsContainer.appendChild(button);
  });
}

// Select Option
function selectOption(index) {
  selectedOption = index;
  document.querySelectorAll('#options button').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });
}

// Next Question ✅ (Handles Score Update)
document.getElementById('next-btn').onclick = () => {
  if (selectedOption !== null && selectedOption === questions[currentQuestion].answer) {
    score++;
  }
  selectedOption = null;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  }
};

// Previous Question ✅
document.getElementById('back-btn').onclick = () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    selectedOption = null;
    showQuestion();
  }
};

// ✅ Count Last Question's Score Before Showing Result
document.getElementById('check-score-btn').onclick = () => {
  if (selectedOption !== null && selectedOption === questions[currentQuestion].answer) {
    score++;
  }
  endQuiz();
};

// Update Button Visibility
function updateButtons() {
  document.getElementById('back-btn').classList.toggle('hidden', currentQuestion === 0);
  document.getElementById('next-btn').classList.toggle('hidden', currentQuestion === questions.length - 1);
  document.getElementById('check-score-btn').classList.toggle('hidden', currentQuestion !== questions.length - 1);
}

// Timer
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    if (timeLeft <= 0) endQuiz();
  }, 1000);
}

// End Quiz ✅
function endQuiz() {
  clearInterval(timer);
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  document.querySelector('.quiz-container').innerHTML = `
    <h2>Your Score: ${score} / ${questions.length}</h2>
    <p>Time Taken: ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s</p>
    <button onclick="location.reload()">Restart Quiz</button>
  `;
}
