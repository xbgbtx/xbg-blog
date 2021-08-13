( function ( lsystem )
{
   let draw_cmds = {};

   draw_cmds.DrawMove = class
   {
      constructor ( distance )
      {
         this.distance = distance;
      }

      execute ( draw_ctx )
      {
         draw_ctx.move ( this.distance );
      }
   }

   draw_cmds.DrawLine = class
   {
      constructor ( distance )
      {
         this.distance = distance;
      }

      execute ( draw_ctx )
      {
         draw_ctx.line ( this.distance );
      }
   }

   draw_cmds.Rotate = class
   {
      constructor ( angle )
      {
         this.angle = angle;
      }

      execute ( draw_ctx )
      {
         draw_ctx.rotate ( this.angle );
      }
   }

   draw_cmds.CmdInterpreter = class
   {
      constructor ()
      {
         this._symbol_map = new Map ();
      }

      add_cmd ( symbol, cmd )
      {
         this._symbol_map.set ( symbol, cmd );
      }

      process ( draw_ctx, symbol )
      {
         let cmd = this._symbol_map.get ( symbol );
         cmd.execute ( draw_ctx );
      }
   }

   lsystem.draw_cmds = draw_cmds;
}( window.lsystem = window.lsystem || {} ))

