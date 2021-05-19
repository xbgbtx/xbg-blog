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
        Array.from(ca_system.automata.entries()).map (  
            k => ({
                text : k[1].name,
                value : k[0]
            })));

    let param_elements = null;

    let a_select = document.getElementById ( "automaton_select" );
    a_select.onchange = 
        () => param_elements = display_automaton_params ( a_select.value );
    a_select.value = ca_system.automaton_key;
    a_select.dispatchEvent ( new Event ( 'change' ) );

    let apply_button = document.getElementById ( "automaton_apply_button" );
    apply_button.onclick = () => 
    {
        apply_cbs = [];

        if ( param_elements != null )
            apply_cbs = param_elements.apply_cbs;

        submit_automaton_menu ( apply_cbs );
        show_automata_menu ();
    };
}

function display_automaton_params ( a )
{
    let params = ca_system.automata.get ( a ).get_parameters ();
    let param_div = document.getElementById ( "automaton_params" );

    if ( params == null || params.size == 0 ) {
        param_div.innerHTML = "";
        return;
    }
    
    let params_fs = document.createElement ( "fieldset" );
    let params_leg = document.createElement ( "legend" );
    params_leg.textContent = "Parameters";
    params_fs.appendChild ( params_leg );

    param_elements = create_automata_params_elements ( params );

    for ( const e of param_elements.els )
        params_fs.appendChild ( e );

    let rand_button = document.createElement ( "button" );
    rand_button.type = "button";
    rand_button.textContent = "Randomize Parameters"

    rand_button.onclick = () => 
    {
        for ( const cb of param_elements.randomize_cbs )
            cb ( param_elements.randomize_cbs.length );
    }

    params_fs.appendChild ( rand_button );

    param_div.appendChild ( params_fs );

    return param_elements;
}

function create_automata_params_elements ( params )
{
    let param_elements = 
    {
        els : [],
        apply_cbs : [],
        randomize_cbs : []
    };

    for ( const [ p_name, p_value ] of params ) 
    {
        if ( p_value instanceof AutomatonParamInt )
        {
            let label = document.createElement ( "label" );
            label.textContent = `${p_name}:`;

            let input = document.createElement ( "input" );
            input.name = `auto_param_${p_name}`;
            input.id = input.name;
            input.type = "number";
            input.min = p_value.min;
            input.max = p_value.max;
            input.value = p_value.val;
            input.step = 1;

            label.htmlFor = input.name;

            param_elements.els.push ( label );
            param_elements.els.push ( input );

            let input_apply = () => p_value.set ( input.value );
            param_elements.apply_cbs.push ( input_apply );
        }
        if ( p_value instanceof AutomatonParamIntSet ) 
        {
            let fieldset = document.createElement ( "fieldset" );
            let legend = document.createElement ( "legend" );
            legend.textContent = p_name;
            fieldset.appendChild ( legend );

            for ( const val of p_value.domain () ) 
            {
                let label = document.createElement ( "label" );
                label.textContent = `${val}:`;
                fieldset.appendChild ( label );

                let checkbox = document.createElement ( "input" );
                checkbox.type = "checkbox";
                checkbox.name = `auto_param_${p_name}_${val}`;
                checkbox.id = checkbox.name;
                checkbox.checked = p_value.has ( val );

                let checkbox_apply = () =>
                {
                    if ( checkbox.checked )
                        p_value.add ( val );
                    else
                        p_value.delete ( val );
                };

                let checkbox_randomize = ( num_boxes ) =>
                {
                    let check = ( Math.random () < (2/num_boxes) );
                    checkbox.checked = check;
                };

                param_elements.randomize_cbs.push ( checkbox_randomize );

                param_elements.apply_cbs.push ( checkbox_apply );

                fieldset.appendChild ( checkbox );

                label.htmlFor=checkbox.id;
            }

            param_elements.els.push ( fieldset );
        }
    }

    return param_elements;
}

function submit_automaton_menu ( param_cbs )
{
    console.log ( "submit_automaton_menu" );

    let input_values = parse_ui_menu_form ();

    let a = input_values [ "automaton_select" ];

    for ( const p_cb  of param_cbs )
        p_cb ();

    let w = parseInt ( input_values.sim_width );
    let h = parseInt ( input_values.sim_height );
    
    let clamp = ( x ) => Math.max ( 64, Math.min ( x, 1024 ) );

    ca_system.set_automaton ( a, clamp ( w ), clamp ( h ) );
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

