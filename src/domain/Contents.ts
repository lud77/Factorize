import * as Matrix from './Matrix';

const getContents = (input) => {
    if (input == null) return '';

    if (input.type === Matrix.matrixSym) return Matrix.toString(input);

    return String(input);
};


export {
    getContents
};