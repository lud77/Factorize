import * as React from 'react';
import WorkArea from './WorkArea';

const Editor = () => {
    const toolbar = React.useRef<any>();

    return <div className="Editor">
        <div className="Toolbar" ref={toolbar}>Test</div>
        <WorkArea toolbar={toolbar}></WorkArea>;
    </div>
};
export default Editor;