const superimposeMode = (a, b) => {
    return a;
};

const dissolveMode = (a, b) => {
    return a + b;
};

const darkenMode = (a, b) => {
    return Math.min(a, b);
};

const multiplyMode = (a, b) => {
    return a * b;
};

const colorBurnMode = (a, b) => {
    if (b == 0) return 0;
    return 1 - (1 - a) / b;
};

const linearBurnMode = (a, b) => {
    return a + b - 1;
};

const darkerColorMode = (a, b) => {
    return a + b;
};

const lightenMode = (a, b) => {
    return Math.max(a, b);
};

const screenMode = (a, b) => {
    return 1 - ((1 - a) * (1 - b));
};

const colorDodgeMode = (a, b) => {
    if (b == 1) return 255;
    return a / (1 - b);
};

const linearDodgeMode = (a, b) => {
    return a + b;
};

const lighterColorMode = (a, b) => {
    return a + b;
};

const overlayMode = (a, b) => {
    if (a < 0.5) return 2 * a * b;
    return 1 - 2 * (1 - a) * (1 - b);
};

const softLightMode = (a, b) => {
    if (b < 0.5) return 2 * a * b + a * a * (1 - 2 * b);
    return Math.sqrt(a) * (2 * b - 1) + 2 * a * (1 - b);
};

const vividLightMode = (a, b) => {
    if (b < 0.5) return a / (1 - 2 * b);
    if (b > 0.5) return 1 - (1 - a) / (2 * (b - 0.5));
    return 255;
};

const hardLightMode = (a, b) => {
    if (b < 0.5) return 1 - 2 * (1 - a) * (1 - b);
    return 2 * a * b;
};

const linearLightMode = (a, b) => {
    if (b < 0.5) return a + 2 * b - 1;
    return a + 2 * (b - 0.5);
};

const pinLightMode = (a, b) => {
    if (b < 0.5) return Math.min(a, 2 * b);
    return Math.max(a, 2 * b);
};

const hardMixMode = (a, b) => {
    return a + b;
};

const differenceMode = (a, b) => {
    return Math.abs(a - b);
};

const exclusionMode = (a, b) => {
    return a + b - 2 * a * b;
};

const subtractMode = (a, b) => {
    return a - b;
};

const divideMode = (a, b) => {
    if (b == 0) return 255;
    return a / b;
};

const hueMode = (a, b) => {
    return a + b;
};

const saturationMode = (a, b) => {
    return a + b;
};

const colorMode = (a, b) => {
    return a + b;
};

const luminosityMode = (a, b) => {
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