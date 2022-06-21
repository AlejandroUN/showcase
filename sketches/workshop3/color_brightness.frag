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

float hsl(vec3 texel) {
  return ( max(max(texel.r,texel.g), texel.b) + min(min(texel.r,texel.g), texel.b)) / 2.0;
}

float hsv(vec3 texel) {
  return max(max(texel.r,texel.g), texel.b);
}

float average(vec3 texel) {
  return (texel.r + texel.g + texel.b) / 3.0;
}

void main() {
  // texture2D(texture, texcoords2) samples texture at texcoords2 
  // and returns the normalized texel color
  vec4 texel = texture2D(texture, texcoords2);
  if(grey_scale == 2) {
    gl_FragColor =   vec4((vec3(luma(texel.rgb))), 1.0);
  }else if(grey_scale == 3) {
    gl_FragColor = vec4((vec3(hsl(texel.rgb))), 1.0);
  }else if(grey_scale == 4) {
    gl_FragColor = vec4((vec3(hsv(texel.rgb))), 1.0);
  }else if(grey_scale == 5) {
    gl_FragColor = vec4((vec3(average(texel.rgb))), 1.0);
  }else{
    gl_FragColor = texel;  
  }
  
}