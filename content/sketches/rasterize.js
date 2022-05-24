const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
let quadrille;
let row0, col0, row1, col1, row2, col2;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille(20,20);
  randomize();
}

function draw() {
  background('#060621');
  drawQuadrille(quadrille, {cellLength: LENGTH, outlineWeight: 1, outline: 'green', board: true});
  tri();
}

function tri() {
  push();
  stroke('cyan');
  strokeWeight(3);
  noFill();
  triangle(col0*LENGTH + LENGTH/2, row0*LENGTH + LENGTH/2, col1*LENGTH + LENGTH/2, row1*LENGTH + LENGTH/2, col2*LENGTH + LENGTH/2, row2*LENGTH + LENGTH/2);
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
  quadrille.colorizeTriangle(row0, col0, row1, col1, row2, col2, 'magenta');
}