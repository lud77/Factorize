import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

import getSequence from '../../utils/sequence';

import './Editor.css';

const { ipcRenderer } = window.require('electron')

const getNextEndpointId = getSequence();

const Editor = () => {
	const makePanel = (type, title) => {
		const inputVolume = getNextEndpointId();
		const inputFrequency = getNextEndpointId();
		const outputAudio = getNextEndpointId();
		const outputWhatev = getNextEndpointId();
		
		return { 
			type, 
			title, 
			refs: { inputVolume, inputFrequency, outputAudio, outputWhatev }
		};
	};

	const makeConnection = (source, target) => {
		return { 
			source, 
			target 
		};
	};

    const toolbar = React.useRef<any>();

    const [snap, setSnap] = React.useState(false);
    const [grid, setGrid] = React.useState(false);

    const [ panels, setPanels ] = React.useState([makePanel('text', 'Component 1'), makePanel('text', 'Component 2')]);
	const [ connections, setConnections ] = React.useState([makeConnection(panels[0].refs.outputAudio, panels[1].refs.inputVolume)]);
    
    const menus = {
        'File': {
            'Quit': {
                execute: () => ipcRenderer.invoke('app:terminate')
            }
        },
        'Panels': {
            'Type 0': {
                execute: () => { 
                    const panel = makePanel('text', 'test');
                    setPanels([...panels, panel]);
                }
            },
            'Type 1': {
                execute: () => { console.log('Type 1') }
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