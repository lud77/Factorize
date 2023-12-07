import {
    color2rgba,
    toAttrs,
    fromAttrs
} from './colors';

test('Colors color by name', () => {
    const color = color2rgba('blue');
    expect(color).toEqual([0, 0, 255, 255]);
});

test('Colors color by hex', () => {
    const color = color2rgba('#0f0');
    expect(color).toEqual([0, 255, 0, 255]);
});

test('Colors color by css', () => {
    const color = color2rgba('rgba(255, 0, 0, 1)');
    expect(color).toEqual([255, 0, 0, 255]);
});

test('Colors color by css with transparency', () => {
    const color = color2rgba('rgba(255, 0, 0, .5)');
    expect(color).toEqual([255, 0, 0, 127]);
});

test('Colors components by hex', () => {
    expect(toAttrs('#00f')).toEqual({"alpha": 1, "blue": 255, "green": 0, "red": 0});
});

test('Colors hex from components', () => {
    expect(fromAttrs({"alpha": 1, "blue": 255, "green": 0, "red": 0})).toEqual({"a": 1, "b": 255, "g": 0, "r": 0});
});
