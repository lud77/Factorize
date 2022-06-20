import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

import getSequence from '../../utils/sequence';

import { ConnectorAnchor, Connection } from './types';
import { Panel } from './Panel/types';

import './Editor.css';

const { ipcRenderer } = window.require('electron')

const getNextComponent = getSequence();

let position = 10;

const Editor = (props) => {
    const makeConnection = (source, target): Connection =>
        ({
            source,
            target
        });

    const makePanel = (type) => {
        const panel = props.panels[type].create(`${type} ${getNextComponent()}`, position, position);
        position += 20;
        setPanels([...panels, {
            ...panel,
            width: 120,
            height: 70
        }]);
    };

    const toolbar = React.useRef<any>();

    const [ snap, setSnap ] = React.useState<boolean>(false);
    const [ grid, setGrid ] = React.useState<boolean>(true);
    const [ inclusiveSelection, setInclusiveSelection ] = React.useState<boolean>(true);

    const [ panels, setPanels ] = React.useState<Panel[]>([]);
	const [ connections, setConnections ] = React.useState<Connection[]>([]);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);
    const [ workAreaOffset, setWorkAreaOffset ] = React.useState([0, 0]);

    const menus = {
        'Panels': {
            'Audio': {
                execute: () => makePanel('Audio')
            },
            'TextInput': {
                execute: () => makePanel('TextInput')
            }
        },
        'Options': {
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
    };

    return (
        <div className={`Editor ${grid ? 'Gridded' : ''}`} style={{ backgroundPosition: `left ${workAreaOffset[0]}px top ${workAreaOffset[1]}px` }}>
            <Toolbar
                toolbar={toolbar}
                menus={menus} default="Panels"
                />
            <WorkArea
                toolbar={toolbar}
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