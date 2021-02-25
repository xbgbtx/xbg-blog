class CAPixi
{
    constructor ()
    {
        this.create_pixi_app ();
        this.create_sprites ();

        this.pixi_app.stage.addChild ( this.display_sprite );

        this.draw_queue = [];

        this.pixi_app.ticker.add ( () => this.update () );

        document.getElementById ( "canvas_div" )
            .appendChild ( this.pixi_app.view );
    }

    create_pixi_app () 
    {
        let type="WebGL";

        if ( !PIXI.utils.isWebGLSupported () )
        {
            type = "canvas";
        }

        PIXI.utils.sayHello ( type );

        this.pixi_app = new PIXI.Application (
        {
            width  : w,
            height : h,
        });
    }

    create_sprites ()
    {
        let make_render_texture = () =>
        {
            let tOpt = 
            {
                width : w,
                height : h,
                wrapMode : PIXI.WRAP_MODES.REPEAT,
                mipmap : false,
            };

            let brt = new PIXI.BaseRenderTexture(tOpt)
            let rt = new PIXI.RenderTexture ( brt )
            return rt;
        }
        
        let t0 = make_render_texture ();
        let t1 = make_render_texture ();

        //draw sprite is blitted onto display sprite and then textures
        //are swapped
        this.draw_sprite = PIXI.Sprite.from ( t0 );
        this.display_sprite = PIXI.Sprite.from ( t1 );
    }

    set_active_shader ( shaderCode )
    {
        let shader = new PIXI.Filter ( undefined, shaderCode, {} );
        this.draw_sprite.filters = [ shader ];
    }

    update ()
    {
        this.poll_mouse ( this.pixi_app.renderer.plugins.interaction.mouse );

        for ( const d of this.draw_queue ) 
        {
            this.pixi_app.renderer.render ( d, 
                this.draw_sprite.texture, false );
        }

        this.draw_queue = [];

        this.pixi_app.renderer.render ( 
            this.draw_sprite, this.display_sprite.texture );

        //swap textures
        let tmp = this.draw_sprite.texture;
        this.draw_sprite.texture = this.display_sprite.texture;
        this.display_sprite.texture = tmp;
    }

    poll_mouse ( mouse )
    {
        //exit it mouse main button not down
        if ( mouse.pointerType == "mouse" &&  mouse.buttons != 1 )
        {
            return;
        }

        canvas_mouse ( mouse );

    }

}
