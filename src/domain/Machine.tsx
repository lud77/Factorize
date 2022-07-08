import { Connection } from '../types/Machine';

let position = 10;

const Machine = ({ props, panels, setPanels, connections, setConnections, workAreaOffset }) => {

    console.log('panels from machine', panels);

    const setPanel = (panel) => {
        setPanels({ ...panels, [panel.panelId]: panel });
    };

    const getOutputValue = (panelId, epRef) => {
        const panel = panels[panelId];
        const ep = panel.outputEpByRef[epRef];
        return panel.outputEpValues[ep];
    };

    const setInputValue = (panelId, epRef, newValue) => {
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

    const propagateOutputValue = (sourcePanelId, sourceEpRef, targetPanelId, targetEpRef) => {
        const newValue = getOutputValue(sourcePanelId, sourceEpRef);
        setInputValue(targetPanelId, targetEpRef, newValue);
    };

    const propagateValueAlong = (sourcePanel, sourceOutputEp, value) => {
        const newSource = {
            ...sourcePanel,
            outputEpValues: {
                ...sourcePanel.outputEpValues,
                [sourceOutputEp]: value
            }
        };

        const sourceEpRef = sourcePanel.outputRefs[sourceOutputEp];

        const outGoingConnection = findConnectionByOutputEpRef(sourceEpRef);
        if (!outGoingConnection) return setPanels({ ...panels, [newSource.panelId]: newSource });

        const { targetPanelId, target } = outGoingConnection;
        const targetPanel = panels[targetPanelId];
        const ep = targetPanel.inputEpByRef[target];

        const newTarget = {
            ...targetPanel,
            inputEpValues: {
                ...targetPanel.inputEpValues,
                [ep]: value
            }
        };

        setPanels({
            ...panels,
            [newSource.panelId]: newSource,
            [newTarget.panelId]: newTarget
        });
    };

    const makeConnection = (sourceEpRef: number, targetEpRef: number, sourcePanelId: number, targetPanelId: number): Connection => {
        // makeConnectionHook(source, target, sourcePanelId, targetPanelId);

            const newValue = propagateOutputValue(sourcePanelId, sourceEpRef, targetPanelId, targetEpRef);



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

	const findConnectionByInputEpRef = (ref) => connections.find((connection) => connection.target == ref);
	const findConnectionByOutputEpRef = (ref) => connections.find((connection) => connection.source == ref);

    const removeConnectionByOutputRef = (ref) => {
		const connection = findConnectionByOutputEpRef (ref);

		if (connection) {
			setConnections(connections.filter((connection) => connection.source !== ref));
			return connection;
		}

		return null;
	};

	const removeConnectionByInputRef = (ref) => {
		const connection = findConnectionByInputEpRef(ref);

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
        findConnectionByInputEpRef,
        findConnectionByOutputEpRef,
        removeConnectionByOutputRef,
        removeConnectionByInputRef,
        propagateValueAlong
    };
};

export default Machine;