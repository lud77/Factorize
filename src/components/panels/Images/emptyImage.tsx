import * as React from 'react';
import { Image } from 'image-js';

import { Panel } from '../../../types/Panel';
import { hex2rgba } from '../../../utils/colors';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

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
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}];

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

        const size = width * height;
        const data = new Uint8ClampedArray(size * 4);

        for (let i = 0; i < size; i++) {
            data[i * 4] = color[0];
            data[i * 4 + 1] = color[1];
            data[i * 4 + 2] = color[2];
            data[i * 4 + 3] = color[3];
        }

        const outputImage = new Image({
            width,
            height,
            data,
            kind: 'RGBA'
        });

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
        width: 134,
        height: 93,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['picture', 'create', 'new'],
    inputEndpoints,
    outputEndpoints
};