let side = 300
let angle = 0

let img;
function preload() {
  img = loadImage('../../resources/images/texture.png');
}

function setup() {
  createCanvas(600, 400, WEBGL);
  angleMode(DEGREES)
  textureMode(NORMAL)
  fill(0, 102, 255)
}

function draw() {
  
  background(220);  
  orbitControl();
  texture(img);
  rotateX(90)
  rotateZ(30)
  
  beginShape()
  // fill(255, 0, 0)
  vertex(-side*sqrt(3)/3 , 0        , -side*sqrt(6)/12, 0.5, 1)
  // fill(0, 255, 0)
  vertex(side*sqrt(3)/6  , side/2   , -side*sqrt(6)/12, 0.5, 0)
  // fill(0, 0, 255) 
  vertex(side*sqrt(3)/6  , -side/2  , -side*sqrt(6)/12,   1, 1) 
  endShape(CLOSE)

  
  beginShape()
  // fill(0, 255, 0)
  vertex(side*sqrt(3)/6  , side/2   , -side*sqrt(6)/12 , 0.5, 1)
  // fill(255, 255, 0)
  vertex(0               , 0        , side*sqrt(6)/4   , 0.5, 0)
  // fill(0, 0, 255)
  vertex(side*sqrt(3)/6  , -side/2  , -side*sqrt(6)/12 , 1, 1)
  endShape(CLOSE)
  
  
  beginShape()
  // fill(255, 255, 0)
  vertex(0               , 0        , side*sqrt(6)/4 , 0.5, 1)
  // fill(255, 0, 0)
  vertex(-side*sqrt(3)/3 , 0        , -side*sqrt(6)/12, 0.5, 0)
  // fill(0, 0, 255)
  vertex(side*sqrt(3)/6  , -side/2  , -side*sqrt(6)/12, 1, 1)
  endShape(CLOSE)

  
  beginShape()
  // fill(0, 255, 0)
  vertex(side*sqrt(3)/6  , side/2   , -side*sqrt(6)/12 , 0.5, 1)
  // fill(255, 255, 0)
  vertex(0               , 0        , side*sqrt(6)/4   , 0.5  , 0)
  // fill(255, 0, 0)
  vertex(-side*sqrt(3)/3 , 0        , -side*sqrt(6)/12 , 1 , 1)
  endShape(CLOSE)
  
}

// function draw(){
//   background(220);  
//   orbitControl();
//   texture(img);
//   rotateX(90)
//   rotateZ(30)
//   box(100)
// }