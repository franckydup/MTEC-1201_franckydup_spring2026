// Spheres of Sorrow
// by Francky Duperval

// You play as Thelnar a young man determined to locate 7 orbs known as the Spheres of Sorrow, 
// which are said to erase sorrow from the one who possesses them, allowing them to find peace. 
// As the player, you navigate various settings such as abandoned subways and scorching deserts in his search for the 7 spheres. 
// On each level the player hops from platform to platform in order to reach the sphere on that level
// The player has to make contact with a part of the sphere in order to reach the necessary amount of sphere power.


// Game state and level tracking ---
let screen = "title"; // current screen: title, level, win, or lose
let currentLevel = 1; // 
let globalWeight = 0; // game-wide weight factor used for difficulty scaling
let playerWeight = 0; // weight applied to player movement and physics
let thelnar; // player character object
let sphere; // power sphere object
let levelStarted = false; 
let levelStartTime = 0;  
let groundY = 650; // y position of the ground surface

// Platforms!! static floor pieces, movingPlatforms: animated platforms
let platforms = []; 
let movingPlatforms = [];

// Sound and audio 
let titleMusic;
let levelMusic = []; // array of level-specific music tracks
let currentMusic = null; // currently playing music track
let audioUnlocked = false; // whether browser audio has been enabled
let screenShake = 0; 

// Levels!!!

let levelNames = [ // initialize levelNames
  "The Forgotten Departure", 
  "The Scorched Regret",
  "The Echoes of Home", 
  "The Silent Goodbyes", 
  "The Hollow Performance", 
  "The Weight of the World", 
  "The Mirror of Truth" 
]; 
let levelPowerGoal = [3, 4, 5, 6, 7, 8, 10]; // initialize levelPowerGoal
let levelIntroText = [
  "The air feels heavier here...",
  "Waves of heat distort the path.", 
  "Memories flicker in the periphery.", 
  "The city glares down mercilessly.", 
  "Systems begin to falter.", 
  "Each step echoes with a crippling heaviness.", 
  "Only silence remains." 
]; 

function preload() { 
  soundFormats('mp3'); 
  titleMusic = loadSound('assets/music/Game Start Screen Music.mp3'); 
  let levelFiles = [ 
    'The Forgotten Departure.mp3', 
    'The Scorched Regret.mp3', 
    'The Echoes of Home.mp3', 
    'The Silent Goodbyes.mp3', 
    'The Hollow Performance.mp3', 
    'The Weight of the World.mp3', 
    'The Mirror of Truth.mp3' 
  ];
  for (let i = 0; i < levelFiles.length; i++) { 
    levelMusic[i] = loadSound('assets/music/' + levelFiles[i]);
  } 
} 

// Stop whatever music is currently playing before a new track starts
function stopCurrentMusic() { 
  if (currentMusic && currentMusic.isPlaying()) { 
    currentMusic.stop(); 
  } 
  currentMusic = null; 
} 

function playMusicForState() { 
  if (!audioUnlocked) { 
    return; 
  } 
  let nextMusic = null; 
  if (screen === 'title') { 
    nextMusic = titleMusic; 
  } else if (screen === 'level') { 
    let levelIndex = currentLevel - 1;  // For separating out levels for sound purposes
    if (levelIndex >= 0 && levelIndex < levelMusic.length) { 
      nextMusic = levelMusic[levelIndex]; 
    } 
  }
  if (nextMusic !== currentMusic) { 
    stopCurrentMusic(); 
    currentMusic = nextMusic; 
    if (currentMusic) { 
      currentMusic.setLoop(true); 
      currentMusic.play();
    }
  } 
} 

function setup() { 
  createCanvas(800, 700); 
  thelnar = new Thelnar(width * 0.2, groundY - 80); 
  sphere = new Sphere(width * 0.7, height * 0.35, 100); 
  playMusicForState(); 
} 

