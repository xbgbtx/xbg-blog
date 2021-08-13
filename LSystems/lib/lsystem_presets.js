( function ( lsystem )
{
    lsystem.get_preset = function ( preset_name )
    {
        switch ( preset_name )
        {
            case "cantor" :
                return cantor_data ();
                break;

            case "dragon" :
                return dragon_data ();
                break;

            case "sierpinski" :
                return sierpinski_data ();
                break;
        }
    }

    let cantor_data = function ()
    {
        let start = "A";

        let grammar = new lsystem.Grammar ();
        grammar.set ( "A", "ABA" );
        grammar.set ( "B", "BBB" );

        let cmd_interpreter = new lsystem.draw_cmds.CmdInterpreter ();
        cmd_interpreter.add_cmd ( "A", 
            new lsystem.draw_cmds.DrawLine ( 10 ) );
        cmd_interpreter.add_cmd ( "B", 
            new lsystem.draw_cmds.DrawMove ( 10 ) );

        let gen_draw_set = new Set ();
        gen_draw_set.add ( 1 );
        gen_draw_set.add ( 2 );
        gen_draw_set.add ( 3 );
        gen_draw_set.add ( 4 );
        gen_draw_set.add ( 5 );
        gen_draw_set.add ( 6 );
        gen_draw_set.add ( 7 );

        return new lsystem.RenderData ({
            start,
            grammar,
            cmd_interpreter,
            gen_draw_set
        });
    }

    let dragon_data = function ()
    {
        let start = "F";

        let grammar = new lsystem.Grammar ();
        grammar.set ( "F", "F+G" );
        grammar.set ( "G", "F-G" );

        let cmd_interpreter = new lsystem.draw_cmds.CmdInterpreter ();
        cmd_interpreter.add_cmd ( "F", 
            new lsystem.draw_cmds.DrawLine ( 10 ) );
        cmd_interpreter.add_cmd ( "G", 
            new lsystem.draw_cmds.DrawLine ( 10 ) );
        cmd_interpreter.add_cmd ( "+", 
            new lsystem.draw_cmds.Rotate ( 90 ) );
        cmd_interpreter.add_cmd ( "-", 
            new lsystem.draw_cmds.Rotate ( -90 ) );

        let gen_draw_set = new Set ();
        gen_draw_set.add ( 13 );

        return new lsystem.RenderData ({
            start,
            grammar,
            cmd_interpreter,
            gen_draw_set
        });
    }

    let sierpinski_data = function ()
    {
        let start = "F-G-G";

        let grammar = new lsystem.Grammar ();
        grammar.set ( "F", "F-G+F+G-F" );
        grammar.set ( "G", "GG" );

        let cmd_interpreter = new lsystem.draw_cmds.CmdInterpreter ();
        cmd_interpreter.add_cmd ( "F", 
            new lsystem.draw_cmds.DrawLine ( 10 ) );
        cmd_interpreter.add_cmd ( "G", 
            new lsystem.draw_cmds.DrawLine ( 10 ) );
        cmd_interpreter.add_cmd ( "+", 
            new lsystem.draw_cmds.Rotate ( 120 ) );
        cmd_interpreter.add_cmd ( "-", 
            new lsystem.draw_cmds.Rotate ( -120 ) );

        let gen_draw_set = new Set ();
        gen_draw_set.add ( 9 );

        return new lsystem.RenderData ({
            start,
            grammar,
            cmd_interpreter,
            gen_draw_set
        });
    }

}( window.lsystem = window.lsystem || {} ))
