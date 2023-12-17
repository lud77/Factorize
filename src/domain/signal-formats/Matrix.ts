import * as Vector from '../Vector';

const matrixSym = Symbol('matrix');

const toMatrix = (contents) => {
    return {
        type: matrixSym,
        contents,
        toString: () => `Matrix (${getWidth({ contents })}x${getHeight({ contents })})`
    };
};

const zeroes = (r, c) => toMatrix(Array(r).fill(0).map(() => Array(c).fill(0)));

const fromArray = (array) => toMatrix([array]);

const getWidth = (matrix) => matrix.contents.length > 0 ? matrix.contents[0].length : 0;
const getHeight = (matrix) => matrix.contents.length;

const getRow = (matrix, r) => matrix.contents[r];
const getColumn = (matrix, c) => matrix.contents.map((row) => row[c]);

const scalarProduct = (matrix, scalar) => {
    return toMatrix(matrix.contents.map((row) => row.map((cell) => cell * scalar)));
};

const dotProduct = (m1, m2) => {
    const m1w = getWidth(m1);
    const m1h = getHeight(m1);
    const m2w = getWidth(m2);
    const m2h = getHeight(m2);

    if (m1w !== m2h) throw new Error('Tried to multiply incompatible matrices');

    const result = zeroes(m1h, m2w);
    // console.log('start', result.contents.toString());

    for (let c = 0; c < m2w; c++) {
        const column = getColumn(m2, c);
        for (let r = 0; r < m1h; r++) {
            const row = getRow(m1, r);
            result.contents[r][c] = Vector.dotProduct(row, column);
            // console.log(r, row, c, column, result.contents[r][c] + '');
            // console.log(r, c, result.contents.toString());
        }
    }

    // console.log('end', result.contents.toString());

    return result;
};

const sum = (m1, m2) => {
    const m1w = getWidth(m1);
    const m1h = getHeight(m1);
    const m2w = getWidth(m2);
    const m2h = getHeight(m2);

    if ((m1w !== m2w) || (m1h !== m2h)) throw new Error('Tried to sum incompatible matrices');

    const result = zeroes(m1h, m1w);

    for (let c = 0; c < m1w; c++) {
        for (let r = 0; r < m1h; r++) {
            result.contents[r][c] = m1.contents[r][c] + m2.contents[r][c];
        }
    }

    return result;
};

const transpose = (m) => {
    const mw = getWidth(m);
    const mh = getHeight(m);
    const tw = mh;
    const th = mw;
    const t = zeroes(th, tw);

    for (let c = 0; c < mw; c++) {
        for (let r = 0; r < mh; r++) {
            t.contents[c][r] = m.contents[r][c];
        }
    }

    return t;
};

const grandSum = (m) => m.contents.flat().reduce((a, v) => a + v, 0);

const printable = (matrix) => {
    const nbspace = ' ';
    const cols = getWidth(matrix);

    const colWidth =
        matrix.contents
            .flat()
            .map((v) => '' + v)
            .reduce((a, v) => Math.max(a, v.length), 0);

    const spaces = Array(cols * colWidth + cols + 1).fill(nbspace).join('');

    return `\n┌${spaces}┐\n` +
        matrix.contents
            .map((row, r) => `│${nbspace}${ row.map((cell) => ('' + cell).padStart(colWidth, nbspace)).join(nbspace) }${nbspace}│`)
            .join('\n') +
        `\n└${spaces}┘\n`;
};

export {
    zeroes,
    matrixSym,
    fromArray,
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
};