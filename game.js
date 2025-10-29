// Platanus Hack 25: Bug to Feature Game
// Convert bugs to features, collect them, and launch production rockets!

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000011',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

// Game variables
let player;
let mothership;
let bugs = [];
let features = [];
let bullets = [];
let productionRockets = [];
let score = 0;
let lives = 3;
let featureCount = 0;
let scoreText;
let livesText;
let featureText;
let gameOver = false;
let bugSpawnTimer = 0;
let mothershipDirection = 1;
let mothershipSpeed = 50;

function preload() {
  // No external assets needed - using graphics API
}

function create() {
  const scene = this;

  // Create player platform at bottom
  player = scene.add.rectangle(400, 550, 80, 20, 0x00ff00);
  scene.physics.add.existing(player);
  player.body.setImmovable(true);

  // Create mothership at top
  mothership = scene.add.rectangle(400, 50, 120, 30, 0xff0000);
  scene.physics.add.existing(mothership);
  mothership.body.setImmovable(true);

  // UI Text
  scoreText = scene.add.text(16, 16, 'Score: 0', {
    fontSize: '20px',
    fontFamily: 'Arial',
    color: '#ffffff'
  });

  livesText = scene.add.text(16, 40, 'Lives: 3', {
    fontSize: '20px',
    fontFamily: 'Arial',
    color: '#ff0000'
  });

  featureText = scene.add.text(16, 64, 'Features: 0/5', {
    fontSize: '20px',
    fontFamily: 'Arial',
    color: '#00ff00'
  });

  // Instructions
  scene.add.text(400, 570, 'Arrows: Move | Space: Shoot | P: Launch Rocket (5 features)', {
    fontSize: '14px',
    fontFamily: 'Arial',
    color: '#888888',
    align: 'center'
  }).setOrigin(0.5);

  // Keyboard controls
  scene.input.keyboard.on('keydown', (event) => {
    if (gameOver && event.key === 'r') {
      restartGame(scene);
      return;
    }

    if (event.key === ' ') {
      shootBullet(scene);
    } else if (event.key === 'p' && featureCount >= 5) {
      launchProductionRocket(scene);
    }
  });

  // Collision detection
  scene.physics.add.overlap(bullets, bugs, hitBug, null, scene);
  scene.physics.add.overlap(features, player, collectFeature, null, scene);
  scene.physics.add.overlap(productionRockets, mothership, hitMothership, null, scene);
}

function update(time, delta) {
  if (gameOver) return;

  // Move player
  const cursors = this.input.keyboard.createCursorKeys();
  if (cursors.left.isDown && player.x > 40) {
    player.x -= 200 * (delta / 1000);
  } else if (cursors.right.isDown && player.x < 760) {
    player.x += 200 * (delta / 1000);
  }

  // Move mothership
  mothership.x += mothershipDirection * mothershipSpeed * (delta / 1000);
  if (mothership.x <= 60 || mothership.x >= 740) {
    mothershipDirection *= -1;
  }

  // Spawn bugs
  bugSpawnTimer += delta;
  if (bugSpawnTimer >= 2000) {
    spawnBug(this);
    bugSpawnTimer = 0;
  }

  // Update falling objects
  updateFallingObjects(this, delta);
  updateBullets(this, delta);
  updateProductionRockets(this, delta);
}

function spawnBug(scene) {
  const bug = scene.add.text(mothership.x, mothership.y + 20, 'B', {
    fontSize: '24px',
    fontFamily: 'Arial',
    color: '#ff0000'
  });
  scene.physics.add.existing(bug);
  bug.body.setVelocityY(100);
  bugs.push(bug);
}

function shootBullet(scene) {
  const bullet = scene.add.rectangle(player.x, player.y - 20, 4, 10, 0xffff00);
  scene.physics.add.existing(bullet);
  bullet.body.setVelocityY(-300);
  bullets.push(bullet);
  playTone(scene, 800, 0.1);
}

function hitBug(bullet, bug) {
  // Convert bug to feature
  const feature = this.add.text(bug.x, bug.y, 'F', {
    fontSize: '24px',
    fontFamily: 'Arial',
    color: '#00ff00'
  });
  this.physics.add.existing(feature);
  feature.body.setVelocityY(100);
  features.push(feature);

  // Remove bug and bullet
  bug.destroy();
  bullet.destroy();
  bugs.splice(bugs.indexOf(bug), 1);
  bullets.splice(bullets.indexOf(bullet), 1);

  score += 10;
  scoreText.setText('Score: ' + score);
  playTone(this, 1200, 0.1);
}

