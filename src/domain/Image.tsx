const imageSym = Symbol('image');

const toImage = (contents) => ({
    type: imageSym,
    contents,
    toString: () => '[object Image]'
});

const toString = () => '[object Image]';

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
            const alpha = source.alpha
                ? base.data[((y + j) * baseWidth + x + i + 1) * sourceChannels - 1] / baseMaxValue * opacity
                : opacity;

            for (let k = 0; k < channelsToProcess; k++) {
                const sourceNdx = (j * sourceWidth + i) * sourceChannels + k;
                const baseNdx = ((y + j) * baseWidth + x + i) * sourceChannels + k;
                if (i < 10)
                    console.log('+++', sourceNdx, baseNdx);
                result.data[baseNdx] = source.data[sourceNdx];
                    // blendFunction(source.data[sourceNdx] / sourceMaxValue, base.data[baseNdx] / baseMaxValue, alpha, fill) * baseMaxValue;
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