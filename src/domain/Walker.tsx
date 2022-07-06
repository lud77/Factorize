import { Panel } from '../types/Panel';

const Walker = ({ panels, setPanels, setPanel, connections, setConnections, play, setPlay, pause, setPause }) => {
    let inExecution: Panel[] = [];

    const reset = () => {
        const newPanels =
            Object.values<Panel>(panels)
                .map((panel) => ({
                    ...panel,
                    inputEpValues: panel.inputEpDefaults
                }))
                .reduce((a, v) => ({
                    ...a,
                    [v.panelId]: v
                }), {});

        setPanels(newPanels);

        inExecution = // select starter panels
            Object.values<Panel>(panels)
                .filter((panel) => panel.starter);
    };

    const step = () => {
        return inExecution.reduce(
            (chain, panel) => chain.then(() => panel.execute(panel.inputEpValues)),
            Promise.resolve()
        );
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