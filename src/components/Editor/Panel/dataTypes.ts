const dataTypeMarkers = {
    any: 'a',
    boolean: 'b',
    float: 'f',
    integer: 'i',
    number: 'n',
    string: 's'
};

const getDataTypeMarkerFor = (dataType) => {
    return dataTypeMarkers[dataType] || '';
};

export default getDataTypeMarkerFor;