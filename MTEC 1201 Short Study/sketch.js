/*MTEC 1201 Assignment 2: Short Study: Particle Accelerator of Life
By Francky Duperval

*/

function setup() {

  // Creating Canvas and Background
  createCanvas(400, 400);
  background(250);

  // Creating left accelerator beam
  ellipse(100, 200, 50, 50)
  fill(blue);
  line(100, 200, 300, 200)
  strokeWeight(5);
  fill(blue);

  // Creating right accelerator beam
  ellipse(300, 200, 50, 50)
  fill(red);
  line(100, 200, 300, 200)
  strokeWeight(5);
  fill(red);

  // Creating the grand particle
  ellipse(200, 200, 20, 20)
  stroke(50);
  fill(purple);
  
}
