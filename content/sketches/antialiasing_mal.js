const ROWS = 13;
const COLS = 20;
const SUBCELLS = 3;
const LENGTH = 30;
let quadrille;
let row0, col0, row1, col1, row2, col2;
let v0color, v1color, v2color;

function setup() {
    createCanvas(COLS * LENGTH, ROWS * LENGTH);
    quadrille = createQuadrille(COLS, ROWS);
    subquadrille = createQuadrille(SUBCELLS, SUBCELLS);
//   lineColor = createColorPicker(color('red'));
//   lineColor.position(10, 10);
//   lineColor.input(() => { colorizeLine() });
    v0color = createColorPicker(color('red'));
    // alert(JSON.stringify(v0color))
    // console.log(newColor(v0color.color(),0.5))
    
    // console.log(v0color.color()*2)
    // console.log(color(290,-3,12))
    v1color = createColorPicker(color('green'));
    console.log(v0color.color()+v1color.color())
    v2color = createColorPicker(color('blue'));
    v0color.position(10, 10);
    v1color.position(80, 10);
    v2color.position(150, 10);
    // v0color.input(() => { quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, v0color.color(), v1color.color(), v2color.color()) });
    // v1color.input(() => { quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, v0color.color(), v1color.color(), v2color.color()) });
    // v2color.input(() => { quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, v0color.color(), v1color.color(), v2color.color()) });
    
    v0color.input(() => { colorizeLine() });
    v1color.input(() => { colorizeLine() });
    v2color.input(() => { colorizeLine() });
    
    randomize();
}

function draw() {
    background('#060621');
    drawQuadrille(quadrille, { cellLength: LENGTH, outlineWeight: 0.05, outline: 'white', board: true });
    tri();
    translate(LENGTH*col1, LENGTH*row1)
    //   console.log(LENGTH*col1, LENGTH*row1)
    drawQuadrille(subquadrille, { cellLength: LENGTH/SUBCELLS, outlineWeight: 0.02, outline: 'white', board: true });
    //   randomize()
    quadrille.fill(2,1, color("white"))
}

function tri() {
    push();
    stroke('cyan');
    strokeWeight(3);
    //   noStroke();
    noFill();
    // triangle(col0 * LENGTH + LENGTH / 2, row0 * LENGTH + LENGTH / 2, col1 * LENGTH + LENGTH / 2, row1 * LENGTH + LENGTH / 2, col2 * LENGTH + LENGTH / 2, row2 * LENGTH + LENGTH / 2);
    line(col0 * LENGTH + LENGTH / 2, row0 * LENGTH + LENGTH / 2, col1 * LENGTH + LENGTH / 2, row1 * LENGTH + LENGTH / 2)
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
    //   row2 = row1
    //   col2 = col1
    quadrille.clear();
    
//   quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, v0color.color(), v1color.color(), v2color.color());
//   quadrille.fill(row0, col0, color('red'))
//   quadrille.colorize(v0color.color()) 
    colorizeLine(col0,row0, col1, row1)
  
}

function colorizeLine(x0, y0, x1, y1){

    quadrille.fill(y0,x0,v0color.color())
    quadrille.fill(y1,x1,v1color.color())
    
    let auxLength = round((abs(x0-x1)+1)/2)
    let auxPoint = [2,2]
    let minorAxis = 0 // X
    if (slope(x0, y0, x1, y1) <= 1/2 && slope(x0, y0, x1, y1) > -1/2) {
        minorAxis = 1 // Y
        console.log("minor axis: Y")
        if (y0+auxLength < ROWS){
            auxPoint = [x0,y0+auxLength]
        }else if(y0-auxLength >= 0){
            auxPoint = [x0,y0-auxLength]
        }else if (y1+auxLength < ROWS){
            auxPoint = [x1,y1+auxLength]
        }else if(y1-auxLength >= 0){
            auxPoint = [x1,y1-auxLength]
        }else{
            randomize()
        }
    }else{
        console.log("minor axis: X")
        if (x0+auxLength < COLS){
            auxPoint = [x0+auxLength, y0]
        }else if(x0-auxLength >= 0){
            auxPoint = [x0-auxLength, y0]
        }else if (x1+auxLength < COLS){
            auxPoint = [x1+auxLength, y1]
        }else if(x1-auxLength >= 0){
            auxPoint = [x1-auxLength, y1]
        }else{
            randomize()
        }
    }
    quadrille.fill(auxPoint[1], auxPoint[0], color("cyan"))

    // console.log(slope(x0, y0, x1, y1))
    // console.log("abs("+x0+"-"+x1+")/2 = "+auxLength)


    

    // for (let i = 0; i < ROWS; i++) {
    //     for (let j = 0; j < COLS; j++) {
    //       // let info = quadrille.read(i,j)
    //         let cords = quadrille._barycentric_coords(i,j, row0, col0, row1, col1, row2, col2)
    //         // quadrille.fill(i, j, color(290,-3,12))
    //         let newV0Color = mulColor(v0color.color(),cords.w0)
    //         let newV1Color = mulColor(v1color.color(),cords.w1)
    //         let newV2Color = mulColor(v2color.color(),cords.w2)
            
    //         quadrille.fill(i, j, sumColor([newV0Color, newV1Color, newV2Color]))

    //         // if(cords.w0 >= 0 && cords.w1 >= 0 && cords.w2 >= 0){
    //         //     quadrille.fill(i, j, color(125,54,12))
    //         // }
    //         // console.log(quadrille.read(i,j))
    //       //   if(cords.w0 > 0 && cords.w1 > 0 && cords.w2 > 0){
    //     //       quadrille.fill(i, j, color('red'))
    //     //   }else{
    //     //     //   translate(LENGTH*j, LENGTH*i)
    //     //       //   console.log(LENGTH*col1, LENGTH*row1)
    //     //     //   drawQuadrille(subquadrille, { cellLength: LENGTH/SUBCELLS, outlineWeight: 0.02, outline: 'white', board: true });
    //     //   }
    //       console.log(cords.w0, cords.w1, cords.w2)
    //       console.log(quadrille.read(i,j))
    //     }
    // } 
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

    return color(result[0], result[1], result[2], red(oldColors[0]))
}

function slope(x0,y0,x1,y1){
    return (y1-y0)/(x1-x0)
}