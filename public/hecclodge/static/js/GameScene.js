var GameScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize:

  function GameScene() {
      Phaser.Scene.call(this, { key: 'gameScene', active: true });
  },

  preload: function() {
    this.audioContext = new AudioContext();
    // Load in images and sprites
    this.load.image('player', 'static/content/spaceship.png');
    this.load.image('sprBg0', 'static/content/sprBg0.png');
    this.load.image('sprBg1', 'static/content/sprBg1.png');
    this.load.image('bullet', 'static/bullet72.png');
    this.load.image('enemy', 'static/melon.png');
    this.load.image('enemy_bullet', 'static/jets.png');

    this.load.spritesheet('sprEnemy0', 'static/content/sprEnemy0.png', {
      frameWidth: 16, frameHeight: 16
    });
    this.load.spritesheet('sprEnemy2', 'static/content/sprEnemy2.png', {
      frameWidth: 16, frameHeight: 16
    });
    this.load.spritesheet('sprExplosion', 'static/content/sprExplosion.png', {
      frameWidth: 32, frameHeight: 32
    });

    this.load.audio('metronome', 'static/metronome.mp3');
    this.load.audio('song', 'static/test.mp3');
    this.load.audio('sndExplode0', 'static/content/sndExplode0.wav');
    this.load.audio('sndExplode1', 'static/content/sndExplode1.wav');
    this.load.audio('sndLaser', 'static/content/sndLaser.wav');
  },

  create: function() {
    //create animations
    this.anims.create({
      key: "sprEnemy0",
      frames: this.anims.generateFrameNumbers("sprEnemy0"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "sprEnemy2",
      frames: this.anims.generateFrameNumbers("sprEnemy2"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: "sprExplosion",
      frames: this.anims.generateFrameNumbers("sprExplosion"),
      frameRate: 20,
      repeat: 0
    });
    this.sfx = {
      explosions: [
      this.sound.add("sndExplode0"),
      this.sound.add("sndExplode1")
      ],
      laser: this.sound.add("sndLaser")
    };

    this.song = this.sound.add('song');
    this.song.setVolume(3);
    this.song.play();

    // Create world bounds
    this.physics.world.setBounds(-windowWidth/2, -windowHeight/2, windowWidth*2, windowHeight*2);

    // Add background, player sprites, and bullets
    player = this.physics.add.sprite(windowWidth/2, windowHeight/2, 'player');
    this.player = player;
    player.setBounce(false);
    player.setImmovable(true);

    this.enemies = this.add.group();
    this.enemyBullets = this.add.group();

    playerBullets = this.add.group();
    this.playerBullets = playerBullets;
    this.enemyEvents = new EnemyEvents();

    //add score text
    scoreText = this.add.text(-windowWidth/2 + 50, -windowHeight/2 + 50, 'Accuracy', { fontSize: '32px', fill: '#FFFFFF'});

    this.metronomeTicker = this.add.graphics();
    this.target = this.add.graphics();
    var metronomeBox = this.add.graphics();
    metronomeBox.lineStyle(2.5, 0xFFFFFF, 1);
    metronomeBox.strokeRect(windowHeight/3, -windowHeight/2 + 50, windowWidth/2, 75);
    this.metronomeSound = this.sound.add('metronome');
    this.metronomeTimer = this.time.addEvent({ delay: beatLength * 1000, callback: this.updateMetronome, callbackScope: this, repeat: 1 << 30 });
    this.targetLocation = getRandomPoint();
    this.lastBulletShot = -1;

    // set up health bar
    var healthBarBack = this.add.graphics();
    healthBarBack.lineStyle(2.5, 0xFFFFFF, 1);
    healthBarBack.strokeRect(windowHeight * 1.5 - 80, -windowHeight/2 + 50, windowWidth/3, 50);
    this.healthBar = this.add.graphics();

    // Set image/sprite properties
    player.setOrigin(0.5, 0.5).setDisplaySize(132, 120).setCollideWorldBounds(true).setDrag(500, 500);
    this.backgrounds = [];
    for (let i = 0; i < 5; i++) {
      let bg = new ScrollingBackground(this, "sprBg0", i * 10);
      this.backgrounds.push(bg);
    }

    // Set camera zoom
    this.cameras.main.zoom = 0.5;

    // Creates object for input with WASD kets
    let moveKeys = this.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'down': Phaser.Input.Keyboard.KeyCodes.S,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D,
      'rotate_left': Phaser.Input.Keyboard.KeyCodes.R,
      'rotate_right': Phaser.Input.Keyboard.KeyCodes.L,
      'shoot': Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    // Enables movement of player with WASD keys
    this.input.keyboard.on('keydown_W', function (event) {
      player.setAccelerationY(-1600);
    });
    this.input.keyboard.on('keydown_S', function (event) {
      player.setAccelerationY(1600);
    });
    this.input.keyboard.on('keydown_A', function (event) {
      player.setAccelerationX(-1600);
    });
    this.input.keyboard.on('keydown_D', function (event) {
      player.setAccelerationX(1600);
    });
    this.input.keyboard.on('keydown_L', function (event) {
      player.setAngularAcceleration(400);
    });
    this.input.keyboard.on('keydown_R', function (event) {
      player.setAngularAcceleration(-400);
    });

    // Stops player acceleration on uppress of WASD keys
    this.input.keyboard.on('keyup_W', function (event) {
      if (moveKeys['down'].isUp)
        player.setAccelerationY(0);
    });
    this.input.keyboard.on('keyup_S', function (event) {
      if (moveKeys['up'].isUp)
        player.setAccelerationY(0);
    });
    this.input.keyboard.on('keyup_A', function (event) {
      if (moveKeys['right'].isUp)
        player.setAccelerationX(0);
    });
    this.input.keyboard.on('keyup_D', function (event) {
      if (moveKeys['left'].isUp)
        player.setAccelerationX(0);
    });
    this.input.keyboard.on('keyup_L', function (event) {
      if (moveKeys['rotate_left'].isUp) {
        player.setAngularVelocity(0);
        player.setAngularAcceleration(0);
      }
    });
    this.input.keyboard.on('keyup_R', function (event) {
      if (moveKeys['rotate_left'].isUp){
        player.setAngularVelocity(0);
        player.setAngularAcceleration(0);
      }
    });

    //colliders
    //NOTE: order is NOT typical in this code (investigate why later)
    this.physics.add.collider(this.playerBullets, this.enemies, function(bullet, enemy) {
      if (enemy) {
        enemy.explode(true);
        bullet.destroy();
      }
    });

    this.physics.add.collider(player, this.enemyBullets, (player, enemyBullet) => {
      if (enemyBullet) {
        playerHealth = Math.max(0, playerHealth - 2);
        if (!playerHealth) this.killPlayer();;
      }
    });
    this.waveCounter = 0;
  },

  destroyBullet: function(player, bullet) { //destroys bullet
    bullet.disableBody(true, true);
    score += 10;
  },

  playerHit: function(player, enemyBullet) { //this HURTS the player/game over!
    // this.physics.pause();
    player.setTint(0xff0000);
    gameOver = true;
  },

  // Ensures sprite speed doesnt exceed maxVelocity while update is called
  constrainVelocity: function(sprite, maxVelocity) {
    if (!sprite || !sprite.body)
      return;

    var angle, currVelocitySqr, vx, vy;
    vx = sprite.body.velocity.x;
    vy = sprite.body.velocity.y;
    currVelocitySqr = vx * vx + vy * vy;

    if (currVelocitySqr > maxVelocity * maxVelocity) {
      angle = Math.atan2(vy, vx);
      vx = Math.cos(angle) * maxVelocity;
      vy = Math.sin(angle) * maxVelocity;
      sprite.body.velocity.x = vx;
      sprite.body.velocity.y = vy;
    }
  },

  update: function(time, delta) {
    if (this.song.seek === 0) {
      this.killPlayer();
    }
    // Constrain velocity of player
    this.constrainVelocity(player, 500);

    // update accuracy if applicable - update accuracy of last target location if applicable
    const iterations = this.metronomeTimer.repeat - this.metronomeTimer.repeatCount;
    const progress = (iterations / 4) % 1 + 1/4;
    if (this.lastTargetLocation && getDistance(player, this.lastTargetLocation) <= getBufferArea() && progress <= 0.25) {
      newAccuracy = (beatLength * 1000 - (this.metronomeTimer.elapsed)) / (beatLength*1000);
      currentAccuracy = Math.max(currentAccuracy, newAccuracy * 100);
    } else if (getDistance(player, this.targetLocation) <= getBufferArea() && progress > 0.25) {
      newAccuracy = (this.metronomeTimer.elapsed) / (beatLength*1000);
      currentAccuracy = Math.max(currentAccuracy, newAccuracy* 100);
    }

    scoreText.setText('Accuracy ' + Math.round(accuracy/beatHits * 10) / 10);

    let groupsToCull = [this.enemies, this.enemyBullets, this.playerBullets];
    const bounds = this.physics.world.bounds;
    for (let g = 0; g < groupsToCull.length; g++) {
      for (let i = 0; i < groupsToCull[g].getChildren().length; i++) {
        let groupMember = groupsToCull[g].getChildren()[i];
        groupMember.update();
        if (groupMember.x < bounds.x ||
          groupMember.x > bounds.x + bounds.width ||
          groupMember.y < bounds.y ||
          groupMember.y > bounds.y + bounds.height) {
          if (groupMember.onDestroy !== undefined) {
            groupMember.onDestroy();
          }
          groupMember.destroy();
        }
      }
    }

    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }

    let waveTime = 10000;
    let rand = Math.random() * 10000;

    if (rand < 9980) {
    } else if (rand < 9990) {
      this.enemyEvents.burstEnemyLine(this, 800, 801, this.enemies);
    } else if (rand < 9995) {
      this.enemyEvents.noFireEnemyLine(this, 400, 401, this.enemies);
    } else {
      this.enemyEvents.spiralEnemyLine(this, 400, 401, this.enemies);
    }

    if (time - this.lastBulletShot > 250 && this.player.active) {
      let angle = this.player.angle - 90;
      let velY = Math.sin(angle * Math.PI / 180) * 500;
      let velX = Math.sqrt(250000 - velY * velY);
      if (angle < -180) velX *= -1;
      if (angle < -90 && angle > -180) velX *= -1;
      let bullet = new PlayerBullet(this, this.player.x, this.player.y, velX, velY);
      this.playerBullets.add(bullet);
      this.lastBulletShot = time;
    }

    this.healthBar.clear();
    if (playerHealth < 50) {
      this.healthBar.fillStyle(0xff0000, 1);
    } else {
      this.healthBar.fillStyle(0x00ff00, 1);
    }
    this.healthBar.fillRect(windowHeight * 1.5 - 80, -windowHeight/2 + 50, windowWidth/300 * playerHealth, 50);
  },

  updateMetronome: function() {
    const iterations = this.metronomeTimer.repeat - this.metronomeTimer.repeatCount;
    const progress = (iterations / 4) % 1 + 1/4;
    let metronomeTicker = this.metronomeTicker;
    let target = this.target;
    if (progress == 1) {
      target.clear();
      this.metronomeSound.setVolume(5)
      this.metronomeSound.play()﻿;
      this.lastTargetLocation = Object.assign({}, this.targetLocation);
      this.targetLocation = getRandomPoint();
      target.fillStyle(0xFF0000, 1);
      target.fillCircle(this.targetLocation.x, this.targetLocation.y, 25);
      target.fillStyle(0x0000FF, 1);
      target.fillCircle(this.lastTargetLocation.x, this.lastTargetLocation.y, 25);
    } else if ((progress * 100) / 25 === 1) {
      target.clear();
      target.fillStyle(0xFF0000, 1);
      target.fillCircle(this.targetLocation.x, this.targetLocation.y, 25);
      this.metronomeSound.setVolume(2)
      this.metronomeSound.play()﻿;
      currentAccuracy = Math.round(currentAccuracy);
      if (this.accuracyDisplay) {
        this.accuracyDisplay.destroy()
      }
      if (this.lastTargetLocation) {
        this.accuracyDisplay = this.add.text(this.lastTargetLocation.x, this.lastTargetLocation.y, currentAccuracy,  { fontSize: '32px', fill: '#FFFFFF'})
      }
      accuracy += currentAccuracy;
      beatHits += 1;
      currentAccuracy = 0;
    } else if (!(progress*100 % 25)) {
      this.metronomeSound.setVolume(2)
      this.metronomeSound.play()﻿;
    }
    metronomeTicker.clear();
    metronomeTicker.lineStyle(5, 0xFFFFFF, 1);
    metronomeTicker.strokeRect(windowHeight/3 + progress*windowWidth/2, -windowHeight/2 + 50, 5, 75);
  },

  killPlayer: function() {
    game.scene.remove('gameScene');
    game.scene.add('endGameScene', EndGameScene, true);
  }
});
