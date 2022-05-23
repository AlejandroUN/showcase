let video;
let myHandpose;
let myResults;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  video.size(640, 480);
  myHandpose = ml5.handpose(video, modelLoaded);
  myHandpose.on('predict', gotResults);
}

function modelLoaded() {
  console.log('model is ready')
}

function gotResults(results) {
  console.log(results);
  myResults = results;
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);
  drawKeypoints();
  if (myResults && myResults[0]) {
    const points = myResults[0].annotations.thumb;
    for (let i = 0; i < myResults[0].annotations.thumb.length; i++) {
      const x = myResults[0].annotations.thumb[i][0];
      const y = myResults[0].annotations.thumb[i][1];
      fill(100, 255, 0);
      ellipse(x, y, 20, 20);
    }
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  if (!myResults) return;
  for (let i = 0; i < myResults.length; i += 1) {
    const prediction = myResults[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}

