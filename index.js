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

  //   const num1 = Math.floor(Math.random() * 10) + 1;
  const num1 = Math.floor(Math.random() * 9) + 2;
  const num2 = Math.floor(Math.random() * 9) + 2;
  //   const num2 = Math.floor(Math.random() * 10) + 1;
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
    optionElement.addEventListener("touchstart", touchStart, {
      passive: true,
    });
    optionElement.addEventListener("touchmove", touchMove, {
      passive: false,
    });
    optionElement.addEventListener("touchend", touchEnd);
    optionsContainer.appendChild(optionElement);
  });

  document.getElementById("dropZone").textContent =
    "Arrastra tu respuesta aquí! 🎯";
  document.getElementById("result").textContent = "";
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
      checkAnswer("timeOut");
    }
  }, 1000);
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.textContent);
}

function allowDrop(ev) {
  ev.preventDefault();
  ev.target.classList.add("hover");
}

function drop(ev) {
  ev.preventDefault();
  ev.target.classList.remove("hover");
  const data = ev.dataTransfer.getData("text");
  checkAnswer(parseInt(data));
}

function dragLeave(ev) {
  ev.target.classList.remove("hover");
}

let touchedElement = null;

function touchStart(ev) {
  touchedElement = ev.target;
  ev.target.style.opacity = "0.5";
}

function touchMove(ev) {
  ev.preventDefault();
  const touch = ev.touches[0];
  const dropZone = document.getElementById("dropZone");
  const dropZoneRect = dropZone.getBoundingClientRect();

  if (
    touch.clientX > dropZoneRect.left &&
    touch.clientX < dropZoneRect.right &&
    touch.clientY > dropZoneRect.top &&
    touch.clientY < dropZoneRect.bottom
  ) {
    dropZone.classList.add("hover");
  } else {
    dropZone.classList.remove("hover");
  }
}

function touchEnd(ev) {
  const dropZone = document.getElementById("dropZone");
  const dropZoneRect = dropZone.getBoundingClientRect();
  const touch = ev.changedTouches[0];

  if (
    touch.clientX > dropZoneRect.left &&
    touch.clientX < dropZoneRect.right &&
    touch.clientY > dropZoneRect.top &&
    touch.clientY < dropZoneRect.bottom
  ) {
    checkAnswer(parseInt(touchedElement.textContent));
  }

  touchedElement.style.opacity = "1";
  dropZone.classList.remove("hover");
  touchedElement = null;
}

function checkAnswer(userAnswer) {
  clearInterval(timerInterval);
  const resultElement = document.getElementById("result");

  if (userAnswer === "timeOut") {
    resultElement.textContent = "¡Tiempo agotado! ¡Inténtalo de nuevo!";
    resultElement.style.color = "#FFA500";
  } else if (userAnswer === correctAnswer) {
    resultElement.textContent = "¡Correcto! ¡Eres genial!";
    resultElement.style.color = "#4CAF50";
    score += 10;
    document.getElementById("score").textContent = `Estrellas: ${score} ⭐`;
    playCorrectSound();
  } else {
    resultElement.textContent = `¡Ups! La respuesta correcta es ${correctAnswer}.`;
    resultElement.style.color = "#FF6B6B";
    playIncorrectSound();
  }

  setTimeout(generateQuestion, 2000);
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("question").style.display = "none";
  document.getElementById("options").style.display = "none";
  document.getElementById("dropZone").style.display = "none";
  document.getElementById("timer").style.display = "none";
  document.getElementById("result").style.display = "none";

  const gameOverElement = document.getElementById("gameOver");
  gameOverElement.style.display = "block";
  gameOverElement.innerHTML = `
                <p>¡Juego terminado!</p>
                <p>Tu puntuación final es: ${score}</p>
                <p>${getEncouragement()}</p>
            `;
}

function getEncouragement() {
  if (score === 150)
    return "¡Perfecto! ¡Eres un genio de las multiplicaciones!";
  if (score >= 120) return "¡Increíble! ¡Eres un experto en multiplicar!";
  if (score >= 100)
    return "¡Muy bien! Estás dominando las tablas de multiplicar.";
  if (score >= 50)
    return "¡Buen trabajo! Sigue practicando para mejorar aún más.";
  return "¡Bien hecho! Con más práctica te convertirás en un experto.";
}

function resetGame() {
  score = 0;
  questionNumber = 0;
  document.getElementById("score").textContent = "Puntuación: 0";
  document.getElementById("question").style.display = "block";
  document.getElementById("options").style.display = "flex";
  document.getElementById("dropZone").style.display = "flex";
  document.getElementById("timer").style.display = "block";
  document.getElementById("result").style.display = "block";
  document.getElementById("gameOver").style.display = "none";
  generateQuestion();
}

function playCorrectSound() {
  // a futuro añadir un sonido de respuesta correcta
}

function playIncorrectSound() {
  // a futuro añadir un sonido de respuesta incorrecta
}

const dropZone = document.getElementById("dropZone");
dropZone.addEventListener("dragover", allowDrop);
dropZone.addEventListener("drop", drop);
dropZone.addEventListener("dragleave", dragLeave);

document.getElementById("resetButton").addEventListener("click", resetGame);

generateQuestion();
