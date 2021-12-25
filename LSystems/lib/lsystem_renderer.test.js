/**
 * @jest-environment jsdom
 */

require('./lsystem_renderer');

const LS = global.lsystem;

test ( "construct a renderer", () =>
{
    let start = "A";
    let process_cb = jest.fn ();
    let rewrite = jest.fn ();

    draw_set = new Set ();
    draw_set.add ( 1 );
    draw_set.add ( 2 );
    draw_set.add ( 3 );

    let dctx_create = jest.fn ();

    let d1 = { id: 1 };
    let d2 = { id: 2 };
    let d3 = { id: 3 };

    dctx_create.mockReturnValueOnce ( d1 );
    dctx_create.mockReturnValueOnce ( d2 );
    dctx_create.mockReturnValueOnce ( d3 );
    dctx_create.mockReturnValueOnce ( d1 );
    dctx_create.mockReturnValueOnce ( d2 );
    dctx_create.mockReturnValueOnce ( d3 );

    let dctx_destroy = jest.fn ();

    let succ_transform = jest.fn ();

    let r = new LS.Renderer ({dctx_create, dctx_destroy});

    r.display ( start, rewrite, process_cb, draw_set, succ_transform );

    expect ( dctx_create ).toHaveBeenCalledTimes ( 3 );
    expect ( dctx_destroy ).not.toHaveBeenCalled ();

    expect ( r.get_dctx_pointers () ).toEqual ( [ d1, d2, d3 ] );

    r.display ( start, rewrite, process_cb, draw_set, succ_transform );

    expect ( r.get_dctx_pointers () ).toEqual ( [ d1, d2, d3 ] );

    expect ( dctx_create ).toHaveBeenCalledTimes ( 6 );
    expect ( dctx_destroy ).toHaveBeenCalledTimes ( 3 );

    expect ( dctx_destroy ).toHaveBeenNthCalledWith ( 1, d1 );
    expect ( dctx_destroy ).toHaveBeenNthCalledWith ( 2, d2 );
    expect ( dctx_destroy ).toHaveBeenNthCalledWith ( 3, d3 );

    r.tear_down ();

    expect ( r.get_dctx_pointers () ).toEqual ( [] );
});

test ( "display func calls interpreter funcs with dctx array", ()=>
{
    let start = "A";
    let process_cb = jest.fn ();
    let rewrite = jest.fn ();
    let succ_transform = jest.fn ();

    draw_set = new Set ();
    draw_set.add ( 1 );
    draw_set.add ( 2 );
    draw_set.add ( 3 );

    rewrite.mockReturnValueOnce ( "AB" );
    rewrite.mockReturnValueOnce ( "ABC" );

    let dctx_create = jest.fn ();

    let d1 = { id: 1 };
    let d2 = { id: 2 };
    let d3 = { id: 3 };

    dctx_create.mockReturnValueOnce ( d1 );
    dctx_create.mockReturnValueOnce ( d2 );
    dctx_create.mockReturnValueOnce ( d3 );

    let dctx_destroy = jest.fn ();

    let r = new LS.Renderer ({dctx_create, dctx_destroy});

    r.display ( start, rewrite, process_cb, draw_set, succ_transform );

    expect ( rewrite ).toHaveBeenCalledTimes ( 2 );
    expect ( rewrite ).toHaveBeenNthCalledWith ( 1, "A" );
    expect ( rewrite ).toHaveBeenNthCalledWith ( 2, "AB" );

    expect ( process_cb ).toHaveBeenCalledTimes ( 3 );
    expect ( process_cb ).toHaveBeenNthCalledWith ( 1, d1, "A" );
    expect ( process_cb ).toHaveBeenNthCalledWith ( 2, d2, "AB" );
    expect ( process_cb ).toHaveBeenNthCalledWith ( 3, d3, "ABC" );

    expect ( succ_transform ).toHaveBeenNthCalledWith ( 1, d2, 1 );
    expect ( succ_transform ).toHaveBeenNthCalledWith ( 2, d3, 2 );
});
