class CAPixi
{
    constructor ( width, height )
    {
        this.create_pixi_app ( width, height );
        this.create_display_sprite ( width, height );
        this.create_sim ( width, height )
        this.create_input_sprite ( width, height );

        this.gridSize = width;

        this.graphics = new PIXI.Graphics ();

        this.automaton = undefined;
        this.input_queue = [];

        this.pixi_app.ticker.add ( () => this.update () );

        document.getElementById ( "canvas_div" )
            .appendChild ( this.pixi_app.view );
    }

    create_pixi_app ( width, height ) 
    {
        let type="WebGL";

        if ( !PIXI.utils.isWebGLSupported () )
        {
            type = "canvas";
        }

        PIXI.utils.sayHello ( type );

        this.pixi_app = new PIXI.Application ( { width, height });

        PIXI.settings.RESOLUTION = window.devicePixelRatio;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    }

    create_display_sprite ( width, height )
    {
        this.display_sprite = 
            PIXI.Sprite.from ( this.create_render_texture ( width, height ) );

        this.pixi_app.stage.addChild ( this.display_sprite );
    }

    create_input_sprite ( width, height )
    {
        this.input_sprite = 
            PIXI.Sprite.from ( this.create_render_texture ( width, height ) );
    }

    create_render_texture ( width, height )
    {
        let brt = new PIXI.BaseRenderTexture({ width, height });
        let rt = new PIXI.RenderTexture ( brt )

        return rt;
    }

    create_sim ( width, height )
    {
        this.sim = new RenderFeedback ( 
            () => this.create_render_texture ( width, height )
        );
    }
    
    set_automaton ( a )
    {
        this.automaton = a;
        this.set_shader (  this.sim.get_input_sprite (),
                            null, a.get_shader (), 
                            { size : this.gridSize });
    }

    set_shader ( target, vert, frag, uniforms )
    {
        let shader = new PIXI.Filter ( vert, frag, uniforms );
        target.filters = [ shader ];
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

        this.poll_mouse ( renderer.plugins.interaction.mouse );

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

    poll_mouse ( mouse )
    {
        //exit it mouse main button not down
        if ( mouse.pointerType == "mouse" &&  mouse.buttons != 1 )
        {
            return;
        }

        if ( mouse.global.x >= 0 && 
             mouse.global.x < this.pixi_app.renderer.width &&
             mouse.global.y >= 0 &&
             mouse.global.y < this.pixi_app.renderer.height )
        {
            canvas_mouse ( mouse.global.x, mouse.global.y );
        }
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
