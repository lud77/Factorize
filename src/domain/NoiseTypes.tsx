import * as Vector from './Vector';
import { createNoise2D } from 'simplex-noise';
import alea from 'alea';

const simplex = (seed, octaves, hP, vP, offsetX, offsetY, angle, color, bgColor) => {
    const Rad = Math.PI / 180;
    const cosa = Math.cos(angle * Rad);
    const sina = Math.sin(angle * Rad);

    const prng = alea(seed);
    const noise = createNoise2D(prng);

    const firstInterval = 2 ** (octaves - 1);
    const octave = firstInterval / (2 * firstInterval - 1);

    return (x, y) => {
        const ox = x - offsetX;
        const oy = y - offsetY;

        const ax = cosa * ox - sina * oy;
        const ay = sina * ox + cosa * oy;

        let amplitude = 0.5 * octave;
        let frequencyX = hP;
        let frequencyY = vP;

        let value = 0;
        for (let o = 0; o < octaves; o++) {
            const octaveValue = (noise(ax * frequencyX, ay * frequencyY) + 1) * amplitude;
            amplitude /= 2;
            frequencyX += frequencyX;
            frequencyY += frequencyY;

            value += octaveValue;
        }

        return Vector.sum(Vector.scalarProduct(color, value), Vector.scalarProduct(bgColor, 1 - value));
    };
};

const directional = (seed, hP, vP, offsetX, offsetY, angle, color, bgColor) => {
    const Rad = Math.PI / 180;
    const cosa = Math.cos(angle * Rad);
    const sina = Math.sin(angle * Rad);

    const confusion = hP / Math.PI;
    const frequency = (vP / 100) / Math.PI;

    const prng = alea(seed);
    const noise = createNoise2D(prng);

    return (x, y) => {
        const ox = x - offsetX;
        const oy = y - offsetY;

        const ax = cosa * ox - sina * oy;
        const ay = sina * ox + cosa * oy;

        const value = Math.sin((noise(Math.floor(ax), 0) * confusion + ay) * frequency);

        return Vector.sum(Vector.scalarProduct(color, value), Vector.scalarProduct(bgColor, 1 - value));
    };
};

const PatternTypes = {
    'Simplex': simplex,
    'Directional': directional
};

export default PatternTypes;