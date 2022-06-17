import * as React from 'react';

const PanelWrapper = (props) => {
    const { ind, panel, workAreaOffset, connections, connectorAnchor } = props;

    return (
        <div data-key={ind} className="Panel" style={{ left: (panel.x + workAreaOffset[0]) + 'px', top: (panel.y + workAreaOffset[1]) + 'px' }}> 
            <div className="Title">{panel.title}</div>
            <panel.Component panel={panel} connections={connections} connectorAnchor={connectorAnchor} />
        </div>
    );
};

export default PanelWrapper;