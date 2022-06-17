import styled from '@emotion/styled';
import * as React from 'react';

const PanelWrapper = (props) => {
    const { ind, panel, workAreaOffset, connections, connectorAnchor } = props;

    const style = { 
        left: (panel.x + workAreaOffset[0]) + 'px', 
        top: (panel.y + workAreaOffset[1]) + 'px'
    };

    return (
        <div 
            data-key={ind} 
            className={`Panel ${props.isSelected ? 'Selected' : ''}`} 
            style={style} 
            onDoubleClick={props.onSelect}
            onClick={(e) => e.stopPropagation()}
            > 
            <div className="Title">{panel.title}</div>
            <panel.Component 
                panel={panel} 
                connections={connections} 
                connectorAnchor={connectorAnchor} 
                />
        </div>
    );
};

export default PanelWrapper;