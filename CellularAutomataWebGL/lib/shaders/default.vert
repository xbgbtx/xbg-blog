#version 300 es

precision highp float;    

//this here binds the attribute location... u can still do 
//it like normal via gl.bindAttribLocation() but this also works
layout(location = 0) in vec3 aColor; 
layout(location = 1) in vec2 aVertexPosition;

//these below work too
//in vec2 aVertexPosition; 
//in vec3 aColor;

uniform vec4 inputSize;
uniform vec4 outputFrame;

out vec2 vTextureCoord;

uniform mat3 translationMatrix;
uniform mat3 projectionMatrix;

out vec3 vColor;

void main() {

   vColor = aColor;
   gl_Position = vec4((projectionMatrix * translationMatrix * 
                       vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

   vTextureCoord = aVertexPosition * 
                           ( outputFrame.zw * inputSize.zw );
}
