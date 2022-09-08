import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

const PanelWrapper = (props) => {
    const {
        panelCoord, setPanelCoords,
        panel, setPanels,
        computeEpCoords,
        connections,
        workAreaOffset,
        connectorAnchor,
        machine,
        redraw
    } = props;

    const left = (panelCoord.left + workAreaOffset[0]) + 'px'
    const top = (panelCoord.top + workAreaOffset[1]) + 'px';
    const width = (panelCoord.isCollpased ? 120 : Math.max(panelCoord.minWidth, panelCoord.width)) + 'px';
    const height = (panelCoord.isCollpased ? 22 : Math.max(panelCoord.minHeight, panelCoord.height)) + 'px';

    const style = {
        left,
        top,
        width,
        height
    };

    const hasResizer = panelCoord.resizer != 'none';

    const toggleCollapse = () => {
        console.log('isCollapsed', !panelCoord.isCollapsed);

        setPanelCoords((panelCoords) => {
            return {
                ...panelCoords,
                [panelCoord.panelId]: {
                    ...panelCoords[panelCoord.panelId],
                    isCollapsed: !panelCoords[panelCoord.panelId].isCollapsed
                }
            };
        });

        setTimeout(() => { redraw(Math.random()); }, 1);

        return false;
    };

    // to avoid this we would need to make all the sizes of the panel predefined
    // which would mean rebuilding the Flexbox features without Flexbox
    // -- not impossible, but yet another useless complication
    React.useEffect(() => {
        console.log('useeffect');

        computeEpCoords(panel, panelCoord, setPanelCoords);
    }, [panel]);

    return (
        <div
            data-key={panelCoord.panelId}
            className={`Panel ${props.isSelected ? 'Selected' : ''} ${props.isFocused ? 'Focused' : ''} ${panelCoord.isCollapsed ? 'Collapsed' : ''}`}
            style={style}
            onClick={props.onSelect}
            onDoubleClick={(e) => e.stopPropagation()}
            >
            <div
                className="Title"
                title={ panel.title }
                >
                <span className="Chevron" onClick={toggleCollapse}><FontAwesomeIcon icon={solid('angle-right')} /></span>
                <span className="TitleText">{panel.title || '\u00A0'}</span>
            </div>
            {
                !panelCoord.isCollapsed
                    ? <>
                        <panel.Component
                            panel={panel} setPanels={setPanels}
                            panelCoord={panelCoord} setPanelCoords={setPanelCoords}
                            machine={machine}
                            connections={connections}
                            connectorAnchor={connectorAnchor}
                            />
                        {
                            hasResizer
                                ? <div className="Resizer">
                                    <div className="Handle">
                                        <FontAwesomeIcon icon={solid('grip')} />
                                    </div>
                                </div>
                                : null
                        }
                    </>
                    : null
            }
        </div>
    );
};

export default PanelWrapper;