import { Connection } from '../types/Machine';

let position = 10;

const Machine = ({ props, panels, setPanels, connections, setConnections, workAreaOffset }) => {

    console.log('panels from machine', panels);

    const setPanel = (panel) => {
        console.log('current panels', panels);
        console.log('setting panels', { ...panels, [panel.panelId]: panel });
        setPanels({ ...panels, [panel.panelId]: panel });
    };

    const getOutputValue = (panelId, epRef) => {
        console.log('get output value');
        const panel = panels[panelId];
        const ep = panel.outputEpByRef[epRef];
        return panel.outputEpValues[ep];
    };

    const setInputValue = (panelId, epRef, newValue) => {
        console.log('set input value');
        const panel = panels[panelId];
        const ep = panel.inputEpByRef[epRef];

        const updatedPanel = {
            ...panel,
            inputEpValues: {
                ...panel.inputEpValues,
                [ep]: newValue
            }
        };

        setPanel(updatedPanel);

        return newValue;
    };

    const propagateValue = (sourcePanelId, sourceEpRef, targetPanelId, targetEpRef) => {
        const newValue = getOutputValue(sourcePanelId, sourceEpRef);
        setInputValue(targetPanelId, targetEpRef, newValue);
    };

    const makeConnection = (sourceEpRef: number, targetEpRef: number, sourcePanelId: number, targetPanelId: number): Connection => {
        // makeConnectionHook(source, target, sourcePanelId, targetPanelId);

        const newValue = propagateValue(sourcePanelId, sourceEpRef, targetPanelId, targetEpRef);



        return {
            source: sourceEpRef,
            target: targetEpRef,
            sourcePanelId,
            targetPanelId,
            active: false
        };
    };

    const makePanel = (palette, type) => {
        const panelId = props.getNextPanelId();
        const panel = props.panelPalettes[palette][type].create(panelId);

        const inputRefs =
            panel.inputEndpoints
                .reduce((a, { name }) => ({ ...a, [`input${name}`]: props.getNextEndpointId() }), {});

        const inputEpByRef =
            panel.inputEndpoints
                .reduce((a, { name }) => ({ ...a, [inputRefs[`input${name}`]]: `input${name}` }), {});

        const inputEpDefaults =
            panel.inputEndpoints
                .reduce((a, { name, defaultValue }) => ({ ...a, [`input${name}`]: defaultValue }), {});

        const outputRefs =
            panel.outputEndpoints
                .reduce((a, { name }) => ({ ...a, [`output${name}`]: props.getNextEndpointId() }), {});

        const outputEpByRef =
            panel.outputEndpoints
                .reduce((a, { name }) => ({ ...a, [outputRefs[`output${name}`]]: `output${name}` }), {});

        const outputEpDefaults =
            panel.outputEndpoints
                .reduce((a, { name, defaultValue }) => ({ ...a, [`output${name}`]: defaultValue }), {});

        console.log('outputEpDefaults', outputEpDefaults);

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
            inputEpByRef,
            inputEpDefaults,
            inputEpValues: { ...inputEpDefaults },
            outputRefs,
            outputEpByRef,
            outputEpDefaults,
            outputEpValues: { ...outputEpDefaults },
            title: `${type} ${panelId}`,
            left: position - workAreaOffset[0],
            top: position + 100 - workAreaOffset[1]
        };

        setPanel(newPanel);
    };

	const findConnectionByInputEndpointId = (ref) => connections.find((connection) => connection.target == ref);
	const findConnectionByOutputEndpointId = (ref) => connections.find((connection) => connection.source == ref);

    const removeConnectionByOutputRef = (ref) => {
		const connection = findConnectionByOutputEndpointId(ref);

		if (connection) {
			setConnections(connections.filter((connection) => connection.source !== ref));
			return connection;
		}

		return null;
	};

	const removeConnectionByInputRef = (ref) => {
		const connection = findConnectionByInputEndpointId(ref);

		if (connection) {
			setConnections(connections.filter((connection) => connection.target !== ref));
			return connection;
		}

		return null;
	};

    return {
        makeConnection,
        setPanel,
        makePanel,
        findConnectionByInputEndpointId,
        findConnectionByOutputEndpointId,
        removeConnectionByOutputRef,
        removeConnectionByInputRef
    };
};

export default Machine;