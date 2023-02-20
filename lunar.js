// Canvas variables
const canvasWidth = 800;
const canvasHeight = 800;

// Player variables
let playerRotation;
let vel;
const maxSpeed = -20;
let isAlive;
let isPlayerExplode;
let isThrusting;
let explosionRadius;

// Level variables
let worldX;
let worldY;
let goalX;
let goalY;
const goalRadius = 1000;
let asteroids = [];
let mountains = [];
const asteroidRadius = 80;
const asteroidRangeX = 14000;
const asteroidRangeY = -12000;
const asteroidAmount = 998;
const mountainAmount = 100;
let bg;
let gameWon;
let timer;
let gameTimer;

// Start and end screen variables
let gameStarted;
let gameEnded;
let startButton;

function preload() {
  createCanvas(canvasWidth, canvasHeight);
  bg = loadImage("assets/Space.jpg");

  gameStarted = false;
  gameEnded = false;

  startButton = createButton("Start game");
  startButton.position(canvasWidth / 2, canvasHeight / 2);
  startButton.mousePressed(startGame);
  startButton.style("padding", "10px");
  startButton.style("font-family", "LEMON MILK");

  setup();
}

function setup() {
  let tempX;
  let tempY;
  let randomSize;

  playerRotation = 0;
  vel = 0;
  worldX = 0;
  worldY = 0;
  isAlive = true;
  isPlayerExplode = false;
  isThrusting = false;
  explosionRadius = 1;
  asteroids = [];
  mountains = [];
  gameWon = false;
  gameEnded = false;
  gameTimer = 0;

  // Level generation
  for (let i = 0; i < asteroidAmount; i++) {
    tempX = (Math.random() - 0.5) * asteroidRangeX;
    tempY = Math.random() * (asteroidRangeY + 300) - 300;
    randomSize = (Math.random() + 0.5) * asteroidRadius;
    asteroids.push(tempX);
    asteroids.push(tempY);
    asteroids.push(randomSize);
  }
  for (let j = 0; j < mountainAmount; j++) {
    tempX = (Math.random() - 0.5) * asteroidRangeX;
    tempY = 495 + Math.random() * 200;
    randomSize = (Math.random() + 0.8) * 200;
    mountains.push(tempX);
    mountains.push(tempY);
    mountains.push(randomSize);
  }
  goalX = (Math.random() - 0.5) * asteroidRangeX * 0.9;
  goalY = Math.random() * (asteroidRangeY * 0.9 + 7000) - 7000;

  clearInterval(timer);
  timer = setInterval(timerCount, 10);
}

function draw() {
  clear();
  update();

  background(7, 9, 10);
  image(bg, 0, asteroidRangeY + worldY + 2500);

  for (let i = 0; i < mountainAmount; i += 3) {
    push();
    createMountain(mountains[i], mountains[i + 1], mountains[i + 2]);
    pop();
  }

  for (let i = 0; i < asteroidAmount; i += 3) {
    push();
    translate(asteroids[i] + worldX, asteroids[i + 1] + worldY);
    rotate(asteroids[i + 2]);
    createAsteroid(asteroids[i + 2]);
    pop();
  }

  floor();
  moon();

  // Player
  if (isAlive) {
    ship(playerRotation);

    if (gameWon == false) {
      radar(goalX, goalY);
      drawTimer();
    } else {
      goalText();
    }
  } else {
    if (isPlayerExplode == false) explosion();

    gameOverText();
  }

  // Start and end screens
  if (gameStarted == false) startScreen();
  if (gameEnded) endScreen();
}

function update() {
  keyboardControlls();

  if (gameWon == false) collisionUpdate();

  for (let i = 0; i < asteroidAmount; i += 3) {
    if (asteroids[i] < -asteroidRangeX / 2) {
      asteroids[i] = asteroidRangeX / 2;
    } else {
      asteroids[i] -= asteroids[i + 2] / 30;
    }
    if (asteroids[i + 1] > 0) {
      asteroids[i + 1] = asteroidRangeY;
    } else {
      asteroids[i + 1] += asteroids[i + 2] / 40;
    }
  }

  worldY -= Math.cos(playerRotation) * vel;
  worldX += Math.sin(playerRotation) * vel;
}

/* -------------------------------------------------------------------------- */
/*                              Player functions                              */
/* -------------------------------------------------------------------------- */

