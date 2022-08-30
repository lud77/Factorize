import { Index } from 'flexsearch';

const getIndexFor = (items) => {
    const index = new Index({ tokenize: 'full' });

    Object.values(items)
        .forEach((item) => {
            index.add(item.type, item.type);

            (item.tags || []).forEach((tag) => {
                index.add(item.type, tag);
            });
        });

    return index;
};

export default getIndexFor;