import * as React from 'react';
import WorkArea from './WorkArea/WorkArea';
import Toolbar from './Toolbar/Toolbar';

const Editor = () => {
    const toolbar = React.useRef<any>();
    const menus = {
        'File': ['Quit'],
        'Edit': ['Preferences'],
        'Panels': ['Type 0', 'Type 1']
    };
    return <div className="Editor">
        <Toolbar ref={toolbar} menus={menus} default="File"></Toolbar>        
        <WorkArea toolbar={toolbar}></WorkArea>;
    </div>;
};

export default Editor;