import { contextMenusSetup } from '../../../domain/Menus';

const getContextMenuItems = (machine, setWorkAreaOffset) => contextMenusSetup({
    deletePanel: (target) => (e) => {
        machine.removePanelsByIds([target.panelId]);
    },
    deletePanels: (target) => (e) => {
        machine.removePanelsByIds(target.selectedPanels);
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
    findOrigin: () => (e) => {
        setWorkAreaOffset([0, 0]);
    }
});

export default getContextMenuItems;