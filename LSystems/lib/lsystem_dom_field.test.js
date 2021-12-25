/**
 * @jest-environment jsdom
 */

require('./lsystem_dom_field');

test ( 'construct field', () =>
{
    let render_data = 
    {
        foo : jest.fn (),
        bar : jest.fn ()
    };

    render_data.foo.mockReturnValue ( 42 );

    let r_getter = ( r_data ) => render_data.foo ();
    let r_setter = ( r_data, val ) => r_data.bar ( val );

    let field = new lsystem_dom.LSystemField ( 10, r_getter, r_setter );

    field.apply_render_data_value ( render_data );

    expect ( render_data.bar ).toHaveBeenCalledTimes ( 1 );
    expect ( render_data.bar ).toHaveBeenLastCalledWith ( 10 );

    field.read_render_data_value ( render_data );

    expect ( render_data.foo ).toHaveBeenCalledTimes ( 1 );

    field.apply_render_data_value ( render_data );

    expect ( render_data.bar ).toHaveBeenCalledTimes ( 2 );
    expect ( render_data.bar ).toHaveBeenLastCalledWith ( 42 );
});

