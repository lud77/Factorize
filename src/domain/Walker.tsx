const Walker = ({ panels, setPanel, connections, setConnections, play, setPlay, pause, setPause }) => {
    let inExecution = [];

    const reset = () => {
        Object.values(panels)
            .forEach((panel) => {
                panel.inputEndpoints
                    .forEach((ep) => ep.reset());
            });

        inExecution = // select starter panels
            Object.values(panels)
                .filter((panel) => panel.starter);
    };

    const step = () => {
        inExecution.forEach((panel) => {
            panel.execute();
        });

        return Promise.resolve(null);
    };

    const mainLoop = () => {
        step().then(() => {
            if (play) setTimeout(mainLoop, 1);
        });
    };

    const pressPlay = () => {
        if (!play) setPlay(true);
        setPause(false);
        mainLoop();
    };

    const pressPause = () => {
        setPause(!pause);
        if (!pause) {
            mainLoop();
        }
    };

    const pressStop = () => {
        if (play) setPlay(false);
        setPause(false);
        reset();
    };

    return {
        reset,
        step,
        mainLoop,
        pressPlay,
        pressPause,
        pressStop
    };
};

export default Walker;