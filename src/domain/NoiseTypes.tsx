import * as Vector from './Vector';
import { createNoise2D } from 'simplex-noise';
import alea from 'alea';

const simplex = (hP, vP, offsetX, offsetY, angle, color, bgColor) => {
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

const directional = (seed, hP, vP, offsetX, offsetY, angle, color, bgColor) => {
    const Rad = Math.PI / 180;
    const cosa = Math.cos(angle * Rad);
    const sina = Math.sin(angle * Rad);

    const frequencyX = (hP) / Math.PI;
    const frequencyY = (vP / 100) / Math.PI;

    const prng = alea(seed);
    const noise = createNoise2D(prng);

    return (x, y) => {
        const ox = x - offsetX;
        const oy = y - offsetY;

        const ax = cosa * ox - sina * oy;
        const ay = sina * ox + cosa * oy;

        const value = Math.sin((noise(Math.floor(ax), 0) * frequencyX + ay) * frequencyY);

        return Vector.sum(Vector.scalarProduct(color, value), Vector.scalarProduct(bgColor, 1 - value));
    };
};

const PatternTypes = {
    'Simplex': simplex,
    'Directional': directional
};

export default PatternTypes;