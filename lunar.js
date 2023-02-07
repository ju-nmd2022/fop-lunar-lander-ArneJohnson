// Canvas
const canvasWidth = 800;
const canvasHeight = 800;

// Player
let playerX;
let playerY;
let playerHeight;
let playerWidth;
let playerRotation;
let vel;
const maxSpeed = -20;
let isAlive;
let isPlayerExplode;
let isThrusting;
let explosionRadius;

// Level
let worldX;
let worldY;
let goalX;
let goalY;
const goalRadius = 1000;
let asteroids = [];
const asteroidRadius = 80;
const asteroidRangeX = 12000;
const asteroidRangeY = -10000;
const asteroidAmount = 839;
let randomSize;
let bg;
let gameWon;

let i;
let tempX;
let tempY;

function preload() {
  bg = loadImage("assets/Space.jpg");
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  playerRotation = 0;
  vel = 0;
  worldX = 0;
  worldY = 0;
  isAlive = true;
  isPlayerExplode = false;
  isThrusting = false;
  explosionRadius = 1;
  asteroids = [];
  gameWon = false;

  // Level generation
  for (i = 0; i < asteroidAmount; i++) {
    tempX = (Math.random() - 0.5) * asteroidRangeX;
    tempY = Math.random() * (asteroidRangeY + 300) - 300;
    randomSize = (Math.random() + 0.5) * asteroidRadius;
    asteroids.push(tempX);
    asteroids.push(tempY);
    asteroids.push(randomSize);
  }
  goalX = (Math.random() - 0.5) * asteroidRangeX;
  goalY = Math.random() * (asteroidRangeY + 7000) - 7000;
}

function draw() {
  clear();
  update();

  background(7, 9, 10);
  image(bg, 0, asteroidRangeY + worldY + 510);
  floor();
  for (i = 0; i < asteroidAmount; i += 3)
    createAsteroid(asteroids[i], asteroids[i + 1], asteroids[i + 2]);
  moon();

  // Player
  if (isAlive) {
    ship(playerRotation);
    if (gameWon == false) radar(goalX, goalY);
  } else {
    if (isPlayerExplode == false) {
      explosion();
    }
    gameOverText();
  }
}

function update() {
  keyboardControlls();

  collisionUpdate();

  worldY -= Math.cos(playerRotation) * vel;
  worldX += Math.sin(playerRotation) * vel;
}

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

  if (isThrusting) {
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
  tempX = goalX - (canvasWidth / 2 - worldX);
  tempY = goalY - (canvasHeight / 2 - worldY + goalRadius / 2);

  let distance = Math.floor(Math.sqrt(tempX * tempX + tempY * tempY));
  let radarRotation = -Math.acos(tempX / distance) + HALF_PI;

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

function createAsteroid(x, y, size) {
  push();
  translate(x, y);
  stroke(120, 120, 120);
  strokeWeight(size / 14);
  fill(180, 180, 180);
  ellipse(worldX, worldY, size);
  noStroke();
  fill(160, 160, 160);
  ellipse(worldX - size / 6, worldY - size / 6, size / 3);
  ellipse(worldX, worldY + size / 4, size / 4);
  ellipse(worldX + size / 4, worldY - size / 8, size / 5);
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

function moon() {
  push();
  noStroke();
  fill(255, 255, 255, 2);
  ellipse(goalX + worldX, goalY + worldY, goalRadius * 4);
  ellipse(goalX + worldX, goalY + worldY, goalRadius * 3.5);
  ellipse(goalX + worldX, goalY + worldY, goalRadius * 3);
  ellipse(goalX + worldX, goalY + worldY, goalRadius * 2.5);
  ellipse(goalX + worldX, goalY + worldY, goalRadius * 2);
  ellipse(goalX + worldX, goalY + worldY, goalRadius * 1.5);
  fill(255, 255, 255);
  stroke(189, 195, 209);
  strokeWeight(10);
  ellipse(goalX + worldX, goalY + worldY, goalRadius);
  noStroke();
  fill(189, 195, 209);
  beginShape();
  vertex(goalX + worldX, goalY + worldY - goalRadius / 2);
  bezierVertex(
    goalX + worldX,
    goalY + worldY - goalRadius / 2,
    goalX + goalRadius / 2 + worldX,
    goalY + goalRadius / 6 + worldY,
    goalX + worldX,
    goalY + worldY + goalRadius / 2
  );
  bezierVertex(
    goalX + worldX,
    goalY + worldY + goalRadius / 2,
    goalX + goalRadius / 2 + worldX,
    goalY + goalRadius / 2 + worldY,
    goalX + worldX + goalRadius / 2,
    goalY + worldY
  );
  bezierVertex(
    goalX + worldX + goalRadius / 2,
    goalY + worldY,
    goalX + goalRadius / 2 + worldX,
    goalY - goalRadius / 2 + worldY,
    goalX + worldX,
    goalY + worldY - goalRadius / 2
  );
  endShape();
  stroke(255, 255, 255);
  ellipse(goalX + worldX - 320, goalY + worldY - 150, goalRadius / 6);
  ellipse(goalX + worldX + 250, goalY + worldY + 200, goalRadius / 9);
  ellipse(goalX + worldX + 200, goalY + worldY - 200, goalRadius / 8);
  ellipse(goalX + worldX - 150, goalY + worldY + 180, goalRadius / 4);

  if (gameWon == false) {
    fill(237, 236, 197, 150);
    noStroke();
    ellipse(goalX + worldX, goalY + worldY - goalRadius / 2 + 5, 150, 20);
    stroke(237, 236, 197);
    strokeWeight(6);
    line(
      goalX + worldX,
      goalY + worldY - goalRadius / 2 - 30,
      goalX + worldX - 20,
      goalY + worldY - goalRadius / 2 - 50
    );
    line(
      goalX + worldX,
      goalY + worldY - goalRadius / 2 - 30,
      goalX + worldX + 20,
      goalY + worldY - goalRadius / 2 - 50
    );
  }
  pop();
}

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

    if (keyIsDown(DOWN_ARROW)) {
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

  // Testing
  if (keyIsDown(ENTER)) {
    goalX = worldX;
    goalY = worldY;
  }
}

function collisionUpdate() {
  playerY =
    canvasHeight / 2 + 35 - Math.cos(((playerRotation / PI) % 2) * PI) * 120;
  playerX = canvasWidth / 2 + Math.sin(((playerRotation / PI) % 2) * PI) * 120;

  playerHeight =
    canvasHeight / 2 + 35 + Math.cos(((playerRotation / PI) % 2) * PI) * 65;
  playerWidth =
    canvasWidth / 2 - Math.sin(((playerRotation / PI) % 2) * PI) * 65;

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
    vel = 0;
    gameWon = true;
  }
}
