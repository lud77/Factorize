import tinycolor from 'tinycolor2';

const color2rgba = (colorStr: string) => {
    const color = tinycolor(colorStr);
    if (!color.isValid()) return null;

    const { r, g, b, a } = color.toRgb();;
    return [r, g, b, Math.floor(a * 255)];
};

const toAttrs = (hex) => {
    const rgb = tinycolor(hex).toRgb();

    return {
        red: rgb.r,
        green: rgb.g,
        blue: rgb.b,
        alpha: rgb.a
    };
};

const fromAttrs = (attrs) => {
    return {
        r: attrs.red,
        g: attrs.green,
        b: attrs.blue,
        a: attrs.alpha
    };
};

export {
    color2rgba,
    toAttrs,
    fromAttrs
};