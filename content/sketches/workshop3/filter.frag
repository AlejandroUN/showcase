precision mediump float;

#define MAX_MASK_SIZE 15*15

uniform sampler2D texture;
uniform vec2 texOffset;
uniform bool grey_scale;
// holds the 3x3 kernel
uniform float mask[MAX_MASK_SIZE];
uniform int maskSize;

uniform float mouseX;
uniform float mouseY;

uniform bool only_region;
uniform bool capture;
uniform float radius;

// uniform vec2 u_resolution;
// we need our interpolated tex coord
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

  // vec2 u_resolution = vec2(1.0, 4.0/3.0);
  vec2 u_resolution = vec2(1.0, 4.0/3.0);
  vec2 st = texcoords2/u_resolution;
  float pct = 0.0;
  pct = capture ? distance(st,vec2(mouseX, mouseY)/u_resolution) : distance(st,vec2(mouseX, mouseY)/u_resolution);
  // pct = distance(st,vec2(0.5));
  // pct = smoothstep(0.1, 0.1, pct);

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

