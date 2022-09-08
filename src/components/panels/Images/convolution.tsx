import * as React from 'react';
import { Image } from 'image-js';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import System from '../../../domain/System';

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
        if (!inputs.inputKernel) return {
            outputImage: inputs.inputImage
        };

        if (!inputs.inputImage) return {};

        return Promise.resolve()
            .then(() => inputs.inputImage.convolution(inputs.inputKernel.contents))
            .then((outputImage) => {
                return { outputImage };
            });
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 53
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['picture', 'filter', 'effect'],
    inputEndpoints,
    outputEndpoints
};