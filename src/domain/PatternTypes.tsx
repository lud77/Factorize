import * as Vector from './Vector';

const checkers = (hP, vP, offsetX, offsetY, angle, color, bgColor) => {
    const Rad = Math.PI / 180;
    const cosa = Math.cos(angle * Rad);
    const sina = Math.sin(angle * Rad);

    return (x, y) => {
        const ox = x - offsetX;
        const oy = y - offsetY;

        const ax = cosa * ox - sina * oy;
        const ay = sina * ox + cosa * oy;

        return ((((hP != 0) ? Math.floor(ax / hP) : 0) + ((vP != 0) ? Math.floor(ay / vP) : 0)) % 2 == 0) ? color : bgColor;
    };
};

const stripes = (hP, vP, offsetX, offsetY, angle, color, bgColor) => {
    const Rad = Math.PI / 180;
    const cosa = Math.cos(angle * Rad);
    const sina = Math.sin(angle * Rad);

    return (x, y) => {
        const ox = x - offsetX;
        const oy = y - offsetY;

        const ax = cosa * ox - sina * oy;
        const ay = sina * ox + cosa * oy;

        const value = Math.abs(Math.sin((((hP != 0) ? (ax / hP) : 0) + ((vP != 0) ? (ay / vP) : 0)) * Math.PI));
        return Vector.sum(Vector.scalarProduct(color, value), Vector.scalarProduct(bgColor, 1 - value));
    };
};

const rings = (hP, vP, offsetX, offsetY, angle, color, bgColor) => {
    const Rad = Math.PI / 180;
    const cosa = Math.cos(angle * Rad);
    const sina = Math.sin(angle * Rad);

    return (x, y) => {
        const ox = x - offsetX;
        const oy = y - offsetY;

        const ax = cosa * ox - sina * oy;
        const ay = sina * ox + cosa * oy;

        const distValue = Math.sqrt(hP * ax * ax + vP * ay * ay);
        const value = Math.abs(Math.sin(distValue * Rad));
        return Vector.sum(Vector.scalarProduct(color, value), Vector.scalarProduct(bgColor, 1 - value));
    };
};

const PatternTypes = {
    'Checkers': checkers,
    'Stripes': stripes,
    'Rings': rings
};

export default PatternTypes;