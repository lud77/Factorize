import Jimp from 'jimp';
import { Image } from 'image-js';

import ndarray from 'ndarray';
import fft from 'ndarray-fft';
import zeros from 'zeros';

import { toImage } from './signal-formats/Image';

const flipX = (image) => {
    const result = image.contents.clone();
    return toImage(result.flipX());
};

const flipY = (image) => {
    const result = image.contents.clone();
    return toImage(result.flipY());
};

const invert = (image) => {
    const result = image.contents.clone();
    return toImage(result.invert());
};

const rotate90 = (image) => {
    const result = image.contents.clone();
    return toImage(result.rotate(90));
};

const rotate180 = (image) => {
    const result = image.contents.clone();
    return toImage(result.rotate(180));
};

const rotate270 = (image) => {
    const result = image.contents.clone();
    return toImage(result.rotate(270));
};

const grey = (image) => {
    const result = image.contents.clone();
    return toImage(result.grey());
};

const cannyEdge = (image) => {
    const result = image.contents.clone();
    return toImage(result.cannyEdge());
};

const fourier = (image) => {
    const result = image.contents.clone();

    const size = 2 ** Math.ceil(Math.log2(Math.max(result.width, result.height)));
    const real = ndarray(result.data, [size, size]);
    const imaginary = zeros([size, size])

    fft(1, real, imaginary);

    result.data = real.data;

    return toImage(result);
};

const inverseFourier = (image) => {
    const result = image.contents.clone();

    const real = ndarray(result.data, [result.width, result.height]);
    const imaginary = zeros([result.width, result.height])

    fft(-1, real, imaginary);

    result.data = real.data;

    return toImage(result);
};

const sepia = (image) => {
    const result = new Jimp(image.contents.clone());

    result.sepia();

    return toImage(new Image(image.contents.width, image.contents.height, result.bitmap.data));
};

export {
    flipX,
    flipY,
    invert,
    grey,
    cannyEdge,
    rotate90,
    rotate180,
    rotate270,
    sepia
    // fourier,
    // inverseFourier
};