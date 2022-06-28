import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

import { ConnectorAnchor, Connection } from './types';
import { Panel } from './Panel/types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import './Editor.css';

const { ipcRenderer } = window.require('electron')

let position = 10;

const Editor = (props) => {
    const [ snap, setSnap ] = React.useState<boolean>(false);
    const [ grid, setGrid ] = React.useState<boolean>(true);
    const [ inclusiveSelection, setInclusiveSelection ] = React.useState<boolean>(true);
    const [ play, setPlay ] = React.useState<boolean>(false);
    const [ pause, setPause ] = React.useState<boolean>(false);

    const [ panels, setPanels ] = React.useState<Panel[]>([]);
	const [ connections, setConnections ] = React.useState<Connection[]>([]);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);
    const [ workAreaOffset, setWorkAreaOffset ] = React.useState([0, 0]);

    const makeConnection = (source: number, target: number, sourcePanelId: number, targetPanelId: number): Connection =>
        ({
            source,
            target,
            sourcePanelId,
            targetPanelId
        });

    const makePanel = (type) => {
        const panelId = props.getNextPanelId();
        const panel = props.panels[type].create(`${type} ${panelId}`, panelId, position, position + 100);

        const inputRefs =
            panel.inputEndpoints
                .reduce((a, endpointName) => ({ ...a, [`input${endpointName}`]: props.getNextEndpointId() }), {});

        const outputRefs =
            panel.outputEndpoints
                .reduce((a, endpointName) => ({ ...a, [`output${endpointName}`]: props.getNextEndpointId() }), {});

        position += 20;

        const newPanel = {
            ...panel,
            panelId,
            inputRefs,
            outputRefs,
            width: 134,
            height: 84
        };

        setPanels({ ...panels, [newPanel.panelId]: newPanel });
    };

    const menus = {
        'Panels': {
            submenus: {
                'Basic': {
                    submenus: {
                        'TextInput': {
                            execute: () => makePanel('TextInput')
                        }
                    },
                    chevron: true
                },
                'Sounds': {
                    submenus: {
                        'Audio': {
                            execute: () => makePanel('Audio')
                        }
                    },
                    chevron: true
                },
                'Materials': {
                    // submenus: {

                    // }
                }
            }
        },
        'Controls': {
            submenus: {
                'Play': {
                    execute: () => {
                        if (!play) setPlay(true);
                        setPause(false);
                    },
                    active: play,
                    icon: <FontAwesomeIcon icon={solid('play')} />
                },
                'Pause': {
                    execute: () => {
                        setPause(!pause);
                    },
                    active: pause,
                    icon: <FontAwesomeIcon icon={solid('pause')} />
                },
                'Stop': {
                    execute: () => {
                        if (play) setPlay(false);
                        setPause(false);
                    },
                    icon: <FontAwesomeIcon icon={solid('stop')} />
                }
            }
        },
        'Options': {
            submenus: {
                'Grid': {
                    execute: (item) => {
                        setGrid(!grid);
                    },
                    active: grid
                },
                'Snap': {
                    execute: (item) => {
                        setSnap(!snap);
                    },
                    active: snap
                },
                'Inclusive Selection': {
                    execute: (item) => {
                        setInclusiveSelection(!inclusiveSelection);
                    },
                    active: inclusiveSelection
                }
            }
        }
    };

    return (
        <div className={`Editor ${grid ? 'Gridded' : ''}`} style={{ backgroundPosition: `left ${workAreaOffset[0]}px top ${workAreaOffset[1]}px` }}>
            <Toolbar menus={menus} primary="Panels" />
            <WorkArea
                getNextEndpointId={props.getNextEndpointId}
                play={play} pause={pause}
                snap={snap}
                inclusiveSelection={inclusiveSelection}
                panels={panels} setPanels={setPanels}
                connections={connections} setConnections={setConnections}
                connectorAnchor={connectorAnchor} setConnectorAnchor={setConnectorAnchor}
                makeConnection={makeConnection}
                workAreaOffset={workAreaOffset} setWorkAreaOffset={setWorkAreaOffset}
                />;
        </div>
    );
};

export default Editor;