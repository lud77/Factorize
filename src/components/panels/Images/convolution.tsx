import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Matrix from '../../../domain/Matrix';
import { toImage } from '../../../domain/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Convolution';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: '',
    type: 'image',
    signal: 'Value'
}, {
    name: 'Kernel',
    defaultValue: null,
    type: 'matrix',
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
                <InputEndpoint name="Kernel" panelId={panelId} {...props}>Kernel</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute convolution', inputs);
        if (!inputs.inputKernel) return { outputImage: null };

        const mw = Matrix.getWidth(inputs.inputKernel);
        const mh = Matrix.getHeight(inputs.inputKernel);
        if ((mw % 2 == 0) || (mh % 2 == 0) || !inputs.inputImage) return { outputImage: null };

        const hasImageChanged = (panel.outputEpValues.oldImage == null) || (inputs.inputImage != panel.outputEpValues.oldImage);
        const hasKernelChanged = (panel.outputEpValues.oldKernel == null) || (inputs.inputKernel != panel.outputEpValues.oldKernel);

        const hasChanged =
            hasImageChanged ||
            hasKernelChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => inputs.inputImage.contents.convolution(inputs.inputKernel.contents))
            .then((resultImage) => {
                return {
                    oldImage: inputs.inputImage,
                    oldKernel: inputs.inputKernel,
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

export default {
    type: panelType,
    create,
    tags: ['image', 'picture', 'filter', 'effect'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};