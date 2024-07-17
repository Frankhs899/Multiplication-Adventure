let correctAnswer,
  score = 0,
  timeLeft = 10,
  timerInterval,
  questionNumber = 0;
const TOTAL_QUESTIONS = 15;

function generateQuestion() {
  if (questionNumber >= TOTAL_QUESTIONS) {
    endGame();
    return;
  }

  questionNumber++;
  document.getElementById(
    "questionCount"
  ).textContent = `Pregunta: ${questionNumber} / ${TOTAL_QUESTIONS} 🚀`;

  const num1 = Math.floor(Math.random() * 9) + 2;
  const num2 = Math.floor(Math.random() * 9) + 2;
  correctAnswer = num1 * num2;
  document.getElementById(
    "question"
  ).textContent = `¿Cuánto es ${num1} x ${num2}?`;

  const options = [correctAnswer];
  while (options.length < 4) {
    const randomAnswer = Math.floor(Math.random() * 100) + 1;
    if (!options.includes(randomAnswer)) {
      options.push(randomAnswer);
    }
  }

  const shuffledOptions = options.sort(() => Math.random() - 0.5);

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";
  shuffledOptions.forEach((option) => {
    const optionElement = document.createElement("div");
    optionElement.className = "option";
    optionElement.textContent = option;
    optionElement.draggable = true;
    optionElement.addEventListener("dragstart", drag);
    optionElement.addEventListener("touchstart", touchStart);
    optionElement.addEventListener("touchmove", touchMove);
    optionElement.addEventListener("touchend", touchEnd);
    optionsContainer.appendChild(optionElement);
  });

  resetTimer();
}

function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = 10;
  document.getElementById("timer").textContent = `Tiempo: ${timeLeft}s ⏱️`;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `Tiempo: ${timeLeft}s ⏱️`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      generateQuestion();
    }
  }, 1000);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const answer = parseInt(data, 10);
  checkAnswer(answer);
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.textContent);
}

function allowDrop(event) {
  event.preventDefault();
}

function checkAnswer(answer) {
  if (answer === correctAnswer) {
    score++;
    document.getElementById("score").textContent = `Estrellas: ${score} ⭐`;
    document.getElementById("result").textContent = "¡Correcto! 🎉";
  } else {
    document.getElementById("result").textContent = "Incorrecto 🙁";
  }
  clearInterval(timerInterval);
  setTimeout(generateQuestion, 1000);
}

document.getElementById("dropZone").addEventListener("drop", drop);
document.getElementById("dropZone").addEventListener("dragover", allowDrop);
document.getElementById("resetButton").addEventListener("click", resetGame);

function resetGame() {
  score = 0;
  questionNumber = 0;
  document.getElementById("score").textContent = "Estrellas: 0 ⭐";
  document.getElementById("gameOver").style.display = "none";
  document.getElementById("resetButton").style.display = "none";
  generateQuestion();
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("question").textContent = "";
  document.getElementById("options").innerHTML = "";
  document.getElementById("timer").textContent = "";
  document.getElementById("dropZone").textContent = "";
  document.getElementById("gameOver").style.display = "block";
  document.getElementById(
    "gameOver"
  ).textContent = `¡Juego terminado! Has ganado ${score} estrellas! 🎉`;
  document.getElementById("resetButton").style.display = "block";
}

// Mobile touch event handlers
let touchStartX = 0;
let touchStartY = 0;

function touchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function touchMove(event) {
  event.preventDefault();
  const touch = event.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  const optionElement = event.target;
  optionElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
}

function touchEnd(event) {
  const optionElement = event.target;
  optionElement.style.transform = "";
  const dropZone = document.getElementById("dropZone");
  const dropZoneRect = dropZone.getBoundingClientRect();
  const optionRect = optionElement.getBoundingClientRect();
  const isInsideDropZone =
    optionRect.left >= dropZoneRect.left &&
    optionRect.right <= dropZoneRect.right &&
    optionRect.top >= dropZoneRect.top &&
    optionRect.bottom <= dropZoneRect.bottom;

  if (isInsideDropZone) {
    const answer = parseInt(optionElement.textContent, 10);
    checkAnswer(answer);
  }
}

generateQuestion();
