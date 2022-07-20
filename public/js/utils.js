const sizeOf = require('image-size');

const getImageDimensions = (filePath) => {
    return new Promise((resolve, reject) => {
        sizeOf(filePath, function (err, dimensions) {
            if (err) {
                reject(err);
                return;
            }

            resolve(dimensions);
        })
    });
};

module.exports = {
    getImageDimensions
};