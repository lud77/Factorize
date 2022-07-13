import * as React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import ValuesEditor from '../components/Editor/ValuesEditor/ValuesEditor';

const toolbarMenus = ({
    panels, setPanels,
    play, pause,
    focused,
    walker,
    flagsMenu, panelsMenu
}) => {
    const {
        pressPlay,
        pressPause,
        pressStop
    } = walker;

    return {
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

export {
    toolbarMenus
};