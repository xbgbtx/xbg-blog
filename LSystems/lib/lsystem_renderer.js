( function ( lsystem )
{
    lsystem.Renderer = class
    {
        constructor ({ dctx_create, dctx_destroy })
        {
            this._dctx_create = dctx_create;
            this._dctx_destroy = dctx_destroy;
            this._dctx_pointers = [];
        }

        get_dctx_pointers ()
        {
            return this._dctx_pointers;
        }

        tear_down ()
        {
            for ( const d of this._dctx_pointers )
            {
                this._dctx_destroy (d);
            }

            this._dctx_pointers = [];
        }

        _construct_dctx ( n )
        {
            for ( let i=0; i<n; i++ )
            {
                let d = this._dctx_create ();
                this._dctx_pointers.push ( d );
            }
        }

        display ( start, rewrite, process_cb, gen_draw_set, succ_transform )
        {
            this.tear_down ();
            this._construct_dctx ( gen_draw_set.size );
            let max_gen = Math.max ( ...Array.from(gen_draw_set));

            //last string generated
            let s = start;

            //index of next draw context to use
            let draw_idx = 0;

            for ( let i=0; i<max_gen; i++ )
            {
                let g = i+1;

                if ( gen_draw_set.has ( g ) )
                {
                    let d = this._dctx_pointers [ draw_idx ];

                    if ( draw_idx > 0 )
                        succ_transform ( d, i );

                    draw_idx += 1;
                    process_cb ( d, s );
                }

                if ( g < max_gen )
                    s = rewrite ( s );
            }
        }
    }
}( window.lsystem = window.lsystem || {} ))

