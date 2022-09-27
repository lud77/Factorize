import * as Vector from './Vector';

const linear = (offset, angle, length, gradient) => (x, y) => {
    return [0, 0, 0, 0];
};

const GradientTypes = {
    'Linear': linear
};

export default GradientTypes;