// Enable browser audio once the player interacts with the game
function enableAudio() {
  if (audioUnlocked) { 
    return;
  } 
  userStartAudio(); 
  audioUnlocked = true; 
  playMusicForState(); 
} 

// Thelnar
class Thelnar { 
  constructor(x, y) { 
    this.startX = x; 
    this.startY = y; 
    this.reset(); 
  } 

  // Reset the player to the starting position and default physics values
  reset() { 
    this.x = this.startX; 
    this.y = this.startY; 
    this.prevX = this.x; 
    this.prevY = this.y; 
    this.vx = 0; 
    this.vy = 0; 
    this.radius = 24; 
    this.baseMaxSpeed = 7; 
    this.maxSpeed = this.baseMaxSpeed; 
    this.baseJumpForce = 14; 
    this.jumpForce = this.baseJumpForce; 
    this.baseGravity = 0.6; 
    this.gravity = this.baseGravity; 
    this.baseFriction = 0.96; 
    this.friction = this.baseFriction; 
    this.powerTime = 0;
    this.jumpReady = true; 
  } 

  // Read player input and convert it to horizontal movement and jump behavior
  applyInput() { 
    let targetVX = 0;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { 
      targetVX -= this.maxSpeed; 
    } 
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { 
      targetVX += this.maxSpeed; 
    } 

    // Smooth the player's velocity based on current weight
    let responsiveness = 0.9 - (playerWeight * 0.5);
    if (responsiveness < 0.2) {
      responsiveness = 0.2;
    }
    this.vx = this.vx * (1 - responsiveness) + targetVX * responsiveness; 

    let pressJump = keyIsDown(UP_ARROW) || keyIsDown(87);
    if (pressJump && this.onGround() && this.jumpReady) { 
      this.vy = -this.jumpForce; 
      this.jumpReady = false; 
      if (currentLevel === 6) {
        screenShake = 3;
      }
    } 
    if (!pressJump) { 
      this.jumpReady = true; 
    } 
  } 

  // Gravity, friction, and collision detection 
  applyPhysics() { 
    this.prevX = this.x; 
    this.prevY = this.y; 
    this.moveWithMovingPlatforms();
    this.vy += this.gravity; 
    this.vx *= this.friction; 
    let maxVX = this.maxSpeed * 1.2; 
    if (this.vx < -maxVX) { 
      this.vx = -maxVX; 
    } else if (this.vx > maxVX) { 
      this.vx = maxVX; 
    } 
    this.y += this.vy; 
    this.x += this.vx; 

    if (this.x - this.radius < 0) {
      this.x = this.radius; 
      this.vx *= -0.4; 
    } 
    if (this.x + this.radius > width) { 
      this.x = width - this.radius; 
      this.vx *= -0.4; 
    } 
    if (this.y + this.radius >= groundY) { 
      this.y = groundY - this.radius; 
      this.vy = 0; 
    } 

    let prevBottom = this.prevY + this.radius; 
    let currBottom = this.y + this.radius;

    // Platform collision
    for (let i = 0; i < platforms.length; i++) { 
      let p = platforms[i]; 
      if (this.vy > 0 && prevBottom <= p.y && currBottom >= p.y && this.x + this.radius > p.x && this.x - this.radius < p.x + p.w) { 
        this.y = p.y - this.radius; 
        this.vy = 0; 
        break; // break out of loop or switch
      } 
    } 

    // Moving platform collision
    for (let i = 0; i < movingPlatforms.length; i++) { 
      let p = movingPlatforms[i]; 
      if (this.vy > 0 && prevBottom <= p.y && currBottom >= p.y && this.x + this.radius > p.x && this.x - this.radius < p.x + p.w) { // conditional check
        this.y = p.y - this.radius; 
        this.vy = 0; 
        break; 
      } 
    } 
  } 

