const startBtn = document.getElementById("startBtn");
const digitInput = document.getElementById("digitInput");
const gameArea = document.getElementById("gameArea");
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const resultDiv = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");

let answer = [];
let length = 0;
let attempts = 0;
let gameStarted = false;

function generateNumberNoDup(len) {
  const digits = [];
  const candidates = [0,1,2,3,4,5,6,7,8,9];

  while (digits.length < len) {
    const idx = Math.floor(Math.random() * candidates.length);
    const num = candidates[idx];
    digits.push(num);
    candidates.splice(idx, 1);
  }

  return digits;
}

function hasDuplicate(str) {
  return new Set(str).size !== str.length;
}

function isValidGuess(guess, length) {
  const validPattern = new RegExp(`^\\d{${length}}$`);
  if (!validPattern.test(guess)) {
    alert(`${length}자리 숫자를 입력해주세요.`);
    return false;
  }

  if (hasDuplicate(guess)) {
    alert("중복되지 않는 숫자를 입력해주세요.");
    return false;
  }

  return true;
}

function resetInput() {
  guessInput.value = "";
  guessInput.focus();
}

function resetGame() {
  answer = [];
  length = 0;
  attempts = 0;
  gameStarted = false;

  gameArea.style.display = "none";
  resultDiv.textContent = "";
  resetBtn.style.display = "none";

  digitInput.disabled = false;
  startBtn.disabled = false;

  resetInput();
}

function startGame() {
  const val = Number(digitInput.value);

  if (!Number.isInteger(val) || val < 2 || val > 9) {
    alert("2부터 9 사이의 정수를 입력해주세요.");
    return;
  }

  length = val;
  answer = generateNumberNoDup(length);
  attempts = 0;
  gameStarted = true;

  gameArea.style.display = "flex";
  resultDiv.textContent = `${length}자리 숫자가 생성되었습니다. 숫자를 입력하고 확인 버튼을 눌러주세요.`;

  digitInput.disabled = true;
  startBtn.disabled = true;

  resetInput();
}

function handleGuess() {
  if (!gameStarted) {
    alert("먼저 게임을 시작해주세요.");
    return;
  }

  const guess = guessInput.value.trim();

  if (!isValidGuess(guess, length)) {
    return;
  }

  const guessArr = guess.split("").map(Number);
  attempts++;

  const result = evaluateGuess(guessArr);
  const strikes = result.strikes;
  const balls = result.balls;

  if (strikes === length) {
    resultDiv.textContent = `🎉 정답! 축하합니다!\n시도 횟수: ${attempts}\n정답: ${answer.join("")}`;
    endGame();
  } else {
    resultDiv.textContent = `${strikes} 스트라이크, ${balls} 볼\n시도 횟수: ${attempts}`;
    resetInput();
  }
}

function evaluateGuess(guessArr) {
  let strikes = 0;
  let balls = 0;

  for (let i = 0; i < length; i++) {
    const digit = guessArr[i];
    if (digit === answer[i]) {
      strikes++;
    } else if (answer.includes(digit)) {
      balls++;
    }
  }

  return { strikes, balls };
}

function endGame() {
  gameStarted = false;
  gameArea.style.display = "none";
  resetBtn.style.display = "block";
}

startBtn.addEventListener("click", startGame);
guessBtn.addEventListener("click", handleGuess);
resetBtn.addEventListener("click", resetGame);

guessInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    guessBtn.click();
  }
});