function ship(playerRotation) {
  push();
  translate(canvasWidth / 2, canvasHeight / 2 + 35);
  rotate(playerRotation);
  stroke(55, 55, 55);
  strokeWeight(4);
  fill(255, 150, 100);
  beginShape();
  vertex(35, -25);
  bezierVertex(35, -25, 35, -110, 0, -120);
  bezierVertex(0, -120, -35, -110, -35, -25);
  vertex(-35, 30);
  vertex(35, 30);
  endShape();

  push();
  fill(255, 180, 140);
  noStroke();
  beginShape();
  vertex(30, -25);
  bezierVertex(30, -25, 35, -110, 0, -118);
  vertex(0, 30);
  vertex(35, 30);
  endShape();
  pop();

  fill(100, 100, 100);
  rect(-35, 40, 70, 25);

  fill(255, 255, 255);
  ellipse(40, -80, 12);
  rect(34, -80, 12, 130);
  ellipse(-40, -80, 12);
  rect(-46, -80, 12, 130);
  push();
  noStroke();
  ellipse(40, -80, 8.5);
  ellipse(-40, -80, 8.5);
  pop();

  beginShape();
  vertex(-25, 10);
  vertex(-50, 40);
  vertex(-55, 60);
  vertex(-25, 50);
  vertex(25, 50);
  vertex(55, 60);
  vertex(50, 40);
  vertex(25, 10);
  vertex(25, -25);
  bezierVertex(25, -25, 25, -60, 0, -75);
  bezierVertex(0, -75, -25, -60, -25, -25);
  vertex(-25, 10);
  endShape();

  fill(50, 200, 255);
  noStroke();
  beginShape();
  vertex(-15, -30);
  bezierVertex(-15, -30, -15, -40, 0, -40);
  bezierVertex(0, -40, 15, -40, 15, -30);
  bezierVertex(15, -30, 0, -40, -15, -30);
  endShape();

  if (isThrusting && gameWon == false) {
    fill(255, 80, 80);
    beginShape();
    vertex(0, 70);
    bezierVertex(0, 70, 40, 70, 0, 120);
    bezierVertex(0, 120, -40, 70, 0, 70);
    endShape();

    push();
    scale(0.6);
    translate(0, 55);
    fill(240, 170, 80);
    beginShape();
    vertex(0, 70);
    bezierVertex(0, 70, 40, 70, 0, 120);
    bezierVertex(0, 120, -40, 70, 0, 70);
    endShape();
    pop();
  }
  pop();
}

function radar(goalX, goalY) {
  let radarRotation;
  let tempX = goalX - (canvasWidth / 2 - worldX);
  let tempY = goalY - (canvasHeight / 2 - worldY + goalRadius / 2);
  let distance;

  distance = Math.floor(Math.sqrt(tempX * tempX + tempY * tempY));
  radarRotation = -Math.acos(tempX / distance) + HALF_PI;

  if (goalY > -worldY + goalRadius) {
    radarRotation = Math.acos(tempX / distance) + HALF_PI;
  }

  push();
  translate(canvasWidth / 2 + 130, canvasHeight / 2 - 30);
  rotate(radarRotation);

  stroke(55, 55, 55);
  strokeWeight(8);
  beginShape();
  vertex(0, 0);
  vertex(-25, 10);
  vertex(0, -25);
  vertex(25, 10);
  vertex(0, 0);
  endShape();

  strokeWeight(0);
  fill(255, 255, 255);
  beginShape();
  vertex(0, 0);
  vertex(-25, 10);
  vertex(0, -25);
  endShape();
  stroke(230, 230, 230);
  fill(230, 230, 230);
  beginShape();
  vertex(25, 10);
  vertex(0, -25);
  vertex(0, 0);
  endShape();
  pop();

  push();
  translate(canvasWidth / 2 + 75, canvasHeight / 2 - 10);
  textSize(18);
  textFont("LEMON MILK");
  textAlign(CENTER, CENTER);
  stroke(55, 55, 55);
  strokeWeight(4);
  fill(255, 255, 255);
  text(distance + "m", 50, 30);
  pop();
}

function explosion() {
  push();
  noStroke();
  translate(canvasWidth / 2, canvasHeight / 2 + 75);

  fill(255, 100, 100);
  rect(-explosionRadius / 2, -explosionRadius / 2, explosionRadius);
  rotate(HALF_PI / 2);
  rect(-explosionRadius / 2, -explosionRadius / 2, explosionRadius);

  fill(255, 150, 100);
  rect(-explosionRadius / 3, -explosionRadius / 3, explosionRadius / 1.5);
  rotate(HALF_PI / 2);
  rect(-explosionRadius / 3, -explosionRadius / 3, explosionRadius / 1.5);

  fill(255, 200, 100);
  rect(-explosionRadius / 6, -explosionRadius / 6, explosionRadius / 3);
  rotate(HALF_PI / 2);
  rect(-explosionRadius / 6, -explosionRadius / 6, explosionRadius / 3);
  pop();
  if (explosionRadius > 120) {
    isPlayerExplode = true;
  } else {
    explosionRadius += 15;
  }
}

