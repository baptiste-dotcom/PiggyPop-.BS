const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const ratio = 4 / 3;
  const targetWidth = window.innerWidth;
  const targetHeight = window.innerHeight;

  let canvasWidth = targetWidth;
  let canvasHeight = canvasWidth / ratio;

  if (canvasHeight > targetHeight) {
    canvasHeight = targetHeight;
    canvasWidth = canvasHeight * ratio;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const eauSound = new Audio('eau.mp3');
const boumSound = new Audio('tir.mp3');
const gameOverSound = new Audio('boum.mp3');

let isGameOver = false;
let floatingScores = [];

const pigImg = new Image();
pigImg.src = 'piggy.png';
pigImg.onload = checkStart;

const duckImg = new Image();
duckImg.src = 'duck.png';
duckImg.onload = checkStart;

const sheepImg = new Image();
sheepImg.src = 'sheep.png';
sheepImg.onload = checkStart;

const cowImg = new Image();
cowImg.src = 'cow.png';
cowImg.onload = checkStart;

const animalTypes = ['pig', 'duck', 'sheep', 'cow'];
const animalImages = {
  pig: pigImg,
  duck: duckImg,
  sheep: sheepImg,
  cow: cowImg
};

let fallingAnimals = [];

function spawnAnimal(columnX) {
  const type = animalTypes[Math.floor(Math.random() * animalTypes.length)];
  const baseSpeed = Math.random() * 3 + 2;
  const speedMultiplier = 1 + currentScore / 80;
  const finalSpeed = baseSpeed * speedMultiplier;

  fallingAnimals.push({
    type: type,
    x: columnX,
    y: -150,
    speed: finalSpeed
  });
}

setInterval(() => {
  spawnAnimal(200);
  spawnAnimal(500);
}, 1000);

let currentScore = 0;

function drawBackground() {
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGameOverOverlay() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '96px VT323';
  ctx.fillStyle = '#ff0033';
  ctx.textAlign = 'center';
  ctx.textShadow = '0 0 20px #ff0033';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
}

function drawFallingAnimals() {
  fallingAnimals.forEach((animal, i) => {
    ctx.drawImage(animalImages[animal.type], animal.x, animal.y, 120, 150);
    animal.y += animal.speed;

    if (animal.y > canvas.height) {
      if (animal.type === 'pig') {
        triggerGameOver();
      } else {
        fallingAnimals.splice(i, 1);
      }
    }
  });
}

function triggerGameOver() {
  isGameOver = true;
  gameOverSound.play();
  saveScore(currentScore);
  document.getElementById('restartButton').style.display = 'block';

  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '72px VT323';
  ctx.fillStyle = '#ff0033';
  ctx.textAlign = 'center';
  ctx.textShadow = '0 0 10px #ff0033';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

  document.getElementById('restartButton').style.display = 'block';
}

function drawFloatingScores() {
  floatingScores.forEach((score, index) => {
    ctx.font = '32px VT323';
    ctx.fillStyle = `rgba(${hexToRgb(score.color)}, ${score.opacity})`;
    ctx.textAlign = 'center';
    ctx.fillText(score.text, score.x, score.y);

    score.y -= 1;
    score.opacity -= 0.02;

    if (score.opacity <= 0) {
      floatingScores.splice(index, 1);
    }
  });
}

function gameLoop() {
  drawBackground();
  drawFallingAnimals();
  updateScoreDisplay();
  drawFloatingScores();
  
  if (isGameOver) {
    drawGameOverOverlay();
    return;
  }
  requestAnimationFrame(gameLoop);
}

let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

function saveScore(newScore) {
  highScores.push(newScore);
  highScores.sort((a, b) => b - a);
  highScores = highScores.slice(0, 5);
  localStorage.setItem('highScores', JSON.stringify(highScores));
  renderScores();
}

function renderScores() {
  const scoreList = document.getElementById('scoreList');
  scoreList.innerHTML = '';
  highScores.forEach((score, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${score} pts`;
    scoreList.appendChild(li);
  });
}

function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('currentScore');
  scoreDisplay.textContent = `Score : ${currentScore.toString().padStart(4, '0')} pts`;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
}

let imagesLoaded = 0;

function checkStart() {
  function handleClick(x, y) {
    for (let i = fallingAnimals.length - 1; i >= 0; i--) {
      const animal = fallingAnimals[i];
      if (
        x >= animal.x && x <= animal.x + 120 &&
        y >= animal.y && y <= animal.y + 150
      ) {
        let scoreValue;
        let color;

        if (animal.type === 'pig') {
          eauSound.play();
          scoreValue = '+30';
          currentScore += 30;
          color = '#00ffcc';
        } else {
          boumSound.play();
          scoreValue = '-10';
          currentScore = Math.max(0, currentScore - 10);
          color = '#ff0033';
        }

        floatingScores.push({
          text: scoreValue,
          x: animal.x + 60,
          y: animal.y,
          opacity: 1,
          color: color
        });

        fallingAnimals.splice(i, 1);
        break;
      }
    }
  }

  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    handleClick(clickX, clickY);
  });

  canvas.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    handleClick(touchX, touchY);
  });

  imagesLoaded++;
  if (imagesLoaded === 4) {
    renderScores();
    gameLoop();
  }
}

document.getElementById('restartButton').addEventListener('click', () => {
  isGameOver = false;
  currentScore = 0;
  fallingAnimals = [];
  document.getElementById('restartButton').style.display = 'none';
  gameLoop();
});





