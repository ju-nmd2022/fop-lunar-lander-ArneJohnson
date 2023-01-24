let canvasWidth = 800;
let canvasHeight = 800;
let playerX;
let playerY;
let playerRotation;
let vel;
let maxSpeed = -30;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(22, 22, 22);
  playerX = 400;
  playerY = 400;
  playerRotation = 0;
  vel = 0;
}

function ship(playerX, playerY, playerRotation) {
  push();
  translate(playerX, playerY);
  rotate(playerRotation);
  fill(255, 255, 255);
  rect(-25, -25, 50);
  pop();
}

function draw() {
  clear();

  // Rotation
  if (keyIsDown(LEFT_ARROW)) {
    playerRotation -= 0.1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    playerRotation += 0.1;
  }

  // Thrusters
  if (keyIsDown(UP_ARROW)) {
    vel = vel * 1.05 - 0.5;
    if (vel < maxSpeed) {
      vel = maxSpeed;
    }
  }
  if (keyIsDown(UP_ARROW) == false) {
    vel += 0.5;
    if (vel > 0) {
      vel = 0;
    }
  }

  // Reset
  if (keyIsDown(DOWN_ARROW)) {
    setup();
  }

  playerRotation = playerRotation % (2 * PI);
  playerY += Math.cos(playerRotation) * vel;
  playerX -= Math.sin(playerRotation) * vel;

  ship(playerX, playerY, playerRotation);
}
