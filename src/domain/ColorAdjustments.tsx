import Jimp from 'jimp';
import { Image } from 'image-js';

import { toImage } from "./types/Image";

const lighten = (image, amount) => {
    const result = new Jimp(image.contents.clone());

    result.color([{ apply: 'lighten', params: [amount] }]);

    return toImage(new Image(image.contents.width, image.contents.height, result.bitmap.data));
};

const brighten = (image, amount) => {
    const result = new Jimp(image.contents.clone());

    result.color([{ apply: 'brighten', params: [amount] }]);

    return toImage(new Image(image.contents.width, image.contents.height, result.bitmap.data));
};

const darken = (image, amount) => {
    const result = new Jimp(image.contents.clone());

    result.color([{ apply: 'darken', params: [amount] }]);

    return toImage(new Image(image.contents.width, image.contents.height, result.bitmap.data));
};

const saturation = (image, amount) => {
    const result = new Jimp(image.contents.clone());

    result.color([{ apply: 'desaturate', params: [100 - amount] }]);

    return toImage(new Image(image.contents.width, image.contents.height, result.bitmap.data));
};

const hue = (image, amount) => {
    const result = new Jimp(image.contents.clone());

    result.color([{ apply: 'hue', params: [amount * 3.6] }]);

    return toImage(new Image(image.contents.width, image.contents.height, result.bitmap.data));
};

const brightness = (image, amount) => {
    const result = new Jimp(image.contents.clone());

    result.brightness((amount - 50) / 100);

    return toImage(new Image(image.contents.width, image.contents.height, result.bitmap.data));
};

const contrast = (image, amount) => {
    const result = new Jimp(image.contents.clone());

    result.contrast((amount - 50) / 100);

    return toImage(new Image(image.contents.width, image.contents.height, result.bitmap.data));
};

const posterize = (image, amount) => {
    const result = new Jimp(image.contents.clone());

    result.posterize(amount);

    return toImage(new Image(image.contents.width, image.contents.height, result.bitmap.data));
};

const fade = (image, amount) => {
    const result = new Jimp(image.contents.clone());

    result.fade(amount / 100);

    return toImage(new Image(image.contents.width, image.contents.height, result.bitmap.data));
};

export {
    brightness,
    contrast,
    saturation,
    hue,
    lighten,
    darken,
    posterize,
    fade
};