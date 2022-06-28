let pg;
let bricksShader, diamondsShader, colorsShader;
let shaderSelector;
let shaderSelected;

function preload() {
  // shader adapted from here: https://thebookofshaders.com/09/
  bricksShader = readShader('/sketches/workshop3/bricks.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
  diamondsShader = readShader('/sketches/workshop3/diamonds.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
  colorsShader = readShader('/sketches/workshop3/colors.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
  createCanvas(400, 400, WEBGL);
  // create frame buffer object to render the procedural texture
  pg = createGraphics(400, 400, WEBGL);
  textureMode(NORMAL);
  noStroke();
  pg.noStroke();
  pg.textureMode(NORMAL);


  shaderSelector = createRadio();
  shaderSelector.option("bricks")
  shaderSelector.option("diamonds")
  shaderSelector.option("colors")
  shaderSelector.selected('bricks');
  shaderSelector.style('color', 'white')
  shaderSelector.style('font-size', '20px')

  shaderSelector.changed(()=>{
    if(shaderSelector.value() == "bricks"){
      shaderSelected = bricksShader;
    }else if(shaderSelector.value() == "diamonds"){
      shaderSelected = diamondsShader;
    }else if(shaderSelector.value() == "colors"){
      shaderSelected = colorsShader;
    }
    pg.shader(shaderSelected);    
    // emitResolution, see:
    // https://github.com/VisualComputing/p5.treegl#macros
    pg.emitResolution(shaderSelected);
    // https://p5js.org/reference/#/p5.Shader/setUniform
    shaderSelected.setUniform('u_zoom', 3);
    // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
    pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
    // set pg as texture
    texture(pg);  
  })
  
  shaderSelected = bricksShader;
  // use truchetShader to render onto pg
  pg.shader(shaderSelected);    
  // emitResolution, see:
  // https://github.com/VisualComputing/p5.treegl#macros
  pg.emitResolution(shaderSelected);
  // https://p5js.org/reference/#/p5.Shader/setUniform
  shaderSelected.setUniform('u_zoom', 3);
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  // set pg as texture
  texture(pg);

}

function draw() {
  background(33);
  orbitControl();
  cylinder(100, 200);
}