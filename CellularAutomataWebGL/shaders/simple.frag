varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main()
{
   gl_FragColor = vec4(vTextureCoord.x,vTextureCoord.y,0.0,1.0);
}
