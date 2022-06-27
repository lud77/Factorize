const getSequence = (): Function => {
    let count = -1;

    return (): number => {
        count++;
        return count;
    };
};

export default getSequence;