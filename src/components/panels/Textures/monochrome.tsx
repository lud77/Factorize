import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { color2rgba } from '../../../utils/colors';
import * as Image from '../../../domain/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Monochrome';

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
    name: 'Color',
    defaultValue: '#ffff',
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
                <InputEndpoint name="Color" panelId={panelId} signal="Value" editable={true} {...props}>Color</InputEndpoint>
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

        if (values.inputColor == null) return { outputImage: null };

        const color = color2rgba(values.inputColor);

        if (color == null) return { outputImage: null };

        const width = parseInt(values.inputWidth || '0');
        const height = parseInt(values.inputHeight || '0');
        const hasColorChanged = (panel.outputEpValues.oldColor == null) || (color.toString() != panel.outputEpValues.oldColor.toString());
        const hasWidthChanged = (panel.outputEpValues.oldWidth == null) || (width != panel.outputEpValues.oldWidth);
        const hasHeightChanged = (panel.outputEpValues.oldHeight == null) || (height != panel.outputEpValues.oldHeight);

        const hasChanged = hasColorChanged || hasWidthChanged || hasHeightChanged;

        if (!hasChanged) return {};

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