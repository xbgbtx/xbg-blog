varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D iSampler;


void main()
{
   vec4 c0 = texture2D ( uSampler, vTextureCoord );

   gl_FragColor = c0;
}

