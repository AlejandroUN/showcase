// WIDTH = 600
// HEIGHT = 390
// COLS = WIDTH / LENGTH
// ROWS = HEIGHT / LENGTH

// let ROWS = 8;
// let ROWS = 13;
// let ROWS = 39;
// let ROWS = 130;
let ROWS;

// let COLS = 12;
// let COLS = 20;
// let COLS = 60;
// let COLS = 200;
let COLS;

// let LENGTH = 50;
// let LENGTH = 30;
// let LENGTH = 10;
// let LENGTH = 3;
let LENGTH;

let SUBCELLS = 3;

let quadrille;
let row0, col0, row1, col1, row2, col2;
let v0color, v1color, v2color;
let subquadrille;
let cellColor, subCellColor, cords, subCords, count = 0;
let checkboxAntialiasing, slider, resolution;
let canvas;
let posX, posY;
let xCord, yCord, barCords;


function setup() {
    // canvas = createCanvas(COLS * LENGTH, ROWS * LENGTH);
  createCanvas(600, 400);
  // frameRate(5)
  slider = createSlider(6, 150, 25, 1);
  slider.position(225,15)

  // LENGTH = slider.value();
  updateResolution()

  slider.changed(()=>{ updateResolution() })
  
  quadrille = createQuadrille(COLS, ROWS);
  subquadrille = createQuadrille(SUBCELLS, SUBCELLS);
  
  // for (let i = 0; i < ROWS; i++) {
  //   let tempRow = []
  //   for (let j = 0; j < COLS; j++) {
  //     tempRow.push(createQuadrille(SUBCELLS, SUBCELLS))
  //   }
  //   subquadrille.push(tempRow)
  // }
  
  
  v0color = createColorPicker(color('red'));
  v1color = createColorPicker(color('green'));
  v2color = createColorPicker(color('blue'));

  v0color.position(10, 10);
  v1color.position(80, 10);
  v2color.position(150, 10);
  
  v0color.input(() => { colorizeTriangle() });
  v1color.input(() => { colorizeTriangle() });
  v2color.input(() => { colorizeTriangle() });
  
  checkboxAntialiasing = createCheckbox('Antialiasing', false);
  // checkboxAntialiasing.position(10,50)
  checkboxAntialiasing.position(380,15)
  checkboxAntialiasing.style('color', 'white')

  checkboxContour = createCheckbox('Contour', true);
  // checkboxContour.position(10,70)
  checkboxContour.position(490,15)
  checkboxContour.style('color', 'white')

  randomize();
}

function draw() {
    background('#060621');
    noStroke()
    // strokeWeight('default')
    
    
    // background('white');
    // updateResolution()
    drawQuadrille(quadrille, { cellLength: LENGTH, outlineWeight: 0.01, outline: 'white', board: true });
    if(checkboxContour.checked())
      tri()
    // fillVertices()
    if(checkboxAntialiasing.checked()){
      colorizeTriangle();
      // fillVertices()   
    }else{
      quadrille.clear();
      quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, v0color.color(), v1color.color(), v2color.color())
    }

    if(LENGTH > 20 && checkboxAntialiasing.checked()){
      posX = int(mouseX/LENGTH)
      posY = int(mouseY/LENGTH)
      translate(posX*LENGTH, posY*LENGTH)
      drawQuadrille(subquadrille, { cellLength: LENGTH/SUBCELLS, outlineWeight: 0.03, outline: 'cyan', board: true });
      translate(-posX*LENGTH, -posY*LENGTH)
      let number = countSubcells()
      noStroke()
      // text(number, mouseX, mouseY)
    }
    // translate(posX, posY)
    
    // quadrille.fill(posY, posX, color('black'))
}

function fillVertices(){
  quadrille.fill(row0, col0, v0color.color())
  quadrille.fill(row1, col1, v1color.color())
  quadrille.fill(row2, col2, v2color.color())
}

function tri() {
    push();
    stroke('cyan');
    strokeWeight(3);
    noFill();
    triangle(col0 * LENGTH + LENGTH / 2, row0 * LENGTH + LENGTH / 2, col1 * LENGTH + LENGTH / 2, row1 * LENGTH + LENGTH / 2, col2 * LENGTH + LENGTH / 2, row2 * LENGTH + LENGTH / 2);
    pop();
}

function keyPressed() {
  randomize(); 
}

function randomize() {
  row0 = int(random(0, ROWS));
  col0 = int(random(0, COLS));
  row1 = int(random(0, ROWS));
  col1 = int(random(0, COLS));
  row2 = int(random(0, ROWS));
  col2 = int(random(0, COLS));
  
  quadrille.clear();

  if(row0 == row1 || row1 == row2 || row0 == row2 || col0 == col1 || col1 == col2 || col0 == col2){
    randomize()
  }
}

function mulColor(oldColor, value){
    return color(red(oldColor)*value,green(oldColor)*value, blue(oldColor)*value)
}

function sumColor(oldColors){
    result = [0,0,0]
    oldColors.forEach(oldColor => {
        result[0] += red(oldColor)
        result[1] += green(oldColor)
        result[2] += blue(oldColor)
    });

    return color(result[0], result[1], result[2])
}

function interpolateColor (cords, color0, color1, color2){
  return sumColor([mulColor(color0, cords.w0), mulColor(color1, cords.w1), mulColor(color2, cords.w2)])
}

