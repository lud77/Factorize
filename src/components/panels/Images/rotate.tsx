import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { toImage } from '../../../domain/signal-formats/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Rotate';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: '',
    type: 'image',
    signal: 'Value'
}, {
    name: 'Angle',
    defaultValue: 1,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Image',
    defaultValue: '',
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
                <InputEndpoint name="Angle" panelId={panelId} editor="text" {...props}>Angle</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute rotate', inputs);
        if (!inputs.inputAngle || isNaN(inputs.inputAngle) || !inputs.inputImage) return { outputImage: inputs.inputImage };

        const hasImageChanged = (panel.outputEpValues.oldImage == null) || (inputs.inputImage != panel.outputEpValues.oldImage);
        const hasAngleChanged = (panel.outputEpValues.oldAngle == null) || (inputs.inputAngle != panel.outputEpValues.oldAngle);

        const hasChanged =
            hasImageChanged ||
            hasAngleChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => inputs.inputImage.contents.rotate(parseInt(inputs.inputAngle), { interpolation: 'bilinear' }))
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
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['picture', 'image'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;