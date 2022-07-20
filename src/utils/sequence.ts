const getSequence = (initial: number = -1): { next: Function, current: Function } => {
    let count = initial;

    const next = (): number => {
        count++;
        return count;
    };

    const current = (): number => count;

    return {
        next,
        current
    };
};

export default getSequence;