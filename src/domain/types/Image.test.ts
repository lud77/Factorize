import {
    printable,
    blend,
    copy,
    empty,
    generatePattern,
    resize,
    getIndexFor
} from './Image'; // Import your component

import BlendModes from '../BlendModes';
import PatternTypes from '../PatternTypes';

const image1 = empty(10, 10, [1, 2, 3, 4]);
const image2 = empty(10, 10, [5, 6, 7, 8]);

test('Image print', () => {
    expect(printable(image1)).toBe(`\nImage info:\nWidth: 10px\nHeight: 10px\nBit depth: 8\nColor model: undefined\nHas alpha: true\n---\n`);
});

test('Image copy', () => {
    const res = copy(image2, image1, 2, 2); // copy image2 on top of image 1, partially overlapping it
    const index = getIndexFor(res);
    const p11 = index(1, 1) * 4;
    const p33 = index(3, 3) * 4;
    expect(res.contents.data[p11]).toBe(1); // first channel of point 1, 1 should be 1
    expect(res.contents.data[p33]).toBe(5); // first channel of point 3, 3 should be 5
});

test('Image blend', () => {
    const base1 = empty(2, 2, [1, 1, 1, 255]);
    const base2 = empty(2, 2, [2, 2, 2, 255]);
    const res = blend(base1, base2, 1, 0, BlendModes['Darken']);
    const index = getIndexFor(res);
    const p00 = index(0, 0) * 4;
    const p11 = index(1, 1) * 4;
    expect(res.contents.data[p00]).toBe(2);
    expect(res.contents.data[p11]).toBe(1);
});

test('Image generatePattern', () => {
    const res = generatePattern(5, 5, PatternTypes.Checkers(1, 1, 0, 0, 0, [1, 2, 3, 4], [5, 6, 7, 8]));
    const index = getIndexFor(res);
    const p11 = index(1, 1) * 4;
    const p12 = index(1, 2) * 4;
    expect(res.contents.data[p11]).toBe(1);
    expect(res.contents.data[p12]).toBe(5);
});

test('Image resize', () => {
    const base = empty(2, 2, [1, 1, 1, 1]);
    const res = resize(base, 3, 3, 'left', 'top', [9, 9, 9, 9]);
    const index = getIndexFor(res);
    const p11 = index(1, 1) * 4;
    const p12 = index(1, 2) * 4;
    expect(res.contents.data[p11]).toBe(1);
    expect(res.contents.data[p12]).toBe(9);
});

