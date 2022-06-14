import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

import getSequence from '../../utils/sequence';

import { ConnectorAnchor, Connection } from './types';
import { Panel } from './Panel/types';

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

    const [snap, setSnap] = React.useState<boolean>(false);
    const [grid, setGrid] = React.useState<boolean>(false);

    const [ panels, setPanels ] = React.useState<Panel[]>([]);
	const [ connections, setConnections ] = React.useState<Connection[]>([]);
	const [ connectorAnchor, setConnectorAnchor ] = React.useState<ConnectorAnchor | null>(null);

    const menus = {
        'Panels': {
            'Audio': {
                execute: () => { 
                    const panel = props.panels.Audio.create(`Audio ${getNextComponent()}`);
                    setPanels([...panels, panel]);
                }
            },
            'TextInput': {
                execute: () => { 
                    const panel = props.panels.TextInput.create(`Text Input ${getNextComponent()}`);
                    setPanels([...panels, panel]);
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
                menus={menus} default="Panels" 
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