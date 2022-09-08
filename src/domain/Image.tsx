const imageSym = Symbol('image');

const toImage = (contents) => ({
    type: imageSym,
    contents,
    toString: () => '[object Image]'
});

const toString = () => '[object Image]';

export {
    toImage,
    toString
};