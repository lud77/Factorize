import { flushSync } from 'react-dom';

import System from './System';
import dictionary from '../components/panels/dictionary';
import mostRecent from '../utils/mostRecent';
import { Panel } from '../types/Panel';
import SystemResponse from '../types/SystemResponse';

const Documents = ({
    setPanels,
    setPanelCoords,
    setConnections,
    setWorkAreaOffset,
    filePath, setFilePath,
    panelIdSequence,
    endpointIdSequence,
    clearAllTimers,
    sendPulseTo,
    timers,
    executePanelLogic
}) => {
    const packDocument = ({ panels, panelCoords, connections, workAreaOffset }) => {
        const purgedPanels =
            (Object.values(panels) as Panel[])
                .map((panel) => {
                    if (!panel.expunge) return panel;
                    console.log('expunging', panel.expunge, panel.outputEpValues);
                    const filteredOutputEpValues = (
                        Object.keys(panel.outputEpValues as any[])
                            .map((ep) => {
                                if (panel.expunge.includes(ep)) return null;

                                return [ep, (panel.outputEpValues as any[])[ep]];
                            })
                            .filter(Boolean) as any[]
                    ).reduce((a, [ k, v ]) => ({ ...a, [k]: v }), {});

                    console.log('expunged', filteredOutputEpValues);
                    return {
                        ...panel,
                        outputEpValues: filteredOutputEpValues
                    };
                })
                .reduce((a, panel) => ({ ...a, [panel.panelId as number]: panel }), {});

        return JSON.stringify({
            panels: purgedPanels,
            panelCoords,
            connections,
            workAreaOffset,
            lastPanelId: panelIdSequence.current(),
            lastEndpointId: endpointIdSequence.current(),
        });
    };

    const parseJson = (json) => {
        try {
            return JSON.parse(json);
        } catch (e) {
            console.log('error while parsing json', e);
        }
    };

    const reconstitutePanel = (panelInfo) => {
        return {
            ...dictionary[panelInfo.type].create(panelInfo.panelId),
            ...panelInfo
        };
    };

    const reconstitutePanels = (panels) => {
        return Object.keys(panels)
            .map((panelId) => {
                const panelInfo = panels[panelId];
                const reconstitutedPanel = reconstitutePanel(panelInfo);
                return [panelId, reconstitutedPanel];
            })
            .reduce((a, [panelId, panel]) => ({ ...a, [panelId]: panel}), {});
    };

    const unpackDocument = (filePath, packedDocument) => {
        clearAllTimers();
        setFilePath(filePath);

        const documentInfo = parseJson(packedDocument);

        const reconstitutedPanels = reconstitutePanels(documentInfo.panels);

        panelIdSequence.force(documentInfo.lastPanelId);
        endpointIdSequence.force(documentInfo.lastEndpointId);

        flushSync(() => {
            setPanelCoords(documentInfo.panelCoords);
        });

        if (documentInfo.workAreaOffset) {
            flushSync(() => {
                setWorkAreaOffset(documentInfo.workAreaOffset);
            });
        }

        flushSync(() => {
            setConnections(documentInfo.connections);
        });

        flushSync(() => {
            setPanels(reconstitutedPanels);
        });

        const panels = (mostRecent(setPanels) ?? []) as Panel[];

        Object.values(panels).reduce((chain, panel) => {
            console.log('adding to chain', panel);
            return chain
                .then(() => executePanelLogic(panel.panelId))
        }, Promise.resolve());
    };

    const create = () => {
        clearAllTimers();

        flushSync(() => {
            setFilePath('');
        });

        flushSync(() => {
            setPanels({});
        });

        flushSync(() => {
            setPanelCoords({});
        });

        flushSync(() => {
            setConnections([]);
        });

        flushSync(() => {
            setWorkAreaOffset([0, 0]);
        });

        panelIdSequence.force(-1);
        endpointIdSequence.force(-1);
    };

    const save = (documentInfo) => {
        if (filePath === '') return saveAs(documentInfo);

        System.writeFile(filePath, packDocument(documentInfo));
    };

    const saveAs = (documentInfo) => {
        System.saveFileDialog({ fileTypes: ['Factorize'] })
            .then((filePath) => {
                setFilePath(filePath);
                System.writeFile(filePath, packDocument(documentInfo));
            });
    };

    const open = () => {
        System.openFileDialog({ fileTypes: ['Factorize'] })
            .then((filePath): Promise<[string | null, SystemResponse | null]> => {
                if (!filePath) return Promise.resolve([null, null]);

                return Promise.all([filePath as string, System.readFile(filePath)]);
            })
            .then((info) => {
                if (!info[0]) return null;
                if (typeof info[1] =='string') return null;

                unpackDocument(info[0], info[1]!.data);
            });
    };

    return {
        create,
        save,
        saveAs,
        open
    };
};

export default Documents;