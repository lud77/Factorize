import { Index } from 'flexsearch';

const getIndexFor = (items) => {
    const index = new Index({ tokenize: 'full' });

    Object.values(items)
        .forEach((item, ndx) => {
            index.add(ndx, item.type);

            (item.tags || []).forEach((tag) => {
                index.append(ndx, tag);
            });
        });

    return index;
};

export default getIndexFor;