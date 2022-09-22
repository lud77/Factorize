import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { hex2rgba } from '../../../utils/colors';
import * as Image from '../../../domain/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'EmptyImage';

const inputEndpoints = [{
    name: 'Width',
    defaultValue: 100,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Height',
    defaultValue: 100,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Hex',
    defaultValue: '#0000',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Image',
    defaultValue: Image.empty(100, 100, [0, 0, 0, 0]),
    type: 'image',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 93
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Hex" panelId={panelId} signal="Value" editable={true} {...props}>Hex</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Width" panelId={panelId} signal="Value" editable={true} {...props}>Width</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Height" panelId={panelId} signal="Value" editable={true} {...props}>Height</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('empty image execute');

        if (values.inputHex == null) return { outputImage: null };

        const color = hex2rgba(values.inputHex);

        if (color == null) return { outputImage: null };

        const width = parseInt(values.inputWidth || '0');
        const height = parseInt(values.inputHeight || '0');
        const hasHexChanged = (panel.outputEpValues.oldHex == null) || (color.toString() != panel.outputEpValues.oldHex.toString());
        const hasWidthChanged = (panel.outputEpValues.oldWidth == null) || (width != panel.outputEpValues.oldWidth);
        const hasHeightChanged = (panel.outputEpValues.oldHeight == null) || (height != panel.outputEpValues.oldHeight);

        const hasChanged = hasHexChanged || hasWidthChanged || hasHeightChanged;

        if (!hasChanged) return { outputImage: null };

        const outputImage = Image.empty(width, height, color);

        return {
            oldColor: values.inputColor,
            oldWidth: width,
            oldHeight: height,
            outputImage
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['picture', 'create', 'new'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};