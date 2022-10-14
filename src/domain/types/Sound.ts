const soundSym = Symbol('image');

const toSound = (contents) => {
    return {
        type: soundSym,
        contents,
        toString: () => `Sound`
    };
};

const printable = (sound) => {
    return `\nSound info:\n` +
        '---\n';
};

const load = (data) => {
    const audioCtx = new AudioContext();

    return new Promise((resolve) => {
        audioCtx.decodeAudioData(data, (decoded) => {
            const source = audioCtx.createBufferSource();
            source.buffer = decoded;
            source.connect(audioCtx.destination);
            resolve(toSound({ source, audioCtx }));
        });
    });
};

export {
    soundSym,
    toSound,
    printable,
    load
};