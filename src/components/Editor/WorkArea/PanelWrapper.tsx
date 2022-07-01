import * as React from 'react';

const PanelWrapper = (props) => {
    const { panel, workAreaOffset, connections, connectorAnchor } = props;

    const style = {
        left: (panel.left + workAreaOffset[0]) + 'px',
        top: (panel.top + workAreaOffset[1]) + 'px',
        width: panel.width + 'px',
        height: panel.height + 'px'
    };

    return (
        <div
            data-key={panel.panelId}
            className={`Panel ${props.isSelected ? 'Selected' : ''}`}
            style={style}
            onClick={props.onSelect}
            >
            <div className="Title">{panel.title || '\u00A0'}</div>
            <panel.Component
                panel={panel}
                connections={connections}
                connectorAnchor={connectorAnchor}
                />
        </div>
    );
};

export default PanelWrapper;