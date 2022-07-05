import { Connection } from '../types/Machine';

let position = 10;

const Machine = ({ props, panels, setPanels, connections, setConnections, workAreaOffset }) => {

    const makeConnection = (source: number, target: number, sourcePanelId: number, targetPanelId: number): Connection =>
        ({
            source,
            target,
            sourcePanelId,
            targetPanelId,
            active: false
        });

    const setPanel = (panel) => {
        setPanels({ ...panels, [panel.panelId]: panel });
    };

    const makePanel = (palette, type) => {
        const panelId = props.getNextPanelId();
        const panel = props.panelPalettes[palette][type].create(panelId);

        const inputRefs =
            panel.inputEndpoints
                .reduce((a, { name }) => ({ ...a, [`input${name}`]: props.getNextEndpointId() }), {});

        const inputEpDefaults =
            panel.inputEndpoints
                .reduce((a, { name, defaultValue }) => ({ ...a, [`input${name}`]: defaultValue }), {});

        const outputRefs =
            panel.outputEndpoints
                .reduce((a, { name }) => ({ ...a, [`output${name}`]: props.getNextEndpointId() }), {});

        position = (position + 20) % 100;

        const defaults = {
            width: 134,
            height: 84
        };

        const newPanel = {
            ...defaults,
            ...panel,
            panelId,
            inputRefs,
            inputEpDefaults,
            inputEpValues: { ...inputEpDefaults },
            outputRefs,
            title: `${type} ${panelId}`,
            left: position - workAreaOffset[0],
            top: position + 100 - workAreaOffset[1]
        };

        setPanel(newPanel);
    };

    return {
        makeConnection,
        setPanel,
        makePanel
    };
};

export default Machine;