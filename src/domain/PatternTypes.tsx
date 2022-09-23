import * as Vector from './Vector';

const checkers = (hP, vP, offsetX, offsetY, color, bgColor) => (x, y) => {
    const ox = x - offsetX;
    const oy = y - offsetY;

    return ((((hP != 0) ? Math.floor(ox / hP) : 0) + ((vP != 0) ? Math.floor(oy / vP) : 0)) % 2 == 0) ? color : bgColor;
};

const stripes = (hP, vP, offsetX, offsetY, color, bgColor) => (x, y) => {
    const ox = x - offsetX;
    const oy = y - offsetY;

    const value = Math.abs(Math.sin((((hP != 0) ? (ox / hP) : 0) + ((vP != 0) ? (oy / vP) : 0)) * Math.PI));
    return Vector.sum(Vector.scalarProduct(color, value), Vector.scalarProduct(bgColor, 1 - value));
};

const rings = (hP, vP, offsetX, offsetY, color, bgColor) => (x, y) => {
    const ox = (x - offsetX) / hP;
    const oy = (y - offsetY) / vP;

    const distValue = Math.sqrt(ox * ox + oy * oy);
    const value = Math.abs(Math.sin(distValue * 2 * Math.PI));
    return Vector.sum(Vector.scalarProduct(color, value), Vector.scalarProduct(bgColor, 1 - value));
};

const PatternTypes = {
    'Checkers': checkers,
    'Stripes': stripes,
    'Rings': rings
};

export default PatternTypes;