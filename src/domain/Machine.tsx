import { flushSync } from 'react-dom';

import makePanelFactory from './MakePanel';
import mostRecent from '../utils/mostRecent';

import { Connection } from '../types/Connection';
import { Point } from '../types/Point';
import { PanelCoords } from '../types/PanelCoords';
import { Panel } from '../types/Panel';

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
        console.log('reifyTarget - before panels');
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
        setPanels((panels) => {
            const panel = panels[panelId];
            console.log('update input values ', panelId, updates, panel.inputEpValues);

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
                            setPanelCoords,
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

    const pulses: Array<Array<any>> = [];

    const sendPulseTo = (panelId, ep) => {
        pulses.push([panelId, ep]);

        return spoolPulses();
    };

    const spoolPulses = () => {
        if (pulses.length == 0) return Promise.resolve();

        return Promise.resolve()
            .then(() => {
                const [ panelId, ep ]: Array<any> = pulses.shift() as Array<any>;
                return propagatePulseTo(panelId, ep);
            })
            .then(spoolPulses);
    };

    const propagatePulseTo = (panelId, ep) => {
        return new Promise((res) => {
            const connections = mostRecent(setConnections);

            console.log('propagatePulseTo - connections', connections);
            timers.setTimer(() => {
                const epRef = getPanelOutputRef(panelId, ep);
                let pulseConnections;
                flushSync(() => {
                    pulseConnections = getConnectionsBySourceRef(epRef, 'Pulse');
                });

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
                updatedPanelsIds.forEach((panelId) => propagateOutputValuesFrom(panelId, (panelUpdates as object)[panelId]?.outputEpValues));

                res(null);
            }, 0);
        });
    };

    const getSignal = (sourcePanel, sourceOutputEp, targetPanel, targetInputEp) => {
        return (sourcePanel.outputSignalByEp[sourceOutputEp] === targetPanel.inputSignalByEp[targetInputEp])
            ? sourcePanel.outputSignalByEp[sourceOutputEp]
            : null;
    };

    const getSignalType = (sourcePanel, sourceOutputEp, targetPanel, targetInputEp) => {
        return (sourcePanel.outputTypeByEp[sourceOutputEp] === targetPanel.inputTypeByEp[targetInputEp] || sourcePanel.outputTypeByEp[sourceOutputEp] === 'any' || targetPanel.inputTypeByEp[targetInputEp] === 'any')
            ? sourcePanel.outputTypeByEp[sourceOutputEp]
            : null;
    };

    const makeConnection = (sourceEpRef: number, targetEpRef: number, sourcePanelId: number, targetPanelId: number): Connection | null => {
        const [ targetPanel, targetInputEp ] = reifyTarget(targetPanelId, targetEpRef);
        const [ sourcePanel, sourceOutputEp ] = reifySource(sourcePanelId, sourceEpRef);

        const signal = getSignal(sourcePanel, sourceOutputEp, targetPanel, targetInputEp);
        if (signal == null) return null;

        const signalType = getSignalType(sourcePanel, sourceOutputEp, targetPanel, targetInputEp);
        if (signal == 'Value' && signalType == null) return null;

        const newValue = getOutputValue(sourcePanelId, sourceEpRef);
        console.log('makeConnection', targetPanelId, signal, newValue, { [targetInputEp]: newValue });

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

    const makePanel = makePanelFactory(dictionary, getNextPanelId, getNextEndpointId, position, workAreaOffset);

    const addPanel = (type, coords?: Point, toTheLeft = false) => {
        const [newPanel, newPanelCoords]: [Panel, PanelCoords] = makePanel(type, coords ? { x: coords.x - (toTheLeft ? dictionary[type].width : 0), y: coords.y } : undefined);

        setPanels((panels) => {
            return {
                ...panels,
                [newPanel.panelId as number]: newPanel
            };
        });

        setPanelCoords((panelCoords) => {
            return {
                ...panelCoords,
                [newPanelCoords.panelId]: newPanelCoords
            };
        });

        return [newPanel, newPanelCoords];
    };

    const addOutputEndpoint = (panelId, label, name, type, defaultValue, signal, value, registry) => {
        setPanelCoords((panelCoords) => {
            const panelCoord = panelCoords[panelId];

            return {
                ...panelCoords,
                [panelId]: {
                    ...panelCoord,
                    height: panelCoord.height + 21,
                    minHeight: panelCoord.minHeight + 21,
                }
            };
        });

        setPanels((panels) => {
            const panel = panels[panelId];
            const ep = `output${name}`;
            const epRef = getNextEndpointId();

            return {
                ...panels,
                [panelId]: {
                    ...panel,
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
        setPanelCoords((panelCoords) => {
            const panelCoord = panelCoords[panelId];

            return {
                ...panelCoords,
                [panelId]: {
                    ...panelCoord,
                    height: panelCoord.height + 21,
                    minHeight: panelCoord.minHeight + 21
                }
            };
        });

        setPanels((panels) => {
            const panel = panels[panelId];
            const ep = `input${name}`;
            const epRef = getNextEndpointId();

            return {
                ...panels,
                [panelId]: {
                    ...panel,
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

        setPanelCoords((panelCoords) => {
            const panelCoord = panelCoords[panelId];

            return {
                ...panelCoords,
                [panelId]: {
                    ...panelCoord,
                    height: panelCoord.height - 21,
                    minHeight: panelCoord.minHeight - 21,
                }
            };
        });

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

        executePanelLogic(panelId);
    };

    const removeOutputEndpoint = (panelId, ep, ref, registry) => {
        console.log('removeOutputEndpoint', panelId, ep, ref, registry);
        removeConnectionBySourceRef(ref);

        setPanelCoords((panelCoords) => {
            const panelCoord = panelCoords[panelId];

            return {
                ...panelCoords,
                [panelId]: {
                    ...panelCoord,
                    height: panelCoord.height - 21,
                    minHeight: panelCoord.minHeight - 21,
                }
            };
        });

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
                    ...copy.inputEpDefaults
                }
            };

            console.log('copy', copy);

            const newPanels = {
                ...panels,
                [newPanel.panelId as number]: {
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
            const updatePairs: Array<[number, PanelCoords]> =
                (Object.values(panelCoords) as PanelCoords[])
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