import * as React from 'react';

const PanelWrapper = (props) => {
    const {
        panel, panelCoord,
        connections,
        workAreaOffset,
        connectorAnchor,
        machine
    } = props;

    const style = {
        left: (panelCoord.left + workAreaOffset[0]) + 'px',
        top: (panelCoord.top + workAreaOffset[1]) + 'px',
        width: panel.width + 'px',
        height: panel.height + 'px'
    };

    return (
        <div
            data-key={panel.panelId}
            className={`Panel ${props.isSelected ? 'Selected' : ''} ${props.isFocused ? 'Focused' : ''}`}
            style={style}
            onClick={props.onSelect}
            >
            <div className="Title" title={ panel.title }>{panel.title || '\u00A0'}</div>
            <panel.Component
                panel={panel}
                machine={machine}
                connections={connections}
                connectorAnchor={connectorAnchor}
                />
        </div>
    );
};

export default PanelWrapper;