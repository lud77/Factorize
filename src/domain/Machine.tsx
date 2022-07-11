import { Connection } from '../types/Machine';

let position = 10;

const Machine = ({
    props,
    panels, setPanels,
    connections, setConnections,
    workAreaOffset,
    getNextEndpointId
}) => {
    const reifySource = (sourcePanelId, sourceEpRef) => {
        const panel = panels[sourcePanelId];
        const ep = panel.outputEpByRef[sourceEpRef];
        return [ panel, ep ];
    };

    const reifyTarget = (targetPanelId, targetEpRef) => {
        const panel = panels[targetPanelId];
        const ep = panel.inputEpByRef[targetEpRef];
        return [ panel, ep ];
    };

    const getOutputValue = (panelId, epRef) => {
        const [ panel, ep ] = reifySource(panelId, epRef);
        return panel.outputEpValues[ep];
    };

    const findOutgoingConnectionsByPanel = (panelId) => connections.filter((connection) => connection.sourcePanelId == panelId);

    const setOutputValue = (panelId, outputEp, value) => {
        updateOutputPanels(panelId, { [outputEp]: value });
    };

    const updateOutputPanels = (panelId, updates) => {
        setPanels((panels) => {
            const panel = panels[panelId];

            console.log('updateOutputPanels', panelId, {
                ...panel.outputEpValues,
                ...updates
            });

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    outputEpValues: {
                        ...panel.outputEpValues,
                        ...updates
                    }
                }
            };
        });
    };

    const executePanelLogic = (panelId, valueUpdates) => {
        const panel = panels[panelId];

        setPanels((panels) => {
            const panel = panels[panelId];

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    inputEpValues: {
                        ...panel.inputEpValues,
                        ...valueUpdates
                    }
                }
            };
        });

        Promise.resolve()
            .then(() => [
                panelId,
                panel.execute(panel, {
                    ...panel.inputEpValues,
                    ...valueUpdates
                })
            ])
            .then(([ panelId, outputs ]) => {
                const updates = {
                    ...panel.outputEpValues,
                    ...outputs
                };

                console.log('updates', updates);

                updateOutputPanels(panelId, updates);

                const outgoingConns = findOutgoingConnectionsByPanel(panel.panelId);
                console.log('outgoingConns', outgoingConns);

                outgoingConns.forEach((conn) => {
                    const [ connectedPanel, connectedEp ] = reifyTarget(conn.targetPanelId, conn.target);
                    const [ , outputEp ] = reifySource(panelId, conn.source);
                    console.log('forEach', connectedPanel, { [connectedEp]: updates[outputEp] });

                    executePanelLogic(conn.targetPanelId, { [connectedEp]: updates[outputEp] });
                });
            });
    };

    const setInputValue = (panelId, epRef, newValue) => {
        setPanels((panels) => {
            const panel = panels[panelId];
            const ep = panel.inputEpByRef[epRef];

            const updatedPanel = {
                ...panels,
                [panelId]: {
                    ...panel,
                    inputEpValues: {
                        ...panel.inputEpValues,
                        [ep]: newValue
                    }
                }
            };

            return updatedPanel;
        });

        return newValue;
    };

    const propagateOutputValue = (sourcePanelId, sourceEpRef, targetPanelId, targetEpRef) => {
        const newValue = getOutputValue(sourcePanelId, sourceEpRef);
        setInputValue(targetPanelId, targetEpRef, newValue);
    };

    const propagateValueAlong = (sourcePanelId, sourceOutputEp, value) => {
        setOutputValue(sourcePanelId, sourceOutputEp, value);

        const sourcePanel = panels[sourcePanelId];
        const sourceEpRef = sourcePanel.outputRefs[sourceOutputEp];
        const outGoingConnection = findConnectionByOutputEpRef(sourceEpRef);

        if (!outGoingConnection) return;

        setPanels((panels) => {
            const sourcePanel = panels[sourcePanelId];
            const sourceEpRef = sourcePanel.outputRefs[sourceOutputEp];

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

            return {
                ...panels,
                [targetPanelId]: newTarget
            };
        });
    };

    const makeConnection = (sourceEpRef: number, targetEpRef: number, sourcePanelId: number, targetPanelId: number): Connection => {
        const newValue = getOutputValue(sourcePanelId, sourceEpRef);
        const [ targetPanel, targetInputEp ] = reifyTarget(targetPanelId, targetEpRef);

        console.log('makeConnection', newValue, { [targetInputEp]: getOutputValue(sourcePanelId, sourceEpRef) });

        executePanelLogic(targetPanelId, { [targetInputEp]: getOutputValue(sourcePanelId, sourceEpRef) });

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

        setPanels((panels) => {
            return {
                ...panels,
                [panelId]: newPanel
            };
        });
    };

    const addEndpoint = (panelId, label, name, defaultValue, value, register) => {
        setPanels((panels) => {
            const panel = panels[panelId];
            const ep = `output${name}`;
            const epRef = getNextEndpointId();

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    height: panel.height + 21,
                    [register]: [
                        ...panel[register],
                        [ep, epRef, label, name]
                    ],
                    outputRefs: {
                        ...panel.outputRefs,
                        [ep]: epRef
                    },
                    outputEpByRef: {
                        ...panel.outputEpByRef,
                        [epRef]: ep
                    },
                    outputEpDefaults: {
                        ...panel.outputEpDefaults,
                        [ep]: defaultValue
                    },
                    outputEpValues: {
                        ...panel.outputEpValues,
                        [ep]: value
                    }
                }
            };
        });
    };

	const findConnectionByInputEpRef = (ref) => connections.find((connection) => connection.target == ref);
	const findConnectionByOutputEpRef = (ref) => connections.find((connection) => connection.source == ref);

    const stopPropagatingValue = (connection) => {
        const { targetPanelId, target } = connection;

        const targetPanel = panels[targetPanelId];
        const ep = targetPanel.inputEpByRef[target]

        executePanelLogic(targetPanelId, { [ep]: targetPanel.inputEpDefaults[ep] });
    };

    const removeConnectionByOutputRef = (ref) => {
		const connection = findConnectionByOutputEpRef(ref);

		if (connection) {
            stopPropagatingValue(connection);
			setConnections(connections.filter((connection) => connection.source !== ref));
			return connection;
		}

		return null;
	};

	const removeConnectionByInputRef = (ref) => {
		const connection = findConnectionByInputEpRef(ref);

		if (connection) {
            stopPropagatingValue(connection);
			setConnections(connections.filter((connection) => connection.target !== ref));
			return connection;
		}

		return null;
	};

    return {
        makeConnection,
        makePanel,
        findConnectionByInputEpRef,
        findConnectionByOutputEpRef,
        removeConnectionByOutputRef,
        removeConnectionByInputRef,
        propagateValueAlong,
        executePanelLogic,
        addEndpoint
    };
};

export default Machine;