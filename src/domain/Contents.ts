import * as Matrix from './signal-formats/Matrix';
import * as Image from './signal-formats/Image';
// import * as Sound from './types/Sound';
import * as Gradient from './signal-formats/Gradient';

const dataTypeMarkers = {
    any: 'a',
    boolean: 'b',
    object: 'd',
    function: 'f',
    gradient: 'g',
    image: 'i',
    array: 'l',
    matrix: 'm', // 2d numeric matrix
    number: 'n',
    sound: '♫',
    string: 's'
};

const extendedFormat = {
    [Matrix.matrixSym]: Matrix.printable,
    [Image.imageSym]: Image.printable,
    // [Sound.soundSym]: Sound.printable,
    [Gradient.gradientSym]: Gradient.printable
};

const getDataTypeMarkerFor = (dataType) => {
    return dataTypeMarkers[dataType] || '';
};

const getExtendedFormat = (input) => {
    if (input == null) return '';

    if (input.type && extendedFormat[input.type]) return extendedFormat[input.type](input);

    return String(input);
};

export {
    getDataTypeMarkerFor,
    getExtendedFormat
};