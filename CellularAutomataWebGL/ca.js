const w = 512;
const h = 512;


let shader_files = [ "rps.frag", "scroll.frag" ]
let shaders;
let graphics;
let ca_pixi;
let pen_color = 0xFF0000;

async function page_loaded () 
{
    console.log ( "Cellular Automata starting..." );

    shaders = new Map ();

    for ( const s of shader_files )
    {
        const response = await fetch ( `shaders/${s}` );
        const text = await response.text ();
        shaders.set ( s, text );
    }

    ca_pixi = new CAPixi ();

    graphics = new PIXI.Graphics ();

    ca_pixi.set_active_shader ( shaders.get("rps.frag") );
}

function randomize_button_click ()
{
    let r_i = ( n ) =>  Math.floor ( Math.random () * n );
    let r_col = () => [ 0x00FF00, 0xFF0000, 0x0000FF ] [ r_i (3) ];

    graphics.clear ();

    graphics
        .beginFill ( 0x00FF00, 1 )
        .drawRect ( 0, 0, w, h );

    let n = r_i(50)+1;
    for ( let i=0; i<n; i++ )
    {
        let s = w/4;
        graphics
            .beginFill ( r_col(), 1 )
            .drawRect ( r_i(s), r_i(s), r_i(s), r_i(s) )
            .drawCircle ( r_i(s), r_i(s), r_i(s) );
    }

    ca_pixi.draw_queue.push ( graphics );
}

function canvas_mouse ( mouse )
{
    let r_i = ( n ) =>  Math.floor ( Math.random () * n );
    let r_col = () => [ 0x00FF00, 0xFF0000, 0x0000FF ] [ r_i (3) ];

    let grid_x = Math.floor ( mouse.global.x );
    let grid_y = Math.floor ( mouse.global.y );

    graphics
        .clear ()
        //.beginFill ( r_col(), 1 )
        .beginFill ( pen_color, 1 )
        .drawCircle ( grid_x, grid_y, 10 );

    ca_pixi.draw_queue.push ( graphics );
}

function pen_select ()
{
    let el = document.getElementById ( "pen_select" );

    switch ( el.value )
    {
        case "red" : pen_color = 0xFF0000;break;
        case "blue" : pen_color = 0x0000FF;break;
        case "green" : pen_color = 0x00FF00;break;
        case "black" : pen_color = 0x000000;break;
    }
}
