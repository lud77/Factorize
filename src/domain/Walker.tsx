import { Panel } from '../types/Panel';

const Walker = ({ setPanels, connections, setConnections, play, setPlay, pause, setPause, machine }) => {
    let inExecution: Panel[] = [];

    const reset = () => {
        setPanels((panels) => {
            inExecution = // select starter panels
                Object.values<Panel>(panels)
                    .filter((panel) => panel.starter);

            return panels;
        });
    };

    const revert = () => {
        setPanels((panels) => {
            return Object.values<Panel>(panels)
                .map((panel) => ({
                    ...panel,
                    inputEpValues: panel.inputEpDefaults
                }))
                .reduce((a, v) => ({
                    ...a,
                    [v.panelId]: v
                }), {});
        });
    };

    const step = () => {
        return inExecution.reduce(
            (chain, panel) => chain.then(() => { /* machine.executePanelLogic(panel.panelId, {}) */ }),
            Promise.resolve()
        );
    };

    const mainLoop = () => {
        step().then(() => {
            console.log('looping');
            if (play) setTimer(mainLoop, 1);
        });
    };

    const pressPlay = () => {
        setPause(false);
        if (play) return;

        setPlay(true);
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