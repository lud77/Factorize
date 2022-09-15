const imageSym = Symbol('image');

const toImage = (contents) => ({
    type: imageSym,
    contents,
    toString: () => '[object Image]'
});

const toString = () => '[object Image]';

const getSourceAlpha = (source, sourceWidth, sourceChannels, sourceMaxValue, baseWidth, x, y, i, j) => {
    if (source.alpha) {
        const sourceAlphaNdx = (j * sourceWidth + i + 1) * sourceChannels - 1;

        return source.data[sourceAlphaNdx] / sourceMaxValue;
    }

    return 1;
};

const blend = (source, base, x, y, blendFunction, opacity, fill) => {
    const result = base.clone();

    const sourceWidth = source.width;
    const sourceHeight = source.height;
    const baseWidth = base.width;
    const patchWidth = Math.min(source.width, base.width - x);
    const patchHeight = Math.min(source.height, base.height - y);
    console.log('blender', patchWidth, patchHeight, sourceWidth, sourceHeight, baseWidth);

    const sourceChannels = source.channels;
    const channelsToProcess = source.channels - (source.alpha ? 1 : 0);
    const sourceMaxValue = 2 ** source.bitDepth - 1;
    const baseMaxValue = 2 ** base.bitDepth - 1;

    for (let i = 0; i < patchWidth; i++) {
        for (let j = 0; j < patchHeight; j++) {
            const baseAlphaNdx = ((y + j) * baseWidth + x + i + 1) * sourceChannels - 1;
            const sourceAlpha = getSourceAlpha(source, sourceWidth, sourceChannels, sourceMaxValue, baseWidth, x, y, i, j) * opacity;
            result.data[baseAlphaNdx] = sourceAlpha * baseMaxValue;

            for (let k = 0; k < channelsToProcess; k++) {
                const sourceNdx = (j * sourceWidth + i) * sourceChannels + k;
                const baseNdx = ((y + j) * baseWidth + x + i) * sourceChannels + k;

                result.data[baseNdx] =
                    blendFunction(
                        source.data[sourceNdx] / sourceMaxValue,
                        base.data[baseNdx] / baseMaxValue,
                        sourceAlpha, fill
                    ) * baseMaxValue;
            }
        }
    }

    return result;
};

export {
    toImage,
    toString,
    blend
};