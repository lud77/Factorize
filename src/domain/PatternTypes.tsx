import * as Vector from './Vector';

const checkers = (hP, vP, color, bgColor) => (x, y) => {
    return ((Math.floor(x / hP) + Math.floor(y / vP)) % 2 == 0) ? color : bgColor;
};

const stripes = (hP, vP, color, bgColor) => (x, y) => {
    const value = Math.abs(Math.sin(((x / hP) * Math.PI * 180)));
    return Vector.sum(Vector.scalarProduct(color, value), Vector.scalarProduct(bgColor, 1 - value));
};

const PatternTypes = {
    'Checkers': checkers,
    'Stripes': stripes,
};

export default PatternTypes;