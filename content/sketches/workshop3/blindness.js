let lumaShader;
let img;
let grey_scale;
let input;
let reset;

function preload() {
  lumaShader = readShader('/sketches/workshop3/blindness.frag', { varyings: Tree.texcoords2 });
  // image source: https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Fire_breathing_2_Luc_Viatour.jpg
  //img = loadImage('/docs/shortcodes/resources/images/Fire_breathing.jpg');
  img = loadImage('/docs/shortcodes/resources/images/colors.jpg');
}

function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(lumaShader);
  grey_scale = createRadio();
  grey_scale.option('1', 'RGB');
  grey_scale.option('2', 'Protanopia');
  grey_scale.option('3', 'Duteranopia');
  grey_scale.option('4', 'Tritanopia');
  grey_scale.option('5', 'Corrected P');
  grey_scale.option('6', 'Corrected D');
  grey_scale.selected('1');
  grey_scale.position(10, 10);
  grey_scale.style('color', 'white');
  grey_scale.changed(() => lumaShader.setUniform('grey_scale', grey_scale.value()));

  reset = createButton("Reset")
  reset.position(20, 450);

  input = createFileInput(handleFile, false);
  input.position(20, 480);

  reset.mousePressed(() => lumaShader.setUniform('texture', img));

  lumaShader.setUniform('texture', img);
  lumaShader.setUniform('grey_scale', grey_scale.value());
  
}

function draw() {
  background(0);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}

function handleFile(file) {
  console.log(file);
  if (file.type === 'image') {
    img = loadImage(file.data);
    
    lumaShader.setUniform('texture', img);  
  } else {
    img = null;
  }
}