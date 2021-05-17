//This class uses two textures to create a render feedback loop.
//t0 is rendered onto t1 and then then textures are flipped.
class RenderFeedback
{
    constructor ( create_texture_cb )
    {
        this.create_textures ( create_texture_cb );
        this.create_sprites ();
    }

    create_textures ( create_texture_cb )
    {
        this.t0 = create_texture_cb ();
        this.t1 = create_texture_cb ();
    }

    create_sprites ()
    {
        this.s0 = PIXI.Sprite.from ( this.t0 );
        this.s1 = PIXI.Sprite.from ( this.t1 );
    }

    render ( output_texture, renderer )
    {
        renderer.render ( this.s1, output_texture );
    }

    update ( renderer )
    {
        renderer.render ( this.s0, this.s1.texture );
    }

    resize ( width, height )
    {
        this.s0.texture.baseTexture.setSize ( width, height );
        this.s1.texture.baseTexture.setSize ( width, height );
    }
    
    get_input_texture ()
    {
        return this.s0.texture;
    }

    get_input_sprite ()
    {
        return this.s0;
    }

    get_output_sprite ()
    {
        return this.s1;
    }

    //swap buffers
    flip ()
    {
        let tmp = this.s0.texture;
        this.s0.texture = this.s1.texture;
        this.s1.texture = tmp;
    }
}

