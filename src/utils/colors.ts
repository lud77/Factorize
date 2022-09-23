import tinycolor from 'tinycolor2';

const color2rgba = (colorStr: string) => {
    const color = tinycolor(colorStr);
    if (!color.isValid()) return null;

    const { r, g, b, a } = color.toRgb();;
    return [r, g, b, Math.floor(a * 255)];
};

const hex2rgba = (hex: string) => {
    const getComponents = (fullHex): string[] | null => {
        const hex = fullHex.replace("#", "");
        if (hex.length == 6) return [
            hex.substr(0, 2),
            hex.substr(2, 2),
            hex.substr(4, 2),
            'ff'
        ];

        if (hex.length == 8) return [
            hex.substr(0, 2),
            hex.substr(2, 2),
            hex.substr(4, 2),
            hex.substr(6, 2)
        ];

        if (hex.length == 3) {
            const r = hex.substr(0, 1);
            const g = hex.substr(1, 1);
            const b = hex.substr(2, 1);

            return [r + r, g + g, b + b, 'ff'];
        }

        if (hex.length == 4) {
            const r = hex.substr(0, 1);
            const g = hex.substr(1, 1);
            const b = hex.substr(2, 1);
            const a = hex.substr(3, 1);

            return [r + r, g + g, b + b, a + a];
        }

        return null;
    };

    const result = getComponents(hex);
    if (result == null) return null;

    const [ rc, gc, bc, ac ] = result;

    try {
        return [
            parseInt(rc, 16),
            parseInt(gc, 16),
            parseInt(bc, 16),
            parseInt(ac, 16)
        ];
    } catch (e) {
        return null;
    }
};

const rgb2hsl = (rgb: number[] | null) => {
    if (rgb == null) return null;

    const normRgb = [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
    const min = normRgb.reduce((a, v) => Math.min(a, v), Infinity);
    const [max, maxIndex] = normRgb.reduce((a, v, i) => {
        if (v >= a[0]) return [v, i];
        return a;
    }, [-Infinity, 0]);

    const lum = (min + max) / 2;

    const calcHue = (min, max, maxIndex, rgb) => {
        const h = maxIndex * 2 + (rgb[(maxIndex + 1) % 3] - rgb[(maxIndex + 2) % 3]) / (max - min);
        return 60 * (isNaN(h) ? 0 : h + (h < 0 ? 6 : 0));
    };

    const calcSat = (min, max, lum) => {
        if (min == max) return 0;
        if (lum <= 0.5) return (max - min) / (max + min);
        return (max - min) / (2 - max - min);
    };

    const hue = calcHue(min, max, maxIndex, normRgb);

    const sat = calcSat(min, max, lum);

    return [hue, sat, lum];
};

const hex2hsl = (hex: string) => rgb2hsl(hex2rgba(hex));

export {
    color2rgba,
    hex2rgba,
    rgb2hsl,
    hex2hsl
};