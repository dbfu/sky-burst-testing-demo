const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const healthEl = document.getElementById("health");
const levelEl = document.getElementById("level");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const startButton = document.getElementById("startButton");
const mobileButtons = [...document.querySelectorAll(".control-btn")];

const keys = {
  left: false,
  right: false,
  up: false,
  down: false,
};

const state = {
  running: false,
  gameOver: false,
  score: 0,
  level: 1,
  spawnTimer: 0,
  bossTimer: 0,
  stars: [],
  bullets: [],
  enemies: [],
  particles: [],
  player: null,
  lastTime: 0,
};

function resetGame() {
  Object.keys(keys).forEach((key) => {
    keys[key] = false;
  });
  state.running = true;
  state.gameOver = false;
  state.score = 0;
  state.level = 1;
  state.spawnTimer = 0;
  state.bossTimer = 0;
  state.bullets = [];
  state.enemies = [];
  state.particles = [];
  state.stars = createStars(80);
  state.player = {
    x: canvas.width / 2,
    y: canvas.height - 96,
    size: 18,
    speed: 320,
    cooldown: 0,
    health: 3,
    hitFlash: 0,
  };
  syncHud();
  hideOverlay();
}

function createStars(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 60 + 30,
  }));
}

function syncHud() {
  scoreEl.textContent = state.score;
  healthEl.textContent = state.player ? state.player.health : 0;
  levelEl.textContent = state.level;
}

function showOverlay(title, text, buttonText) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startButton.textContent = buttonText;
  overlay.classList.remove("is-hidden");
}

function hideOverlay() {
  overlay.classList.add("is-hidden");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function spawnBullet() {
  const player = state.player;
  state.bullets.push(
    {
      x: player.x - 8,
      y: player.y - 10,
      radius: 4,
      speed: 520,
      damage: 1,
    },
    {
      x: player.x + 8,
      y: player.y - 10,
      radius: 4,
      speed: 520,
      damage: 1,
    }
  );
}

function spawnEnemy(isBoss = false) {
  const levelScale = 1 + (state.level - 1) * 0.16;
  if (isBoss) {
    state.enemies.push({
      type: "boss",
      x: canvas.width / 2,
      y: -90,
      width: 140,
      height: 92,
      speed: 58 + state.level * 8,
      health: 18 + state.level * 5,
      drift: 0,
      entered: false,
    });
    return;
  }

  const size = Math.random() * 16 + 18;
  state.enemies.push({
    type: "enemy",
    x: Math.random() * (canvas.width - size * 2) + size,
    y: -40,
    width: size * 1.5,
    height: size * 1.8,
    speed: (Math.random() * 80 + 120) * levelScale,
    health: Math.ceil(levelScale),
    drift: (Math.random() - 0.5) * 90,
  });
}

function createExplosion(x, y, color, count = 10) {
  for (let i = 0; i < count; i += 1) {
    state.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 220,
      vy: (Math.random() - 0.5) * 220,
      life: Math.random() * 0.5 + 0.3,
      color,
    });
  }
}

function loseHealth() {
  if (!state.player || state.player.hitFlash > 0) {
    return;
  }
  state.player.health -= 1;
  state.player.hitFlash = 0.6;
  createExplosion(state.player.x, state.player.y, "#ff8674", 18);
  syncHud();

  if (state.player.health <= 0) {
    state.running = false;
    state.gameOver = true;
    showOverlay("任务失败", `最终得分 ${state.score}，到达第 ${state.level} 阶段。`, "重新开始");
  }
}

function collideRectCircle(rect, circle) {
  const testX = clamp(circle.x, rect.x - rect.width / 2, rect.x + rect.width / 2);
  const testY = clamp(circle.y, rect.y - rect.height / 2, rect.y + rect.height / 2);
  const dx = circle.x - testX;
  const dy = circle.y - testY;
  return dx * dx + dy * dy < circle.radius * circle.radius;
}

