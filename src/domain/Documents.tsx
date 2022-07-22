const Documents = ({
    setPanels,
    setConnections,
    panelIdSequence,
    endpointIdSequence
}) => {
    const newDocument = () => {
        setPanels({});
        setConnections([]);
        panelIdSequence.force(0);
        endpointIdSequence.force(0);
    };

    return {
        newDocument
    };
};

export default Documents;