  onGround() { 
    let onGroundLevel = this.y + this.radius >= groundY - 1; 
    let onPlatform = false; 
    for (let i = 0; i < platforms.length; i++) { 
      let p = platforms[i]; 
      if (this.y + this.radius >= p.y - 1 && this.y + this.radius <= p.y + 2 && this.x + this.radius > p.x && this.x - this.radius < p.x + p.w) { 
        onPlatform = true; 
        break; 
      } 
    } 
    let onMovingPlatform = false; 
    for (let i = 0; i < movingPlatforms.length; i++) { 
      let p = movingPlatforms[i]; 
      if (this.y + this.radius >= p.y - 1 && this.y + this.radius <= p.y + 2 && this.x + this.radius > p.x && this.x - this.radius < p.x + p.w) { 
        onMovingPlatform = true; 
        break; 
      } 
    } 
    return onGroundLevel || onPlatform || onMovingPlatform; 
  } 

  update() { 
    this.applyInput(); 
    this.applyPhysics(); 
  } 

  moveWithMovingPlatforms() { 
    let feetY = this.y + this.radius; 
    for (let i = 0; i < movingPlatforms.length; i++) { 
      let p = movingPlatforms[i]; 
      let onTop = feetY >= p.y - 1 && feetY <= p.y + 2 && this.x + this.radius > p.x && this.x - this.radius < p.x + p.w; 
      if (onTop) { 
        let dx = 0; 
        let dy = 0; 
        if (p.prevX !== undefined) { 
          dx = p.x - p.prevX; 
        } 
        if (p.prevY !== undefined) { 
          dy = p.y - p.prevY; 
        } 
        this.x += dx; 
        this.y += dy; 
        break; 
      } 
    } 
  } 

  // Draw the player character 
  draw() { 
    let x0 = this.x; 
    let y0 = this.y; 
    let alpha = 255; 
    noStroke();
    fill(240, 180, 80, alpha); 
    ellipse(x0, y0 - 16, 28, 32); 
    fill(50, 20, 20, alpha); 
    ellipse(x0 - 6, y0 - 22, 8, 8); 
    ellipse(x0 + 6, y0 - 22, 8, 8); 
    stroke(240, 200, 120, alpha); 
    strokeWeight(8); 
    line(x0 - 10, y0, x0 - 18, y0 + 16); 
    line(x0 + 10, y0, x0 + 18, y0 + 16); 
    line(x0 - 8, y0 + 10, x0 - 12, y0 + 28); 
    line(x0 + 8, y0 + 10, x0 + 12, y0 + 28); 
    noStroke(); 
    fill(120, 180, 220, alpha); 
    rectMode(CENTER); 
    rect(x0, y0 + 10, 28, 36, 8); 
  } 
} 

class Sphere { 
  constructor(x, y, radius, color = [120, 220, 255], movementType = 'orbit') { 
    this.x = x; 
    this.y = y; 
    this.radius = radius; 
    this.color = color; 
    this.movementType = movementType; 
    this.angle = 0;
    this.time = 0;
    this.orbitRadius = 20; 
    this.noiseSeed = random(1000); 
  } 

  update() { 
    this.time += 0.04; 

    if (this.movementType === 'orbit') { 
      // Simple circular orbit
      this.angle += 0.012 + currentLevel * 0.002; 
      this.x = width * 0.5 + cos(this.angle) * (100 + currentLevel * 8); 
      this.y = height * 0.35 + sin(this.angle) * (70 + currentLevel * 5);
    } else if (this.movementType === 'figure8') { 
      // Figure-8 pattern
      this.x = width * 0.5 + 80 * sin(this.time * 0.08); 
      this.y = height * 0.35 + 60 * sin(this.time * 0.16); 
    } else if (this.movementType === 'zigzag') {
      // Zigzag side to side
      this.x = width * 0.5 + 100 * sin(this.time * 0.07); 
      this.y = height * 0.35 + 20 * cos(this.time * 0.12); 
    } else if (this.movementType === 'bounce') { 
      // Bouncing pattern
      this.x = width * 0.5 + 60 * sin(this.time * 0.1); 
      this.y = height * 0.35 + abs(80 * sin(this.time * 0.08)); 
    } else if (this.movementType === 'spiral') {
      // Spiral inward/outward
      let spiralRadius = 100 + 40 * sin(this.time * 0.05); 
      this.x = width * 0.5 + cos(this.time * 0.12) * spiralRadius; 
      this.y = height * 0.35 + sin(this.time * 0.12) * spiralRadius * 0.7; 
    } else if (this.movementType === 'drift') { 
      // Slow random drift
      this.x = width * 0.5 + 80 * sin(this.time * 0.03); 
      this.y = height * 0.35 + 60 * cos(this.time * 0.04); 
    } else if (this.movementType === 'stationary') { 
      // Stays in place
      this.x = width * 0.5; 
      this.y = height * 0.35; 
    } 
  }

