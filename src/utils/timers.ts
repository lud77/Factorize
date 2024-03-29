const Timers = () => {
    const handlers: {} = {};

    const setTimer = (callback, timeout) => {
        const handler = setTimeout(() => {
            callback();
            clearTimer(handler);
        }, timeout);

        // @ts-ignore
        handlers[handler] = handler;
        return handler;
    };

    const registerTimer = (name, callback, timeout) => {
        handlers[name] = setTimeout(() => {
            callback();
            clearTimer(name);
        }, timeout);
    };

    const clearAllTimers = () => {
        (Object.values(handlers) as NodeJS.Timeout[])
            .forEach((h) => clearTimeout(h));
    };

    const clearTimer = (name) => {
        delete handlers[name];
    };

    return {
        setTimer,
        registerTimer,
        clearTimer,
        clearAllTimers
    };
};

export default Timers;