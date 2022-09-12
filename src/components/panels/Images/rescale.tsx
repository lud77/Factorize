import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { hex2rgba } from '../../../utils/colors';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Rescale';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Width',
    defaultValue: null,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Height',
    defaultValue: null,
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
                <InputEndpoint name="Image" panelId={panelId} signal="Value" {...props}>Image</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Width" panelId={panelId} signal="Value" editable={true} {...props}>Width</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Height" panelId={panelId} signal="Value" editable={true} {...props}>Height</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Hex" panelId={panelId} signal="Value" editable={true} {...props}>Hex</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('resize image execute');

        if (values.inputImage == null || values.inputHex == null) return { outputImage: null };

        const color = hex2rgba(values.inputHex);

        if (color == null) return { outputImage: null };

        const width = values.inputWidth ? parseInt(values.inputWidth) : undefined;
        const height = values.inputHeight ? parseInt(values.inputHeight) : undefined;
        const hasHexChanged = (panel.outputEpValues.oldHex == null) || (color.toString() != panel.outputEpValues.oldHex.toString());
        const hasWidthChanged = (panel.outputEpValues.oldWidth == null) || (width != panel.outputEpValues.oldWidth);
        const hasHeightChanged = (panel.outputEpValues.oldHeight == null) || (height != panel.outputEpValues.oldHeight);

        const hasChanged = hasHexChanged || hasWidthChanged || hasHeightChanged;

        if (!hasChanged) return { outputImage: null };

        return Promise.resolve()
            .then(() => values.inputImage.resize({
                width,
                height
            }))
            .then((outputImage) => {
                return {
                    oldColor: values.inputColor,
                    oldWidth: width,
                    oldHeight: height,
                    outputImage
                };
            });
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
    inputEndpoints,
    outputEndpoints
};