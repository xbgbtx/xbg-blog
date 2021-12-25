( function ( pixi_draw )
{
    pixi_draw.DrawingContext = class
    {
        constructor ()
        {
            this._graphics = new PIXI.Graphics ();
            this._graphics.lineStyle ( 1, 0xFF0000 );

            this.x = 0;
            this.y = 0;
            this.rotation = 0;
        }

        get_pixi_graphics ()
        {
            return this._graphics;
        }

        destroy_pixi_graphics ()
        {
            this._graphics.destroy ();
        }

        move ( len )
        {
            let move = this._calc_move ( len );
            this.x = move.x2;
            this.y = move.y2;
        }

        line ( len )
        {
            let move = this._calc_move ( len );

            this._graphics.moveTo ( move.x1, move.y1 );
            this._graphics.lineTo ( move.x2, move.y2 );

            this.move ( len );
        }

        rotate ( angle )
        {
            this.rotation += angle * ( Math.PI / 180 );
        }

        _calc_move ( len )
        {
            return {
                x1 : this.x,
                y1 : this.y,
                x2 : this.x + Math.cos ( this.rotation ) * len,
                y2 : this.y + Math.sin ( this.rotation ) * len,
            };
        }
    }

}( window.pixi_draw = window.pixi_draw || {} ))
