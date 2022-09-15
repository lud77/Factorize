import * as Vector from './Vector';

const imageSym = Symbol('image');

const toImage = (contents) => {
    return {
        type: imageSym,
        contents,
        toString: () => 'Image (${contents.width}x${contents.height})'
    };
};

const printable = (image) => {
    return `\nImage info:\n` +
        `Width: ${image.width}px\n` +
        `Height: ${image.height}px\n` +
        `Bit depth: ${image.bitDepth}px\n` +
        `Color model: ${image.colorModels}px\n` +
        `Has alpha: ${image.alpha ? true : false}px\n` +
        '---';
};

const getAlpha = (image, pixel) => {
    if (!image.alpha) return 1;
    return pixel[pixel.length - 1];
};

const setAlpha = (image, pixel, value) => {
    if (!image.alpha) return;
    pixel[pixel.length - 1] = value;
};

const getIndexFor = (image) => {
    const width = image.width;
    return (x, y) => y * width + x;
};

const blend = (source, base, x, y, blendFunction, opacity, fill) => {
    const result = base.clone();

    const sourceWidth = source.width;
    const sourceHeight = source.height;
    const baseWidth = base.width;
    const patchWidth = Math.min(source.width, base.width - x);
    const patchHeight = Math.min(source.height, base.height - y);
    // console.log('blender', patchWidth, patchHeight, sourceWidth, sourceHeight, baseWidth);

    const channelsToProcess = source.channels - source.alpha;
    const sourceMaxValue = 2 ** source.bitDepth - 1;
    const baseMaxValue = 2 ** base.bitDepth - 1;

    const getSourceIndex = getIndexFor(source);
    const getBaseIndex = getIndexFor(base);

    for (let i = 0; i < patchWidth; i++) {
        for (let j = 0; j < patchHeight; j++) {
            const sourcePixelNdx = getSourceIndex(i, j);
            const sourcePixel = Vector.scalarProduct(source.getPixel(sourcePixelNdx), 1 / sourceMaxValue);
            const sourceAlpha = getAlpha(source, sourcePixel) * opacity;

            const basePixelNdx = getBaseIndex(i + x, j + y);
            const basePixel = base.getPixel(basePixelNdx);

            // if (i == 0) console.log('+-+-+', { sourcePixelNdx, basePixelNdx, sourcePixel, sourceAlpha, basePixel });

            for (let k = 0; k < channelsToProcess; k++) {
                const baseComponent = basePixel[k] / baseMaxValue;

                basePixel[k] = (
                    sourceAlpha * blendFunction(
                        sourcePixel[k],
                        baseComponent,
                        sourceAlpha,
                        fill
                    ) +
                    (1 - sourceAlpha) * baseComponent
                ) * baseMaxValue;
            }

            result.setPixel(basePixelNdx, basePixel);
        }
    }

    return result;
};

export {
    imageSym,
    toImage,
    printable,
    blend
};