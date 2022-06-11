import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

import './Editor.css';

const { ipcRenderer } = window.require('electron')

const Editor = () => {
    const toolbar = React.useRef<any>();

    const [snap, setSnap] = React.useState(false);
    const [grid, setGrid] = React.useState(false);

    const toggle = (item, state) => {
        if (item.classList.contains('Active')) {
            item.classList.remove('Active');
        } 
        
        if (state) {
            item.classList.add('Active');
        }
    };
    
    const menus = {
        'File': {
            'Quit': () => ipcRenderer.invoke('app:terminate')
        },
        'Panels': {
            'Type 0': () => { 
                const x = makePanel('text', 'test');
            }, 
            'Type 1': () => { console.log('Type 1') }
        },
        'Options': {
            'Grid': (item) => { 
                setGrid(!grid); 
                toggle(item, !grid);
            },
            'Snap': (item) => { 
                toggle(item, !snap);
                setSnap(!snap); 
            }
        }
    };

    return <div className={`Editor ${grid ? 'Gridded' : ''}`}>      
        <Toolbar toolbar={toolbar} menus={menus} default="File"></Toolbar>        
        <WorkArea toolbar={toolbar} snap={snap}></WorkArea>;
    </div>;
};

export default Editor;