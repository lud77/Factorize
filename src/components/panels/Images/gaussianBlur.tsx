import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { toImage } from '../../../domain/types/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'GaussianBlur';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Radius',
    defaultValue: 1,
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
    height: 74
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} {...props}>Image</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Radius" panelId={panelId} editor="text" {...props}>Radius</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute gaussianBlur', inputs);
        if (!inputs.inputRadius || isNaN(inputs.inputRadius) || !inputs.inputImage) return { outputImage: null };

        const hasImageChanged = (panel.outputEpValues.oldImage == null) || (inputs.inputImage != panel.outputEpValues.oldImage);
        const hasRadiusChanged = (panel.outputEpValues.oldRadius == null) || (inputs.inputRadius != panel.outputEpValues.oldRadius);

        const hasChanged =
            hasImageChanged ||
            hasRadiusChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => inputs.inputImage.contents.gaussianFilter({ radius: parseInt(inputs.inputRadius) }))
            .then((resultImage) => {
                return { outputImage: toImage(resultImage) };
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
    tags: ['image', 'picture', 'filter', 'effect'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;