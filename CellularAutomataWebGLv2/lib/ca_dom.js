function init_dom ()
{
    hide_ui_menu ();
}

const ui_form_values = 
{
    automaton_menu : 
    {
        sim_width : () => ca_system.sim_size.width,
        sim_height : () => ca_system.sim_size.height
    },
    pen_menu :
    {
        pen_size : () => ca_system.pen_size
    }
}

function ui_option_click ( option_id )
{
    switch ( option_id )
    {
        case "randomize" :
            ca_system.randomize ();
            break;

        case "pen" :
            show_pen_menu ();
            break;

        case "automaton" :
            show_automata_menu ();
            break;
    }
}

function show_ui_menu ( menu_id, title, content )
{
    let ui_menu = document.getElementById ( "ui_menu" );
    let ui_menu_content = document.getElementById ( "ui_menu_content" );
    let ui_menu_title = document.getElementById ( "ui_menu_title" );

    if ( ui_menu == null )
        throw "Can't find ui_menu.";

    ui_menu_title.textContent = title;
    ui_menu_content.innerHTML = "";
    ui_menu_content.appendChild ( content );
    ui_menu.style.visibility = 'visible';

    set_ui_menu_form_values ( menu_id );
}

function show_automata_menu ()
{
    show_ui_menu ( "automaton_menu", "Automaton Options", 
                   clone_template ( "automaton_menu_template" ) );

    populate_select_options ( "automaton_select", 
        Object.values(ca_system.automata).map (  a => ({
            text : a.name,
            value : a.name
        })));

    let a_select = document.getElementById ( "automaton_select" );
    a_select.value = ca_system.automaton.name;
}

function show_pen_menu ()
{
    show_ui_menu ( "pen_menu", "Pen Options", 
                   clone_template ( "pen_menu_template" ) );

    let pen_opt_keys = Array.from ( 
        ca_system.automaton.get_pen_options ().keys () );

    populate_select_options ( "pen_mode_select",
        pen_opt_keys.map ( k => ({
            text : k,
            value : k
        }) ));

    let p_select = document.getElementById ( "pen_mode_select" );
    p_select.value = ca_system.pen_key;
    p_select.onchange = () => ca_system.set_pen_mode ( p_select.value );

    let size_slider = document.getElementById ( "pen_size" );
    size_slider.onchange = () => ca_system.set_pen_size ( size_slider.value );

}

function hide_ui_menu ()
{
    let ui_menu = document.getElementById ( "ui_menu" );
    if ( ui_menu == null )
        throw "Can't find ui_menu.";

    ui_menu.style.visibility = 'hidden';
}


function clone_template ( name )
{
    let temp = document.getElementById ( name );
    let clone = temp.content.cloneNode ( true );
    return clone;
}

function set_ui_menu_form_values ( menu_id )
{
    let form_values = ui_form_values [ menu_id ];

    if ( form_values == null )
        return;

    let ui_menu = document.getElementById ( "ui_menu_content" );

    let els = ui_menu.getElementsByTagName ( "input" );
    let inputs = Object.keys(els).map ( k => els[k] );

    for ( const i of inputs )
    {
        if ( form_values [ i.name ] != null )
            i.value = form_values [ i.name ] ();
    }
}

function parse_ui_menu_form ()
{
    let ui_menu = document.getElementById ( "ui_menu_content" );

    let els = ui_menu.querySelectorAll ( "input,select" );
    let inputs = Object.keys(els).map ( k => els[k] );

    let input_values = inputs.reduce ( ( obj, x ) =>
    {
        obj [ x.name ] = x.value;
        return obj;
    }, {});

    return input_values;
}

function submit_automaton_menu ()
{
    console.log ( "submit_automaton_menu" );

    let input_values = parse_ui_menu_form ();

    let a = input_values [ "automaton_select" ];

    let w = parseInt ( input_values.sim_width );
    let h = parseInt ( input_values.sim_height );
    
    let clamp = ( x ) => Math.max ( 64, Math.min ( x, 1024 ) );

    ca_system.set_automaton ( a, clamp ( w ), clamp ( h ) );
}

function populate_select_options ( select_id, options ) 
{
    let select_el = document.getElementById ( select_id );

    for ( const o of options ) 
    {
        let option = document.createElement('option');
        option.text = o.text;
        option.value = o.value;
        select_el.add ( option );
    }
}

function canvas_mouse ( x, y )
{
    ca_system.mouse_down ( x, y );
}

