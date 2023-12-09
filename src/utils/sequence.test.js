import getSequence from './sequence';

test('Sequence next', () => {
    const seq = getSequence();

    expect(seq.next()).toBe(0);
    expect(seq.next()).toBe(1);
    expect(seq.next()).toBe(2);
});

test('Sequence force', () => {
    const seq = getSequence();
    seq.force(9);

    expect(seq.next()).toBe(10);
    expect(seq.next()).toBe(11);
    expect(seq.next()).toBe(12);
});

test('Sequence current', () => {
    const seq = getSequence();

    expect(seq.current()).toBe(-1);

    seq.force(9);

    expect(seq.current()).toBe(9);
});