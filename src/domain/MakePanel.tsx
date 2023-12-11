import { Point } from '../types/Point';
import { PanelCoords } from '../types/PanelCoords';
import { Panel } from '../types/Panel';

const makePanel = (dictionary, getNextPanelId, getNextEndpointId, position, workAreaOffset) => (panelType, coords?: Point): [Panel, PanelCoords] => {
    const panelId = getNextPanelId();
    const {
        resizer,
        width,
        height,
        minWidth,
        minHeight,
        ...panel
    } = dictionary[panelType].create(panelId);

    const inputRefs =
        panel.inputEndpoints
            .reduce((a, { name }) => ({ ...a, [`input${name}`]: getNextEndpointId() }), {});

    const inputEpByRef =
        panel.inputEndpoints
            .reduce((a, { name }) => ({ ...a, [inputRefs[`input${name}`]]: `input${name}` }), {});

    const inputEpDefaults =
        panel.inputEndpoints
            .reduce((a, { name, defaultValue }) => ({ ...a, [`input${name}`]: defaultValue }), {});

    const inputSignalByEp =
        panel.inputEndpoints
            .reduce((a, { name, signal }) => ({ ...a, [`input${name}`]: signal }), {});

    const inputTypeByEp =
        panel.inputEndpoints
            .reduce((a, { name, type }) => ({ ...a, [`input${name}`]: type }), {});

    const outputRefs =
        panel.outputEndpoints
            .reduce((a, { name }) => ({ ...a, [`output${name}`]: getNextEndpointId() }), {});

    const outputEpByRef =
        panel.outputEndpoints
            .reduce((a, { name }) => ({ ...a, [outputRefs[`output${name}`]]: `output${name}` }), {});

    const outputEpDefaults =
        panel.outputEndpoints
            .reduce((a, { name, defaultValue }) => ({ ...a, [`output${name}`]: defaultValue }), {});

    const outputSignalByEp =
        panel.outputEndpoints
            .reduce((a, { name, signal }) => ({ ...a, [`output${name}`]: signal }), {});

    const outputTypeByEp =
        panel.outputEndpoints
            .reduce((a, { name, type }) => ({ ...a, [`output${name}`]: type }), {});

    position = (position + 20) % 100;

    const newPanel = {
        ...panel,
        panelId,
        inputRefs,
        inputEpByRef,
        inputEpDefaults,
        inputEpValues: { ...inputEpDefaults },
        inputSignalByEp,
        inputTypeByEp,
        outputRefs,
        outputEpByRef,
        outputEpDefaults,
        outputEpValues: { ...outputEpDefaults },
        outputSignalByEp,
        outputTypeByEp,
        title: `${panelType} ${panelId}`
    };

    const resizerHeight = resizer != 'none' ? 9 : 0;

    const newPanelCoords: PanelCoords = {
        panelId,
        width: (width || 134) + resizerHeight,
        height: (height || 84) + resizerHeight,
        minWidth: (minWidth || width || 134) + resizerHeight,
        minHeight: (minHeight || height || 84) + resizerHeight,
        left: coords == null ? position - workAreaOffset[0] : coords.x - workAreaOffset[0],
        top: coords == null ? position + 100 - workAreaOffset[1] : coords.y - workAreaOffset[1],
        resizer: resizer || 'none'
    };

    return [newPanel, newPanelCoords];
};

export default makePanel;