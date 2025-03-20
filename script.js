let questions = [];
let currentQuestion = 0;
let selectedOptions = [];
let timer;
let timeLeft = 180; // 3 minutes
let startTime;

// Load Questions
fetch('questions.json')
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    questions = data;
  });

// Start Quiz
document.getElementById('start-btn').onclick = function() {
  selectedOptions = new Array(questions.length).fill(null);
  currentQuestion = 0;
  document.getElementById('start-container').classList.add('hidden');
  document.getElementById('question-container').classList.remove('hidden');
  startTime = Date.now();
  startTimer();
  showQuestion();
};

// Show Question
function showQuestion() {
  let q = questions[currentQuestion];
  document.getElementById('question').textContent = q.question;
  let optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  for (let i = 0; i < q.options.length; i++) {
    let button = document.createElement('button');
    button.textContent = q.options[i];
    if (selectedOptions[currentQuestion] === i) {
      button.classList.add('selected');
    }
    button.onclick = function() {
      selectOption(i);
    };
    optionsContainer.appendChild(button);
  }

  updateButtons();
}

// Select Option
function selectOption(index) {
  selectedOptions[currentQuestion] = index;
  showQuestion(); // Refresh options to reflect selection
}

// Next Question
document.getElementById('next-btn').onclick = function() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    showQuestion();
  }
};

// Previous Question
document.getElementById('back-btn').onclick = function() {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
};

// Timer
function startTimer() {
  timer = setInterval(function() {
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    document.getElementById('timer').textContent = minutes + ':' + seconds;
    if (timeLeft <= 0) {
      endQuiz();
    }
  }, 1000);
}

// End Quiz
document.getElementById('check-score-btn').onclick = function() {
  endQuiz();
};

function endQuiz() {
  clearInterval(timer);
  let timeTaken = Math.floor((Date.now() - startTime) / 1000);

  // Calculate score 
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (selectedOptions[i] === questions[i].answer) {
      score++;
    }
  }

  document.querySelector('.quiz-container').innerHTML = `
    <h2>Your Score: ${score} / ${questions.length}</h2>
    <p>Time Taken: ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s</p>
    <button onclick="location.reload()">Restart Quiz</button>
  `;
}

function updateButtons() {
  if (currentQuestion === 0) {
    document.getElementById('back-btn').classList.add('hidden');
  } else {
    document.getElementById('back-btn').classList.remove('hidden');
  }

  if (currentQuestion === questions.length - 1) {
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('check-score-btn').classList.remove('hidden');
  } else {
    document.getElementById('next-btn').classList.remove('hidden');
    document.getElementById('check-score-btn').classList.add('hidden');
  }
}
