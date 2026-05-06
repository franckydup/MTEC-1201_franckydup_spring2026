/* Final Work in Progress Draft
By Francky Duperval

A modification of the ball game.

Goal is to add
- Points system (Check)
- Easier control mechanics
- Levels (That can only be unlocked by beating the previous) and also the ability to restart the level without restarting the game.
*/

let mode = 3; // Ball game mode

// ===== MODE 3 VARIABLES =====
let g3_ballX = 400;
let g3_ballY = 350;
let g3_ballDX = 6; // Changed from 5 to 6 for different angle
let g3_ballDY = -4; // Changed from -5 to -4 for different angle and speed
let g3_ballSize = 50;

let paddleX;
let paddleWidth = 120;
let paddleHeight = 15;
let topPaddleY = 30;

let targets = []; // good orbs
let hazards = []; // red orbs

let gameState = "playing"; // "playing", "win", "lose", "secret"
let gameStarted = false; // For home screen
let spaceHideTime = 0; // Timer for hiding hazards
let stars = []; // Array for stars
let points = 0; // Points system
let levelStartPoints = 0; // Points at the start of the current level

// ===== LEVEL SYSTEM =====
let currentLevel = 1; // Current difficulty level (1-5)
let isSecretLevel = false; // Flag for secret level
let secretLevelActive = false; // Flag to prevent re-triggering secret level

function setup() {
  createCanvas(800, 700);
}

// ===== LEVEL INITIALIZATION FUNCTION =====
function initializeLevel(level, isSecret = false) {
  // Save current points as the level start points
  levelStartPoints = points;
  
  let numTargets, numHazards;
  
  if (isSecret) {
    // Secret level - ultra challenge!
    numTargets = 8;
    numHazards = 6;
  } else {
    // Regular difficulties
    switch(level) {
      case 1: // Easy
        numTargets = 2;
        numHazards = 2;
        break;
      case 2: // Medium
        numTargets = 3;
        numHazards = 3;
        break;
      case 3: // Hard
        numTargets = 4;
        numHazards = 4;
        break;
      case 4: // Harder
        numTargets = 5;
        numHazards = 5;
        break;
      case 5: // Expert
        numTargets = 6;
        numHazards = 6;
        break;
      default:
        numTargets = 3;
        numHazards = 3;
    }
  }

  // Create target orbs
  targets = [];
  for (let i = 0; i < numTargets; i++) {
    targets.push({
      x: random(50, width - 50),
      y: random(50, height / 2),
      size: 25,
      color: [random(200, 255), random(200, 255), random(200, 255)]
    });
  }

  // Create hazard orbs (red)
  hazards = [];
  for (let i = 0; i < numHazards; i++) {
    hazards.push({
      x: random(50, width - 50),
      y: random(50, height / 2),
      size: 25
    });
  }
}

