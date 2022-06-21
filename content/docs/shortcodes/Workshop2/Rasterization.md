# Rasterization

</details>

<style>
#antialiasing {
   margin: 20px;
   border: solid 0.5px;
   border-radius: 5px

}

.img-right{
    width: 120px;
    float: right;
    margin: 0px 20px;
}
</style>

## **Problem statement**

What we do with the rasterization process is breaking down a continuous surface (the triangle) into discrete elements (the pixels). The problem is similar to trying to represent a continuous curve or surface with Lego bricks. And the solution to this problem in rendering is called anti-aliasing, that will be implemented using the barycentric coordinates.

## **Background**

### **Concepts**

- #### **Rasterization**

Rasterization is the task of taking an image described in a vector graphics format (shapes) and converting it into a raster image (a series of pixels, dots or lines, which, when displayed together, create the image which was represented via shapes).

- #### **Anti-aliasing**

<img class="img-right" src="../../resources/images/ilustration01.png"/>

Antialiasing is a technique used in digital imaging to reduce the visual defects that occur when high-resolution images are presented in a lower resolution. Aliasing manifests itself as jagged or stair-stepped lines (otherwise known as jaggies) on edges and objects that should otherwise be smooth.

Antialiasing makes these curved or slanting lines smooth again by adding a slight discoloration to the edges of the line or object, causing the jagged edges to blur and melt together. If the image is zoomed out a bit, the human eye can no longer notice the slight discoloration that antialiasing creates.



- #### **Barycentric coordinates in 2D**

Consider a 2D triangle whose vertices are {{< katex >}}a=(x_a,y_a){{< /katex >}}, {{< katex >}}b=(x_b,y_b){{< /katex >}}, {{< katex >}}c=(x_c,y_c){{< /katex >}} and a point {{< katex >}}p{{< /katex >}}. Barycentric coordinates allow us to express the coordinates of {{< katex >}}p = (x, y){{< /katex >}} in terms of {{< katex >}}a{{< /katex >}}, {{< katex >}}b{{< /katex >}}, {{< katex >}}c{{< /katex >}}. More specifically, the barycentric coordinates of {{< katex >}}p{{< /katex >}} are the numbers {{< katex >}}\beta{{< /katex >}} and {{< katex >}}\gamma{{< /katex >}} such that.

{{< katex display >}}p = a + \beta (b − a) + \gamma (c − a){{< /katex >}}

If we regroup {{< katex >}}a{{< /katex >}}, {{< katex >}}b{{< /katex >}} and {{< katex >}}c{{< /katex >}}, we obtain

{{< katex display >}}p = a + \beta b − \beta a + \gamma c − \gamma a = (1-\beta-\gamma)a+\beta b + \gamma c{{< /katex >}}

At this point, it is customary to define a third variable, {{< katex >}}\alpha{{< /katex >}}, by

{{< katex display >}} \alpha = 1 - \beta -  \gamma {{< /katex >}}

We then have

{{< katex display >}} p = \alpha a + \beta b + \gamma c {{< /katex >}}

The barycentric coordinates of the point {{< katex >}}p{{< /katex >}} in terms of the points{{< katex >}}a{{< /katex >}}, {{< katex >}}b{{< /katex >}}, {{< katex >}}c{{< /katex >}} are the numbers {{< katex >}}\alpha{{< /katex >}}, {{< katex >}}\beta{{< /katex >}}, {{< katex >}}\gamma{{< /katex >}} such that

{{< katex display >}} p = \alpha a + \beta b + \gamma c {{< /katex >}}

with the constraint

{{< katex display >}} \alpha + \beta + \gamma = 1 {{< /katex >}}

<img class="img-right" src="../../resources/images/ilustration02.png"/>

We can also use geometry to find {{< katex >}}\alpha{{< /katex >}}, {{< katex >}}\beta{{< /katex >}}, {{< katex >}}\gamma{{< /katex >}}. Let {{< katex >}}A_a{{< /katex >}}, {{< katex >}}A_b{{< /katex >}} and {{< katex >}}A_c{{< /katex >}} be as in figure and let {{< katex >}}A{{< /katex >}} denote the area of the triangle. Also note that the point inside the triangle on figure is the point we called {{< katex >}}p{{< /katex >}}. 

### **Algorithm**

Having into account the barycentric coordinates, we have the following aspects:

- If {{< katex >}}\alpha,\beta, \gamma >= 0{{< /katex >}}, then {{< katex >}}p{{< /katex >}} is within the triangle (or on the contour), otherwise it is outside.
<img class="img-right" src="../../resources/images/ilustration03.png"/>
- The color for any pixel will be given by {{< katex >}}\alpha C_a + \beta C_b + \gamma C_c{{< /katex >}} where {{< katex >}}, C_a, C_b, C_c {{< /katex >}} are the colors of the triangle vertices.
- In order to decide if a pixel is inside or outside a triangle, we took the center of the pixel as the reference.
- All pixels inside the triangle will be colored without fading (Alpha value in RBGA will be 1).
<img class="img-right" src="../../resources/images/ilustration04.png"/>
- If a pixel is outside the triangle, we will do a sub-sampling of it, dividing the pixel into "sub-pixels". In this case, we chose 9 sub-pixels for each pixel.
- For each pixel we will count how many sub-pixels are inside the triangle, and since this value will be between [0,9], it should be mapped to the range [0,1] to set the transparency of a pixel.

