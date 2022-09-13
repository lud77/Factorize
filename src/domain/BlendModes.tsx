const superimposeMode = (a, b, opacity, fill) => {
    return a;
};

const dissolveMode = (a, b, opacity, fill) => {
    return a + b;
};

const darkenMode = (a, b, opacity, fill) => {
    return a + b;
};

const multiplyMode = (a, b, opacity, fill) => {
    return a + b;
};

const colorBurnMode = (a, b, opacity, fill) => {
    return a + b;
};

const linearBurnMode = (a, b, opacity, fill) => {
    return a + b;
};

const darkerColorMode = (a, b, opacity, fill) => {
    return a + b;
};

const lightenMode = (a, b, opacity, fill) => {
    return a + b;
};

const screenMode = (a, b, opacity, fill) => {
    return a + b;
};

const colorDodgeMode = (a, b, opacity, fill) => {
    return a + b;
};

const linearDodgeMode = (a, b, opacity, fill) => {
    return a + b;
};

const lighterColorMode = (a, b, opacity, fill) => {
    return a + b;
};

const overlayMode = (a, b, opacity, fill) => {
    return a + b;
};

const softLightMode = (a, b, opacity, fill) => {
    return a + b;
};

const vividLightMode = (a, b, opacity, fill) => {
    return a + b;
};

const hardLightMode = (a, b, opacity, fill) => {
    return a + b;
};

const linearLightMode = (a, b, opacity, fill) => {
    return a + b;
};

const pinLightMode = (a, b, opacity, fill) => {
    return a + b;
};

const hardMixMode = (a, b, opacity, fill) => {
    return a + b;
};

const differenceMode = (a, b, opacity, fill) => {
    return a + b;
};

const exclusionMode = (a, b, opacity, fill) => {
    return a + b;
};

const subtractMode = (a, b, opacity, fill) => {
    return a + b;
};

const divideMode = (a, b, opacity, fill) => {
    return a + b;
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
    'Dissolve': dissolveMode,
    'Darken': darkenMode,
    'Multiply': multiplyMode,
    'Color Burn': colorBurnMode,
    'Linear Burn': linearBurnMode,
    'Darker Color': darkerColorMode,
    'Lighten': lightenMode,
    'Screen': screenMode,
    'Color Dodge': colorDodgeMode,
    'Linear Dodge': linearDodgeMode,
    'Lighter Color': lighterColorMode,
    'Overlay': overlayMode,
    'Soft Light': softLightMode,
    'Vivid Light': vividLightMode,
    'Hard Light': hardLightMode,
    'Linear Light': linearLightMode,
    'Pin Light': pinLightMode,
    'Hard Mix': hardMixMode,
    'Difference': differenceMode,
    'Exclusion': exclusionMode,
    'Subtract': subtractMode,
    'Divide': divideMode,
    'Hue': hueMode,
    'Saturation': saturationMode,
    'Color': colorMode,
    'Luminosity': luminosityMode
};

export default BlendModes;