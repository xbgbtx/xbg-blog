const w = 800;
const h = 800;

let ca_system;
let shader_manager;

async function page_loaded () 
{
    console.log ( "Cellular Automata starting..." );

    shader_manager = new ShaderManager ();

    await shader_manager.fetch_shaders ();

    let renderer = new CAPixi ( w, h );

    let automata = get_automata ( shader_manager );
    ca_system = new CASystem ( renderer, automata );

    ca_system.set_automaton ( "game_of_life" );

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

    set_automaton ( a )
    {
        this.automaton = this.automata [ a ];
        this.renderer.set_automaton ( this.automaton );
        this.renderer.randomize ();
        this.set_pen_color ( this.automaton.get_default_pen_option () );
        set_pen_options ( this.automaton.get_pen_options () );
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

    set_pen_color ( pen_option_key )
    {
        this.pen_color = this.automaton.get_pen_options ()
            .get ( pen_option_key );
    }
}