  isTouching(player) {
    return dist(this.x, this.y, player.x, player.y) <= this.radius + player.radius; 
  } 

  // Apply sphere influence to the player when they are nearby
  applyTo(player) { // statement
    let distance = dist(this.x, this.y, player.x, player.y); 
    let influence = 1 - (distance - this.radius) / (this.radius * 2);
    if (influence < 0) {
      influence = 0;
    } else if (influence > 1) {
      influence = 1;
    }
    if (distance < this.radius * 1.4) {
      let gravityFactor = 0.7 + (1 - 0.7) * (1 - influence); 
      player.gravity = player.baseGravity * gravityFactor; 
      player.friction = player.baseFriction + 0.02 * influence;
    } else { 
      player.gravity = player.baseGravity + playerWeight * 0.4;
      player.friction = player.baseFriction - playerWeight * 0.15;
    }
  }

  draw() { 
    noStroke(); 
    let c = this.color; 
    fill(c[0], c[1], c[2], 80); 
    ellipse(this.x, this.y, this.radius * 2.6); 
    fill(c[0] * 0.7, c[1] * 0.7, c[2] * 0.7, 140); 
    ellipse(this.x, this.y, this.radius * 2.2); 
    fill(c[0] * 0.9, c[1] * 0.9, c[2] * 0.9);
    ellipse(this.x, this.y, this.radius * 1.4); 
    fill(255); 
    ellipse(this.x - this.radius * 0.2, this.y - this.radius * 0.2, 18, 18); 
  }

  isNear(player) { 
    return dist(this.x, this.y, player.x, player.y) < this.radius * 2.0; 
  } 
} 

// Draw loop called every frame to update and display the game
function draw() { 
  playMusicForState(); 
  if (currentLevel === 6 && screenShake > 0) { 
    screenShake -= 0.5; 
  } 
  background(12, 10, 24); 
  if (screen === 'title') { 
    drawTitle(); 
  } else if (screen === 'level') { 
    runLevel(currentLevel); 
  } else if (screen === 'win') { 
    drawWinScreen(); 
  } else if (screen === 'lose') { 
    drawLoseScreen(); 
  } 
} 

// Draw the title screen with instructions before the game begins
function drawTitle() { 
  fill(255); 
  textAlign(CENTER); 
  textSize(52); 
  text('Spheres of Sorrow', width / 2, height / 2 - 40);
  textSize(18); 
  text('WASD or Arrow keys to move. Stay close to the sphere to power up.', width / 2, height / 2 + 20); 
  text('Press SPACE to begin.', width / 2, height / 2 + 70); 
  if (!audioUnlocked) { 
    textSize(16); 
    text('Click or press any key to enable sound.', width / 2, height / 2 + 110); 
  } 
} 

