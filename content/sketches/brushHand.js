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

//Variables to do calculations to know if the hand is open or closed
let zeroPoint = [0,0];
let onePoint = [0,0];
let eightPoint = [0,0];
let twelvePoint = [0,0];
let sixteenPoint = [0,0];
let twentyPoint = [0,0];
let oneDifference = 0
let twoDifference = 0
let threeDifference = 0
let fourthDifference = 0
let holeDifference = 0

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
}

function modelReady() {
	console.log("Model ready!");
}

function update() {
	let handDistance = 0
	for (let i = 0; i < hands.length; i += 1) {
		const hand = hands[i];	
		const keypoint = hand.landmarks[9];
		handDistance = keypoint[2]	  
		for (let j = 0; j < hand.landmarks.length; j += 1) {
			const keypoint = hand.landmarks[j];
		if (j == 0) {
			//El valor de y disminuye cuando la mano sube
			//Hacia la izquierda de la imagen (en la vida real a la derecha de la persona) el valor de x disminuye, hacia la derecha aumenta
		  zeroPoint = [keypoint[0], keypoint[1]];
		} else if (j == 1) {
		  onePoint = [keypoint[0], keypoint[1]];
		} else if (j == 8) {
		  oneDifference = (onePoint[0] - keypoint[0]) + (onePoint[1] - keypoint[1])
		} else if (j == 12) {
		  twoDifference = (onePoint[0] - keypoint[0]) + (onePoint[1] - keypoint[1])
		} else if (j == 16) {
		  threeDifference = (zeroPoint[0] - zeroPoint[0]) + (onePoint[1] - keypoint[1])
		} else if (j == 20) {
		  fourthDifference = (zeroPoint[0] - zeroPoint[0]) + (onePoint[1] - keypoint[1])
		}
		holeDifference = oneDifference + twoDifference + threeDifference + fourthDifference			
	  }
	}	
	  let m = map(handDistance, -100, 20, 0, 1);
  let dx = abs(mouseX - pmouseX);
  let dy = abs(mouseY - pmouseY);
  speed = constrain((dx + dy) / (2 * (width - height)), 0, 1);
  if (record) {
    points.push({
      worldPosition: treeLocation([mouseX, mouseY, m], { from: 'SCREEN', to: 'WORLD' }),
      color: color.color(),
      speed: speed,
	  radius: map(holeDifference, 200, 1050, 0, 5)
    });
	console.log(m)	
  }
}

function sphereBrush(point) {
  push();
  noStroke();
  // TODO parameterize sphere radius and / or
  // alpha channel according to gesture speed
  fill(point.color);
  sphere(point.radius);
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
