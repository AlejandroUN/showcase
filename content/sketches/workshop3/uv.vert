/*
Vertex shader code to be coupled with uv.frag 
Generated with treegl version 0.1.2
*/
precision mediump float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 texcoords2;
void main() {
  texcoords2 = aTexCoord;
  gl_Position = vec4(aPosition, 1.0);
}