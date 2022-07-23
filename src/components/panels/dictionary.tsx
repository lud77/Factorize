import index from './index';

const dictionary =
    Object.values(index)
        .map((group) => [
            ...Object.values(group)
        ])
        .flat()
        .reduce((a, v) => ({ ...a, [v.type]: v}), {});

export default dictionary;