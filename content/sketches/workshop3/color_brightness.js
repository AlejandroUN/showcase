let lumaShader;
let img, imgUploaded, capture;
let grey_scale;
let input;
let reset;

function preload() {
  lumaShader = readShader('/sketches/workshop3/color_brightness.frag', { varyings: Tree.texcoords2 });
  // image source: https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Fire_breathing_2_Luc_Viatour.jpg
  img = loadImage('/docs/shortcodes/resources/images/Fire_breathing.jpg');
}

function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(lumaShader);
  grey_scale = createRadio();
  grey_scale.option('1', 'RGB');
  grey_scale.option('2', 'CIELAB');
  grey_scale.option('3', 'Luma');
  grey_scale.option('4', 'Average');
  grey_scale.option('5', 'HSV');
  grey_scale.option('6', 'HSL');
  grey_scale.selected('1');
  grey_scale.position(10, 10);
  grey_scale.style('color', 'white');
  grey_scale.changed(() => lumaShader.setUniform('grey_scale', grey_scale.value()));

  reset = createButton("Reset")
  reset.position(20, 450);
  reset.mousePressed(() => {
    lumaShader.setUniform('texture', img);
    captureInput.checked(false);
  });

  input = createFileInput(handleFile, false);
  input.position(20, 480);

  captureInput = createCheckbox("Video", false);
  captureInput.position(20, 420);
  captureInput.changed(() => {
    if(captureInput.checked()){
      capture = createCapture(VIDEO);
      capture.hide();
      lumaShader.setUniform('texture', capture);
    }else{
      capture.pause()
      lumaShader.setUniform('texture', img);
    }
  }) 

  lumaShader.setUniform('texture', img);
  lumaShader.setUniform('grey_scale', grey_scale.value());
  
}

function draw() {
  background(0);

  if(captureInput.checked()){
    scale(-1.0,1.0);  
  }else{
    scale(1.0,1.0);
  }
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
} 

async function handleFile(file) {
  console.log(file);
  if (file.type === 'image') {
    imgUploaded = loadImage(file.data);
    // imgUploaded = loadImage(await toBase64(file.file));
    
    lumaShader.setUniform('texture', imgUploaded);
  }else if (file.type === 'video'){
    imgUploaded = createVideo(file.data);
    imgUploaded.loop()
    imgUploaded.hide()
    console.log(imgUploaded)
    lumaShader.setUniform('texture', imgUploaded);
    
  } else {
    imgUploaded = null;
    lumaShader.setUniform('texture', img);
  }
  captureInput.checked(false);
}