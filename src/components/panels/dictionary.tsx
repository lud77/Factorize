import index from './index';

const dictionary =
    Object.values(index)
        .map((group) => [
            ...Object.values(group)
        ])
        .flat()
        .reduce((a, v) => ({ ...a, [v.type]: v}), {});

console.log(`${Object.keys(dictionary).length} panel types loaded`);

export default dictionary;