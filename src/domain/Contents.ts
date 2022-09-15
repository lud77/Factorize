import * as Matrix from './Matrix';

const getExtendedFormat = (input) => {
    if (input == null) return '';

    if (input.type === Matrix.matrixSym) return Matrix.printable(input);

    return String(input);
};


export {
    getExtendedFormat
};