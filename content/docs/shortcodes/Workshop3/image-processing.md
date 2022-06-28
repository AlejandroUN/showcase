# Image processing

<style>
.img-center{
    display:block;
    margin:auto;
    border: 10px solid white;
}

.img-right{
    width: 180px;
    float: right;
    margin-left: 100px;
}

.parent{
    margin: 20px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
}

iframe{
    margin: 20px auto;
    display: table;
}
</style>

## **Introduction**

Filtering is a technique for modifying or enhancing an image. For example, you can filter an image to emphasize certain features or remove other features. Image processing operations implemented with filtering include smoothing, sharpening, and edge enhancement. [[1]](https://www.mathworks.com/help/images/what-is-image-filtering-in-the-spatial-domain.html)

The value of any given pixel in the output image is determined by applying some algorithm to the values of the pixels in the neighborhood of the corresponding input pixel. A pixel's neighborhood is some set of pixels, defined by their locations relative to that pixel.

## **Background**

### **Kernel**

In image processing, a kernel, convolution matrix, or mask is a small matrix used for blurring, sharpening, embossing, edge detection, and more. This is accomplished by doing a convolution between the kernel and an image. [[2]](https://en.wikipedia.org/wiki/Kernel_(image_processing))

> **Example:**
> Sharpen Filter 
> {{< katex display >}} 
\begin{bmatrix}
\ \ 0 & -1 & \ \ 0 \\
-1 & \ \ 5 & -1 \\
\ \ 0 & -1 & \ \ 0
\end{bmatrix}
 {{< /katex >}}

### **Convolution**

Convolution is the process of adding each element of the image to its local neighbors, weighted by the kernel. [[3]](https://medium.com/@bdhuma/6-basic-things-to-know-about-convolution-daef5e1bc411)

<div><img class="img-center" src="../../resources/images/imageProcessing/convolution.png"/></div> 

## **Methods**

### **Identity**

<div class="parent">
    {{< katex >}} 
    {\displaystyle {\begin{bmatrix}\ \ 0&\ \ 0&\ \ 0\\\ \ 0&\ \ 1&\ \ 0\\\ \ 0&\ \ 0&\ \ 0\end{bmatrix}}}
    {{< /katex >}}
    <img class="img-right" src="../../resources/images/imageProcessing/identity.png"/>
</div>

### **Ridge detection**

<div class="parent">
    {{< katex >}} 
    {\displaystyle {
    \begin{bmatrix}
    -1 &  -1 & -1 \\
    -1 & \ \ 8 & -1 \\
    -1 &  -1 & -1
    \end{bmatrix}
    }}
    {{< /katex >}}
    <img class="img-right" src="../../resources/images/imageProcessing/ridges.png"/>
</div>

### **Box Blur** [[4]](https://aishack.in/tutorials/image-convolution-examples/)

<div class="parent">
    {{< katex >}} 
    {\displaystyle {\frac {1}{9}}{\begin{bmatrix}\ \ 1&\ \ 1&\ \ 1\\\ \ 1&\ \ 1&\ \ 1\\\ \ 1&\ \ 1&\ \ 1\end{bmatrix}}}
    {{< /katex >}}
    <img class="img-right" src="../../resources/images/imageProcessing/blur3x3.png"/>
</div>

<div class="parent">
    {{< katex >}} 
    {\displaystyle {
        {\frac {1}{n*n}}
        \begin{bmatrix} 
        1 & 1 & \dots & 1 \\
        \vdots & \vdots & \ddots & \vdots \\
        1 & 1 & \dots & 1 
        \end{bmatrix}_{n\times n}
    }}
    {{< /katex >}}
    <img class="img-right" src="../../resources/images/imageProcessing/blur15x15.png"/>
</div>

### **Sobel**

<div class="parent">
    {{< katex >}} 
    {\displaystyle {
        \begin{bmatrix} 
        1 & 2 & 1 \\
        0 & 0 & 0 \\
        -1 & -2 & -1 
        \end{bmatrix}
    }}
    {{< /katex >}}
    <img class="img-right" src="../../resources/images/imageProcessing/sobel.png"/>
</div>

### **Sharpen**

<div class="parent">
    {{< katex >}} 
    {\displaystyle {
        \begin{bmatrix}
        \ \ 0 & -1 & \ \ 0 \\
        -1 & \ \ 5 & -1 \\
        \ \ 0 & -1 & \ \ 0
        \end{bmatrix}
    }}
    {{< /katex >}}
    <img class="img-right" src="../../resources/images/imageProcessing/sharpen.png"/>
</div>

## **Code (solution) & results**

<details>
<summary>
Image Processing - Fragment shader
</summary>

```JavaScript:/sketches/workshop3/filter.frag

precision mediump float;

#define MAX_MASK_SIZE 15*15

uniform sampler2D texture;
uniform vec2 texOffset;
uniform bool grey_scale;

uniform float mask[MAX_MASK_SIZE];
uniform int maskSize;

uniform float mouseX;
uniform float mouseY;

uniform bool only_region;
uniform bool capture;
uniform float radius;

varying vec2 texcoords2;

float f(float t){
  if(t > pow(6.0/29.0,3.0)){
    return pow(t, 1.0/3.0);
  }
  return (t/(3.0 * pow(6.0/29.0, 2.0)))+(4.0/29.0);
}

vec3 cielab(vec3 XYZ) {
  float Xn = 96.6797;
  float Yn = 100.0;
  float Zn = 108.883;

  float L = (116.0 * f(XYZ.y / Yn) - 16.0) / 100.0;
  float a = (500.0 * (f(XYZ.x / Xn) - f(XYZ.y / Yn))) / 100.0;
  float b = (200.0 * (f(XYZ.y / Yn) - f(XYZ.z / Zn))) / 100.0;
  return vec3(L,a,b);
}

vec3 xyz(vec3 texel){
  texel.r = texel.r > 0.04045 ? pow(( ( texel.r + 0.055 ) / 1.055 ), 2.4) * 100.0 : texel.r / 12.92 * 100.0;
  texel.g = texel.g > 0.04045 ? pow(( ( texel.g + 0.055 ) / 1.055 ), 2.4) * 100.0 : texel.g / 12.92 * 100.0;
  texel.b = texel.b > 0.04045 ? pow(( ( texel.b + 0.055 ) / 1.055 ), 2.4) * 100.0 : texel.b / 12.92 * 100.0;
  float X = texel.r * 0.4124 + texel.g * 0.3576 + texel.b * 0.1805;
  float Y = texel.r * 0.2126 + texel.g * 0.7152 + texel.b * 0.0722;
  float Z = texel.r * 0.0193 + texel.g * 0.1192 + texel.b * 0.9505;
  return vec3(X,Y,Z);
}

void main() {

  vec2 u_resolution = vec2(1.0, 4.0/3.0);
  vec2 st = texcoords2/u_resolution;
  float pct = 0.0;
  pct = capture ? distance(st,vec2(mouseX, mouseY)/u_resolution) : distance(st,vec2(mouseX, mouseY)/u_resolution);

  vec4 convolution;
  for (int i = 0; i < MAX_MASK_SIZE*MAX_MASK_SIZE; i++) {
    if(i > maskSize*maskSize){break;}
    int i_temp = int(i/maskSize);
    int j_temp = int(mod(float(i),float(maskSize)));
    vec2 temp = texcoords2 + vec2(-float(int(maskSize/2))*texOffset.s + float(j_temp)*texOffset.s, -float(int(maskSize/2))*texOffset.t + float(i_temp)*texOffset.t);
    
    convolution += texture2D(texture, temp)*mask[i];
  }

  if (only_region){
    if (pct <= radius){
      gl_FragColor = grey_scale ? vec4(vec3(cielab(xyz(convolution.rgb)).x), 1.0) : vec4(convolution.rgb, 1.0); 
    }else{
      gl_FragColor = texture2D(texture, texcoords2);
    }
  }else{
    gl_FragColor = grey_scale ? vec4(vec3(cielab(xyz(convolution.rgb)).x), 1.0) : vec4(convolution.rgb, 1.0); 
  }
  
  
}

```

</details>

{{< p5-iframe sketch="/sketches/workshop3/filter.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="725" height="725">}}

<!-- {{< p5-iframe sketch="/sketches/workshop3/filter-ridge.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="725" height="525">}} -->

## **Conclusions & future work**

As future work, it would be nice to implement more complex image filters and improve interface features to provide a better user experience. Also, implement the same image filters sequentially to compare performance and highlight all the gains from doing it in parallel.

## **References**

- [1] [Image Filtering in the Spatial Domain](https://www.mathworks.com/help/images/what-is-image-filtering-in-the-spatial-domain.html)
- [2] [Kernel (image processing)](https://en.wikipedia.org/wiki/Kernel_(image_processing))
- [3] [6 basic things to know about Convolution](https://medium.com/@bdhuma/6-basic-things-to-know-about-convolution-daef5e1bc411)
- [4] [Image convolution examples](https://aishack.in/tutorials/image-convolution-examples/)

<!-- {{< p5-iframe sketch="/sketches/brushbasedwithcamera.js" width="630" height="430">}} -->
