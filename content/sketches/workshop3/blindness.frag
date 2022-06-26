precision mediump float;

// uniforms are defined and sent by the sketch
uniform int grey_scale;
uniform sampler2D texture;

// interpolated texcoord (same name and type as in vertex shader)
varying vec2 texcoords2;


// returns luma of given texel
vec3 protanopia(vec3 texel) {
  //return 0.299 * texel.r + 0.+587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 protanopia = mat3(0.0, 0.0, 0.0, 2.02344, 1.0, 0.0, -2.52581, 0.0, 1.0);
  vec3 LMSP = protanopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RP = BackRGB*LMSP;
  return RP;
}

// returns luma of given texel
vec3 cprotanopia(vec3 texel) {
  //return 0.299 * texel.r + 0.+587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 protanopia = mat3(0.0, 0.0, 0.0, 2.02344, 1.0, 0.0, -2.52581, 0.0, 1.0);
  vec3 LMSP = protanopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RP = BackRGB*LMSP;
  vec3 Diff = tex - RP;
  mat3 EMP = mat3(0.0, 0.7, 0.7, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
  vec3 VEP = EMP*Diff;
  vec3 CIP = tex + VEP;
  return CIP;
  //return vec3(texel.r,texel.g,texel.b);
}

vec3 duteranopia(vec3 texel) {
  //return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 duteranopia = mat3(1.0, 0.49421, 0.0, 0.0, 0.0, 0.0, 0.0, 1.24827, 1.0);
  vec3 LMSD = duteranopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RD = BackRGB*LMSD;
  return RD;
}

vec3 cduteranopia(vec3 texel) {
  //return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 duteranopia = mat3(1.0, 0.49421, 0.0, 0.0, 0.0, 0.0, 0.0, 1.24827, 1.0);
  vec3 LMSD = duteranopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RD = BackRGB*LMSD;
  vec3 Diff = tex - RD;
  mat3 EMD = mat3(1.0, 0.0, 0.0, 0.7, 0.0, 0.7, 0.0, 0.0, 1.0);
  vec3 VED = EMD*Diff;
  vec3 CID = tex + VED;
  return CID;
  //return vec3(texel.r,texel.g,texel.b);
}

vec3 tritanopia(vec3 texel) {
  //return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 tritanopia = mat3(1.0, 0.0, -0.395913, 0.0, 1.0, 0.801109, 0.0, 0.0, 0.0);
  vec3 LMST = tritanopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RT = BackRGB*LMST;
  return RT;
  //return vec3(texel.r,texel.g,texel.b);
}

vec3 ctritanopia(vec3 texel) {
  //return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
  mat3 const1 = mat3(17.8824, 3.45565, 0.0299566, 43.5161, 27.1554, 0.184309, 4.11935, 3.86714, 1.46709);
  vec3 tex = vec3(texel.r,texel.g,texel.b);
  vec3 LMS = const1 * tex;
  mat3 tritanopia = mat3(1.0, 0.0, -0.395913, 0.0, 1.0, 0.801109, 0.0, 0.0, 0.0);
  vec3 LMST = tritanopia * LMS;
  mat3 BackRGB = mat3(0.0809444479, 0.113614708, -0.000365296938, -0.130504409, -0.0102485335, -0.00412161469, 0.116721066, 0.0540193266, 0.693511405);
  vec3 RT = BackRGB*LMST;
  vec3 Diff = tex - RT;
  mat3 EMT = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.7, 0.7, 0.0);
  vec3 VET = EMT*Diff;
  vec3 CIT = tex + VET;
  return CIT;
  //return vec3(texel.r,texel.g,texel.b);
}

void main() {
  // texture2D(texture, texcoords2) samples texture at texcoords2 
  // and returns the normalized texel color
  vec4 texel = texture2D(texture, texcoords2);
  if(grey_scale == 3) {
    gl_FragColor = vec4((vec3(duteranopia(texel.rgb))), 1.0);
  }else if(grey_scale == 6) {
    gl_FragColor = vec4((vec3(cduteranopia(texel.rgb))), 1.0);
  }else if(grey_scale == 7) {
    gl_FragColor = vec4((vec3(ctritanopia(texel.rgb))), 1.0);
  }else if(grey_scale == 5) {
    gl_FragColor = vec4((vec3(cprotanopia(texel.rgb))), 1.0);
  }else if(grey_scale == 4) {
    gl_FragColor = vec4((vec3(tritanopia(texel.rgb))), 1.0);
  }else if(grey_scale == 2) {
    gl_FragColor = vec4((vec3(protanopia(texel.rgb))), 1.0);
  }else{
    gl_FragColor = texel;
  }
  
}