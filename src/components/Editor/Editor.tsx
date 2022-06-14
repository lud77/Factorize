import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

import getSequence from '../../utils/sequence';

import './Editor.css';

const { ipcRenderer } = window.require('electron')

const getNextComponent = getSequence();

const Editor = (props) => {
    const makeConnection = (source, target): object => 
        ({
            source, 
            target 
        });

    const toolbar = React.useRef<any>();

    const [snap, setSnap] = React.useState(false);
    const [grid, setGrid] = React.useState(false);

    const [ panels, setPanels ] = React.useState([]);
	const [ connections, setConnections ] = React.useState([]);
    
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
                    const panel = props.panels.Audio.Audio(`Component ${getNextComponent()}`);
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
                panels={panels}
                connections={connections} setConnections={setConnections}
                makeConnection={makeConnection}
                />;
        </div>
    );
};

export default Editor;