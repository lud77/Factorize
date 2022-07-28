import { flushSync } from 'react-dom';

const mostRecent = (stateSetter) => {
    let result = null;
    flushSync(() => {
        stateSetter((state) => {
            result = state;
            return state;
        });
    });

    return result;
};

export default mostRecent;