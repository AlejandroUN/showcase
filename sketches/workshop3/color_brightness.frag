precision mediump float;

// uniforms are defined and sent by the sketch
uniform int grey_scale;
uniform sampler2D texture;

// interpolated texcoord (same name and type as in vertex shader)
varying vec2 texcoords2;

// returns luma of given texel
float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

// returns luma of given texel
//vec3 luma(vec3 texel) {
//  //return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
//  return vec3(texel.r+0.5,texel.g,texel.b);
//}

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