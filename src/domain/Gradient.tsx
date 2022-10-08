import * as Vector from './Vector';
import { color2rgba } from '../utils/colors';

const gradientSym = Symbol('gradient');

const toGradient = (contents) => {
    return {
        type: gradientSym,
        contents,
        toString: () => `Color gradient`
    };
};

const printable = (gradient) => {
    if (gradient.contents == null) return `\nGradient info:\nnull\n---\n`;

    return `\nGradient with ${gradient.contents.length} keypoints:\n` +
        gradient.contents.map(([c, p]) => `${c} (${Math.floor(p)})\n`).join('') +
        `---\n`;
};

const renderGradient = (gradient, length) => {
    const colors = gradient.contents.map(([ colorPoint ]) => color2rgba(colorPoint));

    const beforeColor = colors[0];
    const afterColor = colors[colors.length - 1];

    const steps = gradient.contents.map(([, step]) => step * length / 100);

    const deltas = gradient.contents.map(([, step], i) => {
        if (i == 0) return null;

        return length * (step - gradient.contents[i - 1][1]) / 100;
    });

    const stepNum = steps.length - 1;

    return (position) => {
        if (position < 0) return beforeColor;
        if (position >= length) return afterColor;

        let prev = -1;
        let delta = -1;
        let prevColor = colors[0];
        let succColor = colors[1];

        for (let s = 1; s <= stepNum; s++) {
            if (steps[s] > position) {
                prev = steps[s - 1];
                prevColor = colors[s - 1];
                succColor = colors[s];
                delta = deltas[s];

                break;
            }
        }

        const fraction = (position - prev) / delta;
        return Vector.sum(Vector.scalarProduct(prevColor, 1 - fraction), Vector.scalarProduct(succColor, fraction));
    };
};

export {
    gradientSym,
    toGradient,
    printable,
    renderGradient
};