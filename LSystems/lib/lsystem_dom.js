( function ( lsystem_dom )
{
    lsystem_dom.ui_button_click = function ( id )
    {
        switch ( id )
        {
            case "ui_menu_close" :
                hide_ui_menu ();
                break;

            case "lsystem" :
                lsystem_dom.show_lsystem_menu ();
                break;

            case "render_preset" :
                render_preset ();
                break;

            default:
                console.error ( `Unknown ui_option_click: ${id}` );
                break;
        }
    }


    let show_ui_menu = function ( menu_id, title, content )
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

        //set_ui_menu_form_values ( menu_id );
    }

    function hide_ui_menu ()
    {
        let ui_menu = document.getElementById ( "ui_menu" );
        if ( ui_menu == null )
            throw "Can't find ui_menu.";

        ui_menu.style.visibility = 'hidden';

        let ui_menu_content = document.getElementById ( "ui_menu_content" );
        ui_menu_content.innerHTML = "";
    }

    let clone_template = function ( template_id )
    {
        let temp = document.getElementById ( template_id );
        let clone = temp.content.cloneNode ( true );
        return clone.firstElementChild;
    }

    lsystem_dom.show_lsystem_menu = function ( preset_name )
    {
        let content = clone_template ( "lsystem_menu_template" );
        show_ui_menu ( "lsystem_menu", "L-System", content );

        let preset_select = document.getElementById ( "select_presets" );
        preset_select.value = preset_name;
    }

    let render_preset = function ()
    {
        let preset_select = document.getElementById ( "select_presets" );
        let r_data = lsystem.get_preset ( preset_select.value );
        lsystem_app.display_lsystem ( r_data );
    }

}( window.lsystem_dom = window.lsystem_dom || {} ))

