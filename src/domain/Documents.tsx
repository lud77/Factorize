import System from './System';

const Documents = ({
    setPanels,
    setConnections,
    panelIdSequence,
    endpointIdSequence
}) => {
    const packDocument = ({ panels, connections }) => {
        return JSON.stringify({
            panels,
            connections,
            lastPanelId: panelIdSequence.current(),
            lastEndpointId: endpointIdSequence.current(),
        });
    };

    const create = () => {
        setPanels({});
        setConnections([]);
        panelIdSequence.force(-1);
        endpointIdSequence.force(-1);
    };

    const saveAs = (documentInfo) => {
        System.saveFileDialog({ fileTypes: ['Factorize'] })
            .then((filePath) => {
                System.writeFile(filePath, packDocument(documentInfo));
            });
    };

    return {
        create,
        saveAs
    };
};

export default Documents;