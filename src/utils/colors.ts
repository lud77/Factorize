const hex2rgb = (hex: string) => {
    const getComponents = (fullHex) => {
        const hex = fullHex.replace("#", "");
        if (hex.length == 6) return [
            hex.substr(0, 2),
            hex.substr(2, 2),
            hex.substr(4, 2)
        ];

        const r = hex.substr(0, 1);
        const g = hex.substr(1, 1);
        const b = hex.substr(2, 1);

        return [r + r, g + g, b + b];
    };

    const [ rc, gc, bc ] = getComponents(hex);

    return [
        parseInt(rc, 16),
        parseInt(gc, 16),
        parseInt(bc, 16)
    ];
};

const rgb2hsl = (rgb: number[]) => {
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

const hex2hsl = (hex: string) => rgb2hsl(hex2rgb(hex));

export {
    hex2rgb,
    rgb2hsl,
    hex2hsl
}