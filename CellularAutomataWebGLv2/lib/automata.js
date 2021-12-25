function get_automata ( shader_manager ) 
{
    let automata = new Map ();
    automata.set('rps', new RockPaperScissors ());
    automata.set('game_of_life', new GameOfLife ());
    automata.set('life_like', new LifeLike ());
    automata.set('brians_brain', new BriansBrain ());
    return automata;
}

class Automaton
{
    constructor ( name, states )
    {
        this.name = name;
        this.states = states;
        this.params = new Map ();
    }
    
    //Should return a mapping of parameter names and expected types
    //(for displaying the options)
    get_parameters ()
    {
        return this.params;
    }

    //Should return the full shader text to compile as fragment shader
    get_shader ()
    {
        throw "get_shader not implemented";
    }

    //Return array of colours used to store states on the texture
    get_states ()
    {
        throw "get_states not implemented";
    }

    //Return colour to fill whole texture at start of random
    get_random_fill ()
    {
        return this.get_states() [ 0 ];
    }

    //Return a list of colours that can be used as random values
    get_random_palette ()
    {
        return this.get_states ();
    }

    //Mapping of names -> colours for pen selection
    get_pen_options ()
    {
        throw "get_pen_options not implemented";
    }

    //Default pen key to use
    get_default_pen_option ()
    {
        throw "get_default_pen_option not implemented";
    }
}

class AutomatonParamInt
{
    constructor ( min, max, default_value )
    {
        this.min = min;
        this.max = max;
        this.set ( default_value );
    }

    set ( val )
    {
        val = Math.floor ( val );
        val = Math.max ( this.min, Math.min ( val, this.max ) );
        this.val = val;
    }
}

/**
 * A parameter that is a set of ints.  The domain of the set is subject
 * to change so a function is used and invalid entries are cleared.
 * E.g. if the neighbourhood changes the valid values will change
 */
class AutomatonParamIntSet
{
    constructor ( domain_cb, default_set )
    {
        this.set = new Set();
        this.domain_cb = domain_cb;
        default_set.forEach ( v => this.add ( v ) );
    }

    add ( val )
    {
        let d = this.domain ();
        if ( !d.has ( val ) )
            return;
        this.set.add ( val );
    }

    delete ( val )
    {
        this.set.delete ( val );
    }

    has ( val )
    {
        let d = this.domain ();
        return d.has(val) && this.set.has ( val );
    }

    domain ()
    {
        let d = this.domain_cb ();

        let union = new Set ();

        for ( const v of this.set )
            if ( d.has ( v ) )
                union.add ( v );

        this.set = union;

        return this.domain_cb ();
    }

    max ()
    {
        return Math.max ( ...this.domain () );
    }
}

class GameOfLife extends Automaton
{
    constructor ()
    {
        super ( "Conway's Game of Life" );
    }
    get_states ()
    {
        return [ 0x000000, 0xFF0000 ];
    }
    get_shader ()
    {
        return shader_manager.get_shader ( "game_of_life.frag" );
    }
    get_pen_options ()
    {
        let o = new Map ();
        o.set ( "Live", 0xFF0000 );
        o.set ( "Dead", 0x000000 );
        return o;
    }

    get_default_pen_option ()
    {
        return "Live";
    }
}

class LifeLike extends Automaton
{
    constructor ()
    {
        super ( "Life-Like" );
        let n_size = new AutomatonParamInt ( 1, 5, 1 );
        this.params.set ( "Neighbourhood Size", n_size );
        let moore_domain = () =>
        {
            let n = Math.pow (n_size.val * 2 + 1, 2 );
            let d = new Set ();
            for ( let i = 0; i<n; i++ )
                d.add (i);
            return d;
        };
        this.params.set ( "Birth", 
            new AutomatonParamIntSet ( moore_domain,  [ 3 ] ) );
        this.params.set ( "Survive", 
            new AutomatonParamIntSet ( moore_domain, [ 2, 3 ] ) );
    }
    get_states ()
    {
        return [ 0x000000, 0xFF0000 ];
    }

    get_shader ()
    {
        let shader_options =
        {
            num_states : 2,
            params : this.params,
        };

        return shader_manager.get_shader ( shader_options );
    }
    get_pen_options ()
    {
        let o = new Map ();
        o.set ( "Live", 0xFF0000 );
        o.set ( "Dead", 0x000000 );
        return o;
    }

    get_default_pen_option ()
    {
        return "Live";
    }
}

class BriansBrain extends Automaton
{
    constructor ()
    {
        super ( "Brian's Brain" );
    }
    get_states ()
    {
        return [ 0x000000, 0xFFFFFF, 0x0000FF ];
    }
    get_shader ()
    {
        return shader_manager.get_shader ( "brians_brain.frag" );
    }
    get_pen_options ()
    {
        let o = new Map ();
        o.set ( "Live", 0xFFFFFF );
        o.set ( "Dead", 0x000000 );
        return o;
    }

    get_default_pen_option ()
    {
        return "Live";
    }
}

class RockPaperScissors extends Automaton
{
    constructor ()
    {
        super ( "Rock Paper Scissors" );
    }
    get_states ()
    {
        return [ 0xFF0000, 0x00FF00, 0x0000FF, 0x000000 ];
    }
    get_shader ()
    {
        return shader_manager.get_shader ( "rps.frag" );
    }

    get_random_palette ()
    {
        return this.get_states().slice ( 0, -1 );
    }

    get_pen_options ()
    {
        let o = new Map ();
        o.set ( "Red", 0xFF0000 );
        o.set ( "Green", 0x00FF00 );
        o.set ( "Blue", 0x0000FF );
        o.set ( "Black", 0x000000 );
        return o;
    }

    get_default_pen_option ()
    {
        return "Red";
    }
}
