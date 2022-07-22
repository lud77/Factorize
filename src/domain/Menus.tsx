import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import ValuesEditor from '../components/Editor/ValuesEditor/ValuesEditor';
import System from '../domain/System';

const toolbarMenusSetup = ({
    panels, setPanels,
    play, pause,
    focused,
    walker,
    documents,
    flagsMenu, panelsMenu
}) => {
    const {
        pressPlay,
        pressPause,
        pressStop
    } = walker;

return {
        'Home': {
            label: 'Home',
            submenus: {
                'New File...': {
                    execute: documents.create,
                    label: 'New File...'
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
                    execute: pressPlay,
                    label: 'Play',
                    active: play,
                    icon: <FontAwesomeIcon icon={solid('play')} />
                },
                'Pause': {
                    execute: pressPause,
                    label: 'Pause',
                    active: pause,
                    icon: <FontAwesomeIcon icon={solid('pause')} />
                },
                'Stop': {
                    execute: pressStop,
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
        icon: <FontAwesomeIcon icon={solid('trash-can')} />,
        label: 'Delete Panel',
        handler: handlers.deletePanel,
        tags: ['panel']
    }, {
        icon: <FontAwesomeIcon icon={solid('circle-minus')} />,
        label: 'Remove Endpoint',
        handler: handlers.removeEp,
        tags: ['removable endpoint']
    }];
};

export {
    toolbarMenusSetup,
    contextMenusSetup
};