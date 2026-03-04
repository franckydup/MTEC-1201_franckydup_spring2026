/* Short Study #3 
By Francky Duperval

Concept:
The goal is to make an expanding ball that grows in size while changing colors.
The ball will start at the center of the canvas and expand until it reaches the edges, then it will shrink back to original size and repeat.
While expanding it will change colors randomly along a color gradient.
Then when shrinking back it will do the same.
The ball will also be a different color every time the program starts.
Pressing a key will reset the ball to its original size and position and give it a new random color.


Parameters (Defined by Professor):
The drawing must react to the mouse and/or keyboard in some way and must include the following:
- Use of declared variables (named by you)
- At least one conditional statement using if, else if, AND else
- Use of the random() function
- Mouse and/or keyboard input
- A developed concept and techniques moving beyond the in-class demos

Consider: how might the strategic use of conditional statements and the random() function create a more unpredictable and engaging user experience?

*/

let ballSize = 50; // Initial size of the ball at 50 pixels
let expanding = true; // Flag to determine if the ball is expanding or shrinking
let ellipseColor; // will pick a random color in setup
let ballY = 350; // Initial Y position of the ball at 350 pixels
let ballX = 0;    // start at zero; update each frame

function setup() {
  createCanvas(800, 700); // Create a canvas of 800x700 pixels
  background(128); // Set the background color to gray

  // choose a random color now that p5 is ready
  ellipseColor = [random(255), random(255), random(255)];
  console.log('initial colour', ellipseColor);
}

function draw() {
  // debug: print values so we can see if draw is running at all
  console.log('draw', {x: ballX, y: ballY, size: ballSize, color: ellipseColor});

  background(128); // Clear the background on each frame to redraw the ball
  ballX = mouseX; // Update the X position of the ball based on the mouse's X position

  // p5 can take separate r/g/b arguments; break the array out explicitly
  fill(ellipseColor[0], ellipseColor[1], ellipseColor[2]);
  ellipse(ballX, ballY, ballSize, ballSize); // Draw the ball at the current position and size

  
  if (expanding) {
    ballSize += 2; // Increase the size of the ball by 2 pixels
    // Change the color randomly while expanding but doing so slowly by only changing one color channel at a time
    let colorChannel = floor(random(3)); // Randomly select a color channel (0, 1, or 2)
    ellipseColor[colorChannel] = (ellipseColor[colorChannel] + random(-5, 5)) % 256; // Randomly adjust the selected color channel
    if (ballSize >= width) { // If the ball reaches the edge of the canvas
      expanding = false; // Start shrinking
    }
  } else {
    ballSize -= 2; // Decrease the size of the ball by 2 pixels
    // Change the color randomly while shrinking but doing so slowly by only changing one color channel at a time
    let colorChannel = floor(random(3)); // Randomly select a color channel (0, 1, or 2)
    ellipseColor[colorChannel] = (ellipseColor[colorChannel] + random(-5, 5)) % 256; // Randomly adjust the selected color channel
    if (ballSize <= 50) { // If the ball reaches its original size
      expanding = true; // Start expanding
    }
  }
}

function keyPressed() {
  ballSize = 50; // Reset the size of the ball to its original size
  ballX = width / 2; // Reset the X position of the ball to the center of the canvas
  ballY = height / 2; // Reset the Y position of the ball to the center of the canvas
  expanding = true; // Start expanding again
  // choose a new random color when a key is pressed
  ellipseColor = [random(255), random(255), random(255)];
}