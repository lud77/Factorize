const getSequence = (initial: number = -1): { next: Function, current: Function, force: Function } => {
    let count = initial;

    const next = (): number => {
        count++;
        return count;
    };

    const current = (): number => count;

    const force = (to: number): void => {
        count = to;
    };

    return {
        next,
        current,
        force
    };
};

export default getSequence;