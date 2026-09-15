const difficultySettings = {
  easy: { label: "Easy", min: 1, max: 50 },
  medium: { label: "Medium", min: 1, max: 100 },
  hard: { label: "Hard", min: 1, max: 500 },
};

const randomNumberBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function createSubmitButton({ label = "Submit", id = "", className = "", disabled = false, onClick } = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "submit-button";

  if (className) {
    button.classList.add(className);
  }

  if (id) {
    button.id = id;
  }

  button.textContent = label;

  if (disabled) {
    button.disabled = true;
  }

  if (typeof onClick === "function") {
    button.addEventListener("click", onClick);
  }

  return button;
}

const guessInput = document.getElementById("guessInput");
const restartButton = document.getElementById("restartButton");
const difficultySelect = document.getElementById("difficultySelect");
const attemptsLabel = document.getElementById("attempts");
const scoreLabel = document.getElementById("score");
const messageBox = document.getElementById("message");
const guessList = document.getElementById("guessList");
const leaderboardList = document.getElementById("leaderboardList");
const subtitle = document.querySelector(".subtitle");
const guessButton = createSubmitButton({
  id: "guessButton",
  label: "Guess",
});

const controlsRow = document.querySelector(".controls-row");
const existingGuessButton = document.getElementById("guessButton");

if (existingGuessButton) {
  existingGuessButton.replaceWith(guessButton);
} else {
  controlsRow.appendChild(guessButton);
}

const SCORE_STORAGE_KEY = "guessing-game-leaderboard";
const previousGuesses = [];
let currentDifficulty = "medium";
let targetNumber = 0;
let attempts = 0;
let score = 100;
let gameOver = false;

function getDifficultySettings(level) {
  return difficultySettings[level] || difficultySettings.medium;
}

function updateAttempts() {
  attemptsLabel.textContent = attempts;
}

function updateScore() {
  scoreLabel.textContent = score;
}

function renderGuessHistory() {
  if (previousGuesses.length === 0) {
    guessList.innerHTML = "<li>No guesses yet</li>";
    return;
  }

  guessList.innerHTML = previousGuesses.map((guess) => `<li>${guess}</li>`).join("");
}

function setMessage(text, type = "") {
  messageBox.textContent = text;
  messageBox.className = "message";

  if (type) {
    messageBox.classList.add(type);
  }
}

function getLeaderboard() {
  const storedScores = localStorage.getItem(SCORE_STORAGE_KEY);

  if (!storedScores) {
    return [];
  }

  try {
    const parsed = JSON.parse(storedScores);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveScoreToLeaderboard() {
  const leaderboard = getLeaderboard();
  leaderboard.push({ score, attempts, difficulty: currentDifficulty });

  const sortedLeaderboard = leaderboard
    .sort((a, b) => b.score - a.score || a.attempts - b.attempts)
    .slice(0, 5);

  localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(sortedLeaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const leaderboard = getLeaderboard();

  if (leaderboard.length === 0) {
    leaderboardList.innerHTML = "<li>No scores yet</li>";
    return;
  }

  leaderboardList.innerHTML = leaderboard
    .map(
      (entry, index) =>
        `<li>#${index + 1} — ${entry.score} pts (${entry.difficulty.toUpperCase()}) — ${entry.attempts} attempts</li>`
    )
    .join("");
}

function startNewGame(level = currentDifficulty) {
  currentDifficulty = level;
  const settings = getDifficultySettings(level);

  targetNumber = randomNumberBetween(settings.min, settings.max);
  attempts = 0;
  score = 100;
  gameOver = false;
  previousGuesses.length = 0;

  guessInput.min = String(settings.min);
  guessInput.max = String(settings.max);
  guessInput.value = "";
  guessInput.disabled = false;
  guessButton.disabled = false;
  guessInput.placeholder = `Enter a number between ${settings.min} and ${settings.max}`;
  subtitle.textContent = `I’m thinking of a number between ${settings.min} and ${settings.max}.`;

  updateAttempts();
  updateScore();
  renderGuessHistory();
  setMessage(`New ${settings.label.toLowerCase()} game started! Guess a number between ${settings.min} and ${settings.max}.`, "warning");
  guessInput.focus();
}

function checkGuess() {
  if (gameOver) return;

  const settings = getDifficultySettings(currentDifficulty);
  const userGuess = Number(guessInput.value);

  if (!Number.isInteger(userGuess) || userGuess < settings.min || userGuess > settings.max) {
    setMessage(`Please enter a valid whole number between ${settings.min} and ${settings.max}.`, "warning");
    guessInput.focus();
    return;
  }

  attempts += 1;
  updateAttempts();
  previousGuesses.push(userGuess);
  renderGuessHistory();

  if (userGuess === targetNumber) {
    gameOver = true;
    guessInput.disabled = true;
    guessButton.disabled = true;
    setMessage(`🎉 Correct! ${targetNumber} was the secret number. Final score: ${score}. You solved it in ${attempts} attempts.`, "success");
    saveScoreToLeaderboard();
    return;
  }

  score = Math.max(0, score - 5);
  updateScore();

  if (userGuess < targetNumber) {
    setMessage("Too low! Try a higher number.", "error");
  } else {
    setMessage("Too high! Try a lower number.", "error");
  }

  guessInput.value = "";
  guessInput.focus();
}

function restartGame() {
  startNewGame(currentDifficulty);
}

guessButton.addEventListener("click", checkGuess);
restartButton.addEventListener("click", restartGame);
difficultySelect.addEventListener("change", (event) => {
  startNewGame(event.target.value);
});

guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkGuess();
  }
});

startNewGame(currentDifficulty);
renderLeaderboard();
