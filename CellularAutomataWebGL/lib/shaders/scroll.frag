varying vec2 vTextureCoord;

uniform sampler2D uSampler;

void main()
{
   float px = 1.0/512.0;

   vec2 c = vec2 ( vTextureCoord.x, //vTextureCoord.y + px );
                   mod ( vTextureCoord.y + px, 1.0 ) );
   
   gl_FragColor = texture2D ( uSampler, c );
}