function drawTimer() {
  push();
  translate(canvasWidth - 100, 50);
  textFont("LEMON MILK");
  textAlign(LEFT, CENTER);
  stroke(55, 55, 55);
  strokeWeight(6);
  fill(255, 255, 255);
  textSize(24);
  text(gameTimer / 100, 0, 0);
  pop();
}

/* -------------------------------------------------------------------------- */
/*                             Start/End screen                               */
/* -------------------------------------------------------------------------- */

function startScreen() {
  push();
  background(255, 0, 0);
  pop();
}

function endScreen() {
  push();
  background(0, 255, 0);
  pop();
}

function startGame() {
  startButton.remove();
  gameStarted = true;
  setup();
}

/* -------------------------------------------------------------------------- */
/*                              Level functions                               */
/* -------------------------------------------------------------------------- */

function floor() {
  push();
  stroke(95, 148, 89);
  strokeWeight(10);
  fill(120, 180, 100);
  rect(-50, 500 + worldY, canvasWidth + 100, 350);

  textFont("LEMON MILK");
  textAlign(LEFT, CENTER);
  noStroke();

  fill(150, 255, 150);
  textSize(32);
  text("How to play", 50 + worldX, 600 + worldY);
  textSize(20);
  text("Use the arrow keys to control your rocket", 50 + worldX, 630 + worldY);

  stroke(200, 255, 200);
  strokeWeight(5);
  noFill();
  rect(60 + worldX, 660 + worldY, 50);
  rect(180 + worldX, 660 + worldY, 50);
  rect(250 + worldX, 660 + worldY, 50);
  rect(370 + worldX, 660 + worldY, 50);

  fill(200, 255, 200);
  noStroke();
  textSize(72);
  text("^", 68 + worldX, 710 + worldY);
  textSize(48);
  text("<", 188 + worldX, 690 + worldY);
  text(">", 258 + worldX, 690 + worldY);
  textSize(36);
  text("v", 380 + worldX, 690 + worldY);

  textSize(14);
  text("Thruster", 50 + worldX, 730 + worldY);
  text("Rotate ship", 195 + worldX, 730 + worldY);
  text("Brake", 370 + worldX, 730 + worldY);
  text("Press backspace to restart", 50 + worldX, 780 + worldY);
  pop();
}

function gameOverText() {
  push();
  translate(canvasWidth / 2, canvasHeight / 2);
  textFont("LEMON MILK");
  textAlign(CENTER, CENTER);
  stroke(55, 55, 55);
  strokeWeight(8);
  fill(255, 255, 255);
  textSize(36);
  text("game over", 0, 0);
  textSize(18);
  text("Press backspace to restart", 0, 40);
  pop();
}

function createAsteroid(size) {
  push();
  stroke(120, 120, 120);
  strokeWeight(size / 14);
  fill(180, 180, 180);
  ellipse(0, 0, size);
  noStroke();
  fill(160, 160, 160);
  ellipse(-size / 6, -size / 6, size / 3);
  ellipse(0, size / 4, size / 4);
  ellipse(size / 4, -size / 8, size / 5);
  fill(180, 180, 180, 50);
  ellipse(0, 0, size * 1.2);
  pop();
}

// Moon and goal text
function moon() {
  push();
  translate(goalX + worldX, goalY + worldY);
  noStroke();
  fill(255, 255, 255, 2);
  ellipse(0, 0, goalRadius * 4);
  ellipse(0, 0, goalRadius * 3.5);
  ellipse(0, 0, goalRadius * 3);
  ellipse(0, 0, goalRadius * 2.5);
  ellipse(0, 0, goalRadius * 2);
  ellipse(0, 0, goalRadius * 1.5);
  fill(255, 255, 255);
  stroke(189, 195, 209);
  strokeWeight(10);
  ellipse(0, 0, goalRadius);
  noStroke();
  fill(189, 195, 209, 128);
  beginShape();
  vertex(0, 0 - goalRadius / 2);
  bezierVertex(
    0,
    -goalRadius / 2,
    goalRadius / 2 + (goalX + worldX) / 3,
    0,
    0,
    0 + goalRadius / 2
  );
  bezierVertex(
    0,
    0 + goalRadius / 2,
    goalRadius / 2,
    goalRadius / 2,
    goalRadius / 2,
    0
  );
  bezierVertex(
    goalRadius / 2,
    0,
    goalRadius / 2,
    -goalRadius / 2,
    0,
    -goalRadius / 2
  );
  endShape();
  stroke(255, 255, 255);
  ellipse(-320, -150, goalRadius / 6);
  ellipse(250, 200, goalRadius / 9);
  ellipse(200, -200, goalRadius / 8);
  ellipse(-150, 180, goalRadius / 4);

  noStroke();
  fill(180, 180, 180, 50);
  ellipse(0, 0, goalRadius * 1.05);

  if (gameWon == false) {
    fill(255, 180, 140, 150);
    noStroke();
    ellipse(0, -goalRadius / 2 + 5, 150, 20);
    stroke(255, 180, 140);
    strokeWeight(6);
    line(0, -goalRadius / 2 - 30, -20, -goalRadius / 2 - 50);
    line(0, -goalRadius / 2 - 30, 20, -goalRadius / 2 - 50);
  }
  pop();
}

