// Platanus Hack 25: Bug to Feature Game
// Convert bugs to features, collect them, and launch production rockets!

// =============================================================================
// ARCADE BUTTON MAPPING - COMPLETE TEMPLATE
// =============================================================================
// Reference: See button-layout.webp at hack.platan.us/assets/images/arcade/
//
// Maps arcade button codes to keyboard keys for local testing.
// Each arcade code can map to multiple keyboard keys (array values).
// The arcade cabinet sends codes like 'P1U', 'P1A', etc. when buttons are pressed.
//
// To use in your game:
//   if (key === 'P1U') { ... }  // Works on both arcade and local (via keyboard)
// =============================================================================

const ARCADE_CONTROLS = {
  // ===== PLAYER 1 CONTROLS =====
  // Joystick - Left hand on WASD
  'P1U': ['w'],
  'P1D': ['s'],
  'P1L': ['a'],
  'P1R': ['d'],

  // Action Buttons - Right hand on home row area (ergonomic!)
  // Top row (ABC): U, I, O  |  Bottom row (XYZ): J, K, L
  'P1A': ['u'],
  'P1B': ['i'],
  'P1C': ['o'],
  'P1X': ['j'],
  'P1Y': ['k'],
  'P1Z': ['l'],

  // Start Button
  'START1': ['1', 'Enter'],

  // ===== PLAYER 2 CONTROLS =====
  // Joystick - Right hand on Arrow Keys
  'P2U': ['ArrowUp'],
  'P2D': ['ArrowDown'],
  'P2L': ['ArrowLeft'],
  'P2R': ['ArrowRight'],

  // Action Buttons - Left hand (avoiding P1's WASD keys)
  // Top row (ABC): R, T, Y  |  Bottom row (XYZ): F, G, H
  'P2A': ['r'],
  'P2B': ['t'],
  'P2C': ['y'],
  'P2X': ['f'],
  'P2Y': ['g'],
  'P2Z': ['h'],

  // Start Button
  'START2': ['2']
};

// Build reverse lookup: keyboard key → arcade button code
const KEYBOARD_TO_ARCADE = {};
for (const [arcadeCode, keyboardKeys] of Object.entries(ARCADE_CONTROLS)) {
  if (keyboardKeys) {
    // Handle both array and single value
    const keys = Array.isArray(keyboardKeys) ? keyboardKeys : [keyboardKeys];
    keys.forEach(key => {
      KEYBOARD_TO_ARCADE[key] = arcadeCode;
    });
  }
}

// Global game state
// Optional: paste your VSCode spritesheet as a Base64 data URI below.
// Example: const VSCODE_SPRITESHEET = 'data:image/png;base64,AA...';
// Set frame size to your icon/sprite frame dimensions (e.g., 16x16).
const VSCODE_SPRITESHEET = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAwklEQVR4AZSQgRHDIAwDnW7ZGTpPZ+iYKR8hMJTehVwM2JY+OI/Ye84iJ8qmdwdwxvMdV0Q0yF2AzProAFkBGr3qR3MtepsBFhviXPrPS3taM6CLmZU5tUsu86GkrxlwhETqYnau/ceMMAPI/0GWZgwzQGPoi/SHP67CuGaAzPTz9Z3zTzhPkQH9+rpBzzEBXUAyAJlNntk5PY+jc11nAGWbORMjhEqKFSC123GEeMTSvgso0hAkmSnuANAzHsH5ii8AAAD' + '/' + '/4QIPVoAAAAGSURBVAMA+1o4Id3Y/QsAAAAASUVORK5CYIIA';
const VSCODE_FRAME_SIZE = { w: 16, h: 16 };
// IntelliJ spritesheet (provided by user)
const INTELLIJ_SPRITESHEET = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtklEQVR4AcyTvQ3DIBCF33MDG6T1XpnC2SBtimSKrOI5vAYV4Tj55BDAlLH0+f6fDiSmDa84Cq5bLJmQvhkLRsB7xhcAskCyiDEaEgu1nOSPmADJnCfVSkCqT6qVXIkJlIXRuCkg64+ITJfbkvv2gd1K8uhLXMM2IAlSkUZSfZISNjGBZsdJ4Q8EHs/1ZMl+2Y4gN17SH9VqFnDOwXv/g7b0/1kghIAa/VGtZoE7VrRIzxdNAHwAAAD' + '/' + '/1NcjKsAAAAGSURBVAMA+1o4Id3Y/QsAAAAASUVORK5CYIIA';
const INTELLIJ_FRAME_SIZE = { w: 16, h: 16 };
let selectedBranch = 'frontend'; // frontend, mobile, backend

