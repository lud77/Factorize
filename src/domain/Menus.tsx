import * as React from 'react';
import { Set } from 'immutable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

import ValuesEditor from '../components/Editor/ValuesEditor/ValuesEditor';
import System from '../domain/System';

const toolbarMenusSetup = ({
    graphState,
    setWorkAreaOffset, workAreaOffset,
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
                    execute: () => documents.open({ setPanels, setPanelCoords, setConnections, setWorkAreaOffset }),
                    label: 'Open File...'
                },
                'Save': {
                    execute: () => {
                        console.log(workAreaOffset);
                        return documents.save({ panels, panelCoords, connections, workAreaOffset })
                    },
                    label: 'Save'
                },
                'Save as...': {
                    execute: () => documents.saveAs({ panels, panelCoords, connections, workAreaOffset }),
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
        icon: <FontAwesomeIcon icon={solid('trash-can')} />,
        label: 'Delete Panels',
        handler: handlers.deletePanels,
        tags: ['panels']
    }, {
        icon: <FontAwesomeIcon icon={solid('object-group')} />,
        label: 'Group Panels',
        handler: handlers.groupPanels,
        tags: ['panels']
    }, {
        icon: <FontAwesomeIcon icon={solid('object-ungroup')} />,
        label: 'Ungroup Panel',
        handler: handlers.ungroupPanel,
        tags: ['panel']
    }, {
        icon: <FontAwesomeIcon icon={solid('object-ungroup')} />,
        label: 'Ungroup Panels',
        handler: handlers.ungroupPanels,
        tags: ['panels']
    }, {
        icon: <FontAwesomeIcon icon={solid('circle-minus')} />,
        label: 'Remove Endpoint',
        handler: handlers.removeEp,
        tags: ['removable endpoint']
    }, {
        icon: <FontAwesomeIcon icon={solid('square-plus')} />,
        label: 'Create Panel',
        handler: handlers.createPanel,
        tags: ['workarea']
    }, {
        icon: <FontAwesomeIcon icon={solid('arrows-to-dot')} />,
        label: 'Find Origin',
        handler: handlers.findOrigin,
        tags: ['workarea']
    }];
};

const getContextMenuItems = (machine, setWorkAreaOffset, setSearchBoxData, setSelectedPanels) => contextMenusSetup({
    deletePanel: (target) => (e) => {
        machine.removePanelsByIds([target.panelId]);
    },
    deletePanels: (target) => (e) => {
        machine.removePanelsByIds(target.selectedPanels);
        setSelectedPanels(Set());
    },
    groupPanels: (target) => (e) => {
        machine.groupPanelsByIds(target.selectedPanels);
    },
    ungroupPanel: (target) => (e) => {
        machine.ungroupPanelById(target.panelId);
    },
    ungroupPanels: (target) => (e) => {
        machine.ungroupPanelsByIds(target.selectedPanels);
    },
    removeEp: (target) => (e) => {
        if (target.endpoint.type === 'Input') return machine.removeInputEndpoint(target.panelId, target.endpoint.name, target.endpoint.ref, target.endpoint.registry);
        if (target.endpoint.type === 'Output') return machine.removeOutputEndpoint(target.panelId, target.endpoint.name, target.endpoint.ref, target.endpoint.registry);
    },
    duplicatePanel: (target) => (e) => {
        machine.duplicatePanelById(target.panelId);
    },
    disconnectPanel: (target) => (e) => {
        machine.removeConnectionsByPanelId(target.panelId);
    },
    createPanel: () => (e) => {
        console.log('opening panel selector');

        setSearchBoxData({
            left: e.clientX,
            top: e.clientY
        });
    },
    findOrigin: () => (e) => {
        setWorkAreaOffset([0, 0]);
    }
});

const getContextMenuOpen = (selectedPanels, setContextMenuData, setSearchBoxData) => (e) => {
    if (e.target.closest('.Panel')) {
        const panelEl = e.target.closest('.Panel');
        const panelId = parseInt(panelEl.dataset.key);
        const isSelection = selectedPanels.includes(panelId);

        const row = e.target.closest('.Row');

        let ep = null;
        if (row) {
            const res = row.getElementsByClassName('Endpoint');
            ep = (res != null) ? res[0] : null;
        }

        const removableEndpoint = (ep != null) && ep.classList.contains('Removable');

        const tags = [isSelection ? 'panels' : 'panel'];
        const target = { panelId, selectedPanels };

        if (removableEndpoint) {
            tags.push('removable endpoint');
            target.endpoint = ep.dataset;
        }

        setSearchBoxData(null);

        setContextMenuData({
            left: e.clientX,
            top: e.clientY,
            target,
            tags
        });

        return;
    }

    if (e.target.closest('.ContextMenu')) {
        setContextMenuData(null);
        return;
    }

    setSearchBoxData(null);

    setContextMenuData({
        left: e.clientX,
        top: e.clientY,
        target: e.target,
        tags: ['workarea']
    });

    return;
};

export {
    toolbarMenusSetup,
    getContextMenuItems,
    getContextMenuOpen
};