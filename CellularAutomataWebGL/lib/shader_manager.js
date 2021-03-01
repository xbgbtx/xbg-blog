class ShaderManager
{
    constructor ()
    {
        this.shader_files = [  
            "rps.frag",
            "game_of_life.frag",
            "brians_brain.frag",
        ]; 

        this.shader_file_text = new Map ();
        this.parsed_shaders = new Map ();

    }

    async fetch_shaders ()
    {
        for ( const s of this.shader_files )
        {
            const response = await fetch ( `lib/shaders/${s}` );
            const text = await response.text ();
            this.shader_file_text.set ( s, text );
        }

        for ( const [ fname, text ] of this.shader_file_text.entries () )
        {
            let lines = text.split ( "\n" );
            let parsed_text = "";

            for ( const l of lines )
            {
                parsed_text += this.parse_line ( l );
            }

            this.parsed_shaders.set ( fname, parsed_text );
        }
    }

    parse_line ( l )
    {
        let include = /^!include +(\S+)/
        let r = l.match ( include );

        if ( r !== null )
        {
            let include_fname = r [ 1 ];

            if ( this.shader_file_text.has ( include_fname ) )
            {
                return this.shader_file_text.get ( include_fname );
            }
            else
            {
                throw ( `Bad shader include ${include_fname}` );
                return "";
            }
        }
        return `${l}\n`;
    }

    get_shader ( s )
    {
        let text = this.parsed_shaders.get ( s );

        if ( s !== null && text === undefined )
            throw ( `No shader ${s}` );

        return text;
    }
}
