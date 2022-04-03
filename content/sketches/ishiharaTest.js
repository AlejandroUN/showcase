let img;
function preload(){
    img = loadImage('../resources/images/ishiharaTest/Ishihara_00.jpg')
}

function setup() {
    createCanvas(600, 400, WEBGL);
    angleMode(DEGREES)
    textureMode(NORMAL)
    fill(0, 102, 255)
    background(220);  
  }

function draw(){
    texture(img)
    rect(-100,-100,200,200)
    
}