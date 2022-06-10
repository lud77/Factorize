import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

import './Editor.css';

const { ipcRenderer } = window.require('electron')

const Editor = () => {
    const toolbar = React.useRef<any>();

    const menus = {
        'File': {
            'Quit': () => ipcRenderer.invoke('app:terminate')
        },
        'Edit': {
            'Preferences': () => { console.log('Preferences') }
        },
        'Panels': {
            'Type 0': () => { console.log('Type 0') }, 
            'Type 1': () => { console.log('Type 1') }
        }
    };

    return <div className="Editor">
        <Toolbar toolbar={toolbar} menus={menus} default="File"></Toolbar>        
        <WorkArea toolbar={toolbar}></WorkArea>;
    </div>;
};

export default Editor;