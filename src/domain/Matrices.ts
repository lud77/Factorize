const createMatrix = (r, c) => {
    return Array(r).fill(Array(c).fill(0));
};

const getWidth = (matrix) => matrix.length > 0 ? matrix[0].length : 0;
const getHeight = (matrix) => matrix.length;

const getRow = (matrix, r) => matrix[r];
const getColumn = (matrix, c) => matrix.map((row) => row[c]);

const dotProduct = (v1, v2) => {
    if (v1.length != v2.length) throw new Error('Tried to multiply vectors of different lengths');

    return v1.map((e, i) => e * v2[i]).reduce((a, v) => a + v, 0);
};

const scalarProduct = (matrix, scalar) => {
    return matrix.map((row) => row.map((cell) => cell * scalar));
};

const matrixProduct = (m1, m2) => {
    const m1w = getWidth(m1);
    const m1h = getHeight(m1);
    const m2w = getWidth(m2);
    const m2h = getHeight(m2);

    if (m1w != m2h) throw new Error('Tried to multiply incompatible matrices');

    const result = createMatrix(m1h, m2w);

    for (let r = 0; r < m1h; r++) {
        for (let c = 0; c < m2w; c++) {
            const row = getRow(m1, r);
            const column = getColumn(m2, c);
            result[r][c] = dotProduct(row, column);
            console.log(r, c, row, column, result[r][c]);
        }
    }

    return result;
};

const convolution = (m1, m2) => {
    // if (
    return m1;
};

export {
    createMatrix,
    getWidth,
    getHeight,
    getRow,
    getColumn,
    scalarProduct,
    dotProduct,
    matrixProduct,
    convolution
};