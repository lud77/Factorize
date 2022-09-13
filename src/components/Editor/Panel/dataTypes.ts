const dataTypeMarkers = {
    any: 'a',
    boolean: 'b',
    channel: 'c', // image channel
    object: 'd',
    function: 'f',
    image: 'i', // rgba image
    array: 'l',
    matrix: 'm', // 2d numeric matrix
    number: 'n',
    string: 's'
};

const getDataTypeMarkerFor = (dataType) => {
    return dataTypeMarkers[dataType] || '';
};

export default getDataTypeMarkerFor;