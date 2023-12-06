import {
    gradientSym,
    toGradient,
    printable,
    renderGradient
} from './Gradient'; // Import your component

const gradient = toGradient([
    ['#000', 0],
    ['#111', 50],
    ['#111', 70],
    ['#222', 100]
]);

const renderer = renderGradient(gradient, 100);

test('Gradient print', () => {
    expect(printable(gradient)).toBe(`\nGradient with 4 keypoints:\n#000 (0)\n#111 (50)\n#111 (70)\n#222 (100)\n---\n`);
});

test('Gradient render - out of bound left should return first color', () => {
    expect(renderer(-10)).toEqual([0, 0, 0, 255]); // out of bounds left
});

test('Gradient render - position between 2 instances of same color should return same color', () => {
    expect(renderer(60)).toEqual([17, 17, 17, 255]); // between #111 and #111
});

test('Gradient render - out of bound right should return last color', () => {
    expect(renderer(110)).toEqual([34, 34, 34, 255]); // out of bounds right
});
