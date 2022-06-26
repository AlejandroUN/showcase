precision mediump float;

// the texture coordinates varying was defined in 
// the vertex shader by treegl readShader()
// open your console and & see!
varying vec2 texcoords2;

uniform bool checkbox;

void main() {
  // glsl swizzling is both handy and elegant
  // see: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Swizzling
  
    // gl_FragColor = checkbox ? vec4(1.0, 0.0, 1.0, 1.0) : vec4(0.0, 1.0, 1.0, 1.0);
    gl_FragColor = checkbox ? vec4(texcoords2.x, 0.0, texcoords2.y, 1.0) : vec4(0.0, texcoords2.xy, 1.0);
  
  
}