// Selection Scene
class SelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SelectionScene' });
  }

  preload() {
    if (VSCODE_SPRITESHEET && VSCODE_SPRITESHEET.startsWith('data:image')) {
      this.load.spritesheet(
        'vscode',
        VSCODE_SPRITESHEET,
        { frameWidth: VSCODE_FRAME_SIZE.w, frameHeight: VSCODE_FRAME_SIZE.h }
      );
    }
    if (INTELLIJ_SPRITESHEET && INTELLIJ_SPRITESHEET.startsWith('data:image')) {
      this.load.spritesheet(
        'intellij',
        INTELLIJ_SPRITESHEET,
        { frameWidth: INTELLIJ_FRAME_SIZE.w, frameHeight: INTELLIJ_FRAME_SIZE.h }
      );
    }
  }

  create() {
    this.add.text(400, 100, "It's not a bug, it's a feature!", {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(400, 160, 'Elije tu editor de código', {
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
    this.add.text(200, 405, '← →', {
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
    this.add.text(400, 405, '← →', {
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
    this.add.text(600, 405, '← →', {
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

    // Countdown variables
    this.countdownActive = false;
    this.countdownText = null;
    this.countdownTimer = 0;

    // Keyboard and Arcade Button input
    this.input.keyboard.on('keydown', (event) => {
      if (this.countdownActive) return; // Disable input during countdown

      // Normalize keyboard input to arcade codes for easier testing
      const key = KEYBOARD_TO_ARCADE[event.key] || event.key;

      // Izquierda: P2L (ArrowLeft) o P1L (A/WASD)
      if (key === 'P2L' || key === 'P1L' || event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        if (selectedBranch === 'mobile') {
          selectedBranch = 'frontend';
          this.selectedBox.setPosition(200, 300);
        } else if (selectedBranch === 'backend') {
          selectedBranch = 'mobile';
          this.selectedBox.setPosition(400, 300);
        }
      }
      // Derecha: P2R (ArrowRight) o P1R (D/WASD)
      else if (key === 'P2R' || key === 'P1R' || event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        if (selectedBranch === 'frontend') {
          selectedBranch = 'mobile';
          this.selectedBox.setPosition(400, 300);
        } else if (selectedBranch === 'mobile') {
          selectedBranch = 'backend';
          this.selectedBox.setPosition(600, 300);
        }
      } else if (key === 'START1' || event.key === ' ' || event.key === 'Enter') {
        this.startCountdown();
      }
    });
  }

  drawFrontendIcon(x, y) {
    if (this.textures.exists('vscode')) {
      const img = this.add.image(x, y, 'vscode', 0).setOrigin(0.5);
      img.setScale(6);
      return;
    }
    const icon = this.add.text(x, y, '💻', {
      fontSize: '48px',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }

  drawMobileIcon(x, y) {
    if (this.textures.exists('intellij')) {
      const img = this.add.image(x, y, 'intellij', 0).setOrigin(0.5);
      img.setScale(6);
      return;
    }
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

  startCountdown() {
    this.countdownActive = true;
    this.countdownText = this.add.text(400, 450, '3', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffff00'
    }).setOrigin(0.5);
    this.countdownTimer = 3;
  }

  update(time, delta) {
    if (this.countdownActive && this.countdownTimer > 0) {
      this.countdownTimer -= delta / 1000;
      if (this.countdownTimer <= 0) {
        this.scene.start('GameScene');
      } else {
        const seconds = Math.ceil(this.countdownTimer);
        this.countdownText.setText(seconds.toString());
      }
    }
  }
}

// Game Scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Create player with selected branch icon
    this.playerContainer = this.add.container(400, 550);
    this.physics.world.enable(this.playerContainer);
    this.playerContainer.body.setSize(90, 90);
    this.playerContainer.body.setImmovable(true);

    this.drawPlayerIcon();

    // Create mothership at top
    this.mothership = this.add.rectangle(400, 50, 120, 30, 0xff0000);
    this.physics.add.existing(this.mothership);
    this.mothership.body.setImmovable(true);

    // Add PRODUCT OWNER text to mothership
    this.mothershipText = this.add.text(400, 50, 'PRODUCT OWNER', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#ffffff',
      align: 'center'
    }).setOrigin(0.5);

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

    // Difficulty levels system (based on production launches)
    this.levels = [
      { name: 'Practicante/Intern', productionCount: 0, speed: 50, erraticChance: 0 },
      { name: 'Junior Dev', productionCount: 3, speed: 70, erraticChance: 0.1 },
      { name: 'Semi Senior', productionCount: 6, speed: 90, erraticChance: 0.25 },
      { name: 'Senior Dev', productionCount: 9, speed: 120, erraticChance: 0.4 },
      { name: '10X Engineer', productionCount: 12, speed: 150, erraticChance: 0.6 }
    ];
    this.currentLevel = 0;
    this.productionLaunches = 0; // Contador de salidas a producción exitosas
    this.mothershipErraticTimer = 0;
    this.mothershipErraticInterval = 2000; // Change direction every 2 seconds at max erratic

    // Sistema de sobrecarga del arma
    this.shotCount = 0; // Contador de disparos consecutivos
    this.maxShots = 4; // Máximo de disparos antes de sobrecalentarse
    this.overheated = false; // Estado de sobrecalentamiento
    this.cooldownTimer = 0; // Temporizador de enfriamiento
    this.cooldownDuration = 3000; // 3 segundos de enfriamiento
    this.lastShotTime = 0; // Tiempo del último disparo
    this.shotResetDelay = 2000; // Tiempo sin disparar para resetear contador (2 segundos)

    // UI Text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });

    this.livesText = this.add.text(16, 40, '❤️❤️❤️', {
      fontSize: '24px',
      fontFamily: 'Arial'
    });

    this.featureText = this.add.text(16, 64, 'Features: 0/5', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#00ff00'
    });

    this.levelText = this.add.text(16, 88, 'Level: Practicante/Intern', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#00ffff'
    });

    // Barra de sobrecarga del arma (parte inferior izquierda)
    this.overheatBarX = 16;
    this.overheatBarY = 580;
    this.overheatBarWidth = 120;
    this.overheatBarHeight = 10;

    // Fondo de la barra
    this.overheatBarBg = this.add.rectangle(this.overheatBarX + this.overheatBarWidth / 2, this.overheatBarY, this.overheatBarWidth, this.overheatBarHeight, 0x333333);
    this.overheatBarBg.setOrigin(0.5, 0.5);
    this.overheatBarBg.setStrokeStyle(2, 0xffffff);

    // Barra de progreso de sobrecarga usando Graphics
    this.overheatBarGraphics = this.add.graphics();
    this.overheatBarProgress = 0;
    this.overheatBarColor = 0x00ff00;

    // Texto de la barra (arriba de la barra)
    this.overheatBarText = this.add.text(this.overheatBarX, this.overheatBarY - 20, 'Sobrecarga', {
      fontSize: '11px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });

    // Level up message text (inicialmente invisible)
    this.levelUpText = this.add.text(400, 300, '', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#00ff00',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    this.levelUpText.setVisible(false);

    // Production ready text
    this.productionReadyText = this.add.text(650, 100, '', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffff00',
      align: 'center'
    }).setOrigin(0.5);
    this.productionReadyText.setVisible(false);

    // Overheat message text
    this.overheatText = this.add.text(400, 300, 'SIN TOKENS', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ff0000',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    this.overheatText.setVisible(false);

    // Instructions
    this.add.text(400, 570, 'Arrows: Move | U/Button A: Shoot | J/Button X: Launch Rocket (5 features)', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#888888',
      align: 'center'
    }).setOrigin(0.5);

    // Create keyboard keys for movement (support both keyboard and arcade controls)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');

    // Keyboard and Arcade Button controls
    this.input.keyboard.on('keydown', (event) => {
      // Normalize keyboard input to arcade codes for easier testing
      const key = KEYBOARD_TO_ARCADE[event.key] || event.key;

      if (this.gameOver && (key === 'P2A' || event.key === 'r')) {
        this.restartGame();
        return;
      }

      if (key === 'P1A' || event.key === 'u' || event.key === 'U') {
        this.shootBullet();
      } else if ((key === 'P1X' || event.key === 'j' || event.key === 'J') && this.featureCount >= 5) {
        this.launchProductionRocket();
      }
    });
  }

  getCurrentLevel() {
    // Find the highest level the player has reached based on production launches
    for (let i = this.levels.length - 1; i >= 0; i--) {
      if (this.productionLaunches >= this.levels[i].productionCount) {
        return i;
      }
    }
    return 0;
  }

  updateDifficulty() {
    const newLevel = this.getCurrentLevel();
    if (newLevel !== this.currentLevel && newLevel > this.currentLevel) {
      this.currentLevel = newLevel;
      const level = this.levels[this.currentLevel];
      this.mothershipSpeed = level.speed;
      this.levelText.setText('Level: ' + level.name);

      // Mostrar mensaje grande de nivel
      this.showLevelUpMessage(level.name);

      // Play level up sound
      this.playTone(1000, 0.2);
    }
  }

  showLevelUpMessage(levelName) {
    this.levelUpText.setText('¡Subiste de nivel!:\n' + levelName);
    this.levelUpText.setVisible(true);
    this.levelUpText.setScale(0.5);
    this.levelUpText.setAlpha(1);

    // Animación de entrada
    this.tweens.add({
      targets: this.levelUpText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      ease: 'Back.easeOut'
    });

    // Animación de salida después de 2 segundos
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: this.levelUpText,
        alpha: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 500,
        onComplete: () => {
          this.levelUpText.setVisible(false);
        }
      });
    });
  }

  drawPlayerIcon() {
    let iconText;
    if (selectedBranch === 'frontend') {
      if (this.textures.exists('vscode')) {
        const img = this.add.image(0, 0, 'vscode', 0).setOrigin(0.5);
        img.setScale(6);
        this.playerContainer.add(img);
        return;
      }
      iconText = this.add.text(0, 0, '💻', {
        fontSize: '48px',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    } else if (selectedBranch === 'mobile') {
      if (this.textures.exists('intellij')) {
        const img = this.add.image(0, 0, 'intellij', 0).setOrigin(0.5);
        img.setScale(6);
        this.playerContainer.add(img);
        return;
      }
      iconText = this.add.text(0, 0, '📱', {
        fontSize: '48px',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    } else {
      iconText = this.add.text(0, 0, '🔧', {
        fontSize: '48px',
        fontFamily: 'Arial'
      }).setOrigin(0.5);
    }
    this.playerContainer.add(iconText);
  }

  update(time, delta) {
    if (this.gameOver) return;

    // Move player (support both keyboard and arcade controls)
    if ((this.cursors.left.isDown || this.wasd.A.isDown) && this.playerContainer.x > 40) {
      this.playerContainer.x -= 200 * (delta / 1000);
    } else if ((this.cursors.right.isDown || this.wasd.D.isDown) && this.playerContainer.x < 760) {
      this.playerContainer.x += 200 * (delta / 1000);
    }

    // Move mothership with erratic behavior at higher levels
    const level = this.levels[this.currentLevel];
    this.mothershipErraticTimer += delta;

    // Erratic direction changes based on level
    if (level.erraticChance > 0) {
      const erraticInterval = this.mothershipErraticInterval / (1 + level.erraticChance * 2);
      if (this.mothershipErraticTimer >= erraticInterval) {
        if (Math.random() < level.erraticChance) {
          this.mothershipDirection *= -1;
        }
        this.mothershipErraticTimer = 0;
      }
    }

    // Normal boundary bounce
    this.mothership.x += this.mothershipDirection * this.mothershipSpeed * (delta / 1000);
    this.mothershipText.x = this.mothership.x; // Move text with mothership
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
    this.updateOverheat(time, delta);
    this.checkCollisions();
  }

  spawnBug() {
    const bug = this.add.text(this.mothership.x, this.mothership.y + 20, '🐛', {
      fontSize: '24px',
      fontFamily: 'Arial'
    });
    this.physics.add.existing(bug);
    bug.body.setVelocityY(100);
    this.bugs.push(bug);
  }

  shootBullet() {
    // Verificar si el arma está sobrecalentada
    if (this.overheated) {
      return; // No se puede disparar si está sobrecalentada
    }

    // Disparar
    const bullet = this.add.rectangle(this.playerContainer.x, this.playerContainer.y - 40, 4, 10, 0xffff00);
    this.physics.add.existing(bullet);
    bullet.body.setVelocityY(-300);
    this.bullets.push(bullet);
    this.playTone(800, 0.1);

    // Incrementar contador de disparos
    this.shotCount++;
    this.lastShotTime = this.time.now;

    // Actualizar barra de sobrecarga
    const progress = this.shotCount / this.maxShots;
    this.updateOverheatBar(progress);

    // Verificar si se alcanzó el límite de disparos
    if (this.shotCount >= this.maxShots) {
      this.overheat();
    }
  }

  overheat() {
    // Activar sobrecalentamiento
    this.overheated = true;
    this.shotCount = 0;
    this.cooldownTimer = 0;

    // Mostrar mensaje "SIN TOKENS"
    this.overheatText.setVisible(true);
    this.overheatText.setAlpha(1);
    this.overheatText.setScale(1);

    // Animación de entrada
    this.tweens.add({
      targets: this.overheatText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 300,
      ease: 'Back.easeOut',
      yoyo: true,
      repeat: 1
    });
  }

  updateOverheat(time, delta) {
    if (this.overheated) {
      // Incrementar temporizador de enfriamiento
      this.cooldownTimer += delta;

      // Actualizar barra de sobrecarga (mostrar llena en rojo durante enfriamiento)
      this.updateOverheatBar(1.0, 0xff0000);

      // Si pasaron 3 segundos, enfriar el arma
      if (this.cooldownTimer >= this.cooldownDuration) {
        this.cooldown();
      }
    } else {
      // Si no está sobrecalentada, verificar si pasó tiempo suficiente sin disparar para resetear contador
      if (this.lastShotTime > 0) {
        const timeSinceLastShot = time - this.lastShotTime;

        // Disminuir gradualmente la barra si no se dispara
        if (timeSinceLastShot > 0 && this.shotCount > 0) {
          // Calcular reducción basada en el tiempo sin disparar
          const decayRate = delta / this.shotResetDelay; // Reducción por frame
          const currentProgress = this.shotCount / this.maxShots;
          const newProgress = Math.max(0, currentProgress - decayRate);
          this.shotCount = Math.max(0, this.shotCount - (decayRate * this.maxShots));
          this.updateOverheatBar(newProgress);
        }

        if (timeSinceLastShot >= this.shotResetDelay && this.shotCount > 0) {
          this.shotCount = 0; // Resetear contador si pasó tiempo sin disparar
          this.updateOverheatBar(0);
        }
      }
    }
  }

  updateOverheatBar(progress, color = null) {
    // Clamp progress entre 0 y 1
    progress = Math.max(0, Math.min(1, progress));
    this.overheatBarProgress = progress;

    // Calcular ancho de la barra
    const currentWidth = progress * this.overheatBarWidth;

    // Cambiar color según el nivel de sobrecarga si no se especifica un color
    if (color === null) {
      if (progress >= 1.0) {
        color = 0xff0000; // Rojo cuando está lleno
      } else if (progress >= 0.75) {
        color = 0xff6600; // Naranja
      } else if (progress >= 0.5) {
        color = 0xffff00; // Amarillo
      } else if (progress >= 0.25) {
        color = 0x88ff00; // Verde-amarillo
      } else {
        color = 0x00ff00; // Verde
      }
    }
    this.overheatBarColor = color;

    // Dibujar barra usando Graphics
    this.overheatBarGraphics.clear();
    if (currentWidth > 0) {
      this.overheatBarGraphics.fillStyle(color, 1);
      this.overheatBarGraphics.fillRect(this.overheatBarX, this.overheatBarY - this.overheatBarHeight / 2, currentWidth, this.overheatBarHeight);
    }
  }

  cooldown() {
    // Enfriar el arma
    this.overheated = false;
    this.cooldownTimer = 0;
    this.shotCount = 0;

    // Resetear barra de sobrecarga
    this.updateOverheatBar(0);

    // Ocultar mensaje "SIN TOKENS" con animación
    this.tweens.add({
      targets: this.overheatText,
      alpha: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 300,
      onComplete: () => {
        this.overheatText.setVisible(false);
        this.overheatText.setAlpha(1);
        this.overheatText.setScale(1);
      }
    });
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
    const feature = this.add.text(bug.x, bug.y, '✨', {
      fontSize: '24px',
      fontFamily: 'Arial'
    });
    this.physics.add.existing(feature);
    feature.body.setVelocityY(180); // Más rápido que los bugs
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

    // Show production ready message when we have enough features
    if (this.featureCount >= 5) {
      this.showProductionReady();
    }

    this.playTone(1600, 0.1);
  }

  launchProductionRocket() {
    const rocket = this.add.text(this.playerContainer.x, this.playerContainer.y - 40, '🚀', {
      fontSize: '28px',
      fontFamily: 'Arial'
    });
    rocket.setRotation(-Math.PI / 4); // Rotate 45 degrees counterclockwise
    this.physics.add.existing(rocket);
    rocket.body.setVelocityY(-400);
    this.productionRockets.push(rocket);

    this.featureCount -= 5;
    this.featureText.setText('Features: ' + this.featureCount + '/5');

    // Hide production ready message after launching
    this.hideProductionReady();

    this.playTone(200, 0.3);
  }

  hitMothership(rocket, idx) {
    rocket.destroy();
    this.productionRockets.splice(idx, 1);

    this.score += 100;
    this.productionLaunches++; // Incrementar contador de salidas a producción
    this.scoreText.setText('Score: ' + this.score);

    // Animación de parpadeo del Product Owner cuando recibe daño
    this.blinkMothership();

    // Actualizar dificultad basada en salidas a producción
    this.updateDifficulty();

    // Victoria basada en salidas a producción (después de pasar el nivel 10X Engineer = 15 salidas)
    if (this.productionLaunches >= 15) {
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
        this.loseLife(); // Only bugs take life when they hit the ground
      }
    }

    for (let i = this.features.length - 1; i >= 0; i--) {
      const feature = this.features[i];
      if (feature.y > 600) {
        feature.destroy();
        this.features.splice(i, 1);
        // Features do NOT take life when they hit the ground
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

  updateLivesHearts() {
    // Crear string de corazones según las vidas restantes
    const hearts = '❤️'.repeat(this.lives);
    this.livesText.setText(hearts);
  }

  loseLife() {
    this.lives--;
    this.updateLivesHearts();
    this.playTone(200, 0.5);

    // Animación de parpadeo rápido del jugador
    this.blinkPlayer();

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  blinkPlayer() {
    // Parpadeo rápido: cambiar alpha varias veces
    const blinkCount = 6; // Número de parpadeos
    const blinkDuration = 100; // Duración de cada parpadeo en ms

    // Asegurar que el jugador sea visible al inicio
    this.playerContainer.setAlpha(1);

    // Crear animación de parpadeo usando tween
    let currentBlink = 0;
    const doBlink = () => {
      if (currentBlink < blinkCount) {
        // Alternar entre visible e invisible
        const targetAlpha = currentBlink % 2 === 0 ? 0.3 : 1;
        this.tweens.add({
          targets: this.playerContainer,
          alpha: targetAlpha,
          duration: blinkDuration,
          onComplete: () => {
            currentBlink++;
            if (currentBlink < blinkCount) {
              doBlink();
            } else {
              // Asegurar que termine visible
              this.playerContainer.setAlpha(1);
            }
          }
        });
      }
    };

    doBlink();
  }

  blinkMothership() {
    // Parpadeo rápido del Product Owner cuando recibe daño
    const blinkCount = 6; // Número de parpadeos
    const blinkDuration = 100; // Duración de cada parpadeo en ms

    // Asegurar que el mothership y su texto sean visibles al inicio
    this.mothership.setAlpha(1);
    this.mothershipText.setAlpha(1);

    // Crear animación de parpadeo usando tween para ambos objetos
    let currentBlink = 0;
    const doBlink = () => {
      if (currentBlink < blinkCount) {
        // Alternar entre visible e invisible
        const targetAlpha = currentBlink % 2 === 0 ? 0.3 : 1;
        this.tweens.add({
          targets: [this.mothership, this.mothershipText],
          alpha: targetAlpha,
          duration: blinkDuration,
          onComplete: () => {
            currentBlink++;
            if (currentBlink < blinkCount) {
              doBlink();
            } else {
              // Asegurar que termine visible
              this.mothership.setAlpha(1);
              this.mothershipText.setAlpha(1);
            }
          }
        });
      }
    };

    doBlink();
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

    this.add.text(400, 400, 'Press Button A or R to Restart', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffff00',
      align: 'center'
    }).setOrigin(0.5);
  }

  showProductionReady() {
    this.productionReadyText.setText('🚀 LAUNCH TO\nPRODUCTION!\nPress J or Button X');
    this.productionReadyText.setVisible(true);

    // Add pulsing effect
    this.tweens.add({
      targets: this.productionReadyText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  hideProductionReady() {
    this.productionReadyText.setVisible(false);
    this.tweens.killTweensOf(this.productionReadyText);
    this.productionReadyText.setScale(1);
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
  render: { pixelArt: true, antialias: false },
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
