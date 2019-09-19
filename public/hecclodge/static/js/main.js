var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: windowWidth,
  height: windowHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [
    MainMenuScene
  ]
};

var game = new Phaser.Game(config);
var sceneManager = new Phaser.Scenes.SceneManager(game);

var score = 0;
var scoreText;
var beatLength = 0.71;
var accuracy = 100;
var beatHits = 0;
var currentAccuracy = 0;
var gameStarted = false;
var playerHealth = 100;