// Set up the game state and platforms for a new level
// Prepares the level layout, sphere behavior, and player reset.
function initializeLevel(level) { 
  currentLevel = level; 
  screen = 'level';
  levelStarted = true; 
  levelStartTime = millis(); 
  let weightValue = (level - 1) / 6;
  if (weightValue < 0) { 
    weightValue = 0; 
  } else if (weightValue > 1) { 
    weightValue = 1; 
  }
  globalWeight = weightValue;
  playerWeight = globalWeight; 
  thelnar.reset(); 
  playMusicForState(); 
  thelnar.x = width * 0.3; 
  thelnar.y = groundY - thelnar.radius; 
  thelnar.powerTime = 0;
  
  // Sphere color and movement type for each level
  let sphereColors = [ 
    [100, 150, 255],  // Level 1 - blue
    [255, 150, 50],   // Level 2 - orange
    [100, 200, 100],  // Level 3 - green
    [200, 100, 255],  // Level 4 - purple
    [255, 80, 80],    // Level 5 - red
    [50, 50, 50],     // Level 6 - black
    [150, 150, 150]   // Level 7 - grey
  ]; 
  
  let sphereMovements = ['orbit', 'figure8', 'zigzag', 'bounce', 'spiral', 'drift', 'stationary']; 
  
  sphere = new Sphere(width * 0.7, height * 0.35, 80 + level * 5, sphereColors[level - 1], sphereMovements[level - 1]); 
  
  // Set platforms for the level
  if (level === 1) {
    // Abandoned Transit Station - broken concrete slabs
    platforms = [ 
      {x: 250, y: 550, w: 120, h: 20}, 
      {x: 450, y: 450, w: 120, h: 20}, 
      {x: 350, y: 350, w: 120, h: 20} 
    ]; 
    movingPlatforms = []; 
  } else if (level === 2) { 
    // Industrial Heat Vents - metal catwalks
    platforms = [ 
      {x: 150, y: 560, w: 100, h: 18}, 
      {x: 400, y: 480, w: 100, h: 18}, 
      {x: 600, y: 400, w: 100, h: 18}, 
      {x: 300, y: 320, w: 100, h: 18} 
    ]; 
    movingPlatforms = [ 
      {x: 500, y: 500, w: 100, h: 18, moveX: 100, moveY: 80, speedX: 0.02, speedY: 0.025, baseX: 500, baseY: 500} 
    ]; 
  } else if (level === 3) { 
    // Crowded Diner - booth seating
    platforms = [ 
      {x: 180, y: 570, w: 110, h: 20}, 
      {x: 280, y: 520, w: 110, h: 20}, 
      {x: 380, y: 460, w: 110, h: 20}, 
      {x: 480, y: 390, w: 110, h: 20} 
    ]; 
    movingPlatforms = [ 
      {x: 350, y: 250, w: 110, h: 20, moveX: 120, moveY: 90, speedX: 0.018, speedY: 0.022, baseX: 350, baseY: 250} 
    ]; 
  } else if (level === 4) { 
    // Neon High-Rises - building ledges
    platforms = [ 
      {x: 100, y: 580, w: 130, h: 22}, 
      {x: 300, y: 520, w: 130, h: 22}, 
      {x: 500, y: 450, w: 130, h: 22}, 
      {x: 350, y: 360, w: 130, h: 22} 
    ]; 
    movingPlatforms = [ 
      {x: 150, y: 350, w: 130, h: 22, moveX: 140, moveY: 180, speedX: 0.015, speedY: 0.02, baseX: 150, baseY: 500}, 
      {x: 500, y: 250, w: 130, h: 22, moveX: 130, moveY: 200, speedX: 0.017, speedY: 0.024, baseX: 500, baseY: 480} 
    ]; 
  } else if (level === 5) { 
    // Corporate Data Mining - grey slabs
    platforms = [ 
      {x: 120, y: 560, w: 115, h: 20}, 
      {x: 300, y: 500, w: 115, h: 20}, 
      {x: 480, y: 440, w: 115, h: 20}, 
      {x: 350, y: 360, w: 115, h: 20} 
    ]; 
    movingPlatforms = [
      {x: 250, y: 450, w: 115, h: 20, moveX: 150, moveY: 220, speedX: 0.016, speedY: 0.021, baseX: 250, baseY: 550}, 
      {x: 500, y: 350, w: 115, h: 20, moveX: 160, moveY: 240, speedX: 0.019, speedY: 0.023, baseX: 500, baseY: 480} 
    ]; 
  } else if (level === 6) {
    // Hostile High-Altitude - collapsing structures
    platforms = [ 
      {x: 140, y: 570, w: 105, h: 18}, 
      {x: 320, y: 510, w: 105, h: 18}, 
      {x: 500, y: 450, w: 105, h: 18},
      {x: 350, y: 380, w: 105, h: 18} 
    ]; 
    movingPlatforms = [ 
      {x: 300, y: 480, w: 105, h: 18, moveX: 180, moveY: 250, speedX: 0.022, speedY: 0.025, baseX: 300, baseY: 580}, 
      {x: 550, y: 380, w: 105, h: 18, moveX: 170, moveY: 260, speedX: 0.02, speedY: 0.027, baseX: 550, baseY: 500}, 
      {x: 200, y: 280, w: 105, h: 18, moveX: 190, moveY: 240, speedX: 0.024, speedY: 0.026, baseX: 200, baseY: 480} 
    ]; 
  } else if (level === 7) { 
    // Altar of Silence - stone blocks
    platforms = [ 
      {x: 160, y: 560, w: 120, h: 22}, 
      {x: 350, y: 480, w: 120, h: 22}, 
      {x: 540, y: 400, w: 120, h: 22} 
    ]; 
    movingPlatforms = [ 
      {x: 250, y: 200, w: 120, h: 22, moveX: 100, moveY: 200, speedX: 0.01, speedY: 0.012, baseX: 250, baseY: 380} 
    ];
  } else { 
    platforms = []; 
    movingPlatforms = []; 
  } 
} 

