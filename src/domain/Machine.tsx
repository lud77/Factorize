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
        flushSync(() => {
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
        console.log('executePanelLogic - panelId, valueUpdates', panelId, valueUpdates);

        if (valueUpdates != null) {
            updateInputValues(panelId, valueUpdates);
        }

        return Promise.resolve()
            .then(() => {
                const panels = mostRecent(setPanels);
                const panel = panels[panelId];
                console.log('executePanelLogic - panels', panels);

                if (!panel) return null;

                const changes = {
                    ...panel.inputEpValues || {},
                    ...valueUpdates
                };

                return Promise.all([
                    panel,
                    changes,
                    panel.execute(
                        panel,
                        changes,
                        {
                            setPanels,
                            executePanelLogic,
                            sendPulseTo,
                            timers
                        }
                    )
                ]);
            })
            .then((result) => {
                if (!result) return;

                const [panel, changes, outputs] = result;

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

    const pulses = [];

    const sendPulseTo = (panelId, ep) => {
        pulses.push([panelId, ep]);

        return spoolPulses();
    };

    const spoolPulses = () => {
        if (pulses.length == 0) return Promise.resolve();

        return Promise.resolve()
            .then(() => {
                const [ panelId, ep ] = pulses.shift();
                return propagatePulseTo(panelId, ep);
            })
            .then(spoolPulses);
    };

    const propagatePulseTo = (panelId, ep) => {
        return new Promise((res) => {
            const connections = mostRecent(setConnections);

            console.log('propagatePulseTo - connections', connections);
            timers.setTimer(() => {
                console.log('timer in propagatePulseTo');
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
                                    const updates = targetPanel.onPulse(ep, targetPanel, { sendPulseTo, executePanelLogic });
                                    console.log('propagatePulseTo - updates', updates);
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

                        console.log('propagatePulseTo updates', panelUpdates);

                        return {
                            ...panels,
                            ...panelUpdates
                        }
                    });
                });

                console.log('after', panels);

                const updatedPanelsIds = getConnectionsBySourceRef(epRef, 'Pulse').map((connection) => connection.targetPanelId);

                console.log('updatedPanelsIds outside', updatedPanelsIds);
                if (panelUpdates == null) res(null);
                updatedPanelsIds.forEach((panelId) => propagateOutputValuesFrom(panelId, panelUpdates[panelId]?.outputEpValues));

                res(null);
            }, 0);
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

    const makePanel = (panelType) => {
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

        console.log('outputEpDefaults', outputEpDefaults);

        position = (position + 20) % 100;

        const newPanel = {
            // resizer: 'none',
            ...panel,
            // minWidth: panel.minWidth || panel.width || 134,
            // minHeight: panel.minHeight || panel.height || 84,
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

        // if (newPanel.resizer != 'none') {
        //     const resizerHeight = 9;
        //     newPanel.height += resizerHeight;
        //     newPanel.minHeight += resizerHeight;
        // }

        const resizerHeight = resizer != 'none' ? 9 : 0;

        const newPanelCoords = {
            panelId,
            width: (width || 134) + resizerHeight,
            height: (height || 84) + resizerHeight,
            minWidth: (minWidth || width || 134) + resizerHeight,
            minHeight: (minHeight || height || 84) + resizerHeight,
            left: position - workAreaOffset[0],
            top: position + 100 - workAreaOffset[1],
            resizer: resizer || 'none'
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

    const addOutputEndpoint = (panelId, label, name, type, defaultValue, signal, value, registry) => {
        setPanels((panels) => {
            const panel = panels[panelId];
            const ep = `output${name}`;
            const epRef = getNextEndpointId();

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    height: panel.height + 21,
                    minHeight: panel.minHeight + 21,
                    [registry]: [
                        ...panel[registry],
                        [ep, epRef, label, name, type]
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
                    },
                    outputTypeByEp: {
                        ...panel.outputTypeByEp,
                        [ep]: type
                    }
                }
            };
        });
    };

    const addInputEndpoint = (panelId, label, name, type, defaultValue, signal, value, registry) => {
        setPanels((panels) => {
            const panel = panels[panelId];
            const ep = `input${name}`;
            const epRef = getNextEndpointId();

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    height: panel.height + 21,
                    minHeight: panel.minHeight + 21,
                    [registry]: [
                        ...panel[registry],
                        [ep, epRef, label, name, type]
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
                    },
                    inputTypeByEp: {
                        ...panel.inputTypeByEp,
                        [ep]: type
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
            delete panel.inputTypeByEp[ep];

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    height: panel.height - 21,
                    minHeight: panel.minHeight - 21,
                    [registry]: panel[registry].filter(([candidateEp]) => candidateEp != ep),
                    inputRefs: { ...panel.inputRefs },
                    inputEpByRef: { ...panel.inputEpByRef },
                    inputEpDefaults: { ...panel.inputEpDefaults },
                    inputEpValues: { ...panel.inputEpValues },
                    inputSignalByEp: { ...panel.inputSignalByEp },
                    inputTypeByEp: { ...panel.inputTypeByEp }
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
            delete panel.outputTypeByEp[ep];

            return {
                ...panels,
                [panelId]: {
                    ...panel,
                    height: panel.height - 21,
                    minHeight: panel.minHeight - 21,
                    [registry]: panel[registry].filter(([candidateEp]) => candidateEp != ep),
                    outputRefs: { ...panel.outputRefs },
                    outputEpByRef: { ...panel.outputEpByRef },
                    outputEpDefaults: { ...panel.outputEpDefaults },
                    outputEpValues: { ...panel.outputEpValues },
                    outputSignalByEp: { ...panel.outputSignalByEp },
                    outputTypeByEp: { ...panel.outputTypeByEp }
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

    const removeConnectionsByPanelIds = (panelIds) => {
        const outGoing = connections.filter((connection) => panelIds.includes(connection.sourcePanelId))
        outGoing.forEach((connection) => {
            stopPropagatingValue(connection);
        });

        flushSync(() => {
            setConnections((connections) =>
                connections.filter((connection) => !panelIds.includes(connection.sourcePanelId) && !panelIds.includes(connection.targetPanelId))
            );
        });
    };

    const removePanelsByIds = (selectedPanels) => {
        removeConnectionsByPanelIds(selectedPanels);

        flushSync(() => {
            setPanels((panels) => {
                selectedPanels.forEach((panelId) => {
                    if (panels[panelId]?.dispose) {
                        panels[panelId].dispose(panels[panelId], { clearTimer: timers.clearTimer });
                    }

                    delete panels[panelId];
                });

                return { ...panels };
            });
        });

        setPanelCoords((panelCoords) => {
            selectedPanels.forEach((panelId) => {
                delete panelCoords[panelId];
            });

            return { ...panelCoords };
        });
    };

    const duplicatePanelById = (panelId) => {
        const source = panels[panelId];
        const [copy, copyCoords] = makePanel(source.type);

        setPanelCoords((panelCoords) => {
            const source = panelCoords[panelId];

            const {
                width,
                height
            } = source;

            const newPanelCoords = {
                ...panelCoords,
                [copyCoords.panelId]: {
                    ...copyCoords,
                    width,
                    height
                }
            };

            return newPanelCoords;
        });

        setPanels((panels) => {
            const source = panels[panelId];

            const {
                inputEpValues
            } = source;

            const newPanel = {
                ...copy,
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

    const groupPanelsByIds = (panelIds) => {
        setPanelCoords((panelCoords) => {
            const updatePairs =
                panelIds
                    .map((panelId) => [panelId, panelCoords[panelId]])
                    .map(([ panelId, panelCoord ]) => {
                        if (panelCoord.group == null) {
                            panelCoord.group = new Set();
                        }

                        panelIds.forEach((panelIdToGroup) => {
                            if (panelIdToGroup === panelId) return;

                            panelCoord.group.add(panelIdToGroup);
                        });

                        return [panelId, { ...panelCoord }];
                    });

            const updates = Object.fromEntries(updatePairs);

            console.log('groupPanelsByIds', updates);

            return {
                ...panelCoords,
                ...updates
            };
        });
    };

    const ungroupPanelById = (panelId) => {
        setPanelCoords((panelcoords) => {
            const updatePairs =
                Object.values(panelCoords)
                    .map((panelCoord) => {
                        if (panelCoord.group == null) return [panelCoord.panelId, panelCoord];

                        panelCoord.group.delete(panelId);
                        return [panelCoord.panelId, { ...panelCoord }];
                    });

            const updates = Object.fromEntries(updatePairs);

            return {
                ...panelCoords,
                ...updates,
                [panelId]: {
                    ...panelCoords[panelId],
                    group: new Set()
                }
            };
        });
    };

    const ungroupPanelsByIds = (panelIds) => {
        setPanelCoords((panelcoords) => {
            const updatePairs =
                panelIds
                    .map((panelId) => [panelId, panelCoords[panelId]])
                    .map(([ panelId, panelCoord ]) => {
                        if (panelCoord.group == null) return [panelId, panelCoord];

                        panelIds.forEach((panelIdToUngroup) => {
                            if (panelIdToUngroup === panelId) return;

                            panelCoord.group.delete(panelIdToUngroup);
                        });

                        return [panelId, { ...panelCoord }];
                    });

            const updates = Object.fromEntries(updatePairs);

            return {
                ...panelCoords,
                ...updates
            };
        });
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
        removeConnectionsByPanelIds,
        removePanelsByIds,
        executePanelLogic,
        addInputEndpoint,
        addOutputEndpoint,
        removeInputEndpoint,
        removeOutputEndpoint,
        getPanelInputRef,
        getPanelOutputRef,
        sendPulseTo,
        duplicatePanelById,
        groupPanelsByIds,
        ungroupPanelById,
        ungroupPanelsByIds
    };
};

export default Machine;