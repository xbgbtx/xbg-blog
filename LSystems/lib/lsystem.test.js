/**
 * @jest-environment jsdom
 */

require('./lsystem');

const LS = global.lsystem;

test('test one char rewrite', () => {
    let grammar = new LS.Grammar ();
    grammar.set ( "A", "B" );
    grammar.set ( "B", "A" );

    let s = "A"

    s = LS.rewrite ( s, grammar );
    expect(s).toEqual("B");
    s = LS.rewrite ( s, grammar );
    expect(s).toEqual("A");
});

test('Rewrite char not in grammar', () =>
{
    let grammar = new LS.Grammar ();
    let s = "A"

    s = LS.rewrite ( s, grammar );
    expect(s).toEqual("A");
});

test('test expand', () => {
    let grammar = new LS.Grammar ();
    grammar.set ( "A", "ABA" );
    grammar.set ( "B", "BBB" );

    let s = "A"

    s = LS.rewrite ( s, grammar );
    expect(s).toEqual("ABA");
    s = LS.rewrite ( s, grammar );
    expect(s).toEqual("ABABBBABA");
});

test('test process', () => {

    let p = jest.fn ();

    let s = "ABC";

    LS.process ( s, p );
    expect ( p ).toHaveBeenCalledTimes ( 3 );

    expect ( p ).toHaveBeenNthCalledWith ( 1, "A" );
    expect ( p ).toHaveBeenNthCalledWith ( 2, "B" );
    expect ( p ).toHaveBeenNthCalledWith ( 3, "C" );
});
