( function ( lsystem )
{
    lsystem.rewrite = function ( s, grammar )
    {
        let out = "";

        for ( const c of s )
        {
            if ( grammar.has ( c ) )
                out += grammar.get ( c );
            else
                out += c;
        }

        return out;
    };

    lsystem.process = function ( s, callback )
    {
        for ( const c of s )
        {
            callback ( c );
        }
    }

    lsystem.Grammar = class
    {
        constructor ()
        {
            this._grammar = new Map ();
        }

        set ( key, val )
        {
            this._grammar.set ( key, val );
        }

        get ( key )
        {
            return this._grammar.get ( key );
        }

        has ( key )
        {
            return this._grammar.has ( key );
        }
    }
}( window.lsystem = window.lsystem || {} ))

