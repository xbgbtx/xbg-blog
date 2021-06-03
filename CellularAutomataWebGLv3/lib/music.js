const fftSize = Math.pow ( 2, 15 );

let mic_enabled = false;
let audioCtx, analyser, audio_data;

const f_buffer_len = 13;
let freq_buffer;

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
    freq_buffer = [];

    for ( let i = 0; i < f_buffer_len; i++ )
        freq_buffer.push ( 0 );

    window.requestAnimationFrame ( process_audio );
    mic_enabled = true;
}


function process_audio ()
{
    if ( !mic_enabled )
        return;

    analyser.getByteFrequencyData ( audio_data );

    update_freq_buffer ( 0, audio_data.length  );

    render_freq_buffer ();

    window.requestAnimationFrame ( process_audio );
}

function update_freq_buffer ( data_start, data_end )
{
    freq_buffer = freq_buffer.map ( x => x * 0.6 );

    let span = Math.min ( data_end - data_start, 1 );

    for ( let i = 0; i<freq_buffer.length; i++ )
    {
        let x = 0;
        let b0 = span * i;
        let b1 = b0 + span;

        for ( let j = b0; j < b1; j++ )
            x += Math.max ( audio_data [ b0 + j ], 0 );

        let f = ( x / span ) / 255;

        freq_buffer [i] = Math.min ( 2, freq_buffer [i] + f );
    }
}

function render_freq_buffer ()
{
    let w = ca_system.sim_size.width;
    let h = ca_system.sim_size.height;

    let t_m = 15000;
    let t = Math.floor ( performance.now () % t_m ) / t_m;

    let origin = {
        x : w / 2 + ( w/2 * Math.sin ( Math.PI * 3 * t ) ),
        y : h / 2 + ( h/2 * Math.sin ( Math.PI * 7 * t ) )
    }

    let dist = Math.sqrt ( w*w + h*h ) / 2;

    let palette = ca_system.automaton.get_random_palette ();
    let p_idx =  Math.floor ( Math.random () * palette.length );
    let pen_col = palette [ p_idx ];



    for ( let i = 0; i < freq_buffer.length; i++ )
    {
        let f = freq_buffer[i];
        let n = i / freq_buffer.length;
        let a = Math.PI * 2 * n;
        let h = dist * n * f;

        let x = origin.x + ( h * Math.cos ( Math.PI * n * t * 19 ) );
        let y = origin.y + ( h * Math.sin ( Math.PI * n * t * 13 ) );

        let r_sin = Math.abs ( Math.sin ( Math.PI * 7 * t ) ) + 0.25;
        let rad = dist * (1-n) * f * r_sin;

        ca_system.renderer.draw ( x, y, pen_col, rad );
    }
}
