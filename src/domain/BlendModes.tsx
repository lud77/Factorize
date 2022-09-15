const superimposeMode = (a, b, opacity, fill) => {
    return a * opacity + b * (1 - opacity);
};

const dissolveMode = (a, b, opacity, fill) => {
    return a + b;
};

const darkenMode = (a, b, opacity, fill) => {
    return Math.min(a, b) * opacity + b * (1 - opacity);
};

const multiplyMode = (a, b, opacity, fill) => {
    return a * b;
};

const colorBurnMode = (a, b, opacity, fill) => {
    if (b == 0) return 0;
    return 1 - (1 - a) / b;
};

const linearBurnMode = (a, b, opacity, fill) => {
    return a + b - 1;
};

const darkerColorMode = (a, b, opacity, fill) => {
    return a + b;
};

const lightenMode = (a, b, opacity, fill) => {
    return Math.max(a, b);
};

const screenMode = (a, b, opacity, fill) => {
    return 1 - ((1 - a) * (1 - b));
};

const colorDodgeMode = (a, b, opacity, fill) => {
    if (b == 1) return 255;
    return a / (1 - b);
};

const linearDodgeMode = (a, b, opacity, fill) => {
    return a + b;
};

const lighterColorMode = (a, b, opacity, fill) => {
    return a + b;
};

const overlayMode = (a, b, opacity, fill) => {
    if (a < 0.5) return 2 * a * b;
    return 1 - 2 * (1 - a) * (1 - b);
};

const softLightMode = (a, b, opacity, fill) => {
    if (b < 0.5) return 2 * a * b + a * a * (1 - 2 * b);
    return Math.sqrt(a) * (2 * b - 1) + 2 * a * (1 - b);
};

const vividLightMode = (a, b, opacity, fill) => {
    if (b < 0.5) return a / (1 - 2 * b);
    if (b > 0.5) return 1 - (1 - a) / (2 * (b - 0.5));
    return 255;
};

const hardLightMode = (a, b, opacity, fill) => {
    if (b < 0.5) return 1 - 2 * (1 - a) * (1 - b);
    return 2 * a * b;
};

const linearLightMode = (a, b, opacity, fill) => {
    if (b < 0.5) return a + 2 * b - 1;
    return a + 2 * (b - 0.5);
};

const pinLightMode = (a, b, opacity, fill) => {
    if (b < 0.5) return Math.min(a, 2 * b);
    return Math.max(a, 2 * b);
};

const hardMixMode = (a, b, opacity, fill) => {
    return a + b;
};

const differenceMode = (a, b, opacity, fill) => {
    return Math.abs(a - b);
};

const exclusionMode = (a, b, opacity, fill) => {
    return a + b - 2 * a * b;
};

const subtractMode = (a, b, opacity, fill) => {
    return a - b;
};

const divideMode = (a, b, opacity, fill) => {
    if (b == 0) return 255;
    return a / b;
};

const hueMode = (a, b, opacity, fill) => {
    return a + b;
};

const saturationMode = (a, b, opacity, fill) => {
    return a + b;
};

const colorMode = (a, b, opacity, fill) => {
    return a + b;
};

const luminosityMode = (a, b, opacity, fill) => {
    return a + b;
};

const BlendModes = {
    'Superimpose': superimposeMode,
    // 'Dissolve': dissolveMode,
    'Darken': darkenMode,
    'Multiply': multiplyMode,
    'Color Burn': colorBurnMode,
    'Linear Burn': linearBurnMode,
    // 'Darker Color': darkerColorMode,
    'Lighten': lightenMode,
    'Screen': screenMode,
    'Color Dodge': colorDodgeMode,
    'Linear Dodge': linearDodgeMode,
    // 'Lighter Color': lighterColorMode,
    'Overlay': overlayMode,
    'Soft Light': softLightMode,
    'Vivid Light': vividLightMode,
    'Hard Light': hardLightMode,
    'Linear Light': linearLightMode,
    'Pin Light': pinLightMode,
    // 'Hard Mix': hardMixMode,
    'Difference': differenceMode,
    'Exclusion': exclusionMode,
    'Subtract': subtractMode,
    'Divide': divideMode,
    // 'Hue': hueMode,
    // 'Saturation': saturationMode,
    // 'Color': colorMode,
    // 'Luminosity': luminosityMode
};

export default BlendModes;