const getSequence = () => {
    let count = -1;

    return () => {
        count++;
        return count;
    };
};

module.exports = getSequence;