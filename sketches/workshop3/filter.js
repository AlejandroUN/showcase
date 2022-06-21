let maskShader;
let img;
// let video_src;
// let video_on;
let mask;

function preload() {
  // video_src = createVideo(['/sketches/shaders/mandrill.webm']);
  // video_src.hide(); // by default video shows up in separate dom
  maskShader = readShader('/sketches/workshop3/filter.frag', { varyings: Tree.texcoords2 });
  //img = loadImage('/sketches/shaders/tree.jpeg');
  img = loadImage('/docs/shortcodes/resources/images/Fire_breathing.jpg');
  
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(650, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  // video_on = createCheckbox('video', false);
  // video_on.style('color', 'white');
  // video_on.changed(() => {
  //   if (video_on.checked()) {
  //     maskShader.setUniform('texture', video_src);
  //     video_src.loop();
  //   } else {
  //     maskShader.setUniform('texture', img);
  //     video_src.pause();
  //   }
  // });
  // video_on.position(10, 30);
  mask = createCheckbox('ridges', false);
  mask.position(10, 10);
  mask.style('color', 'white');
  shader(maskShader);
  maskShader.setUniform('texture', img);
  emitTexOffset(maskShader, img, 'texOffset');
}

function draw() {
  background(0);
  //
  if (mask.checked()) {
    // maskShader.setUniform('mask', [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]);
    maskShader.setUniform('mask', [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
    // maskShader.setUniform('mask', [0, -1, 0, -1, 5, -1, 0, -1, 0]);
  }
  else {
    maskShader.setUniform('mask', [0, 0, 0, 0, 1, 0, 0, 0, 0]);
  }
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}