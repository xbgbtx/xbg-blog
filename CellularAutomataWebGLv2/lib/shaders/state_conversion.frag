
uniform int state_colors [ 12 ];

vec4 color_to_sVec ( vec4 c )
{
   int cInt [ 3 ];
   cInt [ 0 ] = int ( c.r * 255.0 );
   cInt [ 1 ] = int ( c.r * 255.0 );
   cInt [ 2 ] = int ( c.r * 255.0 );

   vec4 sVec = vec4 ( 0.0, 0.0, 0.0, 1.0 );

   for ( int i = 0; i < 4; i++ )
   {
      if ( cInt [ 0 ] == state_colors [ i * 3     ] &&
           cInt [ 1 ] == state_colors [ i * 3 + 1 ] &&
           cInt [ 2 ] == state_colors [ i * 3 + 2 ] )
      {
         sVec.r = 1.0 * float ( i );
      }
   }

   return sVec;
}

int sVec_to_sInt ( vec4 s )
{
   return int ( s.r * 4.0 );
}

vec4 sInt_to_sVec ( int s )
{
   return vec4 ( (1.0/4.0) * float ( s ), 0, 0, 1.0 );
}

vec4 sVec_to_color ( vec4 sVec )
{
   int sInt = sVec_to_sInt ( sVec );
   int idx = sInt * 3;
   return vec4 ( float ( state_colors [ idx ] ) / 255.0,
                 float ( state_colors [ idx + 1 ] ) / 255.0,
                 float ( state_colors [ idx + 2 ] ) / 255.0,
                 1.0 );
}

