import { renderGradient } from './signal-formats/Gradient';

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

const circular = (offsetX, offsetY, angle, length, gradient) => {
    const Rad = Math.PI / 180;
    const cosa = Math.cos(angle * Rad);
    const sina = Math.sin(angle * Rad);

    const getColorAt = renderGradient(gradient, length);

    return (x, y) => {
        const ox = x - offsetX;
        const oy = y - offsetY;

        const ax = cosa * ox - sina * oy;
        const ay = sina * ox + cosa * oy;

        const distValue = Math.sqrt(ax * ax + ay * ay);
        const value = Math.abs(100 * Math.sin(distValue * Rad));

        return getColorAt(value);
    }
};

const GradientTypes = {
    'Linear': linear,
    'Circular': circular
};

export default GradientTypes;