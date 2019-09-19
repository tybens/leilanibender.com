function getRandomPoint() {
  let point = {};
  point['x'] = Math.floor(Math.random() * (windowWidth * 2 - 50) + (-windowWidth / 2 + 50));
  point['y'] = Math.floor(Math.random() * (windowHeight * 2 - 50) + (-windowHeight / 2 + 50));
  return point;
}

function getDistance(one, two) {
  return Math.pow(Math.pow(one.x - two.x, 2) + Math.pow(one.y - two.y, 2), 0.5)
}

function getBufferArea() {
  return Math.max(windowHeight, windowWidth) * 0.05;
}


