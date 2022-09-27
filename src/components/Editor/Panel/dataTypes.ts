const dataTypeMarkers = {
    any: 'a',
    boolean: 'b',
    object: 'd',
    function: 'f',
    gradient: 'g',
    image: 'i',
    array: 'l',
    matrix: 'm', // 2d numeric matrix
    number: 'n',
    string: 's'
};

const getDataTypeMarkerFor = (dataType) => {
    return dataTypeMarkers[dataType] || '';
};

export default getDataTypeMarkerFor;