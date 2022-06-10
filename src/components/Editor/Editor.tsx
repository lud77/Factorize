import { app } from 'electron';
import * as React from 'react';

import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

import './Editor.css';

const Editor = () => {
    const toolbar = React.useRef<any>();

    const menus = {
        'File': {
            'Quit': () => app.quit()
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