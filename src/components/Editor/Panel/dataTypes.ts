const dataTypeMarkers = {
    any: 'a',
    boolean: 'b',
    function: 'f',
    number: 'n',
    string: 's'
};

const getDataTypeMarkerFor = (dataType) => {
    return dataTypeMarkers[dataType] || '';
};

export default getDataTypeMarkerFor;