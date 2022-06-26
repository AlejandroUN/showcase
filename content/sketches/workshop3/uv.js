let uvShader;
let checkbox;
let shaderTexture;

function preload() {
  // Define geometry directly in clip space (i.e., matrices: Tree.NONE).
  // Interpolate only texture coordinates (i.e., varyings: Tree.texcoords2).
  // see: https://github.com/VisualComputing/p5.treegl#handling
  uvShader = readShader('/sketches/workshop3/uv.frag', { matrices: Tree.NONE, varyings: Tree.texcoords2 });
  // uvShader = readShader('/sketches/workshop3/uv.frag', { varyings: Tree.texcoords2 });
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(300, 300, WEBGL);

  shaderTexture = createGraphics(500, 500, WEBGL)
  
  noStroke();
  // see: https://p5js.org/reference/#/p5/shader
  
  // https://p5js.org/reference/#/p5/textureMode
  // best and simplest is to just always used NORMAL
  textureMode(NORMAL);
  
  checkbox = createCheckbox('Red', false);
  checkbox.changed(changeColor);
  
  uvShader.setUniform('checkbox', checkbox.checked())
  
}

function draw() {
  shaderTexture.shader(uvShader);
  
  // shaderTexture.rect(-width/2,-height/2,width/2,height/2);
  shaderTexture.rect(-500,-500,500,500);
  texture(shaderTexture)
  background(205);
  // clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  // https://p5js.org/reference/#/p5/quad
  // It's worth noting (not mentioned in the api docs) that the quad
  // command also adds the texture coordinates to each of its vertices.
  // quad(-1, -1, 1, -1, 1, 1, -1, 1);  
  
  orbitControl();
  beginShape();
  vertex(-width/2 + 5, -height/2 + 5, 0, 0, 0);
  vertex(+width/2 - 5, -height/2 + 5, 0, 0, 1)
  vertex(+width/2 - 5, +height/2 - 5, 0, 1, 0);
  vertex(-width/2 + 5, +height/2 - 5, 0, 1, 1); 
  
  endShape(CLOSE);
  // rect(0,0,width, height)
  // circle(0, 0, map(mouseX, 0, 300, -1, 1));
  // square(-1, 0.5, 0.1);  
  // triangle(-height/2,-1,1,-1,0,1)
  
  
}

function changeColor() {
  uvShader.setUniform('checkbox', checkbox.checked())
}