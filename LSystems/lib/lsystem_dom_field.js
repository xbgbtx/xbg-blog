( function ( lsystem_dom )
{
    //Data structure to help convert between render data and data displayed
    //for the user in the dom
    lsystem_dom.LSystemField = class
    {
        constructor ( value, render_data_getter, render_data_setter )
        {
            this.value = value;
            this.render_data_getter = render_data_getter;
            this.render_data_setter = render_data_setter;
        }

        apply_render_data_value ( render_data )
        {
            this.render_data_setter ( render_data, this.value );
        }

        read_render_data_value ( render_data )
        {
            this.value = this.render_data_getter ( render_data );
        }
    }

}( window.lsystem_dom = window.lsystem_dom || {} ))
