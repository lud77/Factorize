const dataTypeMarkers = {
    any: 'a',
    boolean: 'b',
    object: 'd',
    function: 'f',
    array: 'l',
    number: 'n',
    string: 's'
};

const getDataTypeMarkerFor = (dataType) => {
    return dataTypeMarkers[dataType] || '';
};

export default getDataTypeMarkerFor;