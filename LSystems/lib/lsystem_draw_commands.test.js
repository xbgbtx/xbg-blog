/**
 * @jest-environment jsdom
 */

require('./lsystem_draw_commands');

const LS = global.lsystem;

test('test move command', () => {
    let draw_ctx =
    {
        move : jest.fn ()
    };

    let cmd = new LS.draw_cmds.DrawMove ( 5 );

    cmd.execute ( draw_ctx );

    expect ( draw_ctx.move ).toHaveBeenCalledTimes ( 1 );
    expect ( draw_ctx.move ).toHaveBeenNthCalledWith ( 1, 5 );
});

test('test line command', () => {
    let draw_ctx =
    {
        line : jest.fn ()
    };

    let cmd = new LS.draw_cmds.DrawLine ( 5 );

    cmd.execute ( draw_ctx );

    expect ( draw_ctx.line ).toHaveBeenCalledTimes ( 1 );
    expect ( draw_ctx.line ).toHaveBeenNthCalledWith ( 1, 5 );
});

test('test rotate command', () => {
    let draw_ctx =
    {
        rotate : jest.fn ()
    };

    let cmd = new LS.draw_cmds.Rotate ( 90 );

    cmd.execute ( draw_ctx );

    expect ( draw_ctx.rotate ).toHaveBeenCalledTimes ( 1 );
    expect ( draw_ctx.rotate ).toHaveBeenNthCalledWith ( 1, 90 );
});

test ( 'test create draw command string interpreter', () =>
{
   let cmd_interpreter = new LS.draw_cmds.CmdInterpreter ();

   let mock_cmd = {
      execute : jest.fn ()
   }

   let draw_ctx = {};

   cmd_interpreter.add_cmd ( "A", mock_cmd );

   cmd_interpreter.process ( draw_ctx, "A" );

   expect ( mock_cmd.execute ).toHaveBeenCalledTimes ( 1 );
   expect ( mock_cmd.execute ).toHaveBeenNthCalledWith ( 1, draw_ctx );
});

