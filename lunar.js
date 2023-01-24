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

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  playerRotation = 0;
  vel = 0;
  worldX = 0;
  worldY = 0;
}

function draw() {
  clear();
  update();

  background(22, 22, 22);

  ship(playerRotation);
  floor();
  ellipse(550 + worldX, 400 + worldY, 50);
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
  if (keyIsDown(DOWN_ARROW)) {
    vel += 1;
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

function floor() {
  push();
  noStroke();
  fill(120, 180, 100);
  rect(0, 500 + worldY, canvasWidth, 300);

  textFont("LEMON MILK");
  textAlign(LEFT, CENTER);
  fill(200, 255, 200);

  textSize(32);
  text("How to play", 50 + worldX, 600 + worldY);
  textSize(24);
  text("W       = accelerate", 50 + worldX, 630 + worldY);
  text("A, D   = Rotate", 50 + worldX, 655 + worldY);
  text("S        = brake", 50 + worldX, 680 + worldY);
  textSize(14);
  text("Press backspace to restart", 50 + worldX, 740 + worldY);
  pop();
}
