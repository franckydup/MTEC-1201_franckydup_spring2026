/* Short Study #4 
By Francky Duperval

Concept: Expanding upon the concept of the ball, now dubbed the Omni-Ball

In the first iteration, the Omni-Ball was able to move along the x-axis and change color when hitting the borders of the screen and 
keep said color until it hits the edge again

In the second iteration, the Omni-Ball was able to expand as well as move along the x-axis while smoothly and subtly changing color along a gradient
and when it hits the edge of the screen, it would contract while still changing color, as well as resetting upon user command with any key press.

In the third iteration, we will be revisting the Omni-Ball's creation that was meant to be visualized in the first Short Study 

As I am writing, I envision, a countdown timer that triggers the Omni-Ball synthesis via a particle accelerator sequence

I envision, a jpeg or png of some sort of space background along with text illustrating a 10 second countdown that can be seen in console log
When the countdown ends, it triggers the sequence, generating the Omni-Ball which will remain stable at 50 pixels in the center of the accelerator
However, once the user moves the Omni-Ball along the x-axis outside of the bounds of the accelerator, it will begin to expand to the bounds of the screen
While expanding, it will change color subtly along a color gradient.

When the ball returns to the center of the two beams (center of screen), it will begin to contract and change along color gradient to its original size and color

When the user presses a key, it will reset and when the Omni-Ball generates, it will start at a slightly different color

Constraints:
- At least one external image file: .jpg or .png.
- Text.
- At least one conditional statement.
- At least one timed event using the millis() function.
- A developed concept and techniques moving beyond the in-class demos.

*/

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
  
  // Start the countdown timer
  startTime = millis();
}

function draw() {
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
    stroke(50);
    ellipse(ballX, ballY, ballSize, ballSize); // Draw the ball at the current position and size
  }  fill(ellipseColor[0], ellipseColor[1], ellipseColor[2]);
  stroke(50);
  ellipse(ballX, ballY, ballSize, ballSize); // Draw the ball at the current position and size

}

function keyPressed() {
  // Reset ball state
  ballSize = originalSize; // Reset the size of the ball to its original size
  ballX = width / 2; // Reset the X position of the ball to the center of the canvas
  expanding = false; // Stop expanding
  contracting = false; // Stop contracting
  
  // Generate a new color (slightly different shade each time)
  let hueShift = random(-30, 30);
  ellipseColor = [constrain(128 + hueShift, 0, 255), 0, constrain(128 + hueShift, 0, 255)]; // Purple variation
  originalColor = [...ellipseColor]; // Update the original color to the new color
}