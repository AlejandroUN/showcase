# Color brightness tools

<style>
    iframe{
        margin: 20px auto;
        display: table;
    }
</style>

<details>
<summary>
Fragment shader
</summary>

```JavaScript:/sketches/workshop3/color_brightness.frag

precision mediump float;

uniform int grey_scale;
uniform sampler2D texture;

// interpolated texcoord (same name and type as in vertex shader)
varying vec2 texcoords2;

float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

float hsl(vec3 texel) {
  return ( max(max(texel.r,texel.g), texel.b) + min(min(texel.r,texel.g), texel.b)) / 2.0;
}

float hsv(vec3 texel) {
  return max(max(texel.r,texel.g), texel.b);
}

float average(vec3 texel) {
  return (texel.r + texel.g + texel.b) / 3.0;
}

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
  // texture2D(texture, texcoords2) samples texture at texcoords2 
  // and returns the normalized texel color
  vec4 texel = texture2D(texture, texcoords2);
  if(grey_scale == 3) {
    gl_FragColor =   vec4((vec3(luma(texel.rgb))), 1.0);
  }else if(grey_scale == 6) {
    gl_FragColor = vec4((vec3(hsl(texel.rgb))), 1.0);
  }else if(grey_scale == 5) {
    gl_FragColor = vec4((vec3(hsv(texel.rgb))), 1.0);
  }else if(grey_scale == 4) {
    gl_FragColor = vec4((vec3(average(texel.rgb))), 1.0);
  }else if(grey_scale == 2) {
    gl_FragColor = vec4(vec3(cielab(xyz(texel.rgb)).x), 1.0);
  }else{
    gl_FragColor = texel;
  }
  
}

```

</details>

<div>
{{< p5-iframe sketch="/sketches/workshop3/color_brightness.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="725" height="525">}}
</div>

## Referencias

- http://colormine.org/convert/rgb-to-lab
- https://www.hisour.com/es/lab-color-space-24846/
- https://stackoverflow.com/questions/15408522/rgb-to-xyz-and-lab-colours-conversion
- https://en.wikipedia.org/wiki/HSL_and_HSV#Disadvantages
- https://visualcomputing.github.io/docs/shaders/texturing/