function createMountain(x, y, size) {
  push();
  translate(x + worldX, y + worldY);
  fill(65, 74, 77);
  stroke(26, 38, 46);
  strokeWeight(size / 20);
  beginShape();
  vertex(0, 0);
  vertex(size, -4 * size);
  vertex(size * 1.4, -2.5 * size);
  vertex(size * 1.6, -3 * size);
  vertex(size * 2.3, 0);
  endShape();
  fill(255, 255, 255);
  beginShape();
  vertex(size / 1.6, -2.5 * size);
  vertex(size, -2.8 * size);
  vertex(size * 1.33, -2.6 * size);
  vertex(size, -4 * size);
  vertex(size / 1.6, -2.5 * size);
  endShape();
  fill(26, 38, 46, 100);
  noStroke();
  beginShape();
  vertex(size, -4 * size);
  vertex(size * 1.4, 0);
  vertex(0, 0);
  endShape();
  pop();

  tree(x - 100 - size / 2);
  tree(x);
  tree(x + size);
  tree(x + 500 + size / 2);
}

function goalText() {
  push();
  translate(goalX + worldX, goalY + worldY);
  stroke(55, 55, 55);
  strokeWeight(5);
  line(-90, -goalRadius / 2 + 30, -120, -goalRadius / 2 - 90);
  strokeWeight(0);
  fill(75, 176, 255);
  beginShape();
  vertex(-122, -goalRadius / 2 - 90);
  vertex(-172, -goalRadius / 2 - 80);
  vertex(-162, -goalRadius / 2 - 40);
  vertex(-112, -goalRadius / 2 - 50);
  endShape();
  noFill();
  stroke(232, 235, 75);
  strokeWeight(10);
  line(-140, -goalRadius / 2 - 82, -132, -goalRadius / 2 - 50);
  line(-162, -goalRadius / 2 - 60, -120, -goalRadius / 2 - 68);
  stroke(55, 55, 55);
  strokeWeight(4);
  beginShape();
  vertex(-122, -goalRadius / 2 - 90);
  vertex(-172, -goalRadius / 2 - 80);
  vertex(-162, -goalRadius / 2 - 40);
  vertex(-112, -goalRadius / 2 - 50);
  vertex(-122, -goalRadius / 2 - 90);
  endShape();

  translate(0, -canvasHeight - 30);
  textFont("LEMON MILK");
  textAlign(CENTER, CENTER);
  stroke(55, 55, 55);
  strokeWeight(8);
  fill(255, 255, 255);
  textSize(36);
  text("Congratulations!", 0, 0);
  textSize(18);
  text(
    "It took you " + gameTimer / 100 + " seconds to land on the moon",
    0,
    40
  );
  textSize(16);
  fill(255, 180, 140);
  strokeWeight(6);
  text("Press backspace to restart", 0, 90);
  text("Or press Enter submit your score", 0, 120);
  pop();
}

function tree(x) {
  push();
  translate(x + worldX, 494 + worldY);

  noStroke();
  fill(88, 128, 59);
  ellipse(-20, -70, 50, 40);
  ellipse(20, -60, 55, 45);
  ellipse(10, -90, 60, 50);

  noFill();
  stroke(135, 93, 55);
  strokeWeight(20);
  line(0, 0, 0, -10);
  strokeWeight(12);
  line(0, -10, 0, -50);
  strokeWeight(8);
  line(0, -50, -20, -70);
  line(0, -50, 10, -90);
  line(0, -50, 20, -60);

  noStroke();
  fill(121, 196, 88, 80);
  ellipse(-20, -70, 40, 30);
  fill(172, 230, 129, 80);
  ellipse(20, -60, 45, 35);
  fill(109, 161, 69, 80);
  ellipse(10, -90, 50, 40);

  fill(88, 128, 59);
  ellipse(-100, 0, 80, 50);
  fill(112, 156, 81);
  ellipse(-70, 0, 50, 30);
  pop();
}

