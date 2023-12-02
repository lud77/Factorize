import Jimp from 'jimp';
import { Image } from 'image-js';

import * as Vector from '../Vector';
import { renderGradient } from './Gradient';

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
        toString: () => `Image (${contents.width}x${contents.height}x${contents.colorModel}${contents.alpha ? 'α' : ''})`
    };
};

const printable = (image) => {
    return `\nImage info:\n` +
        `Width: ${image.contents.width}px\n` +
        `Height: ${image.contents.height}px\n` +
        `Bit depth: ${image.contents.bitDepth}\n` +
        `Color model: ${image.contents.colorModels}\n` +
        `Has alpha: ${image.contents.alpha ? true : false}\n` +
        '---\n';
};

const getAlpha = (image, pixel) => {
    if (!image.contents.alpha) return 1;
    return pixel[pixel.length - 1];
};

const setAlpha = (image, pixel, value) => {
    if (!image.contents.alpha) return;
    pixel[pixel.length - 1] = value;
};

const getIndexFor = (image) => {
    const width = image.contents.width;
    return (x, y) => y * width + x;
};

const copy = (source, base, x, y, opacity = 1) => {
    const result = base.contents.clone();

    const patchX = Math.max(0, x);
    const patchY = Math.max(0, y);

    const sourceX = Math.max(0, -x);
    const sourceY = Math.max(0, -y);

    const patchWidth = Math.min(source.contents.width, base.contents.width - x) - sourceX;
    const patchHeight = Math.min(source.contents.height, base.contents.height - y) - sourceY;
    // console.log('blender', patchWidth, patchHeight, sourceWidth, sourceHeight, baseWidth);

    const channelsToProcess = source.contents.channels;

    const getSourceIndex = getIndexFor(source);
    const getBaseIndex = getIndexFor(base);

    for (let i = 0; i < patchWidth; i++) {
        for (let j = 0; j < patchHeight; j++) {
            const sourcePixelNdx = getSourceIndex(i + sourceX, j + sourceY);
            const sourcePixel = source.contents.getPixel(sourcePixelNdx);

            const basePixelNdx = getBaseIndex(i + patchX, j + patchY);
            const basePixel = base.contents.getPixel(basePixelNdx);

            // if (i == 0) console.log('+-+-+', { sourcePixelNdx, basePixelNdx, sourcePixel, sourceAlpha, basePixel });

            for (let k = 0; k < channelsToProcess; k++) {
                basePixel[k] = sourcePixel[k] * opacity + basePixel[k] * (1 - opacity);
            }

            result.setPixel(basePixelNdx, basePixel);
        }
    }

    return toImage(result);
};

const blend = (source, base, x, y, blendFunction, opacity = 1) => {
    const result = base.contents.clone();

    const patchX = Math.max(0, x);
    const patchY = Math.max(0, y);

    const sourceX = Math.max(0, -x);
    const sourceY = Math.max(0, -y);

    const patchWidth = Math.min(source.contents.width, base.contents.width - x) - sourceX;
    const patchHeight = Math.min(source.contents.height, base.contents.height - y) - sourceY;

    // console.log('blender', patchWidth, patchHeight, sourceWidth, sourceHeight, baseWidth);

    const channelsToProcess = source.contents.channels - source.contents.alpha;
    const sourceMaxValue = 2 ** source.contents.bitDepth - 1;
    const baseMaxValue = 2 ** base.contents.bitDepth - 1;

    const getSourceIndex = getIndexFor(source);
    const getBaseIndex = getIndexFor(base);

    for (let i = 0; i < patchWidth; i++) {
        for (let j = 0; j < patchHeight; j++) {
            const sourcePixelNdx = getSourceIndex(i + sourceX, j + sourceY);
            const sourcePixel = Vector.scalarProduct(source.contents.getPixel(sourcePixelNdx), 1 / sourceMaxValue);
            const sourceAlpha = getAlpha(source, sourcePixel) * opacity;

            const basePixelNdx = getBaseIndex(i + patchX, j + patchY);
            const basePixel = base.contents.getPixel(basePixelNdx);

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

    return toImage(result);
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

    return toImage(new Image({
        width,
        height,
        data,
        kind: 'RGBA'
    }));
};

const generatePattern = (width, height, patternCbk) => {
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

    return toImage(new Image({
        width,
        height,
        data,
        kind: 'RGBA'
    }));
};

const getTargetX = (hAnchor, newWidth, imWidth) => {
    return Math.floor((newWidth - imWidth) * hAnchorMultiplier[hAnchor]);
};

const getTargetY = (vAnchor, newHeight, imHeight) => {
    return Math.floor((newHeight - imHeight) * vAnchorMultiplier[vAnchor]);
};

const resize = (image, newWidth, newHeight, hAnchor, vAnchor, bgcolor) => {
    const newImage = empty(newWidth, newHeight, bgcolor);

    const targetX = getTargetX(hAnchor, newWidth, image.contents.width);
    const targetY = getTargetY(vAnchor, newHeight, image.contents.height);

    return copy(image, newImage, targetX, targetY, 1);
};

const displace = (image, map, offset) => {
    const imageClone = new Jimp(image.contents);
    const mapClone = new Jimp(map.contents);

    imageClone.displace(mapClone, offset);

    return toImage(new Image(image.width, image.height, imageClone.bitmap.data));
};

const createHeightmap = (heightmap, gradient) => {
    const { width, height, channels } = heightmap.contents;

    const size = width * height;
    const data = new Uint8ClampedArray(size * channels);

    const getColorAt = renderGradient(gradient, 256);

    const gradCache =
        Array(256).fill(0)
            .map((e, i) => getColorAt(i));

    for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < height; y += 1) {
            const i = (x + y * width) * channels;
            const color = gradCache[heightmap.contents.data[i]];

            data[i] = color[0];
            data[i + 1] = color[1];
            data[i + 2] = color[2];
            data[i + 3] = color[3];
        }
    }

    return toImage(new Image({
        width,
        height,
        data,
        kind: 'RGBA'
    }));
};

export {
    imageSym,
    toImage,
    printable,
    blend,
    copy,
    empty,
    generatePattern,
    resize,
    displace,
    createHeightmap,
    hAnchorMultiplier,
    vAnchorMultiplier
};