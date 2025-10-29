// Platanus Hack 25: Bug to Feature Game
// Convert bugs to features, collect them, and launch production rockets!

// Global game state
let selectedBranch = 'frontend'; // frontend, mobile, backend

// Selection Scene
class SelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SelectionScene' });
  }

  create() {
    this.add.text(400, 100, "It's not a bug, it's a feature!", {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 160, 'Choose Your Dev Branch', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#00ff00'
    }).setOrigin(0.5);

    // Draw dev branch icons
    this.drawFrontendIcon(200, 300);
    this.add.text(200, 380, 'Frontend', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(200, 405, 'Press 1', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#888888'
    }).setOrigin(0.5);

    this.drawMobileIcon(400, 300);
    this.add.text(400, 380, 'Mobile', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(400, 405, 'Press 2', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#888888'
    }).setOrigin(0.5);

    this.drawBackendIcon(600, 300);
    this.add.text(600, 380, 'Backend', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(600, 405, 'Press 3', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#888888'
    }).setOrigin(0.5);

    this.selectedBox = this.add.rectangle(200, 300, 80, 80);
    this.selectedBox.setStrokeStyle(3, 0xffff00);

    this.add.text(400, 500, 'Press SPACE or ENTER to start', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffff00'
    }).setOrigin(0.5);

    // Keyboard input
    this.input.keyboard.on('keydown', (event) => {
      if (event.key === '1') {
        selectedBranch = 'frontend';
        this.selectedBox.setPosition(200, 300);
      } else if (event.key === '2') {
        selectedBranch = 'mobile';
        this.selectedBox.setPosition(400, 300);
      } else if (event.key === '3') {
        selectedBranch = 'backend';
        this.selectedBox.setPosition(600, 300);
      } else if (event.key === ' ' || event.key === 'Enter') {
        this.scene.start('GameScene');
      }
    });
  }

  drawFrontendIcon(x, y) {
    // Use emoji for frontend (laptop)
    const icon = this.add.text(x, y, '💻', {
      fontSize: '48px',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  drawMobileIcon(x, y) {
    // Use emoji for mobile (phone)
    const icon = this.add.text(x, y, '📱', {
      fontSize: '48px',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  drawBackendIcon(x, y) {
    // Use emoji for backend (wrench/gear)
    const icon = this.add.text(x, y, '🔧', {
      fontSize: '48px',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
}

// Game Scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Create player with selected IDE icon
    this.playerContainer = this.add.container(400, 550);
    this.physics.world.enable(this.playerContainer);
    this.playerContainer.body.setSize(70, 70);
    this.playerContainer.body.setImmovable(true);

    this.drawPlayerIcon();

    // Create mothership at top
    this.mothership = this.add.rectangle(400, 50, 120, 30, 0xff0000);
    this.physics.add.existing(this.mothership);
    this.mothership.body.setImmovable(true);

    // Game state
    this.bugs = [];
    this.features = [];
    this.bullets = [];
    this.productionRockets = [];
    this.score = 0;
    this.lives = 3;
    this.featureCount = 0;
    this.gameOver = false;
    this.bugSpawnTimer = 0;
    this.mothershipDirection = 1;
    this.mothershipSpeed = 50;

    // UI Text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });

    this.livesText = this.add.text(16, 40, 'Lives: 3', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ff0000'
    });

    this.featureText = this.add.text(16, 64, 'Features: 0/5', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#00ff00'
    });

    // Instructions
    this.add.text(400, 570, 'Arrows: Move | Space: Shoot | P: Launch Rocket (5 features)', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#888888',
      align: 'center'
    }).setOrigin(0.5);

    // Keyboard controls
    this.input.keyboard.on('keydown', (event) => {
      if (this.gameOver && event.key === 'r') {
        this.restartGame();
        return;
      }

      if (event.key === ' ') {
        this.shootBullet();
      } else if (event.key === 'p' && this.featureCount >= 5) {
        this.launchProductionRocket();
      }
    });
  }

  drawPlayerIcon() {
    let iconText;
    if (selectedBranch === 'frontend') {
      iconText = this.add.text(0, 0, '💻', {
        fontSize: '32px',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    } else if (selectedBranch === 'mobile') {
      iconText = this.add.text(0, 0, '📱', {
        fontSize: '32px',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    } else {
      iconText = this.add.text(0, 0, '🔧', {
        fontSize: '32px',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    }
    this.playerContainer.add(iconText);
  }

  update(time, delta) {
    if (this.gameOver) return;

    // Move player
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown && this.playerContainer.x > 40) {
      this.playerContainer.x -= 200 * (delta / 1000);
    } else if (cursors.right.isDown && this.playerContainer.x < 760) {
      this.playerContainer.x += 200 * (delta / 1000);
    }

    // Move mothership
    this.mothership.x += this.mothershipDirection * this.mothershipSpeed * (delta / 1000);
    if (this.mothership.x <= 60 || this.mothership.x >= 740) {
      this.mothershipDirection *= -1;
    }

    // Spawn bugs
    this.bugSpawnTimer += delta;
    if (this.bugSpawnTimer >= 2000) {
      this.spawnBug();
      this.bugSpawnTimer = 0;
    }

    // Update falling objects
    this.updateFallingObjects();
    this.updateBullets();
    this.updateProductionRockets();
    this.checkCollisions();
  }

  spawnBug() {
    const bug = this.add.text(this.mothership.x, this.mothership.y + 20, 'B', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ff0000'
    });
    this.physics.add.existing(bug);
    bug.body.setVelocityY(100);
    this.bugs.push(bug);
  }

  shootBullet() {
    const bullet = this.add.rectangle(this.playerContainer.x, this.playerContainer.y - 40, 4, 10, 0xffff00);
    this.physics.add.existing(bullet);
    bullet.body.setVelocityY(-300);
    this.bullets.push(bullet);
    this.playTone(800, 0.1);
  }

  checkCollisions() {
    // Bullets hit bugs
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      for (let j = this.bugs.length - 1; j >= 0; j--) {
        const bug = this.bugs[j];
        if (Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), bug.getBounds())) {
          this.hitBug(bullet, bug, i, j);
          break;
        }
      }
    }

    // Features hit player
    for (let i = this.features.length - 1; i >= 0; i--) {
      const feature = this.features[i];
      if (Phaser.Geom.Intersects.RectangleToRectangle(
        feature.getBounds(),
        this.playerContainer.body
      )) {
        this.collectFeature(feature, i);
      }
    }

    // Production rockets hit mothership
    for (let i = this.productionRockets.length - 1; i >= 0; i--) {
      const rocket = this.productionRockets[i];
      if (Phaser.Geom.Intersects.RectangleToRectangle(
        rocket.getBounds(),
        this.mothership.getBounds()
      )) {
        this.hitMothership(rocket, i);
      }
    }
  }

  hitBug(bullet, bug, bulletIdx, bugIdx) {
    const feature = this.add.text(bug.x, bug.y, 'F', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#00ff00'
    });
    this.physics.add.existing(feature);
    feature.body.setVelocityY(100);
    this.features.push(feature);

    bug.destroy();
    bullet.destroy();
    this.bugs.splice(bugIdx, 1);
    this.bullets.splice(bulletIdx, 1);

    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
    this.playTone(1200, 0.1);
  }

  collectFeature(feature, idx) {
    feature.destroy();
    this.features.splice(idx, 1);
    this.featureCount++;
    this.featureText.setText('Features: ' + this.featureCount + '/5');
    this.playTone(1600, 0.1);
  }

  launchProductionRocket() {
    const rocket = this.add.text(this.playerContainer.x, this.playerContainer.y - 40, 'P', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#0000ff'
    });
    this.physics.add.existing(rocket);
    rocket.body.setVelocityY(-400);
    this.productionRockets.push(rocket);

    this.featureCount -= 5;
    this.featureText.setText('Features: ' + this.featureCount + '/5');
    this.playTone(200, 0.3);
  }

  hitMothership(rocket, idx) {
    rocket.destroy();
    this.productionRockets.splice(idx, 1);

    this.score += 100;
    this.scoreText.setText('Score: ' + this.score);

    if (this.score >= 500) {
      this.endGame(true);
    } else {
      this.playTone(300, 0.2);
    }
  }

  updateFallingObjects() {
    for (let i = this.bugs.length - 1; i >= 0; i--) {
      const bug = this.bugs[i];
      if (bug.y > 600) {
        bug.destroy();
        this.bugs.splice(i, 1);
        this.loseLife();
      }
    }

    for (let i = this.features.length - 1; i >= 0; i--) {
      const feature = this.features[i];
      if (feature.y > 600) {
        feature.destroy();
        this.features.splice(i, 1);
        this.loseLife();
      }
    }
  }

  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      if (bullet.y < 0) {
        bullet.destroy();
        this.bullets.splice(i, 1);
      }
    }
  }

  updateProductionRockets() {
    for (let i = this.productionRockets.length - 1; i >= 0; i--) {
      const rocket = this.productionRockets[i];
      if (rocket.y < 0) {
        rocket.destroy();
        this.productionRockets.splice(i, 1);
      }
    }
  }

  loseLife() {
    this.lives--;
    this.livesText.setText('Lives: ' + this.lives);
    this.playTone(200, 0.5);

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  endGame(victory) {
    this.gameOver = true;

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, 800, 600);

    const title = victory ? 'VICTORY!' : 'GAME OVER';
    const color = victory ? '#00ff00' : '#ff0000';

    this.add.text(400, 250, title, {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: color,
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 350, 'Score: ' + this.score, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 400, 'Press R to Restart', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffff00',
      align: 'center'
    }).setOrigin(0.5);
  }

  restartGame() {
    this.scene.start('SelectionScene');
  }

  playTone(frequency, duration) {
    const audioContext = this.sound.context;
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
}

// Game configuration
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
  scene: [SelectionScene, GameScene]
};

const game = new Phaser.Game(config);
