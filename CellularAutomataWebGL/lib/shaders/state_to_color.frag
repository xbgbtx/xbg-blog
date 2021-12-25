!include pixi_header.frag
!include state_conversion.frag

void main()
{
   vec4 c0 = texture ( uSampler, vTextureCoord );

   vColor = sVec_to_color ( c0 );
}
