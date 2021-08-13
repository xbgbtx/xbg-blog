( function ( lsystem )
{
    lsystem.RenderData = class
    {
        constructor ({
            start,
            grammar,
            cmd_interpreter,
            gen_draw_set
        })
        {
            this.start = start;
            this.grammar = grammar;
            this.cmd_interpreter = cmd_interpreter;
            this.gen_draw_set = gen_draw_set;
        };

        get_start ()
        {
            return this.start;
        }

        get_grammar ()
        {
            return this.grammar;
        }

        get_cmd_interpreter ()
        {
            return this.cmd_interpreter;
        }

        get_gen_draw_set ()
        {
            return this.gen_draw_set;
        }
    }

}( window.lsystem = window.lsystem || {} ))