function collideRects(a, b) {
  return (
    Math.abs(a.x - b.x) * 2 < a.width + b.width &&
    Math.abs(a.y - b.y) * 2 < a.height + b.height
  );
}

function update(delta) {
  const player = state.player;
  if (!player) {
    return;
  }

  state.stars.forEach((star) => {
    star.y += star.speed * delta;
    if (star.y > canvas.height) {
      star.y = -4;
      star.x = Math.random() * canvas.width;
    }
  });

  const moveX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
  const moveY = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);

  // Fix BUG-002: 调整边界值以匹配玩家实际碰撞区域
  // 玩家碰撞区域宽度为 34px，边界值应为 17 (34/2)
  // 但考虑到视觉效果，调整为 25
  player.x = clamp(player.x + moveX * player.speed * delta, 25, canvas.width - 25);
  player.y = clamp(player.y + moveY * player.speed * delta, 36, canvas.height - 36);
  player.cooldown -= delta;
  player.hitFlash = Math.max(0, player.hitFlash - delta);

  if (player.cooldown <= 0) {
    spawnBullet();
    player.cooldown = 0.17;
  }

  state.spawnTimer += delta;
  state.bossTimer += delta;

  const spawnInterval = Math.max(0.22, 0.7 - (state.level - 1) * 0.04);
  if (state.spawnTimer >= spawnInterval) {
    spawnEnemy(false);
    state.spawnTimer = 0;
  }

  if (state.bossTimer >= 16) {
    spawnEnemy(true);
    state.bossTimer = 0;
    state.level += 1;
    syncHud();
  }

  state.bullets = state.bullets.filter((bullet) => {
    bullet.y -= bullet.speed * delta;
    return bullet.y > -20;
  });

  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.type === "boss") {
      enemy.y += enemy.entered ? 0 : enemy.speed * delta;
      if (enemy.y >= 120) {
        enemy.entered = true;
      }
      if (enemy.entered) {
        enemy.x += Math.sin(performance.now() / 700) * 90 * delta;
        enemy.y += Math.sin(performance.now() / 500) * 14 * delta;
      }
    } else {
      enemy.y += enemy.speed * delta;
      enemy.x += enemy.drift * delta;
    }

    if (enemy.y > canvas.height + 100) {
      return false;
    }

    state.bullets.forEach((bullet) => {
      if (bullet.dead) {
        return;
      }
      if (collideRectCircle(enemy, bullet)) {
        bullet.dead = true;
        enemy.health -= bullet.damage;
        createExplosion(bullet.x, bullet.y, "#8df3c1", 4);
        if (enemy.health <= 0) {
          enemy.dead = true;
          const scoreGain = enemy.type === "boss" ? 30 : 5;
          state.score += scoreGain;
          createExplosion(enemy.x, enemy.y, enemy.type === "boss" ? "#ffe27a" : "#ff8674", enemy.type === "boss" ? 28 : 12);
          syncHud();
        }
      }
    });

    const playerRect = { x: player.x, y: player.y, width: 34, height: 42 };
    if (!enemy.dead && collideRects(enemy, playerRect)) {
      enemy.dead = true;
      loseHealth();
      return false;
    }

    return !enemy.dead;
  });

  state.bullets = state.bullets.filter((bullet) => !bullet.dead);

  state.particles = state.particles.filter((particle) => {
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.life -= delta;
    return particle.life > 0;
  });
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0f2234");
  gradient.addColorStop(0.65, "#112433");
  gradient.addColorStop(1, "#10261a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  state.stars.forEach((star) => {
    ctx.globalAlpha = 0.3 + star.size / 3;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

function drawPlayer() {
  const player = state.player;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.fillStyle = player.hitFlash > 0 ? "#ffb19f" : "#8df3c1";
  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.lineTo(16, 16);
  ctx.lineTo(7, 12);
  ctx.lineTo(0, 24);
  ctx.lineTo(-7, 12);
  ctx.lineTo(-16, 16);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#173042";
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(5, 10);
  ctx.lineTo(-5, 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBullets() {
  ctx.fillStyle = "#c8ffe0";
  state.bullets.forEach((bullet) => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawEnemies() {
  state.enemies.forEach((enemy) => {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    if (enemy.type === "boss") {
      ctx.fillStyle = "#ffe27a";
      ctx.fillRect(-enemy.width / 2, -enemy.height / 2, enemy.width, enemy.height);
      ctx.fillStyle = "#7c1820";
      ctx.fillRect(-enemy.width / 2 + 12, -enemy.height / 2 + 12, enemy.width - 24, enemy.height - 24);
      ctx.fillStyle = "#fef4ce";
      ctx.fillRect(-34, -10, 68, 14);

      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(-enemy.width / 2, -enemy.height / 2 - 18, enemy.width, 8);
      ctx.fillStyle = "#8df3c1";
      const ratio = Math.max(0, enemy.health) / (18 + state.level * 5);
      ctx.fillRect(-enemy.width / 2, -enemy.height / 2 - 18, enemy.width * ratio, 8);
    } else {
      ctx.fillStyle = "#ff8674";
      ctx.beginPath();
      ctx.moveTo(0, enemy.height / 2);
      ctx.lineTo(enemy.width / 2, -enemy.height / 2);
      ctx.lineTo(0, -enemy.height / 4);
      ctx.lineTo(-enemy.width / 2, -enemy.height / 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  });
}

function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(0, particle.life * 1.6);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, 4, 4);
  });
  ctx.globalAlpha = 1;
}

function drawGameOverHint() {
  if (state.running) {
    return;
  }
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(16, canvas.height - 70, canvas.width - 32, 44);
  ctx.fillStyle = "#d4efe2";
  ctx.font = "16px Trebuchet MS";
  ctx.fillText("自动射击已启用，专注躲避和走位。", 34, canvas.height - 42);
}

function render() {
  drawBackground();
  if (state.player) {
    drawBullets();
    drawEnemies();
    drawPlayer();
    drawParticles();
  }
  drawGameOverHint();
}

function gameLoop(timestamp) {
  if (!state.lastTime) {
    state.lastTime = timestamp;
  }
  const delta = Math.min(0.032, (timestamp - state.lastTime) / 1000);
  state.lastTime = timestamp;

  if (state.running) {
    update(delta);
  }
  render();
  requestAnimationFrame(gameLoop);
}

function mapKey(event, isDown) {
  switch (event.key.toLowerCase()) {
    case "arrowleft":
    case "a":
      keys.left = isDown;
      break;
    case "arrowright":
    case "d":
      keys.right = isDown;
      break;
    case "arrowup":
    case "w":
      keys.up = isDown;
      break;
    case "arrowdown":
    case "s":
      keys.down = isDown;
      break;
    default:
      return;
  }
  event.preventDefault();
}

document.addEventListener("keydown", (event) => mapKey(event, true));
document.addEventListener("keyup", (event) => mapKey(event, false));

mobileButtons.forEach((button) => {
  const dir = button.dataset.dir;
  button.addEventListener("pointerdown", () => {
    keys[dir] = true;
  });
  button.addEventListener("pointerup", () => {
    keys[dir] = false;
  });
  button.addEventListener("pointerleave", () => {
    keys[dir] = false;
  });
});

canvas.addEventListener("pointermove", (event) => {
  if (!state.running || event.pointerType === "mouse") {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  state.player.x = clamp((event.clientX - rect.left) * scaleX, 28, canvas.width - 28);
  state.player.y = clamp((event.clientY - rect.top) * scaleY, 36, canvas.height - 36);
});

startButton.addEventListener("click", () => {
  state.lastTime = 0;
  resetGame();
});

showOverlay("准备起飞", "方向键或 WASD 移动。手机上可拖动飞机，敌机会越来越快。", "开始游戏");
resetGame();
state.running = false;
showOverlay("准备起飞", "方向键或 WASD 移动。手机上可拖动飞机，敌机会越来越快。", "开始游戏");
requestAnimationFrame(gameLoop);
