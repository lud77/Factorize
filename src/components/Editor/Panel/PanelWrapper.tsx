import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

const PanelWrapper = (props) => {
    const {
        panel, panelCoord,
        connections,
        workAreaOffset,
        connectorAnchor,
        machine
    } = props;

    const left = (panelCoord.left + workAreaOffset[0]) + 'px'
    const top = (panelCoord.top + workAreaOffset[1]) + 'px';
    const width = Math.max(panel.minWidth, panel.width) + 'px';
    const height = Math.max(panel.minHeight, panel.height) + 'px';

    const style = {
        left,
        top,
        width,
        height
    };

    const hasResizer = panel.resizer != 'none';

    return (
        <div
            data-key={panel.panelId}
            className={`Panel ${props.isSelected ? 'Selected' : ''} ${props.isFocused ? 'Focused' : ''}`}
            style={style}
            onClick={props.onSelect}
            >
            <div className="Title" title={ panel.title }>{panel.title || '\u00A0'}</div>
            <div className="Body">
                <panel.Component
                    panel={panel}
                    machine={machine}
                    connections={connections}
                    connectorAnchor={connectorAnchor}
                    />
            </div>
            {
                hasResizer
                    ? <div className="Resizer">
                        <div className="Handle">
                            <FontAwesomeIcon icon={solid('grip')} />
                        </div>
                    </div>
                    : null
            }
        </div>
    );
};

export default PanelWrapper;