let side = 300
let angle = 0

function setup() {
  createCanvas(600, 400, WEBGL);
  angleMode(DEGREES)
  fill(0, 102, 255)
}

function draw() {
  
  background(220);  
  orbitControl();
  
  rotateX(90)
  rotateZ(30)
  
  beginShape()
  fill(255, 0, 0)
  vertex(-side*sqrt(3)/3 , 0        , -side*sqrt(6)/12)
  fill(0, 255, 0)
  vertex(side*sqrt(3)/6  , side/2   , -side*sqrt(6)/12)
  fill(0, 0, 255) 
  vertex(side*sqrt(3)/6  , -side/2  , -side*sqrt(6)/12) 
  endShape(CLOSE)

  
  beginShape()
  fill(0, 255, 0)
  vertex(side*sqrt(3)/6  , side/2   , -side*sqrt(6)/12)
  fill(255, 255, 0)
  vertex(0               , 0        , side*sqrt(6)/4)
  fill(0, 0, 255)
  vertex(side*sqrt(3)/6  , -side/2  , -side*sqrt(6)/12)
  endShape(CLOSE)
  
  
  beginShape()
  fill(255, 255, 0)
  vertex(0               , 0        , side*sqrt(6)/4)
  fill(255, 0, 0)
  vertex(-side*sqrt(3)/3 , 0        , -side*sqrt(6)/12)
  fill(0, 0, 255)
  vertex(side*sqrt(3)/6  , -side/2  , -side*sqrt(6)/12)
  endShape(CLOSE)

  
  beginShape()
  fill(0, 255, 0)
  vertex(side*sqrt(3)/6  , side/2   , -side*sqrt(6)/12)
  fill(255, 255, 0)
  vertex(0               , 0        , side*sqrt(6)/4)
  fill(255, 0, 0)
  vertex(-side*sqrt(3)/3 , 0        , -side*sqrt(6)/12)
  endShape(CLOSE)
  
}
