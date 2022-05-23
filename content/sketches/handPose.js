let handpose;
let video;
let hands = [];
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
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("hand", results => {
    hands = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  //console.log(handpose)
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < hands.length; i += 1) {
    const hand = hands[i];
	//console.log(i)
    for (let j = 0; j < hand.landmarks.length; j += 1) {
      const keypoint = hand.landmarks[j];
	  
      fill(0, 255, 0);
      noStroke();
	  //console.log(keypoint[0])
	  if (j == 0) {
		  //El valor de y disminuye cuando la mano sube
		  //Hacia la izquierda de la imagen (en la vida real a la derecha de la persona) el valor de x disminuye, hacia la derecha aumenta
		//console.log(keypoint[0])
		zeroPoint = [keypoint[0], keypoint[1]];
	  } else if (j == 1) {
		onePoint = [keypoint[0], keypoint[1]];
	  } else if (j == 8) {
		//eightPoint = [keypoint[0], keypoint[1]];
		oneDifference = (onePoint[0] - keypoint[0]) + (onePoint[1] - keypoint[1])
	  } else if (j == 12) {
		//twelvePoint = [keypoint[0], keypoint[1]];
		twoDifference = (onePoint[0] - keypoint[0]) + (onePoint[1] - keypoint[1])
	  } else if (j == 16) {
		//sixteenPoint = [keypoint[0], keypoint[1]];
		threeDifference = (zeroPoint[0] - zeroPoint[0]) + (onePoint[1] - keypoint[1])
	  } else if (j == 20) {
		//twentyPoint = [keypoint[0], keypoint[1]];
		fourthDifference = (zeroPoint[0] - zeroPoint[0]) + (onePoint[1] - keypoint[1])
	  }
	  holeDifference = oneDifference + twoDifference + threeDifference + fourthDifference
	  print(holeDifference)
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}