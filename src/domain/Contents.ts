import * as Matrix from './Matrix';
import * as Image from './Image';

const extendedFormat = {
    [Matrix.matrixSym]: Matrix.printable,
    [Image.imageSym]: Image.printable
};

const getExtendedFormat = (input) => {
    if (input == null) return '';

    if (input.type && extendedFormat[input.type]) return extendedFormat[input.type](input);

    return String(input);
};


export {
    getExtendedFormat
};