function colorizeTriangle(){
  // quadrille.fill(posY, posX, count.toString())
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      translate(LENGTH*j, LENGTH*i)
      // drawQuadrille(subquadrille[i][j], { cellLength: LENGTH/SUBCELLS, outlineWeight: 0.02, outline: 'white', board: false });
      // subquadrille.fill(0,0, color('black'))
      cords = quadrille._barycentric_coords(i+(1/2),j+(1/2), row0+(1/2), col0+(1/2), row1+(1/2), col1+(1/2), row2+(1/2), col2+(1/2))
      count = 0
      if(cords.w0 >= 0 && cords.w1 >= 0 && cords.w2 >= 0){
        cellColor = interpolateColor(cords, v0color.color(), v1color.color(), v2color.color())
        quadrille.fill(i, j, cellColor)
      }else{
        for (let ki = 0; ki < SUBCELLS; ki++) {
          for (let kj = 0; kj < SUBCELLS; kj++) {
            // point(i+(ki/SUBCELLS), j+(kj/SUBCELLS))
            subCords = quadrille._barycentric_coords(i+((2*ki+1)/(2*SUBCELLS)),j+((2*kj+1)/(2*SUBCELLS)), row0+(1/2), col0+(1/2), row1+(1/2), col1+(1/2), row2+(1/2), col2+(1/2))    
            if(subCords.w0 >= 0 && subCords.w1 >= 0 && subCords.w2 >= 0){
              count += 1
              // let subCellColor = interpolateColor(subCords, v0color.color(), v1color.color(), v2color.color())
              // subCellColor.levels[3] = map(count, 0, SUBCELLS*SUBCELLS, 0, 255)
              // subquadrille[i][j].fill(ki, kj, cellColor)
            }
          }
        }
      }
      
      if (count>0){
        // print("HOOOLLLAA")
        cellColor = interpolateColor(cords, v0color.color(), v1color.color(), v2color.color())
        let newColorCell = cellColor.toString().substr(0,cellColor.toString().length-2)+map(count, 0, SUBCELLS*SUBCELLS, 0, 1).toString()+")"
        quadrille.fill(i, j, color(newColorCell))
      }
      
      translate(-LENGTH*j, -LENGTH*i)
    }
  }
}

function updateResolution(){
  
  // COLS = int(600/LENGTH)
  oldROWS = ROWS
  oldCOLS = COLS

  COLS = slider.value()

  LENGTH = int(width/COLS)
  ROWS = int(height/LENGTH)
  // quadrille.clear()
  quadrille = createQuadrille(COLS, ROWS);
  
  row0 = round(map(row0, 0, oldROWS, 0, ROWS))
  col0 = round(map(col0, 0, oldCOLS, 0, COLS))
  row1 = round(map(row1, 0, oldROWS, 0, ROWS))
  col1 = round(map(col1, 0, oldCOLS, 0, COLS))
  row2 = round(map(row2, 0, oldROWS, 0, ROWS))
  col2 = round(map(col2, 0, oldCOLS, 0, COLS))
  
}

function countSubcells(){  
  let cells = 0
  for (let ki = 0; ki < SUBCELLS; ki++) {
    for (let kj = 0; kj < SUBCELLS; kj++) {
      xCord = ((int(mouseX/LENGTH)+(kj/SUBCELLS))*LENGTH)+LENGTH/(SUBCELLS*2)
      yCord = ((int(mouseY/LENGTH)+(ki/SUBCELLS))*LENGTH)+LENGTH/(SUBCELLS*2)
      // barCords = quadrille._barycentric_coords((ki/SUBCELLS)+(LENGTH/(SUBCELLS*2)),(kj/SUBCELLS)+(LENGTH/(SUBCELLS*2)), row0+(1/2), col0+(1/2), row1+(1/2), col1+(1/2), row2+(1/2), col2+(1/2))    
      // barCords = quadrille._barycentric_coords((ki/SUBCELLS),(kj/SUBCELLS), row0+(1/2), col0+(1/2), row1+(1/2), col1+(1/2), row2+(1/2), col2+(1/2))    
      barCords = quadrille._barycentric_coords(int(mouseY/LENGTH)+((2*ki+1)/(2*SUBCELLS)),int(mouseX/LENGTH)+((2*kj+1)/(2*SUBCELLS)), row0+(1/2), col0+(1/2), row1+(1/2), col1+(1/2), row2+(1/2), col2+(1/2))    
      stroke('purple')
      strokeWeight(5)
      // point(int(mouseX/LENGTH)*LENGTH+(kj/SUBCELLS), int(mouseY/LENGTH)+(ki/SUBCELLS))
      
      if(barCords.w0 >= 0 && barCords.w1 >= 0 && barCords.w2 >= 0){
        cells += 1
        stroke('yellow')
        // let subCellColor = interpolateColor(subCords, v0color.color(), v1color.color(), v2color.color())
        // subCellColor.levels[3] = map(count, 0, SUBCELLS*SUBCELLS, 0, 255)
        // subquadrille[i][j].fill(ki, kj, cellColor)
      }
      point(((int(mouseX/LENGTH)+(kj/SUBCELLS))*LENGTH)+LENGTH/(SUBCELLS*2), ((int(mouseY/LENGTH)+(ki/SUBCELLS))*LENGTH)+LENGTH/(SUBCELLS*2))
    }
  }
  return cells
}