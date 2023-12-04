import FullyTypedPromise from "../../types/FullyTypedPromise";

const soundSym = Symbol('image');

const context = new AudioContext();

type getSoundCallback = (...args: any[]) => void;

const toSound = (contents, getSound: getSoundCallback = () => {}) => {
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

const loadSample = (data): FullyTypedPromise<{ getSound: getSoundCallback, contents: any }, string> => {
    return new Promise((resolve) => {
        context.decodeAudioData(data, (decoded) => {
            resolve(toSound(decoded, createSample));
        });
    });
};

const getContext = () => context;

const createOscillator = (waveType = 'sine', frequency = 440) => {
    const oscillator = context.createOscillator();

    oscillator.type = waveType as OscillatorType;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    return toSound(oscillator);
};

const createGain = (gain) => {
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(gain, context.currentTime);

    return toSound(gainNode);
};

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