!include pixi_header.frag



void main()
{
   vec4 c0 = texture ( uSampler, vTextureCoord );

   //gl_FragColor = color_to_sVec ( c0 );
   //vColor = c0;

   fragColor = vec4 ( 1.0, 1.0, 1.0, 1.0 );
}