function collectFeature(feature, player) {
  feature.destroy();
  features.splice(features.indexOf(feature), 1);
  featureCount++;
  featureText.setText('Features: ' + featureCount + '/5');
  playTone(this, 1600, 0.1);
}

function launchProductionRocket(scene) {
  const rocket = scene.add.text(player.x, player.y - 20, 'P', {
    fontSize: '28px',
    fontFamily: 'Arial',
    color: '#0000ff'
  });
  scene.physics.add.existing(rocket);
  rocket.body.setVelocityY(-400);
  productionRockets.push(rocket);

  featureCount -= 5;
  featureText.setText('Features: ' + featureCount + '/5');
  playTone(scene, 200, 0.3);
}

function hitMothership(rocket, mothership) {
  rocket.destroy();
  productionRockets.splice(productionRockets.indexOf(rocket), 1);

  score += 100;
  scoreText.setText('Score: ' + score);

  // Check if mothership destroyed
  if (score >= 500) {
    endGame(this, true);
  } else {
    playTone(this, 300, 0.2);
  }
}

function updateFallingObjects(scene, delta) {
  // Update bugs
  for (let i = bugs.length - 1; i >= 0; i--) {
    const bug = bugs[i];
    if (bug.y > 600) {
      bug.destroy();
      bugs.splice(i, 1);
      loseLife(scene);
    }
  }

  // Update features
  for (let i = features.length - 1; i >= 0; i--) {
    const feature = features[i];
    if (feature.y > 600) {
      feature.destroy();
      features.splice(i, 1);
      loseLife(scene);
    }
  }
}

function updateBullets(scene, delta) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    if (bullet.y < 0) {
      bullet.destroy();
      bullets.splice(i, 1);
    }
  }
}

function updateProductionRockets(scene, delta) {
  for (let i = productionRockets.length - 1; i >= 0; i--) {
    const rocket = productionRockets[i];
    if (rocket.y < 0) {
      rocket.destroy();
      productionRockets.splice(i, 1);
    }
  }
}

function loseLife(scene) {
  lives--;
  livesText.setText('Lives: ' + lives);
  playTone(scene, 200, 0.5);

  if (lives <= 0) {
    endGame(scene, false);
  }
}

function endGame(scene, victory) {
  gameOver = true;

  // Overlay
  const overlay = scene.add.graphics();
  overlay.fillStyle(0x000000, 0.8);
  overlay.fillRect(0, 0, 800, 600);

  const title = victory ? 'VICTORY!' : 'GAME OVER';
  const color = victory ? '#00ff00' : '#ff0000';

  scene.add.text(400, 250, title, {
    fontSize: '48px',
    fontFamily: 'Arial',
    color: color,
    align: 'center'
  }).setOrigin(0.5);

  scene.add.text(400, 350, 'Score: ' + score, {
    fontSize: '24px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center'
  }).setOrigin(0.5);

  scene.add.text(400, 400, 'Press R to Restart', {
    fontSize: '20px',
    fontFamily: 'Arial',
    color: '#ffff00',
    align: 'center'
  }).setOrigin(0.5);
}

function restartGame(scene) {
  // Clear all arrays
  bugs.forEach(bug => bug.destroy());
  features.forEach(feature => feature.destroy());
  bullets.forEach(bullet => bullet.destroy());
  productionRockets.forEach(rocket => rocket.destroy());

  bugs = [];
  features = [];
  bullets = [];
  productionRockets = [];

  // Reset game state
  score = 0;
  lives = 3;
  featureCount = 0;
  gameOver = false;
  bugSpawnTimer = 0;

  // Reset UI
  scoreText.setText('Score: 0');
  livesText.setText('Lives: 3');
  featureText.setText('Features: 0/5');

  // Reset positions
  player.x = 400;
  mothership.x = 400;

  scene.scene.restart();
}

function playTone(scene, frequency, duration) {
  const audioContext = scene.sound.context;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'square';

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}