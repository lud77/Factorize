const scalarProduct = (v, scalar) => {
    return v.map((el) => el * scalar);
};

const dotProduct = (v1, v2) => {
    if (v1.length != v2.length) throw new Error('Tried to multiply vectors of different lengths');

    return v1.reduce((a, v, i) => a + v * v2[i], 0);
};

const sum = (v1, v2) => {
    if (v1.length != v2.length) throw new Error('Tried to sum incompatible vectors');

    return Array(v1.length).map((el, i) => el + v2[i]);
};

const grandSum = (v) => {
    return v.reduce((a, v) => a + v, 0);
};

const opposite = (v) => {
    return v.map((el) => -el);
};

const copy = (source, target, offset) => {
    const sl = source.length;
    for (let s = 0, t = offset; s < sl; s++, t++) {
        target[t] = source[s];
    }
};

export {
    dotProduct,
    scalarProduct,
    sum,
    opposite,
    grandSum,
    copy
};