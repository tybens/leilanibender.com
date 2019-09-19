var EndGameScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize:

  function EndGameScene() {
    Phaser.Scene.call(this, { key: 'endGameScene', active: true });
  },

  preload: function() {
    this.load.image('background', 'static/starfield.png');
  },

  create: function() {
    var background = this.add.image(windowWidth/2, windowHeight/2, 'background');

    background.setOrigin(0.5, 0.5).setDisplaySize(windowWidth*2, windowHeight*2);
    this.cameras.main.zoom = 0.5;

    // Creates object for input with WASD kets
    moveKeys = this.input.keyboard.addKeys({
      'start': Phaser.Input.Keyboard.KeyCodes.SPACE
    });

    this.input.keyboard.on('keydown_SPACE', function (event) {
      game.scene.remove('mainMenuScene');
      game.scene.add('gameScene', GameScene, true);
      gameStarted = true;
    });

    pass = "PASS"
    if (!playerHealth) pass = "FAIL"
    titleText = this.add.text(windowWidth/2, windowHeight/2 - 50, 'Bullet Lodge', { align: 'center', fontSize: '100px', fill: '#FFFFFF'});
    instructionText = this.add.text(windowWidth/2, windowHeight/2, 'Game Over', { align: 'center', fontSize: '32px', fill: '#FFFFFF'});
    instructionText = this.add.text(windowWidth/2, windowHeight/2 + 50, 'Accuracy ' + accuracy, { align: 'center', fontSize: '32px', fill: '#FFFFFF'});
    instructionText = this.add.text(windowWidth/2, windowHeight/2 + 100, pass, { align: 'center', fontSize: '32px', fill: '#FFFFFF'});
    titleText.setOrigin(0.5, 0.5);
    instructionText.setOrigin(0.5, 0.5);
  }
});
