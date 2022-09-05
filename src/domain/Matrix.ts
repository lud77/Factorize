const matrixSym = Symbol('matrix');

const toMatrix = (contents) => ({
    type: matrixSym,
    contents,
    toString: () => '[matrix Object]'
});

const zeroes = (r, c) => toMatrix(Array(r).fill(0).map(() => Array(c).fill(0)));

const fromArray = (array) => toMatrix([array]);

const getWidth = (matrix) => matrix.contents.length > 0 ? matrix.contents[0].length : 0;
const getHeight = (matrix) => matrix.contents.length;

const getRow = (matrix, r) => matrix.contents[r];
const getColumn = (matrix, c) => matrix.contents.map((row) => row[c]);

const dotProduct = (v1, v2) => {
    if (v1.length != v2.length) throw new Error('Tried to multiply vectors of different lengths');

    return v1.reduce((a, v, i) => a + v * v2[i], 0);
};

const scalarProduct = (matrix, scalar) => {
    return toMatrix(matrix.contents.map((row) => row.map((cell) => cell * scalar)));
};

const matrixProduct = (m1, m2) => {
    const m1w = getWidth(m1);
    const m1h = getHeight(m1);
    const m2w = getWidth(m2);
    const m2h = getHeight(m2);

    if (m1w != m2h) throw new Error('Tried to multiply incompatible matrices');

    const result = zeroes(m1h, m2w);
    console.log('start', result.contents.toString());

    for (let c = 0; c < m2w; c++) {
        const column = getColumn(m2, c);
        for (let r = 0; r < m1h; r++) {
            const row = getRow(m1, r);
            result.contents[r][c] = dotProduct(row, column);
            console.log(r, row, c, column, result.contents[r][c] + '');
            console.log(r, c, result.contents.toString());
        }
    }

    console.log('end', result.contents.toString());

    return result;
};

const convolution = (m1, m2) => {
    // if (
    return m1;
};

const toString = (matrix) => {
    const nbspace = ' ';
    const cols = getWidth(matrix);
    const colWidth = ('' + matrix.contents.reduce((a, r) => Math.max(a, r.reduce((b, c) => Math.max(b, c), 0)), 0)).length;
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
    matrixProduct,
    convolution,
    toString
};