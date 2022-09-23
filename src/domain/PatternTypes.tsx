import * as Vector from './Vector';

const checkers = (hP, vP, color, bgColor) => (x, y) => {
    return ((((hP != 0) ? Math.floor(x / hP) : 0) + ((vP != 0) ? Math.floor(y / vP) : 0)) % 2 == 0) ? color : bgColor;
};

const stripes = (hP, vP, color, bgColor) => (x, y) => {
    const value = Math.abs(Math.sin((((hP != 0) ? (x / hP) : 0) + ((vP != 0) ? (y / vP) : 0)) * Math.PI));
    return Vector.sum(Vector.scalarProduct(color, value), Vector.scalarProduct(bgColor, 1 - value));
};

const PatternTypes = {
    'Checkers': checkers,
    'Stripes': stripes,
};

export default PatternTypes;