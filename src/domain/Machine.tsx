import { Connection } from '../types/Machine';

let position = 10;

const Machine = ({ props, panels, setPanels, connections, setConnections, workAreaOffset }) => {

    const makeConnection = (source: number, target: number, sourcePanelId: number, targetPanelId: number): Connection =>
        ({
            source,
            target,
            sourcePanelId,
            targetPanelId
        });

    const setPanel = (panel) => {
        setPanels({ ...panels, [panel.panelId]: panel });
    };

    const makePanel = (palette, type) => {
        const panelId = props.getNextPanelId();
        const panel = props.panelPalettes[palette][type].create(`${type} ${panelId}`, panelId, position - workAreaOffset[0], position + 100 - workAreaOffset[1]);

        const inputRefs =
            panel.inputEndpoints
                .reduce((a, endpointName) => ({ ...a, [`input${endpointName}`]: props.getNextEndpointId() }), {});

        const outputRefs =
            panel.outputEndpoints
                .reduce((a, endpointName) => ({ ...a, [`output${endpointName}`]: props.getNextEndpointId() }), {});

        position = (position + 20) % 100;

        const newPanel = {
            ...panel,
            panelId,
            inputRefs,
            outputRefs,
            width: 134,
            height: 84
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