function draw() {
  // ===== MODE 3 DRAWING =====
  background(0);

  // Home screen
  if (!gameStarted) {
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Ball Game", width/2, height/2 - 140);

    textSize(24);
    text("Use the MOUSE to move the blue paddle.", width/2, height/2 - 60);
    text("Press A to switch the ball's angle.", width/2, height/2 - 20);
    text("Press SPACEBAR to make the red balls disappear.", width/2, height/2 + 20);
    text("Press SPACEBAR again to start the game.", width/2, height/2 + 60);
    
    textSize(20);
    if (isSecretLevel) {
      fill(255, 215, 0); // Gold for secret level
      text("SECRET LEVEL UNLOCKED!", width/2, height/2 + 110);
      fill(255);
    }
    text("Level: " + currentLevel, width/2, height/2 + 140);
    text("Press 3 to restart game | Press 4 to restart level", width/2, height/2 + 170);

    return; // Exit early to show only the home screen
  }

  // Check for secret level trigger (exactly 55 points)
  if (points === 55 && !secretLevelActive && gameState === "playing") {
    secretLevelActive = true;
    isSecretLevel = true;
    gameState = "win"; // Transition to secret level
    return;
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
    if (isSecretLevel) {
      fill(255, 215, 0);
      textSize(50);
      textAlign(CENTER, CENTER);
      text("SECRET LEVEL!", width/2, height/2 - 40);
      textSize(24);
      text("You scored exactly 55 points!", width/2, height/2 + 20);
      text("An ultra challenge awaits!", width/2, height/2 + 60);
      text("Press SPACEBAR to attempt the secret level", width/2, height/2 + 100);
      text("Or Press 3 to restart", width/2, height/2 + 140);
      return;
    } else {
      fill(0, 255, 0);
      textSize(50);
      textAlign(CENTER, CENTER);
      text("LEVEL COMPLETE!", width/2, height/2);
      textSize(24);
      text("Points: " + points, width/2, height/2 + 50);
      text("Press SPACEBAR to continue or Press 3 to restart", width/2, height/2 + 100);
      return;
    }
  }

  if (gameState === "lose") {
    fill(255, 0, 0);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("YOU LOSE!", width/2, height/2);
    textSize(24);
    text("Points: " + points, width/2, height/2 + 50);
    text("Press 4 to restart level | Press 3 to restart game", width/2, height/2 + 100);
    return;
  }

  // ===== PADDLES =====
  paddleX = mouseX;
  fill(0, 0, 255);
  rectMode(CENTER);
  rect(paddleX, topPaddleY, paddleWidth, paddleHeight);
  rect(paddleX, height - 30, paddleWidth, paddleHeight);

  // ===== BALL =====
  g3_ballX += g3_ballDX;
  g3_ballY += g3_ballDY;

  // Bounce off LEFT and RIGHT walls only
  if (g3_ballX < 0 || g3_ballX > width) g3_ballDX *= -1;

  // Bounce off top paddle
  if (
    g3_ballY - g3_ballSize/2 < topPaddleY + paddleHeight/2 &&
    g3_ballX > paddleX - paddleWidth/2 &&
    g3_ballX < paddleX + paddleWidth/2
  ) {
    g3_ballDY *= -1;
    g3_ballY = topPaddleY + paddleHeight/2 + g3_ballSize/2;
  } else if (g3_ballY < 0) {
    // Ball reached top without hitting paddle - LOSE
    gameState = "lose";
  }

  // Bounce off bottom paddle
  if (
    g3_ballY + g3_ballSize/2 > height - 30 - paddleHeight/2 &&
    g3_ballX > paddleX - paddleWidth/2 &&
    g3_ballX < paddleX + paddleWidth/2
  ) {
    g3_ballDY *= -1;
    g3_ballY = height - 30 - paddleHeight/2 - g3_ballSize/2;
  } else if (g3_ballY > height) {
    // Ball reached bottom without hitting paddle - LOSE
    gameState = "lose";
  }

  // Ball color (reuse your random style)
  fill(random(255), random(255), random(255));
  ellipse(g3_ballX, g3_ballY, g3_ballSize);

  // Display points and level
  fill(255);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Points: " + points, 10, 10);
  text("Level: " + currentLevel, 10, 40);

  // ===== TARGET ORBS (WIN) =====
  for (let i = targets.length - 1; i >= 0; i--) {
    let t = targets[i];
    fill(t.color[0], t.color[1], t.color[2]);
    ellipse(t.x, t.y, t.size);

    let d = dist(g3_ballX, g3_ballY, t.x, t.y);
    if (d < (g3_ballSize/2 + t.size/2)) {
      targets.splice(i, 1); // remove orb
      points += 10; // Add points for hitting target
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
    currentLevel = 1; // Reset to level 1
    isSecretLevel = false;
    secretLevelActive = false;
    points = 0; // Reset points

    // Initialize level 1
    initializeLevel(1);
  } else if (key === '4') {
    // Restart current level (reset points to level start)
    // Reset ball
    g3_ballX = width / 2;
    g3_ballY = height / 2;
    g3_ballDX = 6;
    g3_ballDY = -4;

    // Paddle
    paddleX = width / 2;

    // Reset game state but restore points to level start
    points = levelStartPoints;
    gameState = "playing";
    gameStarted = true; // Stay in game
    
    // Reinitialize current level
    initializeLevel(currentLevel, isSecretLevel);
  } else if (key === ' ') { // Spacebar
    if (!gameStarted) {
      gameStarted = true; // Start the game if on home screen
      initializeLevel(currentLevel, isSecretLevel);
    } else if (gameState === "win") {
      if (isSecretLevel) {
        // Secret level was offered, now starting it
        gameState = "playing";
        secretLevelActive = true;
        initializeLevel(currentLevel, true); // Initialize secret level
      } else {
        // Regular level completion, advance to next level
        currentLevel++;
        if (currentLevel > 5) {
          currentLevel = 1; // Loop back to level 1 if exceeded
        }
        gameState = "playing";
        gameStarted = false; // Back to home screen
      }
    } else {
      // During gameplay - hide hazards
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