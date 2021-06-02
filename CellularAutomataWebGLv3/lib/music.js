const fftSize = Math.pow ( 2, 15 );

let mic_enabled = false;
let audioCtx, analyser, audio_data;

let audio_grid_w = 4;
let audio_grid_h = 4;

async function enable_microphone ()
{
    console.log ( "Enable Microphone" );

    if ( mic_enabled ) 
    {
        window.cancelAnimationFrame ( process_audio );
    }

    let c = {
        video : false,
        audio : true
    };

    audioCtx = new AudioContext ();
    let stream = await navigator.mediaDevices.getUserMedia ( c );

    let mic = audioCtx.createMediaStreamSource ( stream );


    analyser = audioCtx.createAnalyser ();
    analyser.fftSize = fftSize;
    mic.connect ( analyser );

    audio_data = new Uint8Array ( analyser.frequencyBinCount );

    window.requestAnimationFrame ( process_audio );
    mic_enabled = true;
}


function process_audio ()
{
    if ( !mic_enabled )
        return;

    analyser.getByteFrequencyData ( audio_data );

    let r_size = audio_grid_w * audio_grid_h;
    let r_data = reduce_audio_data ( r_size, 0, audio_data.length / 2 );

    render_reduced_data ( r_data );

    window.requestAnimationFrame ( process_audio );
}

function reduce_audio_data ( output_size, data_start, data_end )
{
    let output = [];

    let span = Math.min ( data_end - data_start, 1 );

    for ( let i = 0; i<output_size; i++ )
    {
        let x = 0;
        let b0 = span * i;
        let b1 = b0 + span;

        for ( let j = b0; j < b1; j++ )
            x += Math.max ( audio_data [ b0 + j ], 0 );

        output.push ( ( x / span ) / 255 );
    }

    return output;
}

function render_reduced_data ( r_data )
{
    let cell_w = ca_system.sim_size.width / audio_grid_w;
    let cell_h = ca_system.sim_size.height / audio_grid_h;

    let palette = ca_system.automaton.get_random_palette ();

    let c_idx =  Math.floor ( Math.random () * palette.length );
    let pen_col = palette [ c_idx ];

    for ( let i = 0; i < audio_grid_h; i++ )
    {
        let y = cell_h * i + cell_h/2;

        for ( let j = 0; j < audio_grid_w; j++ )
        {
            let x = cell_w * j + cell_w/2;
            let audio_idx = i * audio_grid_w + j;
            let f = r_data [ audio_idx ];
            let rad = Math.min ( cell_w, cell_h ) * f * 2;

            ca_system.renderer.draw ( x, y, pen_col, rad );
        }
    }
}
