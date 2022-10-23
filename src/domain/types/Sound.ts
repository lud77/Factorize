const soundSym = Symbol('image');

const context = new AudioContext();

const toSound = (contents, getSound = () => {}) => {
    return {
        type: soundSym,
        contents,
        toString: () => `Sound`,
        getSound
    };
};

const printable = (sound) => {
    return `\nSound info:\n` +
        '---\n';
};

const loadSample = (data) => {
    return new Promise((resolve) => {
        context.decodeAudioData(data, (decoded) => {
            resolve(toSound(decoded, createSample));
        });
    });
};

const getContext = () => context;

const createOscillator = (waveType = 'sine', frequency = 440) => {
    const oscillator = context.createOscillator();

    oscillator.type = waveType;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    return toSound(oscillator);
};

const createGain = () => toSound(context.createGain());

const createSample = (sample, loop, loopStart, loopEnd) => {
    const source = context.createBufferSource();
    source.buffer = sample;
    source.loop = loop;
    source.loopStart = loopStart;
    source.loopEnd = loopEnd;
    return toSound(source);
};

export {
    soundSym,
    toSound,
    printable,
    loadSample,
    getContext,
    createOscillator,
    createGain,
    createSample
};