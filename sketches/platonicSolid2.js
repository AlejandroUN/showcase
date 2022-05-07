let side = 300
let angle = 0
let colorBlindness;
let normalColors = [], weakColors = [], currentColors = [];

function setup() {
  createCanvas(600, 400, WEBGL);
  angleMode(DEGREES)
  textureMode(NORMAL)
  fill(0, 102, 255)

  colorBlindness = createCheckbox("Red-Green Blindness")
  colorBlindness.position(20, 20)

  normalColors = [color(253,12,28), color(254,252,55), color(20,150,24), color(152,28,202)]
  weakColors = [color(120,102,36), color(254,238,54), color(226,197,43), color(16,93,225)]

  if(colorBlindness.checked()){   
    currentColors = weakColors;
  }else{
    currentColors = normalColors;
  }
}

function draw() {
  
  background(220);  
  if(colorBlindness.checked()){
    currentColors = weakColors;
  }else{
    currentColors = normalColors;
  }
  
  orbitControl();
  
  rotateX(90)
  rotateZ(30)
  
  beginShape()
  fill(currentColors[0]) // fill(255, 0, 0)
  vertex(-side*sqrt(3)/3 , 0        , -side*sqrt(6)/12)
  fill(currentColors[1]) // fill(0, 255, 0)
  vertex(side*sqrt(3)/6  , side/2   , -side*sqrt(6)/12)
  fill(currentColors[2]) // fill(0, 0, 255)  
  vertex(side*sqrt(3)/6  , -side/2  , -side*sqrt(6)/12) 
  endShape(CLOSE)

  
  beginShape()
  fill(currentColors[1]) // fill(0, 255, 0)
  vertex(side*sqrt(3)/6  , side/2   , -side*sqrt(6)/12)
  fill(currentColors[3]) // fill(255, 255, 0)
  vertex(0               , 0        , side*sqrt(6)/4  )
  fill(currentColors[2]) // fill(0, 0, 255) 
  vertex(side*sqrt(3)/6  , -side/2  , -side*sqrt(6)/12)
  endShape(CLOSE)
  
  
  beginShape()
  fill(currentColors[3]) // fill(255, 255, 0)
  vertex(0               , 0        , side*sqrt(6)/4)
  fill(currentColors[0]) // fill(255, 0, 0)
  vertex(-side*sqrt(3)/3 , 0        , -side*sqrt(6)/12)
  fill(currentColors[2]) // fill(0, 0, 255) 
  vertex(side*sqrt(3)/6  , -side/2  , -side*sqrt(6)/12)
  endShape(CLOSE)

  
  beginShape()
  fill(currentColors[1]) // fill(0, 255, 0)
  vertex(side*sqrt(3)/6  , side/2   , -side*sqrt(6)/12)
  fill(currentColors[3]) // fill(255, 255, 0)
  vertex(0               , 0        , side*sqrt(6)/4  )
  fill(currentColors[0]) // fill(255, 0, 0)
  vertex(-side*sqrt(3)/3 , 0        , -side*sqrt(6)/12)
  endShape(CLOSE)

}