// Restart the game from the very beginning without exiting the program
function restartGame() { 
  currentLevel = 1; 
  screen = 'title'; 
  levelStarted = false; 
  levelStartTime = 0; 
  globalWeight = 0; 
  playerWeight = 0; 
  thelnar.reset(); 
  sphere = new Sphere(width * 0.7, height * 0.35, 100); 
  playMusicForState(); 
} 

// This helper makes the restart behavior explicit and easy to call.
function startOver() { 
  restartGame(); 
}

// Update level-dependent physics parameters based on current level
function updateLevelParameters() { 
  playerWeight = (currentLevel - 1) / 10; 
  if (playerWeight < 0) { 
    playerWeight = 0; 
  } else if (playerWeight > 1) { 
    playerWeight = 1; 
  } 
  globalWeight = playerWeight; 

  let levelModifier = (currentLevel - 1) / 6;
  if (levelModifier < 0) {
    levelModifier = 0;
  } else if (levelModifier > 1) {
    levelModifier = 1;
  }
  thelnar.maxSpeed = thelnar.baseMaxSpeed * (1 - levelModifier * 0.15); 
  thelnar.jumpForce = thelnar.baseJumpForce * (1 - levelModifier * 0.3); 
  thelnar.baseGravity = 0.6 + (playerWeight * 0.2); 
  thelnar.baseFriction = 0.96 - (playerWeight * 0.06); 
} 

