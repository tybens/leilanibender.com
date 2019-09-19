class EnemyEvents {
  spiralEnemyLine(scene, minSize, maxSize, enemyGroup) {
    for (let i = minSize; i < maxSize; i += 50) {
      let enemy = new SpiralBulletEnemy(scene, i, 0);
      if (enemy !== null) {
        enemy.setScale(Phaser.Math.Between(10,20) * 0.1);
        enemyGroup.add(enemy);
      }
    }
  }

  burstEnemyLine(scene, minSize, maxSize, enemyGroup) {
    let start = minSize;
    scene.time.addEvent({
      delay: 1000,
      repeat: parseInt((maxSize - minSize)/100) + 1,
      callback: function() {
        let enemy = new BurstEnemy(scene, start, 0);
        if (enemy !== null) {
          enemy.setScale(1.5);
          enemyGroup.add(enemy);
          start += 50;
        }
      }, 
      callbackScope: scene,
      loop: false
    });
  }

  noFireEnemyLine(scene, minSize, maxSize, enemyGroup) {
    let start = minSize;
    scene.time.addEvent({
      delay: 1000,
      repeat: parseInt((maxSize - minSize)/50),
      callback: function() {
        let enemy = new NoFireEnemy(scene, start, -200);
        if (enemy !== null) {
          enemy.setScale(1.5);
          enemyGroup.add(enemy);
          start += 50;
        }
      }, 
      callbackScope: scene,
      loop: false
    });
  }
}
