import ndarray from 'ndarray';
import fft from 'ndarray-fft';
import zeros from 'zeros';

const flipX = (image) => {
    const result = image.clone();
    return result.flipX();
};

const flipY = (image) => {
    const result = image.clone();
    return result.flipY();
};

const invert = (image) => {
    const result = image.clone();
    return result.invert();
};

const rotate90 = (image) => {
    const result = image.clone();
    return result.rotate(90);
};

const rotate180 = (image) => {
    const result = image.clone();
    return result.rotate(180);
};

const rotate270 = (image) => {
    const result = image.clone();
    return result.rotate(270);
};

const grey = (image) => {
    const result = image.clone();
    return result.grey();
};

const cannyEdge = (image) => {
    const result = image.clone();
    return result.cannyEdge();
};

const fourier = (image) => {
    const result = image.clone();
    const size = 2 ** Math.ceil(Math.log2(Math.max(result.width, result.height)));
    const real = ndarray(result.data, [size, size]);
    const imaginary = zeros([size, size])

    fft(1, real, imaginary);

    result.data = real.data;

    return result;
};

const inverseFourier = (image) => {
    const result = image.clone();

    const real = ndarray(result.data, [result.width, result.height]);
    const imaginary = zeros([result.width, result.height])

    fft(-1, real, imaginary);

    result.data = real.data;

    return result;
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
    // fourier,
    // inverseFourier
};