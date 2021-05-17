class CAPixi
{
    constructor ()
    {
        this.create_pixi_app ( canvas_div );
        this.create_display_sprite ();
        this.create_sim ()
        this.create_input_sprite ();

        this.graphics = new PIXI.Graphics ();

        this.automaton = undefined;
        this.input_queue = [];

        this.drawing = false;

        this.pixi_app.ticker.add ( () => this.update () );

        this.pixi_app.renderer.on ( "resize", ( w, h ) =>
        {
            this.center_display_sprite ();
        });
    }

    create_pixi_app () 
    {
        let canvas_div = document.getElementById ( "canvas_div" );
        let canvas = document.getElementById ( "pixi_canvas" );
        let type="WebGL";

        if ( !PIXI.utils.isWebGLSupported () )
        {
            type = "canvas";
        }

        PIXI.utils.sayHello ( type );

        this.pixi_app = new PIXI.Application ({ 
            view:  canvas,
            resizeTo: canvas_div 
        });

        PIXI.settings.RESOLUTION = window.devicePixelRatio;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    }

    create_display_sprite ()
    {
        this.display_sprite = PIXI.Sprite.from ( this.create_render_texture () );

        this.display_sprite.interactive = true;
        this.display_sprite
            .on ( 'pointerdown', () => this.drawing = true )
            .on ( 'pointerup', () => this.drawing = false )
            .on ( 'pointermove', ( e ) => 
            {
                let local = this.display_sprite.toLocal ( e.data.global );
                if ( this.drawing )
                    canvas_mouse ( local.x, local.y );
            } );

        this.pixi_app.stage.addChild ( this.display_sprite );
        this.center_display_sprite ()
    }

    center_display_sprite ()
    {
        let view_w = this.pixi_app.renderer.width;
        let view_h = this.pixi_app.renderer.height;

        console.log ( {view_w, view_h});

        this.display_sprite.width = Math.min ( view_w, view_h );
        this.display_sprite.height = Math.min ( view_w, view_h );

        this.display_sprite.x = (view_w/2)-this.display_sprite.width/2;
        this.display_sprite.y = (view_h/2)-this.display_sprite.height/2;
    }

    create_input_sprite ()
    {
        this.input_sprite = 
            PIXI.Sprite.from ( this.create_render_texture () );
    }

    create_render_texture ()
    {
        let width = 256;
        let height = 256;
        let resolution = 1;
        let brt = new PIXI.BaseRenderTexture({ width, height, resolution });
        let rt = new PIXI.RenderTexture ( brt )
        return rt;
    }

    create_sim ()
    {
        this.sim = new RenderFeedback ( 
            () => this.create_render_texture ()
        );
    }

    set_automaton ( a, width, height )
    {
        this.automaton = a;

        let uniforms = { width, height };
        let frag = a.get_shader ();
        let shader = new PIXI.Filter ( null, frag, uniforms );
        this.sim.get_input_sprite().filters = [ shader ];

        this.display_sprite.texture.baseTexture.setSize ( width, height );
        this.input_sprite.texture.baseTexture.setSize ( width, height );

        this.sim.resize ( width, height );

        //Hack - when setSize is called on the textures their contents are
        //       cleared so this puts random data in the buffers
        this.update ();
        this.randomize ();
        this.update ();
        this.randomize ();

        this.center_display_sprite ();
    }


    update ()
    {
        let renderer = this.pixi_app.renderer;

        this.process_input ();

        this.sim.update ( renderer );
        this.sim.render ( this.display_sprite.texture, renderer );
        this.sim.flip ();
    }

    process_input ()
    {

        let renderer = this.pixi_app.renderer;

        if ( this.input_queue.length <= 0 )
            return;

        for ( let i = 0; i < this.input_queue.length; i++ )
        {
            renderer.render ( this.input_queue [ i ], 
                              this.input_sprite.texture, 
                ( i == 0) ); //clear input texture on first render
        }

        this.input_queue = [];

        renderer.render ( this.input_sprite, 
                          this.sim.get_input_texture (), false );
    }

    randomize ()
    {
        if ( !this.automaton )
            return;

        let r_i = ( n ) =>  Math.floor ( Math.random () * n );

        //used to select random colors to paint
        let r_pal = this.automaton.get_random_palette ();
        let r_col = () => r_pal [ r_i ( r_pal.length ) ];

        this.graphics.clear ();

        let w = this.input_sprite.width;
        let h = this.input_sprite.height;

        this.graphics
            .beginFill ( this.automaton.get_random_fill (), 1 )
            .drawRect ( 0, 0, w, h );

        let n = r_i(5000)+50;
        for ( let i=0; i<n; i++ )
        {
            let s = 10;
            this.graphics
                .beginFill ( r_col(), 1 )
                .drawRect ( r_i(w), r_i(h), r_i(s), r_i(s) )
                .drawCircle ( r_i(w), r_i(h), r_i(s) );
        }

        this.input_queue.push ( this.graphics );
    }

    draw ( x, y, pen_color, pen_size )
    {
        this.graphics
            .clear ()
            .beginFill ( pen_color, 1 )
            .drawCircle ( x, y, pen_size );

        this.input_queue.push ( this.graphics );
    }
}
