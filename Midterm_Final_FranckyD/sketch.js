let ballSize = 50; // Initial size of the ball at 50 pixels
let originalSize = 50; // Store the original size
let expanding = false; // Flag to determine if the ball is expanding
let contracting = false; // Flag to determine if the ball is contracting
let ellipseColor; // will pick a random color in setup
let originalColor; // Store the original color to return to
let ballY = 350; // Initial Y position of the ball at 350 pixels
let ballX = 0;    // start at zero; update each frame
let Space;
let opacity = 0;
let startTime; // Time when the program starts
let countdownDuration = 10000; // 10 seconds in milliseconds
let ballVisible = false; // Flag to control when the ball appears

let mode = 1; // 1 for original mode, 2 for alternate mode
let mode2_ballSize = 50;
let mode2_expanding = true;
let mode2_ellipseColor;
let mode2_ballY = 350;
let mode2_ballX = 0;

function preload(){
Space = loadImage("Images/Space.jpeg")
}

function setup() {
  createCanvas(800, 700);
  background(250);
  imageMode(CORNER);
  // Initialize the ball color to purple
  ellipseColor = [128, 0, 128]; // Purple
  originalColor = [...ellipseColor]; // Store a copy of the original color
  
  // Initialize mode 2 color
  mode2_ellipseColor = [random(255), random(255), random(255)];
  
  // Start the countdown timer
  startTime = millis();
}

function draw() {
  if (mode === 1) {
    background(250);

    fill(opacity);
    image(Space, 0, 0, width , height);
    
    // Creating left accelerator beam
    stroke('blue');
    strokeWeight(5);
    line(0, height/2, width/2, height/2);

    // Creating right accelerator beam
    stroke('red');
    strokeWeight(5);
    line(width, height/2, width/2, height/2);

    // Calculate remaining time for countdown
    let elapsedTime = millis() - startTime;
    let remainingTime = countdownDuration - elapsedTime;
    
    // Display countdown text
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    if (remainingTime > 0) {
      let secondsLeft = ceil(remainingTime / 1000);
      text("Omni-Ball Synthesis in: " + secondsLeft, width/2, height/2 - 50);
      console.log("Countdown: " + secondsLeft + " seconds remaining");
    } else {
      // Countdown finished, show the ball
      ballVisible = true;
    }
    
    // Only draw and update the ball if it's visible
    if (ballVisible) {
      // Update ball position
      ballX = mouseX;
      
      // Check if the ball is at the center of the screen
      let atCenter = abs(ballX - width/2) < 10; // Within 10 pixels of center
      let outside = ballX < (width/2 - 50) || ballX > (width/2 + 50); // Outside the center region
      
      // Determine state: expanding when outside, contracting when at center
      if (outside) {
        expanding = true;
        contracting = false;
      } else if (atCenter) {
        expanding = false;
        contracting = true;
      }
      
      // Handle expanding state
      if (expanding) {
        ballSize += 2; // Increase the size of the ball by 2 pixels
        // Change to random colors while expanding
        ellipseColor[0] = random(255);
        ellipseColor[1] = random(255);
        ellipseColor[2] = random(255);
      }
      
      // Handle contracting state
      if (contracting) {
        ballSize -= 2; // Decrease the size of the ball by 2 pixels
        // Smoothly transition color back to original using lerp
        ellipseColor[0] = lerp(ellipseColor[0], originalColor[0], 0.05);
        ellipseColor[1] = lerp(ellipseColor[1], originalColor[1], 0.05);
        ellipseColor[2] = lerp(ellipseColor[2], originalColor[2], 0.05);
        
        // Stop contracting when we reach the original size
        if (ballSize <= originalSize) {
          ballSize = originalSize;
          ellipseColor = [...originalColor]; // Ensure exact color match
          contracting = false;
        }
      }
      
      // Creating the Omni-Ball with actual color array
      fill(ellipseColor[0], ellipseColor[1], ellipseColor[2]);
      stroke(0);
      ellipse(ballX, ballY, ballSize, ballSize); // Draw the ball at the current position and size
    }
  } else if (mode === 2) {
    // debug: print values so we can see if draw is running at all
    console.log('draw mode2', {x: mode2_ballX, y: mode2_ballY, size: mode2_ballSize, color: mode2_ellipseColor});

    background(128); // Clear the background on each frame to redraw the ball
    mode2_ballX = mouseX; // Update the X position of the ball based on the mouse's X position

    // p5 can take separate r/g/b arguments; break the array out explicitly
    noStroke();
    fill(mode2_ellipseColor[0], mode2_ellipseColor[1], mode2_ellipseColor[2]);
    ellipse(mode2_ballX, mode2_ballY, mode2_ballSize, mode2_ballSize); // Draw the ball at the current position and size

    
    if (mode2_expanding) {
      mode2_ballSize += 2; // Increase the size of the ball by 2 pixels
      // Change the color randomly while expanding but doing so slowly by only changing one color channel at a time
      let colorChannel = floor(random(3)); // Randomly select a color channel (0, 1, or 2)
      mode2_ellipseColor[colorChannel] = (mode2_ellipseColor[colorChannel] + random(-5, 5)) % 256; // Randomly adjust the selected color channel
      if (mode2_ballSize >= width) { // If the ball reaches the edge of the canvas
        mode2_expanding = false; // Start shrinking
      }
    } else {
      mode2_ballSize -= 2; // Decrease the size of the ball by 2 pixels
      // Change the color randomly while shrinking but doing so slowly by only changing one color channel at a time
      let colorChannel = floor(random(3)); // Randomly select a color channel (0, 1, or 2)
      mode2_ellipseColor[colorChannel] = (mode2_ellipseColor[colorChannel] + random(-5, 5)) % 256; // Randomly adjust the selected color channel
      if (mode2_ballSize <= 50) { // If the ball reaches its original size
        mode2_expanding = true; // Start expanding
      }
    }
  }
}

function keyPressed() {
  if (key === '1') {
    mode = 1;
    ballVisible = false;
    startTime = millis();
  } else if (key === '2') {
    mode = 2;
    mode2_ballSize = 50;
    mode2_ballX = width / 2;
    mode2_ballY = height / 2;
    mode2_expanding = true;
    mode2_ellipseColor = [random(255), random(255), random(255)];
  } else {
    // Reset ball state for mode 1
    ballSize = originalSize; // Reset the size of the ball to its original size
    ballX = width / 2; // Reset the X position of the ball to the center of the canvas
    expanding = false; // Stop expanding
    contracting = false; // Stop contracting
    
    // Generate a new color (slightly different shade each time)
    let hueShift = random(-30, 30);
    ellipseColor = [constrain(128 + hueShift, 0, 255), 0, constrain(128 + hueShift, 0, 255)]; // Purple variation
    originalColor = [...ellipseColor]; // Update the original color to the new color
  }
}