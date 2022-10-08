import { renderGradient } from './Gradient';

const linear = (offsetX, offsetY, angle, length, gradient) => {
    const Rad = Math.PI / 180;
    const cosa = Math.cos(angle * Rad);
    const sina = Math.sin(angle * Rad);

    const getColorAt = renderGradient(gradient, length);

    return (x, y) => {
        const ox = x - offsetX;
        const oy = y - offsetY;

        const ax = cosa * ox - sina * oy;
        // const ay = sina * ox + cosa * oy;

        return getColorAt(ax);
    }
};

const GradientTypes = {
    'Linear': linear
};

export default GradientTypes;