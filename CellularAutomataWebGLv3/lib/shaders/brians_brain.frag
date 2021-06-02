varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform int width, height;

void main()
{
   vec4 c0 = texture2D ( uSampler, vTextureCoord );

   float px = 1.0/float ( width );
   float py = 1.0/float ( height );

   bool ready = int(c0.b)==0;
   bool firing = int(c0.r)==1;

   int count = 0;

   for ( int i = -1; i <= 1; i++ )
   {
      for ( int j = -1; j <= 1; j++ )
      {
         float offx = px * float (i);
         float offy = py * float (j);
         float nx = mod ( vTextureCoord.x + offx, 1.0 );
         float ny = mod ( vTextureCoord.y + offy, 1.0 );

         count += int ( texture2D ( uSampler, vec2 ( nx, ny ) ).r );
      }
   }

   if ( firing )
   {
      gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
      return;
   }

   if ( ready && count ==  2)
   {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      return;
   }

   gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}


