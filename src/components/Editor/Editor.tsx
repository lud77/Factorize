import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

import getSequence from '../../utils/sequence';

import { ConnectorAnchor, Connection } from './types';

import './Editor.css';

const { ipcRenderer } = window.require('electron')

const getNextComponent = getSequence();

const Editor = (props) => {
    const makeConnection = (source, target): Connection => 
        ({
            source, 
            target 
        });

    const toolbar = React.useRef<any>();

    const [snap, setSnap] = React.useState(false);
    const [grid, setGrid] = React.useState(false);

    const [ panels, setPanels ] = React.useState([]);
	const [ connections, setConnections ] = React.useState<Connection[]>([]);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);

	const isOutputConnected = (ref) => connections.find((connection) => connection.source === ref);
	const isInputConnected = (ref) => connections.find((connection) => connection.target === ref);

    const menus = {
        'File': {
            'Load': {
                execute: () => {}
            },
            'Save': {
                execute: () => {}
            },
            'Quit': {
                execute: () => ipcRenderer.invoke('app:terminate')
            }
        },
        'Panels': {
            'Audio': {
                execute: () => { 
                    console.log('y', props.panels);                    
                    const panel = props.panels.Audio.create(`Component ${getNextComponent()}`, isInputConnected, isOutputConnected, connectorAnchor);
                    setPanels([...panels, panel]);
                }
            },
            'TextInput': {
                execute: () => { 
                    console.log('Type 1');
                }
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
            }
        }
    };

    return (
        <div className={`Editor ${grid ? 'Gridded' : ''}`}>
            <Toolbar 
                toolbar={toolbar} 
                menus={menus} default="File" 
                />
            <WorkArea 
                toolbar={toolbar} 
                snap={snap} 
                panels={panels} setPanels={setPanels}
                connections={connections} setConnections={setConnections}
                connectorAnchor={connectorAnchor} setConnectorAnchor={setConnectorAnchor}
                makeConnection={makeConnection}
                />;
        </div>
    );
};

export default Editor;