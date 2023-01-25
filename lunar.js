// Canvas
const canvasWidth = 800;
const canvasHeight = 800;

// Player
let playerRotation;
let vel;
const maxSpeed = -30;

// Level
let worldX;
let worldY;
let goalX;
let goalY;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  playerRotation = 0;
  vel = 0;
  worldX = 0;
  worldY = 0;

  // Defined for testing purposes, will be random later
  goalX = 100;
  goalY = 100;
}

function draw() {
  clear();
  update();

  background(22, 22, 22);
  floor();
  ship(playerRotation);
  radar(goalX, goalY);

  // Testing goal
  ellipse(goalX + worldX, goalY + worldY, 100);
}

function update() {
  // Rotation
  if (keyIsDown(LEFT_ARROW)) {
    playerRotation -= 0.1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    playerRotation += 0.1;
  }

  // Thrusters
  if (keyIsDown(UP_ARROW)) {
    vel = vel * 1.05 - 0.2;
    if (vel < maxSpeed) {
      vel = maxSpeed;
    }
  } else {
    vel = vel * 0.99;
  }
  if (keyIsDown(DOWN_ARROW)) {
    vel += 0.5;
    if (vel > 0) {
      vel = 0;
    }
  }

  // Reset
  if (keyIsDown(BACKSPACE)) {
    setup();
  }

  // Collision
  if (worldY < 0) {
    worldY = 0;
    vel = 0;
  }

  playerRotation = playerRotation % (2 * PI);
  worldY -= Math.cos(playerRotation) * vel;
  worldX += Math.sin(playerRotation) * vel;
}

function ship(playerRotation) {
  push();
  translate(canvasWidth / 2, canvasHeight / 2 + 75);
  rotate(playerRotation);
  noStroke();
  fill(255, 255, 255);
  rect(-25, -25, 50);
  pop();
}

function radar(goalX, goalY) {
  let tempX = goalX - 50 - (canvasWidth / 2 - worldX);
  let tempY = goalY - 50 - (canvasHeight / 2 - worldY);
  let distance = Math.floor(Math.sqrt(tempX * tempX + tempY * tempY));
  let radarRotation = -Math.acos(tempX / distance) + HALF_PI;
  if (tempY > goalY - 100) {
    radarRotation = Math.acos(tempX / distance) + HALF_PI;
  }

  push();
  translate(canvasWidth / 2 + 50, canvasHeight / 2 - 20);
  stroke(255, 255, 255);
  rotate(radarRotation);
  beginShape();
  vertex(0, 0);
  vertex(-25, 10);
  vertex(0, -25);
  vertex(25, 10);
  endShape();
  pop();

  push();
  translate(canvasWidth / 2, canvasHeight / 2);
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
