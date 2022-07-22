

const Documents = ({
    setPanels,
    setConnections,
    panelIdSequence,
    endpointIdSequence
}) => {
    const create = () => {
        setPanels({});
        setConnections([]);
        panelIdSequence.force(0);
        endpointIdSequence.force(0);
    };

    const saveAs = () => {

    };

    return {
        create,
        saveAs
    };
};

export default Documents;