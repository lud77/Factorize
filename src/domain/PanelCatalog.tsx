import { Index } from 'flexsearch';

const getIndexFor = (items) => {
    const values = Object.values(items);
    const sorted = values.sort((a, b) => a.type > b.type ? 1 : -1);

    const index = new Index({ tokenize: 'full' });

    sorted.forEach((item, ndx) => {
        index.add(ndx, item.type);

        (item.tags || []).forEach((tag) => {
            index.append(ndx, tag);
        });
    });

    return [sorted, index];
};

export default getIndexFor;