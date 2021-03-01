function randomize_button_click ()
{
    ca_system.randomize ();
}

function canvas_mouse ( x, y )
{
    ca_system.mouse_down ( x, y );
}

function pen_select ()
{
    let el = document.getElementById ( "pen_select" );

    ca_system.set_pen_color ( el.value );
}

function set_pen_options ( opt_mapping )
{
    let el = document.getElementById ( "pen_select" );

    el.options.length = 0;

    for ( const o of opt_mapping.keys () )
    {
        let option = document.createElement('option');
        option.text = o;
        el.add ( option );
    }
}

function pen_size_slider_move ()
{
    let el = document.getElementById ( "pen_size_slider" );

    ca_system.set_pen_size ( el.value );
}

function automata_select ()
{
    let el = document.getElementById ( "automata_select" );

    ca_system.set_automaton ( el.value );
}

