/* MTEC 1201 Short Study #2
By Francky Duperval

Goal is to create a ball that incorporates the following elements:
- As the user moves left or right with their mouse, the ball should move in the direction of the mouse.
- The ball should change color each time it hits the left or right sides of the canvas. 
- Additional elements per my choice to make the animation more interesting.


Constraints: 
- use of at least two declared variables (named by you)
- at least one of the following system variables: mouseX, mouseY, pmouseX, pmouseY
- use of at least one arithmetic operator (+, -, *, /)
- use of at least one value incrementing (increasing) or decrementing (decreasing) over time
- use of at least one event function: keyPressed() and/or mousePressed()
*/

let ballY = 350; // Initial y-coordinate of the ball at 350 pixels
let ballColor; // Variable to store the current color of the ball
// Creating the Canvas and setting up the environment for the animation.
function setup() {
  createCanvas(800, 700); //Sets the size of the canvas to 800 pixels by 700 pixels
  ballColor = color(135, 206, 235); // Initial color of the ball is set to sky blue

}

function draw() {
  background(128); // Grey background
  // Defining the ball properties and drawing it on the canvas. 
  const ballSize = 100; // Sets the diameter of the ball to 100 pixels
  const ballX = mouseX; // The x-coordinate of the ball is set to the horizontal position of the mouse
  const radius = ballSize / 2; // Calculate the radius of the ball for collision detection
  const ballY = 350; // The y-coordinate of the ball is set to a fixed height of 350 pixels

 // Check for collision with left or right edges
  if (ballX - radius <= 0 || ballX + radius >= width) {
    ballColor = color(random(255), random(255), random(255)); // change to random color
  }

  fill(ballColor);
  ellipse(ballX, ballY, ballSize, ballSize);
}


// Whenever key is pressed, the ball resets to the center of the canvas and changes color back to its original color.
function keyPressed() {
  background(128); // Reset background to grey
  ballColor = color(135, 206, 235); // Reset ball color to sky blue
}