// Draw the level environment
function drawLevelEnvironment(level) {
  noStroke(); 
  let t = level / 7; 
  let skyR = 12 + (70 - 12) * t; 
  let skyG = 10 + (40 - 10) * t; 
  let skyB = 24 + (110 - 24) * t; 
  background(skyR, skyG, skyB); 
  
  // Level-specific background visuals
  if (level === 1) { 
    // Abandoned Transit Station - dusty, grey
    fill(40, 40, 50, 100); 
    for (let i = 0; i < 20; i++) { 
      rect(random(width), random(height * 0.7), random(30, 80), 3); 
    } 
    fill(30, 30, 40); 
    textSize(16); 
    textAlign(CENTER); 
    fill(100, 100, 100, 80); 
    text('STATION CLOSED', 150, 150); 
    text('NO SERVICE', 650, 200); 
  } else if (level === 2) { 
    // Industrial Heat Vents - orange glow, heat haze
    fill(255, 150, 50, 80); 
    for (let i = 0; i < 30; i++) { 
      ellipse(random(width), random(height), random(20, 60), random(10, 40)); 
    } 
    fill(150, 50, 20, 60); 
    rect(0, groundY - 50, width, 50); 
  } else if (level === 3) { 
    // Crowded Diner - ghostly overlays
    fill(200, 150, 100, 40); 
    for (let i = 0; i < 10; i++) { 
      rect(random(width), random(height * 0.8), random(60, 100), random(40, 80)); 
    } 
    fill(255, 200, 150, 30); 
    textSize(14); 
    textAlign(LEFT); 
    text('...old stories...', 100, 200); 
    text('...long conversations...', 500, 250);
  } else if (level === 4) { 
    // Neon High-Rises - desaturating colors, high contrast
    let saturation = 1 - playerWeight * 0.7; 
    if (saturation < 0.3) { 
      saturation = 0.3; 
    } else if (saturation > 1) { 
      saturation = 1; 
    } 
    fill(255 * saturation, 100 * saturation, 150 * saturation, 100); 
    for (let i = 0; i < 8; i++) { 
      rect(i * 100, 0, 80, height * 0.6); 
    } 
    stroke(255 * saturation, 100 * saturation, 150 * saturation);
    strokeWeight(2); 
    for (let i = 0; i < 30; i++) { 
      line(random(width), random(height * 0.5), random(width), random(height * 0.5)); 
    } 
  } else if (level === 5) { 
    // Corporate Data Mining - grey slabs and monitors
    fill(60, 60, 70); 
    for (let i = 0; i < 6; i++) { 
      rect(i * 130, height * 0.2, 120, 100); 
    } 
    fill(80, 200, 100, 100); 
    textSize(12); 
    textAlign(CENTER); 
    for (let i = 0; i < 6; i++) { 
      text('MINING', i * 130 + 60, height * 0.45); 
    } 
  } else if (level === 6) { 
    // Hostile High-Altitude - wind effects, collapsing
    fill(200, 200, 220, 80); 
    for (let i = 0; i < 20; i++) { 
      line(random(width), random(height), random(width), random(height));
    } 
    fill(100, 50, 50, 100); 
    rect(random(width) - 50, random(height * 0.6), 100, 20); 
  } else if (level === 7) { 
    // Altar of Silence - serene, minimal
    fill(100, 120, 100, 100); 
    ellipse(width * 0.5, height * 0.3, 150, 150);
    fill(200, 200, 180); 
    ellipse(width * 0.5, height * 0.3, 100, 100);
  } 
  
  fill(36, 28, 48); 
  rect(0, groundY, width, height - groundY); 
  
  // Draw platforms
  rectMode(CORNER); 
  fill(60, 50, 70); 
  for (let i = 0; i < platforms.length; i++) { // loop iteration
    let p = platforms[i]; 
    rect(p.x, p.y, p.w, p.h); 
  } 
  
  // Draw moving platforms
  fill(70, 60, 90); 
  for (let i = 0; i < movingPlatforms.length; i++) { 
    let p = movingPlatforms[i]; 
    rect(p.x, p.y, p.w, p.h); 
  } 
  
  fill(255, 255, 255, 120); 
  textSize(18); 
  textAlign(LEFT); 
  text('Level ' + level + ': ' + levelNames[level - 1], 20, 30); 
  text('Weight: ' + nf(playerWeight, 1, 2), 20, 55); 
  text('Sphere Power: ' + nf(thelnar.powerTime, 1, 2) + 's / ' + levelPowerGoal[level - 1] + 's', 20, 80); 
  text('Speed: ' + nf(thelnar.maxSpeed, 1, 2), 20, 105); 
  text('Jump Force: ' + nf(thelnar.jumpForce, 1, 2), 20, 130); 
  fill(255, 180, 180, 120); 
  rect(20, 140, playerWeight * 220, 12);
  noFill(); 
  stroke(255); 
  strokeWeight(1); 
  rect(20, 140, 220, 12); 
  noStroke(); 
} 

