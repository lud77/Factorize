import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';
import Statusbar from './Statusbar/Statusbar';
import ValuesEditor from './ValuesEditor/ValuesEditor';

import { ConnectorAnchor } from '../../types/ConnectorAnchor';
import { Connection } from '../../types/Machine';

import Machine from '../../domain/Machine';
import Walker from '../../domain/Walker';
import Palette from '../../domain/Palette';

import './Editor.css';

const { ipcRenderer } = window.require('electron')

const Editor = (props) => {
    const [ snap, setSnap ] = React.useState<boolean>(false);
    const [ grid, setGrid ] = React.useState<boolean>(true);
    const [ inclusiveSelection, setInclusiveSelection ] = React.useState<boolean>(true);

    const [ play, setPlay ] = React.useState<boolean>(false);
    const [ pause, setPause ] = React.useState<boolean>(false);

    const [ focused, setFocus ] = React.useState<number | null>(null);
    const [ panels, setPanels ] = React.useState<object>({});
	const [ connections, setConnections ] = React.useState<Connection[]>([]);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);
    const [ workAreaOffset, setWorkAreaOffset ] = React.useState([0, 0]);

    const {
        makeConnection,
        setPanel,
        makePanel,
        removeConnectionByOutputRef,
        removeConnectionByInputRef
    } = Machine({
        props,
        panels, setPanels,
        connections, setConnections,
        workAreaOffset
    });

    const {
        pressPlay,
        pressPause,
        pressStop
    } = Walker({
        panels, setPanels,
        setPanel,
        connections, setConnections,
        play, setPlay,
        pause, setPause
    });

    const { paletteMenu, flagPalette } = Palette(makePanel);

    const menus = {
        'Panels': { submenus: paletteMenu(props.panelPalettes) },
        'Values': { component: <ValuesEditor panel={focused !== null ? panels[focused] : null} setPanel={setPanel} /> },
        'Controls': {
            submenus: {
                'Play': {
                    execute: pressPlay,
                    active: play,
                    icon: <FontAwesomeIcon icon={solid('play')} />
                },
                'Pause': {
                    execute: pressPause,
                    active: pause,
                    icon: <FontAwesomeIcon icon={solid('pause')} />
                },
                'Stop': {
                    execute: pressStop,
                    icon: <FontAwesomeIcon icon={solid('stop')} />
                }
            }
        },
        'Options': {
            submenus: flagPalette({
                'Grid': [grid, setGrid],
                'Snap': [snap, setSnap],
                'Inclusive Selection': [inclusiveSelection, setInclusiveSelection]
            })
        }
    };

    return (
        <div className={`Editor ${grid ? 'Gridded' : ''}`} style={{ backgroundPosition: `left ${workAreaOffset[0]}px top ${workAreaOffset[1]}px` }}>
            <Toolbar menus={menus} primary="Panels" />
            <WorkArea
                machine={{
                    removeConnectionByOutputRef,
                    removeConnectionByInputRef
                }}
                getNextEndpointId={props.getNextEndpointId}
                play={play} pause={pause}
                snap={snap}
                focused={focused} setFocus={setFocus}
                inclusiveSelection={inclusiveSelection}
                panels={panels} setPanels={setPanels} setPanel={setPanel}
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