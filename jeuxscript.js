const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const ratio = 9 / 16;
  const maxCanvasWidth = window.innerWidth * 0.9;
  const maxCanvasHeight = window.innerHeight * 0.9;

  let canvasWidth = maxCanvasWidth;
  let canvasHeight = canvasWidth / ratio;

  if (canvasHeight > maxCanvasHeight) {
    canvasHeight = maxCanvasHeight;
    canvasWidth = canvasHeight * ratio;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.width = canvasWidth + 'px';
  canvas.style.height = canvasHeight + 'px';
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
  const speedMultiplier = Math.min(1 + currentScore / 300, 3.5);
  const finalSpeed = baseSpeed * speedMultiplier;

  fallingAnimals.push({
    type: type,
    x: columnX,
    y: -150,
    speed: finalSpeed
  });
}

setInterval(() => {
  spawnAnimal(250);
  spawnAnimal(550);
}, 1000);

let currentScore = 0;
let comboCharge = 5;
let comboLevel = 0;

function getComboBonus(level) {
  switch (level) {
    case 1: return 100;
    case 2: return 200;
    case 3: return 350;
    case 4: return 550;
    default: return 800 + (level - 4) * 250;
  }
}

function updateComboChargeDisplay() {
  document.getElementById('comboChargeDisplay').textContent =
    `⚡ COMBO LV${comboLevel} — ${comboCharge} cochons avant bonus`;
}

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
    ctx.drawImage(animalImages[animal.type], animal.x, animal.y, 240, 300);
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
}

function drawFloatingScores() {
  floatingScores.forEach((score, index) => {
    ctx.font = '80px VT323';
    ctx.fillStyle = `rgba(${hexToRgb(score.color)}, ${score.opacity})`;
    ctx.textAlign = 'center';
    ctx.save();
    ctx.translate(score.x, score.y);
    ctx.scale(1 + score.opacity * 0.2, 1 + score.opacity * 0.2);
    ctx.fillText(score.text, 0, 0);
    ctx.restore();

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
    ctx.font = canvas.width < 600 ? '72px VT323' : '96px VT323';
    return;
  }
  requestAnimationFrame(gameLoop);
}

let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

function saveScore(newScore) {
  const bestScore = Math.max(newScore, highScores[0] || 0);
  highScores = [bestScore];
  localStorage.setItem('highScores', JSON.stringify(highScores));
  renderScores();
}

function renderScores() {
  const scoreList = document.getElementById('scoreList');
  scoreList.innerHTML = '';
const li = document.createElement('li');
li.textContent = `🏆 Meilleur score : ${highScores[0]} pts`;
scoreList.appendChild(li);
  });
}

function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('currentScore');
  scoreDisplay.textContent = `Score : ${currentScore.toString().padStart(4, '0')} pts`;
}

function updateComboDisplay() {
  const comboEl = document.getElementById('comboDisplay');
  comboEl.textContent = `🔥 COMBO : ${comboLevel}`;
  if (comboLevel >= 1) {
    comboEl.classList.add('combo-flash');
  } else {
    comboEl.classList.remove('combo-flash');
  }
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
      const hitMargin = 20;
      if (
        x >= animal.x - hitMargin && x <= animal.x + 240 + hitMargin &&
        y >= animal.y - hitMargin && y <= animal.y + 300 + hitMargin
      ) {
        let scoreValue;
        let color;

        if (animal.type === 'pig') {
          eauSound.play();
          comboCharge--;

          let bonus = 0;
          if (comboCharge === 0) {
            comboLevel++;
            bonus = getComboBonus(comboLevel);
            comboCharge = 5;
          }

          currentScore += 30 + bonus;
          scoreValue = `+${30 + bonus}`;
          color = '#00ffcc';

          floatingScores.push({
            text: scoreValue,
            x: animal.x + 60,
            y: animal.y,
            opacity: 1,
            color: color
          });

          if (bonus > 0) {
            floatingScores.push({
              text: `🌟 COMBO LV${comboLevel} +${bonus}`,
              x: animal.x + 60,
              y: animal.y - 40,
              opacity: 1,
              color: '#ff00ff'
            });
          }

          updateComboChargeDisplay();
        } else {
          boumSound.play();
          scoreValue = '-10';
          currentScore = Math.max(0, currentScore - 10);
          color = '#ff0033';
          comboCharge = 5;
          comboLevel = 0;

          floatingScores.push({
            text: scoreValue,
            x: animal.x + 60,
            y: animal.y,
            opacity: 1,
            color: color
          });

          updateComboChargeDisplay();
        }

        fallingAnimals.splice(i, 1);
        break;
      }
    }
  }

  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    handleClick(clickX, clickY);
  });

  canvas.addEventListener('touchstart', function (e) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width

