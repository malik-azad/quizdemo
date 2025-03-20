
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 600; // 10 minutes in seconds
let testStartTime;


// Load JSON Data

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
  })
  .catch(err => console.error('Failed to load questions:', err));

// Start Test

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-container').classList.add('hidden');
  document.getElementById('question-container').classList.remove('hidden');
  document.getElementById('timer').classList.remove('hidden');
  
  testStartTime = Date.now(); // Record start time
  startTimer();
  showQuestion();
});

// Questions

function showQuestion() {
  const question = questions[currentQuestionIndex];
  document.getElementById('question').textContent = question.question;

  // Load options
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.onclick = () => selectAnswer(index, button);
    optionsContainer.appendChild(button);
  });

  document.getElementById('next-btn').classList.add('hidden');
}

// Answer 

function selectAnswer(index, button) {
  document.querySelectorAll('#options button').forEach(btn => {
    btn.classList.remove('selected');
  });

  button.classList.add('selected');

  if (index === questions[currentQuestionIndex].answer) {
    score++;
  }

  document.getElementById('next-btn').classList.remove('hidden');
}

// Next Button

document.getElementById('next-btn').addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    document.getElementById('check-score-btn').classList.remove('hidden');
    document.getElementById('next-btn').classList.add('hidden');
  }
});

// Timer Function

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
      `Time Left: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    
    if (timeLeft <= 0) endQuiz();
  }, 1000);
}


// Show Score

document.getElementById('check-score-btn').addEventListener('click', endQuiz);

function endQuiz() {
  clearInterval(timer);

  const timeTaken = Math.floor((Date.now() - testStartTime) / 1000); // in seconds

  document.querySelector('.quiz-container').innerHTML = `
    <h1>Quiz Completed!</h1>
    <p>Your Score: ${score} / ${questions.length}</p>
    <p>Time Taken: ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s</p>
    <button onclick="location.reload()">Restart Quiz</button>
  `;
}
