import { Index } from 'flexsearch';

const getIndexFor = (items) => {
    const index = new Index({ tokenize: 'full' });

    items.forEach((item) => {
        index.add(item, item);
    });

    return index;
};

export default getIndexFor;