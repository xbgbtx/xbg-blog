let ca_system;
let shader_manager;

async function page_loaded () 
{
    console.log ( "Cellular Automata starting..." );

    init_dom ();

    shader_manager = new ShaderManager ();

    await shader_manager.fetch_shaders ();

    let renderer = new CAPixi ();

    let automata = get_automata ( shader_manager );
    ca_system = new CASystem ( renderer, automata );

    //ca_system.set_automaton ( "brians_brain", 256, 256 );
    //ca_system.set_automaton ( "rps", 256, 256 );
    ca_system.set_automaton ( "game_of_life", 256, 256 );

}

class CASystem
{
    constructor ( renderer, automata )
    {
        this.automata = automata ;
        this.renderer = renderer;
        this.pen_color = 0xFF0000;
        this.pen_size = 10;

        this.automaton = undefined;
    }

    set_automaton ( a, width, height )
    {
        this.automaton = this.automata [ a ];
        this.sim_size = { width, height };
        this.renderer.set_automaton ( this.automaton, width, height );
        this.set_pen_mode ( this.automaton.get_default_pen_option () );
    }

    resize_automaton ( width, height )
    {
        this.sim_size = { width, height };
        this.renderer.set_automaton ( this.automaton, width, height );
    }

    randomize ()
    {
        this.renderer.randomize ();
    }

    mouse_down ( x, y )
    {
        this.renderer.draw ( x, y, this.pen_color, this.pen_size );
    }

    set_pen_size ( s )
    {
        this.pen_size = s;
    }

    set_pen_mode ( pen_option_key )
    {
        this.pen_key = pen_option_key;
        this.pen_color = this.automaton.get_pen_options ()
            .get ( pen_option_key );
    }
}

