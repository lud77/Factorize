const getSequence = () => {
    let count = 0;

    return () => count++;
};

module.exports = getSequence;