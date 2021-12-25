//Pointer to object contanining app execution data.
let lsystem_app;

//Called when the page is lletoaded
async function page_loaded () 
{
    console.log ( "L-Systems starting..." );

    pixi_app.start ();
    let viewport = pixi_app.create_viewport ();
    
    let draw_ctx_actions = get_draw_ctx_actions ( viewport );

    lsystem_app = new lsystem.LSystemApp ( draw_ctx_actions );

    let start_preset = "dragon"
    lsystem_app.display_lsystem ( lsystem.get_preset ( start_preset) );
    lsystem_dom.show_lsystem_menu ( start_preset);
}

//Function pointers to create and destroy the 'drawing context' that
//is used to render L-Systems.  L Systems rendering uses this drawing
//context code so that the rendering library can potentially be swapped.
function get_draw_ctx_actions ( viewport )
{
    let ctx_actions = {
        dctx_create : () =>
        {
            let ctx = new pixi_draw.DrawingContext ();
            viewport.addChild ( ctx.get_pixi_graphics () );
            return ctx;
        },

        dctx_destroy : ( ctx ) =>
        {
            let g = ctx.get_pixi_graphics ();
            viewport.removeChild ( g );
            ctx.destroy_pixi_graphics (); 
        }
    };

    return ctx_actions;
}

function ui_button_click ( button_id )
{
    lsystem_dom.ui_button_click ( button_id );
}


