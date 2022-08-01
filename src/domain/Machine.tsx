import { flushSync } from 'react-dom';

import mostRecent from '../utils/mostRecent';

import { Connection } from '../types/Connection';

let position = 10;

const Machine = ({
    dictionary,
    graphState,
    workAreaOffset,
    getNextPanelId,
    getNextEndpointId,
    timers
}) => {
    const {
        panels, setPanels,
        panelCoords, setPanelCoords,
        connections, setConnections
    } = graphState;

    const reifySource = (sourcePanelId, sourceEpRef) => {
        const panels = mostRecent(setPanels);
        const panel = panels[sourcePanelId];
        const ep = panel.outputEpByRef[sourceEpRef];
        return [ panel, ep ];
    };

    const reifyTarget = (targetPanelId, targetEpRef) => {
        console.log('reifyTarget - panels before', panels);
        const panels = mostRecent(setPanels);
        console.log('reifyTarget - panels recent - targetPanelId', panels, targetPanelId);
        const panel = panels[targetPanelId];
        const ep = panel.inputEpByRef[targetEpRef];
        return [ panel, ep ];
    };

    const getPanelInputRef = (panelId, ep) => {
        const panels = mostRecent(setPanels);
        return panels[panelId].inputRefs[ep];
    };

    const getPanelOutputRef = (panelId, ep) => {
        const panels = mostRecent(setPanels);
        return panels[panelId].outputRefs[ep];
    };

    const getOutputValue = (panelId, epRef) => {
        const [ panel, ep ] = reifySource(panelId, epRef);
        return panel.outputEpValues[ep];
    };

    const findOutgoingConnectionsByPanel = (panelId) => {
        const connections = mostRecent(setConnections);
        return connections.filter((connection) => connection.sourcePanelId == panelId);
    }

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
        console.log('propagateOutputValuesFrom - outgoingConns', outgoingConns);

        const panels = mostRecent(setPanels);
        const updates = {};

        outgoingConns.forEach((conn) => {
            const [ connectedPanel, connectedEp ] = reifyTarget(conn.targetPanelId, conn.target);
            const [ , outputEp ] = reifySource(panelId, conn.source);
            console.log('forEach', connectedPanel, outputEp, updatedOutputs, { [connectedEp]: updatedOutputs[outputEp] });

            if (!updates[conn.targetPanelId]) {
                updates[conn.targetPanelId] = panels[conn.targetPanelId];
            }

            updates[conn.targetPanelId].inputEpValues[connectedEp] = updatedOutputs[outputEp];
        });

        const updatedPanels = {
            ...panels,
            ...updates
        };

        const updatedPanelsIds = outgoingConns.map((conn) => conn.targetPanelId);
        updatedPanelsIds.forEach((panelId) => executePanelLogic(panelId));

        setPanels(updatedPanels);
    };

    const executePanelLogic = (panelId, valueUpdates: object | null = null) => {
        console.log('executePanelLogic - valueUpdates', panelId, valueUpdates);

        if (valueUpdates != null) {
            updateInputValues(panelId, valueUpdates);
        }

        return Promise.resolve()
            .then(() => {
                const panels = mostRecent(setPanels);
                const panel = panels[panelId];
                console.log('executePanelLogic - panels', panels);
                const changes = {
                    ...panel.inputEpValues || {},
                    ...valueUpdates
                };

                return Promise.all([
                    changes,
                    panel,
                    panel.execute(
                        panel,
                        changes,
                        {
                            setPanels,
                            sendPulseTo,
                            timers
                        }
                    )
                ]);
            })
            .then(([changes, panel, outputs]) => {
                if (outputs === changes) return;

                const updatedOutputs = {
                    ...panel.outputEpValues || {},
                    ...outputs
                };

                console.log('updates', panelId, updatedOutputs);

                updateOutputValues(panelId, updatedOutputs);

                return propagateOutputValuesFrom(panelId, updatedOutputs);
            });
    };

    const sendPulseTo = (panelId, ep) => {
        const connections = mostRecent(setConnections);

        console.log('sendPulseTo - connections', connections);
        timers.setTimer(() => {
            console.log('timer in sendPulseTo');
            const epRef = getPanelOutputRef(panelId, ep);
            let pulseConnections;
            flushSync(() => {
                pulseConnections = getConnectionsBySourceRef(epRef, 'Pulse');
            });
            console.log('Sending pulse through', ep, epRef);
            console.log('pulseConnections', pulseConnections);

            console.log('before', panels);

            let panelUpdates: object | null = null;

            flushSync(() => {
                setPanels((panels) => {
                    panelUpdates =
                        pulseConnections
                            .map((connection) => {
                                const targetPanel = panels[connection.targetPanelId];
                                if (!targetPanel) return null;

                                const ep = targetPanel.inputEpByRef[connection.target];
                                const updates = targetPanel.onPulse(ep, targetPanel, { sendPulseTo });

                                return {
                                    [targetPanel.panelId]: {
                                        ...targetPanel,
                                        outputEpValues: {
                                            ...targetPanel.outputEpValues,
                                            ...updates
                                        }
                                    }
                                };
                            })
                            .filter(Boolean)
                            .reduce((a, v) => ({ ...a, ...v }), {});

                    console.log('sendPulseTo updates', panelUpdates);

                    return {
                        ...panels,
                        ...panelUpdates
                    }
                });
            });

            console.log('after', panels);

            const updatedPanelsIds = getConnectionsBySourceRef(epRef, 'Pulse').map((connection) => connection.targetPanelId);

            console.log('updatedPanelsIds outside', updatedPanelsIds);
            if (panelUpdates == null) return;
            updatedPanelsIds.forEach((panelId) => propagateOutputValuesFrom(panelId, panelUpdates[panelId]?.outputEpValues));
        }, 0);
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

        executePanelLogic(targetPanelId, (signal === 'Value') ? { [targetInputEp]: newValue } : null);

        return {
            source: sourceEpRef,
            target: targetEpRef,
            sourcePanelId,
            targetPanelId,
            active: false,
            signal
        };
    };

    const makePanel = (type) => {
        const panelId = getNextPanelId();
        const panel = dictionary[type].create(panelId);

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
            title: `${type} ${panelId}`
        };

        const newPanelCoords = {
            panelId,
            left: position - workAreaOffset[0],
            top: position + 100 - workAreaOffset[1]
        };

        return [newPanel, newPanelCoords];
    };

    const addPanel = (type) => {
        const [newPanel, newPanelCoords] = makePanel(type);

        setPanels((panels) => {
            return {
                ...panels,
                [newPanel.panelId]: newPanel
            };
        });

        setPanelCoords((panelCoords) => {
            return {
                ...panelCoords,
                [newPanelCoords.panelId]: newPanelCoords
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

        flushSync(() => {
            setConnections((connections) =>
                connections.filter((connection) => (connection.sourcePanelId !== panelId) && (connection.targetPanelId !== panelId))
            );
        });
    };

    const removePanelById = (panelId) => {
        removeConnectionsByPanelId(panelId);

        flushSync(() => {
            setPanels((panels) => {
                if (panels[panelId]?.dispose) {
                    panels[panelId].dispose(panels[panelId], { clearTimer: timers.clearTimer });
                }

                delete panels[panelId];
                const newPanels = { ...panels };

                return newPanels;
            });
        });

        setPanelCoords((panelCoords) => {
            delete panelCoords[panelId];
            const newPanelCoords = { ...panelCoords };

            return newPanelCoords;
        });
    };

    const duplicatePanelById = (panelId) => {
        const source = panels[panelId];
        const [copy, copyCoords] = makePanel(source.type);

        flushSync(() => {
            setPanels((panels) => {
                const source = panels[panelId];

                const {
                    width,
                    height,
                    inputEpValues
                } = source;

                const newPanel = {
                    ...copy,
                    width,
                    height,
                    inputEpValues: {
                        ...inputEpValues,
                        ...copy.inputDefaultValues
                    }
                };

                console.log('copy', copy);

                const newPanels = {
                    ...panels,
                    [newPanel.panelId]: {
                        ...newPanel
                    }
                };

                console.log('newPanels', newPanels);

                return newPanels;
            });
        });

        setPanelCoords((panelCoords) => {
            const newPanelCoords = {
                ...copyCoords,
                [copyCoords.panelId]: {
                    ...copyCoords
                }
            };

            return newPanelCoords;
        });
	};

    const findConnectionByTargetRef = (ref, signal: string | null = null) => connections.find((connection) => (connection.target == ref) && (!signal || connection.signal == signal));
	const findConnectionBySourceRef = (ref, signal: string | null = null) => connections.find((connection) => (connection.source == ref) && (!signal || connection.signal == signal));

	const getConnectionsByTargetRef = (ref, signal: string | null = null) => {
        const connections = mostRecent(setConnections);
        return connections.filter((connection) => (connection.target == ref) && (!signal || connection.signal == signal));
    };

	const getConnectionsBySourceRef = (ref, signal: string | null = null) => {
        const connections = mostRecent(setConnections);
        return connections.filter((connection) => (connection.source == ref) && (!signal || connection.signal == signal));
    };

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
            flushSync(() => {
			    setConnections((connections) => connections.filter((connection) => connection.source != ref));
            });
			return connection;
		}

		return null;
	};

	const removeConnectionByTargetRef = (ref) => {
		const connection = findConnectionByTargetRef(ref);

		if (connection) {
            stopPropagatingValue(connection);
            console.log('removeConnection before', connections);
            flushSync(() => {
                setConnections((connections) => {
                    console.log('removeConnection inside before A', connections);
                    const filtered = connections.filter((connection) => connection.target != ref);
                    console.log('removeConnection inside after A', filtered);
                    return filtered;
                });
            });

            setConnections((connections) => {
                console.log('removeConnection inside before B', connections);
                const filtered = connections.filter((connection) => connection.target != ref);
                console.log('removeConnection inside after B', filtered);
                return filtered;
            });

            console.log('removeConnection after', connections);
			return connection;
		}

		return null;
	};

    return {
        makeConnection,
        addPanel,
        findConnectionBySourceRef,
        findConnectionByTargetRef,
        getConnectionsBySourceRef,
        getConnectionsByTargetRef,
        // removeConnectionBySourceRef,
        removeConnectionByTargetRef,
        removeConnectionsByPanelId,
        removePanelById,
        executePanelLogic,
        addInputEndpoint,
        addOutputEndpoint,
        removeInputEndpoint,
        removeOutputEndpoint,
        getPanelInputRef,
        getPanelOutputRef,
        sendPulseTo,
        duplicatePanelById
    };
};

export default Machine;