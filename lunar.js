// Canvas
const canvasWidth = 800;
const canvasHeight = 800;

// Player
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
const gravity = 9.18;
const goalRadius = 300;
let asteroids = [];
const asteroidRadius = 50;
const asteroidRangeX = 8000;
const asteroidRangeY = -10000;
let bg;

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

  // Level generation
  for (i = 1; i < 500; i++) {
    tempX = (Math.random() - 0.5) * asteroidRangeX;
    tempY = Math.random() * (asteroidRangeY + 300) - 300;
    asteroids.push(createAsteroid);
    asteroids.push(tempX);
    asteroids.push(tempY);
  }
  goalX = (Math.random() - 0.5) * asteroidRangeX;
  goalY = Math.random() * (asteroidRangeY + 6000) - 6000;
}

function draw() {
  clear();
  update();

  // Level
  background(7, 9, 10);
  image(bg, 0, asteroidRangeY + worldY + 510);
  floor();
  for (i = 0; i < asteroids.length; i += 3) {
    asteroids[i](asteroids[i + 1], asteroids[i + 2]);
  }

  // Player
  if (isAlive) {
    ship(playerRotation);
    radar(goalX, goalY);
  } else {
    if (isPlayerExplode == false) {
      explosion();
    }
    gameOverText();
  }

  // Testing goal
  ellipse(goalX + worldX, goalY + worldY, goalRadius);
}

function update() {
  if (isAlive) {
    // Rotation
    if (keyIsDown(LEFT_ARROW)) {
      playerRotation -= 0.1;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      playerRotation += 0.1;
    }

    // Thrusters
    if (keyIsDown(UP_ARROW)) {
      vel = vel * 1.02 - 0.2;
      isThrusting = true;
      if (vel < maxSpeed) {
        vel = maxSpeed;
      }
    } else {
      vel = vel * 0.99;
      isThrusting = false;
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

  // Asteroid movement
  for (i = 1; i < asteroids.length; i += 3) {
    if (Math.random() > 0.8) {
      asteroids[i] += Math.random() * 8 - 4;
    }
    if (Math.random() > 0.8) {
      asteroids[i + 1] += Math.random() * 8 - 4;
    }
  }

  // Collision
  if (worldY < 0) {
    worldY = 0;
    vel = 0;
    isAlive = false;
  }

  playerRotation = playerRotation % (2 * PI);
  worldY -= Math.cos(playerRotation) * vel;
  worldX += Math.sin(playerRotation) * vel;
}

function ship(playerRotation) {
  push();
  translate(canvasWidth / 2, canvasHeight / 2 + 35);
  rotate(playerRotation);
  noStroke();
  fill(255, 150, 100);
  beginShape();
  vertex(35, -25);
  bezierVertex(35, -25, 35, -110, 0, -120);
  bezierVertex(0, -120, -35, -110, -35, -25);
  vertex(-35, 30);
  vertex(35, 30);
  endShape();

  fill(100, 100, 100);
  rect(-35, 40, 70, 25);

  fill(255, 255, 255);
  rect(34, -80, 12, 130);
  ellipse(40, -80, 12);
  rect(-46, -80, 12, 130);
  ellipse(-40, -80, 12);

  stroke(220, 220, 220);
  strokeWeight(3);
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
    fill(255, 100, 100);
    beginShape();
    vertex(0, 70);
    bezierVertex(0, 70, 40, 70, 0, 120);
    bezierVertex(0, 120, -40, 70, 0, 70);
    endShape();

    push();
    scale(0.6);
    translate(0, 55);
    fill(255, 150, 100);
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
  tempY = goalY - (canvasHeight / 2 - worldY);
  let distance = Math.floor(Math.sqrt(tempX * tempX + tempY * tempY));
  let radarRotation = -Math.acos(tempX / distance) + HALF_PI;
  if (goalY > -worldY + goalRadius) {
    radarRotation = Math.acos(tempX / distance) + HALF_PI;
  }

  push();
  translate(canvasWidth / 2 + 130, canvasHeight / 2 - 30);
  rotate(radarRotation);
  stroke(255, 255, 255);
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
  noStroke();
  fill(255, 255, 255);
  text(distance + "m", 50, 30);
  pop();
}

function floor() {
  push();
  noStroke();
  fill(120, 180, 100);
  rect(0, 500 + worldY, canvasWidth, 300);

  textFont("LEMON MILK");
  textAlign(LEFT, CENTER);

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
  noStroke();
  fill(255, 255, 255);
  textSize(36);
  text("game over", 0, 0);
  textSize(18);
  text("Press backspace to restart", 0, 40);
  pop();
}

function createAsteroid(x, y) {
  push();
  translate(x, y);
  noStroke();
  fill(255, 255, 255);
  ellipse(worldX, worldY, asteroidRadius);
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
