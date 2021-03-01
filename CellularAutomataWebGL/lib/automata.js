class Automaton
{
    constructor ( name, shader_file, states )
    {
        this.name = name;
        this.shader_file = shader_file;
        this.states = states;
    }

    get_shader ()
    {
        return shader_manager.get_shader ( this.shader_file );
    }

    get_random_fill ()
    {
        return this.states [ 0 ];
    }

    get_random_palette ()
    {
        return this.states;
    }

    get_pen_options ()
    {
        throw "get_pen_options not implemented";
    }

    get_default_pen_option ()
    {
        throw "get_default_pen_option not implemented";
    }
}

function get_automata ( shader_manager ) 
{
    return {
        rps : new RockPaperScissors (),
        game_of_life : new GameOfLife (),
        brians_brain : new BriansBrain (),
    }
}

class GameOfLife extends Automaton
{
    constructor ()
    {
        super ( "game_of_life", "game_of_life.frag", 
            [ 0x000000, 0xFF0000 ] );
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
        super ( "brians_brain", "brians_brain.frag", 
            [ 0x000000, 0xFFFFFF, 0x0000FF ] );
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
        super ( "rps", "rps.frag", 
            [ 0x000000, 0xFF0000, 0x00FF00, 0x0000FF ] );
    }

    get_random_fill ()
    {
        return this.states [ 1 ];
    }

    get_random_palette ()
    {
        return this.states.slice ( 1 );
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
