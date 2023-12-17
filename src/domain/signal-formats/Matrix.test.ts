import { composition } from 'mathjs';
import {
    zeroes,
    getWidth,
    getHeight,
    getRow,
    getColumn,
    scalarProduct,
    dotProduct,
    sum,
    transpose,
    grandSum,
    printable
} from './Matrix'; // Import your component

const matrix1 = zeroes(3, 2);
matrix1.contents[0][1] = 1;
matrix1.contents[1][1] = 1;

const matrix2 = zeroes(3, 2);
matrix2.contents[0][1] = 2;

test('Matrix print', () => {
    expect(printable(matrix1)).toBe(`\n┌     ┐\n│ 0 1 │\n│ 0 1 │\n│ 0 0 │\n└     ┘\n`);
});

test('Matrix sum', () => {
    const res = sum(matrix1, matrix2);
    expect(res.contents[0][1]).toBe(3);
});

test('Matrix dot product 1', () => {
    const res = dotProduct(transpose(matrix1), matrix2);
    expect(res.contents[1][1]).toBe(2);
    expect(getWidth(res)).toBe(2);
    expect(getHeight(res)).toBe(2);
});

test('Matrix dot product 2', () => {
    const res = dotProduct(matrix1, transpose(matrix2));
    expect(res.contents[0][0]).toBe(2);
    expect(getWidth(res)).toBe(3);
    expect(getHeight(res)).toBe(3);
});

test('Matrix scalar product', () => {
    const res = scalarProduct(matrix1, 4);
    expect(res.contents[1][1]).toBe(4);
});

test('Matrix getRow', () => {
    expect(getRow(matrix1, 0)).toEqual([0, 1]);
});

test('Matrix getColumn', () => {
    expect(getColumn(matrix1, 0)).toEqual([0, 0, 0]);
});

test('Matrix grandSum', () => {
    expect(grandSum(matrix1)).toBe(2);
});
