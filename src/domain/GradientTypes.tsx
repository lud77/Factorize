import * as Vector from './Vector';
import { color2rgba } from '../utils/colors';

const linear = (offsetX, offsetY, angle, length, gradient) => {
    const colors = gradient.map(([ colorPoint ]) => color2rgba(colorPoint));

    const beforeColor = colors[0];
    const afterColor = colors[colors.length - 1];

    const steps = gradient.map(([, step]) => step * length / 100);
    const deltas = gradient.map(([, step], i) => {
        if (i == 0) return null;

        return length * (step - gradient[i - 1][1]) / 100;
    });

    const stepNum = steps.length - 1;

    return (x, y) => {
        const ox = x - offsetX;
        const oy = y - offsetY;

        if (ox < 0) return beforeColor;
        if (ox >= length) return afterColor;

        let prev = -1;
        let delta = -1;
        let prevColor = colors[0];
        let succColor = colors[1];

        for (let s = 1; s <= stepNum; s++) {
            if (steps[s] > ox) {
                prev = steps[s - 1];
                prevColor = colors[s - 1];
                succColor = colors[s];
                delta = deltas[s];

                break;
            }
        }

        const fraction = (ox - prev) / delta;
        return Vector.sum(Vector.scalarProduct(prevColor, 1 - fraction), Vector.scalarProduct(succColor, fraction));
    }
};

const GradientTypes = {
    'Linear': linear
};

export default GradientTypes;