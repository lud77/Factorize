import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import ValuesEditor from '../components/Editor/ValuesEditor/ValuesEditor';
import System from '../domain/System';

const toolbarMenusSetup = ({
    graphState,
    play, pause,
    focused,
    walker, documents,
    flagsMenu, panelsMenu
}) => {
    const {
        panels, setPanels,
        panelCoords, setPanelCoords,
        connections, setConnections
    } = graphState;

    return {
        'Home': {
            label: 'Home',
            submenus: {
                'New File': {
                    execute: documents.create,
                    label: 'New File'
                },
                'Open File...': {
                    execute: () => documents.open({ setPanels, setPanelCoords, setConnections }),
                    label: 'Open File...'
                },
                'Save': {
                    execute: () => documents.save({ panels, panelCoords, connections }),
                    label: 'Save'
                },
                'Save as...': {
                    execute: () => documents.saveAs({ panels, panelCoords, connections }),
                    label: 'Save As...'
                },
                'Quit': {
                    execute: System.quit,
                    label: 'Quit'
                }
            }
        },
        'Panels': {
            label: 'Panels',
            submenus: panelsMenu
        },
        'Values': {
            label: 'Values',
            component: <ValuesEditor panel={focused != null ? panels[focused] : null} setPanels={setPanels} />
        },
        'Controls': {
            label: 'Controls',
            submenus: {
                'Play': {
                    execute: walker.pressPlay,
                    label: 'Play',
                    active: play,
                    icon: <FontAwesomeIcon icon={solid('play')} />
                },
                'Pause': {
                    execute: walker.pressPause,
                    label: 'Pause',
                    active: pause,
                    icon: <FontAwesomeIcon icon={solid('pause')} />
                },
                'Stop': {
                    execute: walker.pressStop,
                    label: 'Stop',
                    icon: <FontAwesomeIcon icon={solid('stop')} />
                }
            }
        },
        'Options': {
            label: 'Options',
            submenus: flagsMenu
        }
    };
};

const contextMenusSetup = (handlers) => {
    return [{
        icon: <FontAwesomeIcon icon={solid('clone')} />,
        label: 'Duplicate Panel',
        handler: handlers.duplicatePanel,
        tags: ['panel']
    }, {
        icon: <FontAwesomeIcon icon={solid('link-slash')} />,
        label: 'Disconnect Panel',
        handler: handlers.disconnectPanel,
        tags: ['panel']
    }, {
        icon: <FontAwesomeIcon icon={solid('trash-can')} />,
        label: 'Delete Panel',
        handler: handlers.deletePanel,
        tags: ['panel']
    }, {
        icon: <FontAwesomeIcon icon={solid('circle-minus')} />,
        label: 'Remove Endpoint',
        handler: handlers.removeEp,
        tags: ['removable endpoint']
    }, {
        icon: <FontAwesomeIcon icon={solid('arrows-to-dot')} />,
        label: 'Find Origin',
        handler: handlers.findOrigin,
        tags: ['workarea']
    }];
};

export {
    toolbarMenusSetup,
    contextMenusSetup
};