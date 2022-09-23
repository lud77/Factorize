import Jimp from 'jimp/es';
import { Image } from 'image-js';

import * as Vector from './Vector';

const imageSym = Symbol('image');

const hAnchorMultiplier = {
    left: 0,
    center: .5,
    right: 1
};

const vAnchorMultiplier = {
    top: 0,
    center: .5,
    bottom: 1
};

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

const copy = (source, base, x, y, opacity = 1) => {
    const result = base.clone();

    const patchX = Math.max(0, x);
    const patchY = Math.max(0, y);

    const sourceX = Math.max(0, -x);
    const sourceY = Math.max(0, -y);

    const patchWidth = Math.min(source.width, base.width - x) - sourceX;
    const patchHeight = Math.min(source.height, base.height - y) - sourceY;
    // console.log('blender', patchWidth, patchHeight, sourceWidth, sourceHeight, baseWidth);

    const channelsToProcess = source.channels;

    const getSourceIndex = getIndexFor(source);
    const getBaseIndex = getIndexFor(base);

    for (let i = 0; i < patchWidth; i++) {
        for (let j = 0; j < patchHeight; j++) {
            const sourcePixelNdx = getSourceIndex(i + sourceX, j + sourceY);
            const sourcePixel = source.getPixel(sourcePixelNdx);

            const basePixelNdx = getBaseIndex(i + patchX, j + patchY);
            const basePixel = base.getPixel(basePixelNdx);

            // if (i == 0) console.log('+-+-+', { sourcePixelNdx, basePixelNdx, sourcePixel, sourceAlpha, basePixel });

            for (let k = 0; k < channelsToProcess; k++) {
                basePixel[k] = sourcePixel[k] * opacity + basePixel[k] * (1 - opacity);
            }

            result.setPixel(basePixelNdx, basePixel);
        }
    }

    return result;
};

const blend = (source, base, x, y, blendFunction, opacity = 1) => {
    const result = base.clone();

    const patchX = Math.max(0, x);
    const patchY = Math.max(0, y);

    const sourceX = Math.max(0, -x);
    const sourceY = Math.max(0, -y);

    const patchWidth = Math.min(source.width, base.width - x) - sourceX;
    const patchHeight = Math.min(source.height, base.height - y) - sourceY;

    // console.log('blender', patchWidth, patchHeight, sourceWidth, sourceHeight, baseWidth);

    const channelsToProcess = source.channels - source.alpha;
    const sourceMaxValue = 2 ** source.bitDepth - 1;
    const baseMaxValue = 2 ** base.bitDepth - 1;

    const getSourceIndex = getIndexFor(source);
    const getBaseIndex = getIndexFor(base);

    for (let i = 0; i < patchWidth; i++) {
        for (let j = 0; j < patchHeight; j++) {
            const sourcePixelNdx = getSourceIndex(i + sourceX, j + sourceY);
            const sourcePixel = Vector.scalarProduct(source.getPixel(sourcePixelNdx), 1 / sourceMaxValue);
            const sourceAlpha = getAlpha(source, sourcePixel) * opacity;

            const basePixelNdx = getBaseIndex(i + patchX, j + patchY);
            const basePixel = base.getPixel(basePixelNdx);

            // if (i == 0) console.log('+-+-+', { sourcePixelNdx, basePixelNdx, sourcePixel, sourceAlpha, basePixel });

            for (let k = 0; k < channelsToProcess; k++) {
                const baseComponent = basePixel[k] / baseMaxValue;

                basePixel[k] = (
                    sourceAlpha * blendFunction(sourcePixel[k], baseComponent) +
                    (1 - sourceAlpha) * baseComponent
                ) * baseMaxValue;
            }

            result.setPixel(basePixelNdx, basePixel);
        }
    }

    return result;
};

const empty = (width, height, bgcolor) => {
    const size = width * height;
    const data = new Uint8ClampedArray(size * 4);

    for (let i = 0; i < size; i += 1) {
        data[i * 4] = bgcolor[0];
        data[i * 4 + 1] = bgcolor[1];
        data[i * 4 + 2] = bgcolor[2];
        data[i * 4 + 3] = bgcolor[3];
    }

    return new Image({
        width,
        height,
        data,
        kind: 'RGBA'
    });
};

const patterned = (width, height, patternCbk) => {
    const size = width * height;
    const data = new Uint8ClampedArray(size * 4);

    for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < height; y += 1) {
            const i = (x + y * width) * 4;
            const color = patternCbk(x, y);

            data[i] = color[0];
            data[i + 1] = color[1];
            data[i + 2] = color[2];
            data[i + 3] = color[3];
        }
    }

    return new Image({
        width,
        height,
        data,
        kind: 'RGBA'
    });
};

const getTargetX = (hAnchor, newWidth, imWidth) => {
    return Math.floor((newWidth - imWidth) * hAnchorMultiplier[hAnchor]);
};

const getTargetY = (vAnchor, newHeight, imHeight) => {
    return Math.floor((newHeight - imHeight) * vAnchorMultiplier[vAnchor]);
};

const resize = (image, newWidth, newHeight, hAnchor, vAnchor, bgcolor) => {
    const newImage = empty(newWidth, newHeight, bgcolor);

    const targetX = getTargetX(hAnchor, newWidth, image.width);
    const targetY = getTargetY(vAnchor, newHeight, image.height);

    return copy(image, newImage, targetX, targetY, 1);
};

const displace = (image, map, offset) => {
    const imageClone = new Jimp(image);
    const mapClone = new Jimp(map);

    imageClone.displace(mapClone, offset);

    return new Image(image.width, image.height, imageClone.bitmap.data);
};

export {
    imageSym,
    toImage,
    printable,
    blend,
    copy,
    empty,
    patterned,
    resize,
    displace,
    hAnchorMultiplier,
    vAnchorMultiplier
};