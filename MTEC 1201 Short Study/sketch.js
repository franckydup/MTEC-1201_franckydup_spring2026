/*MTEC 1201 Assignment 2: Short Study: Particle Accelerator of Life
By Francky Duperval

*/

function setup() {
  createCanvas(400, 400);
  background(250);
}

function draw() {
  background(250);
  
  // Creating left accelerator beam
  fill('blue');
  stroke(50);
  strokeWeight(5);
  ellipse(100, 200, 50, 50);

  // Creating right accelerator beam
  fill('red');
  stroke(50);
  strokeWeight(5);
  ellipse(300, 200, 50, 50);
  line(100, 200, 300, 200);

  // Creating the grand particle
  fill('purple');
  stroke(50);
  ellipse(200, 200, 20, 20);
}