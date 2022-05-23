// Goal in the 3d Brush is double, to implement:
// 1. a gesture parser to deal with depth, i.e.,
// replace the depth slider with somehing really
// meaningful. You may use a 3d sensor hardware
// such as: https://en.wikipedia.org/wiki/Leap_Motion
// or machine learning software to parse hand (or
// body) gestures from a (video) / image, such as:
// https://ml5js.org/
// 2. other brushes to stylize the 3d brush, taking
// into account its shape and alpha channler, gesture
// speed, etc.

// Brush controls
let color;
let depth;
let brush;

let easycam;
let state;

let escorzo = true;
let points;
let record;

//ml5 variables
let handpose;
let video;
let hands = [];

function setup() {
  createCanvas(600, 450, WEBGL);
  // easycam stuff
  let state = {
    distance: 250,           // scalar
    center: [0, 0, 0],       // vector
    rotation: [0, 0, 0, 1],  // quaternion
  };
  easycam = createEasyCam();
  easycam.state_reset = state;   // state to use on reset (double-click/tap)
  easycam.setState(state, 2000); // now animate to that state

  // brush stuff
  points = [];
  depth = createSlider(0, 1, 0.05, 0.05);
  depth.position(10, 10);
  depth.style('width', '580px');
  color = createColorPicker('#ed225d');
  color.position(width - 70, 40);
  // select initial brush
  brush = sphereBrush;

  //Activate video
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("hand", results => {
    hands = results;
  });

  // Hide the video element, and just show the canvas
  //video.hide();
}

function draw() {
  update();
  background(120);
  push();
  strokeWeight(0.8);
  stroke('magenta');
  grid({ dotted: false });
  pop();
  axes();
  for (const point of points) {
    push();
    translate(point.worldPosition);	
    brush(point);
    pop();
  }

  //drawKeypoints();
}

function modelReady() {
	console.log("Model ready!");
}

function update() {
	let currentHandDistancex = 0
	let currentHandDistancey = 0
	let currentHandDistancez = 0
	let oldHandDistancex = 0
	let oldHandDistancey = 0
	let oldHandDistancez = 0	
	for (let i = 0; i < hands.length; i += 1) {
		const hand = hands[i];		
		const keypoint = hand.landmarks[20];
		fill(0, 255, 0);
		noStroke();
		oldHandDistancex = currentHandDistancex
		oldHandDistancey = currentHandDistancey
		oldHandDistancez = currentHandDistancez
		currentHandDistancex = keypoint[0]
		currentHandDistancey = keypoint[1]
		currentHandDistancez = keypoint[2]
		ellipse(currentHandDistancex, currentHandDistancey, 10, 10);
		//console.log("x" + currentHandDistancex)
		//console.log("y" + currentHandDistancey)
	  }
	  let mz = map(currentHandDistancez, -100, 20, 0, 1);
	  let mx = map(currentHandDistancex, 0, 500, width, 0);
	  let my = map(currentHandDistancey, 0, 300, 0, height);
	//preguntarle esta parte al profe	
  let dx = abs(currentHandDistancex - oldHandDistancex);
  let dy = abs(currentHandDistancey - oldHandDistancey);
  speed = constrain((dx + dy) / (2 * (width - height)), 0, 1);
  if (record) {
    points.push({
      worldPosition: treeLocation([mx, my, mz], { from: 'SCREEN', to: 'WORLD' }),
      color: color.color(),
      speed: speed
    });
	//console.log(m)	
  }
}

function sphereBrush(point) {
  push();
  noStroke();
  // TODO parameterize sphere radius and / or
  // alpha channel according to gesture speed
  fill(point.color);
  sphere(1);
  pop();
}

function keyPressed() {
  if (key === 'r') {
    record = !record;
  }
  if (key === 'p') {
    escorzo = !escorzo;
    escorzo ? perspective() : ortho();
  }
  if (key == 'c') {
    points = [];
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < hands.length; i += 1) {
    const hand = hands[i];
	//console.log(i)
    for (let j = 0; j < hand.landmarks.length; j += 1) {
      const keypoint = hand.landmarks[j];
	  //console.log(j)
      fill(0, 255, 0);
      noStroke();
	  //console.log(keypoint[0])
	  if (j == 20) {
		//depth = keypoint[2]
		//console.log(keypoint[2])
	  } else {
		
	  }	  
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}