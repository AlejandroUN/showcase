// WIDTH = 600
// HEIGHT = 390
// ROWS = WIDTH / LENGTH
// COLS = HEIGHT / LENGTH

// const ROWS = 8;
const ROWS = 13;
// const ROWS = 39;
// const COLS = 12;
const COLS = 20;
// const COLS = 60;
// const LENGTH = 50;
const LENGTH = 30;
// const LENGTH = 10;

const SUBCELLS = 11;

let quadrille;
let row0, col0, row1, col1, row2, col2;
let v0color, v1color, v2color;
let subquadrille = [];
let cellColor, subCellColor, cords, subCords, count;
let checkboxAntialiasing, slider, resolution;
let canvas;


function setup() {
    canvas = createCanvas(COLS * LENGTH, ROWS * LENGTH);
    // createCanvas(600, 390);
    frameRate(5)
    // slider = createSlider(1, 100, 30, 1);
    // slider.position(450,15)

    // slider.changed(()=>{removeElements(); updateResolution(); setup(); })
    // slider.changed(()=>{ updateResolution(); setupQuadrille(); })
    
    quadrille = createQuadrille(COLS, ROWS);

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
    // background('white');
    // updateResolution()
    drawQuadrille(quadrille, { cellLength: LENGTH, outlineWeight: 0.05, outline: 'white', board: true });
    if(checkboxContour.checked())
      tri()
    fillVertices()
    if(checkboxAntialiasing.checked()){
      colorizeTriangle();
      fillVertices()   
    }else{
      quadrille.clear();
      quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, v0color.color(), v1color.color(), v2color.color())
    }
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
  row0 = int(random(1, ROWS-1));
  col0 = int(random(1, COLS-1));
  row1 = int(random(1, ROWS-1));
  col1 = int(random(1, COLS-1));
  row2 = int(random(1, ROWS-1));
  col2 = int(random(1, COLS-1));
  
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
  let toColor = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      translate(LENGTH*j, LENGTH*i)
      // drawQuadrille(subquadrille[i][j], { cellLength: LENGTH/SUBCELLS, outlineWeight: 0.02, outline: 'white', board: false });
      // subquadrille.fill(0,0, color('black'))
      count = 0
      let p = i.toString()+"_"+j.toString()
      for (let ki = 0; ki < SUBCELLS; ki++) {
        for (let kj = 0; kj < SUBCELLS; kj++) {
          subCords = quadrille._barycentric_coords(i+(ki/SUBCELLS),j+(kj/SUBCELLS), row0+(1/2), col0+(1/2), row1+(1/2), col1+(1/2), row2+(1/2), col2+(1/2))    
          if(subCords.w0 >= 0 && subCords.w1 >= 0 && subCords.w2 >= 0){
            count += 1
            if (!(toColor.includes(p))){
              toColor.push(p)
            }
            
            // let subCellColor = interpolateColor(subCords, v0color.color(), v1color.color(), v2color.color())
            // subCellColor.levels[3] = map(count, 0, SUBCELLS*SUBCELLS, 0, 255)
            // subquadrille[i][j].fill(ki, kj, cellColor)
          }
        }
      }
      if (count>0){
        cords = quadrille._barycentric_coords(i,j, row0, col0, row1, col1, row2, col2)    
        cellColor = interpolateColor(cords, v0color.color(), v1color.color(), v2color.color())
        let newColorCell = cellColor.toString().substr(0,cellColor.toString().length-2)+map(count, 0, SUBCELLS*SUBCELLS, 0, 1).toString()+")"
        quadrille.fill(i, j, color(newColorCell))
      }

      translate(-LENGTH*j, -LENGTH*i)
    }
  }
}

function updateResolution(){
  
  LENGTH = slider.value
  COLS = 600/LENGTH
  ROWS = 390/LENGTH
  // resizeCanvas(w, h,
  
}