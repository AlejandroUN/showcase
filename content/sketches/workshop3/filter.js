let filterShader;
let img;
let mask, message, label;
let filters;
let maskSize = 3
let customMask = [];
let tempInput;
let imgUploaded;
let blurSize;
let nMouseX, nMouseY;
let regionInput, greyScaleInput, captureInput;
let radius; 

function preload() {
  filterShader = readShader('/sketches/workshop3/filter.frag', { varyings: Tree.texcoords2 });
  img = loadImage('/docs/shortcodes/resources/images/Fire_breathing.jpg');
}

function setup() {
  canvas = createCanvas(700, 525, WEBGL);
  noStroke();
  textureMode(NORMAL);
  
  message = createP("");
  message.position(15, 600)
  message.style('color', 'red');
  message.style('font-size', '30px');
  message.style('font-weight', 'bold');
  message.style('text-align', 'center');
  // message.style('width', '200px');

  filters = createRadio()
  filters.option('Normal')
  filters.option('Ridges')
  filters.option('Blur')
  filters.option('Sobel')
  filters.option('Custom')
  filters.position(10, 545);
  // filters.style('width', '80px')
  filters.style('color', 'white');
  filters.selected('Normal')
  
  filters.changed(()=>{    
    if(filters.value() == 'Custom'){
      label = createP("Mask side");
      label.position(15, 570);
      label.style('color', 'white');
      maskSizeSlider = createSlider(3, 15, 3, 2);
      maskSizeSlider.position(10, 605)
      maskSizeSlider.changed(()=>{
        maskSize = maskSizeSlider.value();
        redrawMask();
        filterShader.setUniform('maskSize', maskSize);
      });
      redrawMask();

    }else if(filters.value() == 'Blur'){
      blurSize = createSlider(1, 15, 3, 2);
      blurSize.position(100, 575)
      blurSize.changed(() => {
        filterShader.setUniform('maskSize', blurSize.value());
      })
    }
    if(customMask != undefined && filters.value() != 'Custom'){
      customMask.forEach(input => {
        input.remove()
      });
      try{
        maskSizeSlider.remove()
        label.remove()
      }catch(error){}
      message.html("")

    }
    if(blurSize != undefined && filters.value() != 'Blur'){
      blurSize.remove()
    }
    
    
  });

  captureInput = createCheckbox("Camera", false);
  captureInput.position(350, 545);
  captureInput.style("color", "white");
  captureInput.changed(() => {
    if(captureInput.checked()){
      capture = createCapture(VIDEO);
      capture.hide();
      filterShader.setUniform('texture', capture);
    }else{
      capture.pause()
      filterShader.setUniform('texture', img);
    }
    filterShader.setUniform('capture', captureInput.checked());
  }) 

  greyScaleInput = createCheckbox("Grey scale", false);
  greyScaleInput.position(440, 545);
  greyScaleInput.style("color", "white");
  greyScaleInput.changed(() => {
    filterShader.setUniform('grey_scale', greyScaleInput.checked());
  }) 

  regionInput = createCheckbox("Only region", false);
  regionInput.position(550, 545);
  regionInput.style("color", "white");
  regionInput.changed(() => {
    
    filterShader.setUniform('only_region', regionInput.checked());    
    if(regionInput.checked()){
      radiusInput = createSlider(0, 1.5, 0.05, 0.01);
      radiusInput.position(550, 575)
      radius = radiusInput.value()
      filterShader.setUniform('radius', radius);
      radiusInput.changed(()=>{
        radius = radiusInput.value()
        filterShader.setUniform('radius', radius);
      })
    }else{
      radiusInput.remove()
    }
  }) 

  input = createFileInput(handleFile, false);
  input.position(20, 505);
  
  reset = createButton("Reset")
  reset.position(645, 505);
  reset.mousePressed(() => {
    filterShader.setUniform('texture', img);
    captureInput.checked(false);
  });

  shader(filterShader);  
  filterShader.setUniform('texture', img);
  // filterShader.setUniform('u_resolution', [map(width, start1, stop1, start2, stop2)]);
  filterShader.setUniform('texOffset', [1/width, 1/height]);  
}

function draw() {
  background(0);
  // if(captureInput.checked()){
  //   scale(-1.0,1.0);
  // }else{
  //   scale(1.0,1.0);
  // }
  //
  if (filters.value() == 'Ridges') {
    filterShader.setUniform('maskSize', 3);
    // filterShader.setUniform('filter', [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]);
     mask = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
    //  filterShader.setUniform('mask', [0, -1, 0, -1, 5, -1, 0, -1, 0]);
	//Move right
	 //filterShader.setUniform('filter', [0, 0, 0, 1, 0, 0, 0, 0, 0]);
	 //Move left
	 //filterShader.setUniform('filter', [0, 0, 0, 0, 0, 1, 0, 0, 0]);
  } else if(filters.value() == 'Blur'){
    const size = blurSize.value()*blurSize.value();
    mask = Array(size).fill(1/size);    
  } else if(filters.value() == 'Sobel'){
    // mask = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
    mask = [1, 2, 1, 0, 0, 0, -1, -2, -1]

  } else if(filters.value() == 'Custom'){
    maskSize = maskSizeSlider.value()
    mask = []
    try {
      customMask.forEach(input => {
        if(input.value().trim() == "") throw "Error";
        mask.push(eval(input.value()))
        message.html("");
      });
    } catch (error) {
      message.html("Invalid mask");
      // console.log(error)
    }
    
  } else {
    filterShader.setUniform('maskSize', 3);
    mask = [0, 0, 0, 0, 1, 0, 0, 0, 0];
  }
  filterShader.setUniform('mask', mask);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);

  nMouseX = map(mouseX, 0, width, 0, 1);
  nMouseY = map(mouseY, 0, height, 0, 1);
  // scale(1.0,1.0);
  filterShader.setUniform('mouseX', nMouseX);
  filterShader.setUniform('mouseY', nMouseY);

  if (keyIsDown(107) || keyIsDown(187)) {
    if(radius < 1.5){
      radius += 0.01;
    }
    
    filterShader.setUniform('radius', radius);
  }
  // 109 and 189 are keyCodes for "-"
  if (keyIsDown(109) || keyIsDown(189)) {
    if(radius >= 0){
      radius -= 0.01;
    }
    filterShader.setUniform('radius', radius);
  }
  // console.log(nMouseX + " " + nMouseY)
}

async function handleFile(file) {
  console.log(file);
  if (file.type === 'image') {
    imgUploaded = loadImage(file.data);
    // imgUploaded = loadImage(await toBase64(file.file));
    
    filterShader.setUniform('texture', imgUploaded);
  }else if (file.type === 'video'){
    imgUploaded = createVideo(file.data);
    imgUploaded.loop()
    imgUploaded.hide()
    console.log(imgUploaded)
    filterShader.setUniform('texture', imgUploaded);
    
  } else {
    imgUploaded = null;
    filterShader.setUniform('texture', img);
  }
  captureInput.checked(false);
}

function redrawMask(){
  customMask.forEach(input => {
    input.remove()
  });
  customMask = [];
  for (let i = 0; i < maskSize; i++) {
    for (let j = 0; j < maskSize; j++) {
      tempInput = i == j && i == int(maskSize/2) ? createInput("1", "text") : createInput("0", "text");
      tempInput.size(30,30)
      tempInput.position(200 + j*40, 575 + i*40)
      tempInput.style("font-size", "25px")
      tempInput.style("text-align", "center")
      customMask.push(tempInput);
    }
  }
}
// OTHER FILTERS

// SHARPEN
// 0 -1 0
// -1 5 -1
// 0 -1 0