/* -------------------------------------------------------------------------- */
/*                                Functionality                               */
/* -------------------------------------------------------------------------- */
function keyboardControlls() {
  if (isAlive && gameWon == false) {
    // Rotation
    if (keyIsDown(LEFT_ARROW)) {
      playerRotation -= 0.1;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      playerRotation += 0.1;
    }
    playerRotation = playerRotation % (2 * PI);

    // Thrusters
    if (keyIsDown(UP_ARROW)) {
      vel = vel * 1.01 - 0.1;
      isThrusting = true;
      if (vel < maxSpeed) {
        vel = maxSpeed;
      }
    } else {
      vel = vel * 0.99;
      isThrusting = false;

      // Gravity after take-off
      if (worldY != 0) {
        worldY -= 3;
        if (playerRotation < 0.5 && playerRotation > -0.5) {
          vel += 0.08;
        }
      }
    }

    if (keyIsDown(DOWN_ARROW) && keyIsDown(UP_ARROW) == false) {
      vel += 0.5;
      if (vel > 0) {
        vel = 0;
      }
    }
  }

  // Reset
  if (keyIsDown(BACKSPACE)) {
    setup();
  }

  // Back to start screen
  if (keyIsDown(ENTER) && gameWon == true) {
    gameEnded = true;
  }
}
function collisionUpdate() {
  let tempX;
  let tempY;
  let distance;

  let playerY1 =
    canvasHeight / 2 + 35 - Math.cos(((playerRotation / PI) % 2) * PI) * 75;
  let playerX1 =
    canvasWidth / 2 + Math.sin(((playerRotation / PI) % 2) * PI) * 75;

  let playerY2 =
    canvasHeight / 2 + 35 + Math.cos(((playerRotation / PI) % 2) * PI) * 5;
  let playerX2 =
    canvasWidth / 2 - Math.sin(((playerRotation / PI) % 2) * PI) * 5;

  // Asteroid collision
  for (let i = 0; i < asteroidAmount; i += 3) {
    tempX = worldX + asteroids[i] - playerX1;
    tempY = worldY + asteroids[i + 1] - playerY1;
    distance = Math.sqrt(tempX * tempX + tempY * tempY);
    if (
      distance + asteroids[i + 2] / 2 < 45 ||
      distance - asteroids[i + 2] / 2 < 45
    ) {
      isAlive = false;
      vel = 0;
      return;
    }
    tempX = worldX + asteroids[i] - playerX2;
    tempY = worldY + asteroids[i + 1] - playerY2;
    distance = Math.sqrt(tempX * tempX + tempY * tempY);
    if (
      distance + asteroids[i + 2] / 2 < 55 ||
      distance - asteroids[i + 2] / 2 < 55
    ) {
      isAlive = false;
      vel = 0;
      return;
    }
  }

  // Moon collision
  tempX = worldX + goalX - playerX1;
  tempY = worldY + goalY - playerY1;
  distance = Math.sqrt(tempX * tempX + tempY * tempY);
  if (distance + goalRadius / 2 < 45 || distance - goalRadius / 2 < 45) {
    isAlive = false;
    vel = 0;
    return;
  }
  tempX = worldX + goalX - playerX2;
  tempY = worldY + goalY - playerY2;
  distance = Math.sqrt(tempX * tempX + tempY * tempY);
  if (distance + goalRadius / 2 < 55 || distance - goalRadius / 2 < 55) {
    isAlive = false;
    vel = 0;
    return;
  }

  // Floor collision
  if (worldY < 0) {
    isAlive = false;
    vel = 0;
    return;
  }

  // Landing
  if (
    goalY + worldY - goalRadius < 0 &&
    goalY + worldY - goalRadius > -15 &&
    goalX + worldX - canvasWidth / 2 < 60 &&
    goalX + worldX - canvasWidth / 2 > -60 &&
    playerRotation < 0.3 &&
    playerRotation > -0.3 &&
    vel > -0.6 &&
    vel < 0.6
  ) {
    gameWon = true;
    vel = 0;
    return;
  }
}

function timerCount() {
  gameTimer++;
  if (gameWon == true || isAlive == false) {
    clearInterval(timer);
  }
}
