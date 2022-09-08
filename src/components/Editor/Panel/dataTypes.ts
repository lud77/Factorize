const dataTypeMarkers = {
    any: 'a',
    boolean: 'b',
    object: 'd',
    function: 'f',
    image: 'i',
    array: 'l',
    matrix: 'm',
    number: 'n',
    string: 's'
};

const getDataTypeMarkerFor = (dataType) => {
    return dataTypeMarkers[dataType] || '';
};

export default getDataTypeMarkerFor;