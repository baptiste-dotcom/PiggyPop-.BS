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
const duckImg = new Image();
const sheepImg = new Image();
const cowImg = new Image();

let imagesLoaded = 0;
function checkStart() {
  imagesLoaded++;
  if (imagesLoaded === 4) {
    renderScores();
    gameLoop();
  }
}

pigImg.src = 'piggy.png';
pigImg.onload = checkStart;
duckImg.src = 'duck.png';
duckImg.onload = checkStart;
sheepImg.src = 'sheep.png';
sheepImg.onload = checkStart;
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
  const speedMultiplier = Math.min(1 + currentScore / 300, 2.5);
  const finalSpeed = baseSpeed * speedMultiplier;

  fallingAnimals.push({
    type: type,
    x: columnX,
    y: -150,
    speed: finalSpeed
  });
}

setInterval(() => {
  spawnAnimal(100);
  spawnAnimal(350);
  spawnAnimal(600);
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
        fallingAnimals.splice(i