## **Code (solution) & results**

<details>
<summary>
Anti-aliasing implementation
</summary>

```JavaScript:/sketches/antialising.js

let ROWS;
let COLS;
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
  createCanvas(600, 400);
  slider = createSlider(6, 150, 25, 1);
  slider.position(225,15)

  updateResolution()

  slider.changed(()=>{ updateResolution() })
  
  quadrille = createQuadrille(COLS, ROWS);
  subquadrille = createQuadrille(SUBCELLS, SUBCELLS);

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
  checkboxAntialiasing.position(380,15)
  checkboxAntialiasing.style('color', 'white')

  checkboxContour = createCheckbox('Contour', true);
  checkboxContour.position(490,15)
  checkboxContour.style('color', 'white')

  randomize();
}

function draw() {
    background('#060621');
    noStroke()

    drawQuadrille(quadrille, { cellLength: LENGTH, outlineWeight: 0.01, outline: 'white', board: true });
    if(checkboxContour.checked())
      tri()

    if(checkboxAntialiasing.checked()){
      colorizeTriangle();
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
      text(number, mouseX, mouseY)
    }
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

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      translate(LENGTH*j, LENGTH*i)

      cords = quadrille._barycentric_coords(i+(1/2),j+(1/2), row0+(1/2), col0+(1/2), row1+(1/2), col1+(1/2), row2+(1/2), col2+(1/2))
      count = 0
      
      if(cords.w0 >= 0 && cords.w1 >= 0 && cords.w2 >= 0){
        cellColor = interpolateColor(cords, v0color.color(), v1color.color(), v2color.color())
        quadrille.fill(i, j, cellColor)
      }else{
        for (let ki = 0; ki < SUBCELLS; ki++) {
          for (let kj = 0; kj < SUBCELLS; kj++) {
            subCords = quadrille._barycentric_coords(i+((2*ki+1)/(2*SUBCELLS)),j+((2*kj+1)/(2*SUBCELLS)), row0+(1/2), col0+(1/2), row1+(1/2), col1+(1/2), row2+(1/2), col2+(1/2))    
            if(subCords.w0 >= 0 && subCords.w1 >= 0 && subCords.w2 >= 0){
              count += 1
            }
          }
        }
      }
      
      if (count>0){
        cellColor = interpolateColor(cords, v0color.color(), v1color.color(), v2color.color())
        let newColorCell = cellColor.toString().substr(0,cellColor.toString().length-2)+map(count, 0, SUBCELLS*SUBCELLS, 0, 1).toString()+")"
        quadrille.fill(i, j, color(newColorCell))
      }
      
      translate(-LENGTH*j, -LENGTH*i)
    }
  }
}

function updateResolution(){
  
  oldROWS = ROWS
  oldCOLS = COLS

  COLS = slider.value()

  LENGTH = int(width/COLS)
  ROWS = int(height/LENGTH)
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
      
      barCords = quadrille._barycentric_coords(int(mouseY/LENGTH)+((2*ki+1)/(2*SUBCELLS)),int(mouseX/LENGTH)+((2*kj+1)/(2*SUBCELLS)), row0+(1/2), col0+(1/2), row1+(1/2), col1+(1/2), row2+(1/2), col2+(1/2))    
      stroke('purple')
      strokeWeight(5)
            
      if(barCords.w0 >= 0 && barCords.w1 >= 0 && barCords.w2 >= 0){
        cells += 1
        stroke('yellow')
      }
      point(((int(mouseX/LENGTH)+(kj/SUBCELLS))*LENGTH)+LENGTH/(SUBCELLS*2), ((int(mouseY/LENGTH)+(ki/SUBCELLS))*LENGTH)+LENGTH/(SUBCELLS*2))
    }
  }
  return cells
}

```
</details>

{{< p5-iframe sketch="/sketches/antialiasing.js" lib1="https://cdn.jsdelivr.net/gh/objetos/p5.quadrille.js/p5.quadrille.min.js" width="630" height="430">}}

## **Conclusions & future work**

- Antialiasing definitely improves the visual experience of users.
- It requires high hardware requirements to have a good performance.
- The number of subsamples could be increased to have a more accurate result but it would be slower.
- As future work we could try to improve the antialiasing implementation using parallel computing.

## **References**

- [Antialiasing](https://www.techopedia.com/definition/1950/antialiasing)
- [Rasterisation](https://en.wikipedia.org/wiki/Rasterisation)
- [Mathematics for Computer Graphics - Barycentric Coordinates](https://users.csc.calpoly.edu/~zwood/teaching/csc471/2017F/barycentric.pdf)
- [The barycentric conspiracy](https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/)
- [Rasterization: a Practical Implementation](https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/rasterization-practical-implementation)
- [Visual Computing eBook. Rasterization](https://visualcomputing.github.io/docs/rendering/rasterization/)

