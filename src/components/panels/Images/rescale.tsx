import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { toImage } from '../../../domain/types/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

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
}];

const outputEndpoints = [{
    name: 'Image',
    defaultValue: null,
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
                <InputEndpoint name="Image" panelId={panelId} signal="Value" {...props}>Image</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Width" panelId={panelId} signal="Value" editor="text" {...props}>Width</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Height" panelId={panelId} signal="Value" editor="text" {...props}>Height</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('rescale image execute');

        if (values.inputImage == null) return { outputImage: null };

        const width = values.inputWidth ? parseInt(values.inputWidth) : undefined;
        const height = values.inputHeight ? parseInt(values.inputHeight) : undefined;
        const hasWidthChanged = (panel.outputEpValues.oldWidth == null) || (width != panel.outputEpValues.oldWidth);
        const hasHeightChanged = (panel.outputEpValues.oldHeight == null) || (height != panel.outputEpValues.oldHeight);

        const hasChanged = hasWidthChanged || hasHeightChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => values.inputImage.contents.resize({
                width,
                height
            }))
            .then((resultImage) => {
                return {
                    oldWidth: width,
                    oldHeight: height,
                    outputImage: toImage(resultImage)
                };
            });
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

const PanelBundle = {
    type: panelType,
    create,
    tags: ['image', 'perlin', 'size', 'zoom'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;