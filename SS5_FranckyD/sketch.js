/*

Short Study #5
By Francky Duperval

Using the for and while loops, I am modifying my code for my ball game.

The sketch must include the following:
At least one conditional statement
At least two for loops that create a pattern of some kind
A developed concept and techniques moving beyond the in-class demos
*/

let mode = 3; // Ball game mode

// ===== MODE 3 VARIABLES =====
let g3_ballX, g3_ballY;
let g3_ballDX = 6; // Changed from 5 to 6 for different angle
let g3_ballDY = -4; // Changed from -5 to -4 for different angle and speed
let g3_ballSize = 50;

let paddleX;
let paddleWidth = 120;
let paddleHeight = 15;

let targets = []; // good orbs
let hazards = []; // red orbs

let gameState = "playing"; // "playing", "win", "lose"
let gameStarted = false; // For home screen
let spaceHideTime = 0; // Timer for hiding hazards
let stars = []; // Array for stars

function setup() {
  createCanvas(800, 700);
}

function draw() {
  // ===== MODE 3 DRAWING =====
  background(0);

  // Home screen
  if (!gameStarted) {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Ball Game: Press SPACE to Start!", width/2, height/2);
    return; // Exit early to show only the home screen
  }

  // Stars when hiding hazards
  if (millis() < spaceHideTime) {
    fill(255);
    noStroke();
    for (let s of stars) {
      ellipse(s.x, s.y, 2, 2);
    }
  }

  // ===== GAME OVER SCREENS =====
  if (gameState === "win") {
    fill(0, 255, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width/2, height/2);
    textSize(24);
    text("Press 3 to restart", width/2, height/2 + 60);
    return;
  }

  if (gameState === "lose") {
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("YOU LOSE!", width/2, height/2);
    textSize(24);
    text("Press 3 to restart", width/2, height/2 + 60);
    return;
  }

  // ===== PADDLE =====
  paddleX = mouseX;
  fill(0, 0, 255);
  rectMode(CENTER);
  rect(paddleX, height - 30, paddleWidth, paddleHeight);

  // ===== BALL =====
  g3_ballX += g3_ballDX;
  g3_ballY += g3_ballDY;

  // Bounce off walls
  if (g3_ballX < 0 || g3_ballX > width) g3_ballDX *= -1;
  if (g3_ballY < 0) g3_ballDY *= -1;

  // Bounce off bottom (optional: you could lose here instead)
  if (g3_ballY > height) g3_ballDY *= -1;

  // Bounce off paddle
  if (
    g3_ballY + g3_ballSize/2 > height - 30 - paddleHeight/2 &&
    g3_ballX > paddleX - paddleWidth/2 &&
    g3_ballX < paddleX + paddleWidth/2
  ) {
    g3_ballDY *= -1;
  }

  // Ball color (reuse your random style)
  fill(random(255), random(255), random(255));
  ellipse(g3_ballX, g3_ballY, g3_ballSize);

  // ===== TARGET ORBS (WIN) =====
  for (let i = targets.length - 1; i >= 0; i--) {
    let t = targets[i];
    fill(t.color[0], t.color[1], t.color[2]);
    ellipse(t.x, t.y, t.size);

    let d = dist(g3_ballX, g3_ballY, t.x, t.y);
    if (d < (g3_ballSize/2 + t.size/2)) {
      targets.splice(i, 1); // remove orb
    }
  }

  // Win condition
  if (targets.length === 0) {
    gameState = "win";
  }

  // ===== HAZARD ORBS (LOSE) =====
  for (let h of hazards) {
    if (millis() >= spaceHideTime) { // Only draw if not hidden
      fill(255, 0, 0);
      ellipse(h.x, h.y, h.size);
    }

    // Only check collision if not hidden
    if (millis() >= spaceHideTime) {
      let d = dist(g3_ballX, g3_ballY, h.x, h.y);
      if (d < (g3_ballSize/2 + h.size/2)) {
        gameState = "lose";
      }
    }
  }
}

function keyPressed() {
  if (key === '3') {
    mode = 3; // Ball game mode

    // Reset ball
    g3_ballX = width / 2;
    g3_ballY = height / 2;
    g3_ballDX = 6;
    g3_ballDY = -4;

    // Paddle
    paddleX = width / 2;

    // Reset game state
    gameState = "playing";
    gameStarted = false; // Back to home screen

    // Create target orbs (3 to win)
    targets = [];
    for (let i = 0; i < 3; i++) {
      targets.push({
        x: random(50, width - 50),
        y: random(50, height / 2),
        size: 25,
        color: [random(255), random(255), random(255)]
      });
    }

    // Create hazard orbs (red)
    hazards = [];
    for (let i = 0; i < 3; i++) {
      hazards.push({
        x: random(50, width - 50),
        y: random(50, height / 2),
        size: 25
      });
    }
  } else if (key === ' ') { // Spacebar
    if (!gameStarted) {
      gameStarted = true; // Start the game if on home screen
    } else {
      spaceHideTime = millis() + 1000; // Hide hazards for 1 second
      // Generate stars
      stars = [];
      let starCount = 0;
      while (starCount < 50) { // While loop for random stars
        stars.push({x: random(width), y: random(height)});
        starCount++;
      }
      for (let i = 0; i < 10; i++) { // First for loop: rows
        for (let j = 0; j < 8; j++) { // Second for loop: columns
          stars.push({x: i * 80 + 40, y: j * 70 + 35});
        }
      }
    }
  } else if (key === 'a' || key === 'A') {
    g3_ballDX = -g3_ballDX; // Reverse x-direction
    g3_ballDX *= 1.2; // Boost x-speed
  }
}