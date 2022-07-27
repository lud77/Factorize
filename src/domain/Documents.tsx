import { flushSync } from 'react-dom';

import System from './System';
import dictionary from '../components/panels/dictionary';

const Documents = ({
    setPanels,
    setConnections,
    filePath, setFilePath,
    panelIdSequence,
    endpointIdSequence,
    clearAllTimers
}) => {
    const packDocument = ({ panels, connections }) => {
        return JSON.stringify({
            panels,
            connections,
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

        flushSync(() => {
            setPanels(reconstitutedPanels);
        });

        flushSync(() => {
            setConnections(documentInfo.connections);
        });

        panelIdSequence.force(documentInfo.lastPanelId);
        endpointIdSequence.force(documentInfo.lastEndpointId);
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
            setConnections([]);
        });

        panelIdSequence.force(-1);
        endpointIdSequence.force(-1);
    };

    const save = (documentInfo) => {
        if (filePath == '') return saveAs(documentInfo);

        System.writeFile(filePath, packDocument(documentInfo));
    };

    const saveAs = (documentInfo) => {
        System.saveFileDialog({ fileTypes: ['Factorize'] })
            .then((filePath) => {
                setFilePath(filePath);
                System.writeFile(filePath, packDocument(documentInfo));
            });
    };

    const open = (documentInfo) => {
        System.openFileDialog({ fileTypes: ['Factorize'] })
            .then((filePath) => {
                if (!filePath) return [null, null];

                return Promise.all([filePath, System.readFile(filePath)]);
            })
            .then(([filePath, fileContent]) => {
                if (!filePath) return null;

                unpackDocument(filePath, fileContent.data);
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