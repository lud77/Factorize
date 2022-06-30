import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';
import Statusbar from './Statusbar/Statusbar';
import ValuesEditor from './ValuesEditor';

import { ConnectorAnchor, Connection } from './types';
import { Panel } from './Panel/types';

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

        setPanels({ ...panels, [newPanel.panelId]: newPanel });
    };

    const panelMenu = (paletteName, palette) => {
        return Object.keys(palette)
            .map((panel) => ({
                name: panel,
                execute: () => makePanel(paletteName, panel)
            }))
            .reduce((a, v) => ({
                ...a,
                [v.name]: v
            }), {});
    };

    const paletteMenu = (palettes) => {
        return Object.keys(palettes)
            .map((paletteName) => ({
                name: paletteName,
                submenus: panelMenu(paletteName, palettes[paletteName]),
                chevron: true
            }))
            .reduce((a, v) => ({
                ...a,
                [v.name]: v
            }), {});
    };

    const menus = {
        'Panels': { submenus: paletteMenu(props.panelPalettes) },
        'Values': { component: <ValuesEditor /> },
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
            <Statusbar status="Ready" />
        </div>
    );
};

export default Editor;