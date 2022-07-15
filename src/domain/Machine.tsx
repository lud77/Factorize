import { updateSourceFile } from 'typescript';
import { Connection } from '../types/Connection';

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
        updateInputValues(panelId, { [outputEp]: value });
    };

    const updateInputValues = (panelId, updates) => {
        console.log('update input values ', panelId, updates);
        setPanels((panels) => {
            const panel = panels[panelId];

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    inputEpValues: {
                        ...panel.inputEpValues,
                        ...updates
                    }
                }
            };
        });
    };

    const updateOutputValues = (panelId, updates) => {
        console.log('update output values ', panelId, updates);
        setPanels((panels) => {
            const panel = panels[panelId];

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

    const propagateOutputValuesFrom = (panelId, updatedOutputs) => {
        const outgoingConns = findOutgoingConnectionsByPanel(panelId);
        console.log('outgoingConns', outgoingConns);

        setPanels((panels) => {
            const updates = {};

            outgoingConns.forEach((conn) => {
                const [ connectedPanel, connectedEp ] = reifyTarget(conn.targetPanelId, conn.target);
                const [ , outputEp ] = reifySource(panelId, conn.source);
                console.log('forEach', connectedPanel, { [connectedEp]: updatedOutputs[outputEp] });

                if (!updates[conn.targetPanelId]) {
                    updates[conn.targetPanelId] = panels[conn.targetPanelId];
                }

                updates[conn.targetPanelId].inputEpValues[connectedEp] = updatedOutputs[outputEp];
            });

            return {
                ...panels,
                ...updates
            };
        });

        return outgoingConns.map((conn) => conn.targetPanelId);
    };

    const executePanelLogic = (panelId, valueUpdates: object | null = null) => {
        const panel = panels[panelId];

        if (valueUpdates != null) {
            updateInputValues(panelId, valueUpdates);
        }

        Promise.resolve()
            .then(() => [
                panelId,
                panel.execute(panel, {
                    ...panel.inputEpValues,
                    ...valueUpdates
                })
            ])
            .then(([ panelId, outputs ]) => {
                const updatedOutputs = {
                    ...panel.outputEpValues,
                    ...outputs
                };

                console.log('updates', panelId, updatedOutputs);

                updateOutputValues(panelId, updatedOutputs);

                const updatedPanelIds = propagateOutputValuesFrom(panel.panelId, updatedOutputs);

                updatedPanelIds.forEach((panelId) => {
                    executePanelLogic(panelId);
                });
            });
    };

    const setInputValue = (panelId, epRef, newValue) => {
        setPanels((panels) => {
            const panel = panels[panelId];
            const ep = panel.inputEpByRef[epRef];

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    inputEpValues: {
                        ...panel.inputEpValues,
                        [ep]: newValue
                    }
                }
            };
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
        const outGoingConnection = findConnectionBySourceRef(sourceEpRef);

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

    const getSignal = (sourcePanel, sourceOutputEp, targetPanel, targetInputEp) => {
        return (sourcePanel.outputSignalByEp[sourceOutputEp] === targetPanel.inputSignalByEp[targetInputEp])
            ? sourcePanel.outputSignalByEp[sourceOutputEp]
            : null;
    };

    const makeConnection = (sourceEpRef: number, targetEpRef: number, sourcePanelId: number, targetPanelId: number): Connection | null => {
        const [ targetPanel, targetInputEp ] = reifyTarget(targetPanelId, targetEpRef);
        const [ sourcePanel, sourceOutputEp ] = reifySource(sourcePanelId, sourceEpRef);

        const signal = getSignal(sourcePanel, sourceOutputEp, targetPanel, targetInputEp);
        if (signal == null) return null;

        const newValue = getOutputValue(sourcePanelId, sourceEpRef);
        console.log('makeConnection', newValue, { [targetInputEp]: newValue });

        executePanelLogic(targetPanelId, { [targetInputEp]: newValue });

        return {
            source: sourceEpRef,
            target: targetEpRef,
            sourcePanelId,
            targetPanelId,
            active: false,
            signal
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

        const inputSignalByEp =
                panel.inputEndpoints
                    .reduce((a, { name, signal }) => ({ ...a, [`input${name}`]: signal }), {});

        const outputRefs =
            panel.outputEndpoints
                .reduce((a, { name }) => ({ ...a, [`output${name}`]: props.getNextEndpointId() }), {});

        const outputEpByRef =
            panel.outputEndpoints
                .reduce((a, { name }) => ({ ...a, [outputRefs[`output${name}`]]: `output${name}` }), {});

        const outputEpDefaults =
            panel.outputEndpoints
                .reduce((a, { name, defaultValue }) => ({ ...a, [`output${name}`]: defaultValue }), {});

        const outputSignalByEp =
                panel.outputEndpoints
                    .reduce((a, { name, signal }) => ({ ...a, [`output${name}`]: signal }), {});

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
            inputSignalByEp,
            outputRefs,
            outputEpByRef,
            outputEpDefaults,
            outputEpValues: { ...outputEpDefaults },
            outputSignalByEp,
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

    const addOutputEndpoint = (panelId, label, name, defaultValue, signal, value, registry) => {
        setPanels((panels) => {
            const panel = panels[panelId];
            const ep = `output${name}`;
            const epRef = getNextEndpointId();

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    height: panel.height + 21,
                    [registry]: [
                        ...panel[registry],
                        [ep, epRef, label, name]
                    ],
                    [`${registry}Counter`]: panel[`${registry}Counter`] + 1,
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
                    },
                    outputSignalByEp: {
                        ...panel.outputSignalByEp,
                        [ep]: signal
                    }
                }
            };
        });
    };

    const addInputEndpoint = (panelId, label, name, defaultValue, signal, value, registry) => {
        setPanels((panels) => {
            const panel = panels[panelId];
            const ep = `input${name}`;
            const epRef = getNextEndpointId();

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    height: panel.height + 21,
                    [registry]: [
                        ...panel[registry],
                        [ep, epRef, label, name]
                    ],
                    [`${registry}Counter`]: panel[`${registry}Counter`] + 1,
                    inputRefs: {
                        ...panel.inputRefs,
                        [ep]: epRef
                    },
                    inputEpByRef: {
                        ...panel.inputEpByRef,
                        [epRef]: ep
                    },
                    inputEpDefaults: {
                        ...panel.inputEpDefaults,
                        [ep]: defaultValue
                    },
                    inputEpValues: {
                        ...panel.inputEpValues,
                        [ep]: value
                    },
                    inputSignalByEp: {
                        ...panel.inputSignalByEp,
                        [ep]: signal
                    }
                }
            };
        });
    };

    const removeInputEndpoint = (panelId, ep, ref, registry) => {
        console.log('removeInputEndpoint', panelId, ep, ref, registry);
        removeConnectionByTargetRef(ref);

        setPanels((panels) => {
            const panel = panels[panelId];

            delete panel.inputRefs[ep];
            delete panel.inputEpByRef[ref];
            delete panel.inputEpDefaults[ep];
            delete panel.inputEpValues[ep];
            delete panel.inputSignalByEp[ep];

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    height: panel.height - 21,
                    [registry]: panel[registry].filter(([candidateEp]) => candidateEp != ep),
                    inputRefs: { ...panel.inputRefs },
                    inputEpByRef: { ...panel.inputEpByRef },
                    inputEpDefaults: { ...panel.inputEpDefaults },
                    inputEpValues: { ...panel.inputEpValues },
                    inputSignalByEp: { ...panel.inputSignalByEp }
                }
            };
        });
    };

    const removeOutputEndpoint = (panelId, ep, ref, registry) => {
        console.log('removeOutputEndpoint', panelId, ep, ref, registry);
        removeConnectionBySourceRef(ref);

        setPanels((panels) => {
            const panel = panels[panelId];

            delete panel.outputRefs[ep];
            delete panel.outputEpByRef[ref];
            delete panel.outputEpDefaults[ep];
            delete panel.outputEpValues[ep];
            delete panel.outputSignalByEp[ep];

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    height: panel.height - 21,
                    [registry]: panel[registry].filter(([candidateEp]) => candidateEp != ep),
                    outputRefs: { ...panel.outputRefs },
                    outputEpByRef: { ...panel.outputEpByRef },
                    outputEpDefaults: { ...panel.outputEpDefaults },
                    outputEpValues: { ...panel.outputEpValues },
                    outputSignalByEp: { ...panel.outputSignalByEp }
                }
            };
        });
    };

    const removeConnectionsByPanelId = (panelId) => {
        const outGoing = connections.filter((connection) => connection.sourcePanelId === panelId)
        outGoing.forEach((connection) => {
            stopPropagatingValue(connection);
        });

        setConnections((connections) =>
            connections.filter((connection) => (connection.sourcePanelId !== panelId) && (connection.targetPanelId !== panelId))
        );
    };

    const removePanelById = (panelId) => {
		removeConnectionsByPanelId(panelId);

		setPanels((panels) => {
			delete panels[panelId];
			const newPanels = { ...panels };

			return newPanels;
		});
	};

	const findConnectionByTargetRef = (ref) => connections.find((connection) => connection.target == ref);
	const findConnectionBySourceRef = (ref) => connections.find((connection) => connection.source == ref);

    const getConnectionsByTargetRef = (ref) => connections.filter((connection) => connection.target == ref);
	const getConnectionsBySourceRef = (ref) => connections.filter((connection) => connection.source == ref);

    const stopPropagatingValue = (connection) => {
        const { targetPanelId, target } = connection;

        const targetPanel = panels[targetPanelId];
        const ep = targetPanel.inputEpByRef[target]

        executePanelLogic(targetPanelId, { [ep]: targetPanel.inputEpDefaults[ep] });
    };

    const removeConnectionBySourceRef = (ref) => {
		const connection = findConnectionBySourceRef(ref);

        if (connection) {
            stopPropagatingValue(connection);
			setConnections((connections) => connections.filter((connection) => connection.source != ref));
			return connection;
		}

		return null;
	};

	const removeConnectionByTargetRef = (ref) => {
		const connection = findConnectionByTargetRef(ref);

		if (connection) {
            stopPropagatingValue(connection);
            setConnections((connections) => connections.filter((connection) => connection.target != ref));
			return connection;
		}

		return null;
	};

    return {
        makeConnection,
        makePanel,
        findConnectionBySourceRef,
        findConnectionByTargetRef,
        removeConnectionBySourceRef,
        removeConnectionByTargetRef,
        removeConnectionsByPanelId,
        removePanelById,
        propagateValueAlong,
        executePanelLogic,
        addInputEndpoint,
        addOutputEndpoint,
        removeInputEndpoint,
        removeOutputEndpoint
    };
};

export default Machine;