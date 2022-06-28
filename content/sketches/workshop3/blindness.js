let correctorShader;
let img;
let blindnessType;
let input;
let reset;

function preload() {
  correctorShader = readShader('/sketches/workshop3/blindness.frag', { varyings: Tree.texcoords2 });
  // image source: https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Fire_breathing_2_Luc_Viatour.jpg
  img = loadImage('/docs/shortcodes/resources/images/Fire_breathing.jpg');
  img = loadImage('/docs/shortcodes/resources/images/ishiharaTest/Ishihara_01.jpg');
  //img = loadImage('/docs/shortcodes/resources/images/colors.jpg');
  //img = loadImage('/docs/shortcodes/resources/images/rubik.png');
  //img = loadImage('/docs/shortcodes/resources/images/circuloc.jpg');
  //img = loadImage('/docs/shortcodes/resources/images/types.jpg');
}

function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(correctorShader);
  blindnessType = createRadio();
  blindnessType.option('1', 'RGB');
//  blindnessType.option('2', 'Protanopia');
//  blindnessType.option('3', 'Duteranopia');
//  blindnessType.option('4', 'Tritanopia');
  blindnessType.option('5', 'Correct Protanopia');
  blindnessType.option('6', 'Correct Deuteranopia');
  blindnessType.option('7', 'Correct Tritanopia');  
  blindnessType.selected('1');
  blindnessType.position(10, 10);
  blindnessType.style('color', 'white');
  blindnessType.changed(() => correctorShader.setUniform('blindnessType', blindnessType.value()));

  reset = createButton("Reset")
  reset.position(20, 450);

  input = createFileInput(handleFile, false);
  input.position(20, 480);

  reset.mousePressed(() => correctorShader.setUniform('texture', img));

  correctorShader.setUniform('texture', img);
  correctorShader.setUniform('blindnessType', blindnessType.value());
  
}

function draw() {
  background(0);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}

function handleFile(file) {
  console.log(file);
  if (file.type === 'image') {
    img = loadImage(file.data);
    correctorShader.setUniform('texture', img);  
  } else {
    img = null;
  }
}