function updateMovingPlatforms() {
  for (let i = 0; i < movingPlatforms.length; i++) {
    let p = movingPlatforms[i];
    if (p.prevX === undefined) {
      p.prevX = p.x;
      p.prevY = p.y;
    } else {
      p.prevX = p.x;
      p.prevY = p.y;
    }
    let rawX = sin(frameCount * p.speedX);
    let rawY = sin(frameCount * p.speedY);
    let holdThreshold = 0.92;
    if (rawX > holdThreshold) {
      rawX = 1;
    } else if (rawX < -holdThreshold) {
      rawX = -1;
    }
    if (rawY > holdThreshold) {
      rawY = 1;
    } else if (rawY < -holdThreshold) {
      rawY = -1;
    }
    p.x = p.baseX + p.moveX * rawX;
    p.y = p.baseY + p.moveY * rawY;
  }
}

// Run one level: initialize it, show intro text, then update gameplay each frame
function runLevel(level) { 
  if (!levelStarted) { 
    initializeLevel(level); 
    return; 
  } 
  if (millis() - levelStartTime < 10000) {
    fill(255); 
    textAlign(CENTER);
    textSize(40); 
    text(levelNames[level - 1], width / 2, height / 2 - 10); 
    textSize(18); 
    text(levelIntroText[level - 1], width / 2, height / 2 + 30); 
    return; 
  } 

  updateMovingPlatforms();
  updateLevelParameters(); 
  sphere.update(); 
  sphere.applyTo(thelnar);
  thelnar.update(); 
  drawLevelEnvironment(level); 

  sphere.draw(); 
  thelnar.draw();

  let touching = sphere.isTouching(thelnar); 
  if (touching) {
    thelnar.powerTime += deltaTime / 1000; 
  } else { 
    thelnar.powerTime = max(0, thelnar.powerTime - deltaTime / 1000 * 0.4); 
  } 

  stroke(255, 255, 100, 120); 
  strokeWeight(2); 
  noFill(); 
  ellipse(sphere.x, sphere.y, sphere.radius * 2.6); 

  if (thelnar.y > height + 40) { 
    screen = 'lose'; 
    levelStarted = false; 
  } 

  if (thelnar.powerTime >= levelPowerGoal[level - 1]) { 
    screen = 'win'; 
    levelStarted = false; 
  } 
} 

// Draw the win screen shown after the player completes the level goal
function drawWinScreen() { 
  fill(220, 255, 220); 
  textAlign(CENTER); 
  textSize(50); 
  text('Sphere Powered!', width / 2, height / 2 - 40); 
  textSize(22); 
  text('Press N for next level, or R to restart from the beginning.', width / 2, height / 2 + 20); 
}

function drawLoseScreen() { 
  fill(255, 180, 180); 
  textAlign(CENTER); 
  textSize(50); 
  text('The Weight Crushes You', width / 2, height / 2 - 40); 
  textSize(22); 
  text('Press R to retry the level.', width / 2, height / 2 + 20); 
}

// Global key input for title, win, and lose screens
function keyPressed() { 
  enableAudio(); 
  if (screen === 'title' && keyCode === 32) { 
    screen = 'level';
    currentLevel = 1;
    levelStarted = false; 
    return; 
  } 
  if (screen !== 'title' && (key === 't' || key === 'T')) { 
    startOver(); 
    return; 
  } 
  if (screen === 'win') { 
    if (key === 'n' || key === 'N') { 
      if (currentLevel < 7) { 
        currentLevel += 1; 
        screen = 'level'; 
        levelStarted = false; 
      } else { 
        screen = 'title'; 
        playMusicForState(); 
      } 
      return; 
    } 
    if (key === 'r' || key === 'R') { 
      startOver(); 
      return; 
    } 
  } 
  if (screen === 'lose' && (key === 'r' || key === 'R')) { 
    levelStarted = false; 
    return; 
  } 
} 
