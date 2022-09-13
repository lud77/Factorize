import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Dilate';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Iterations',
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

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} {...props}>Image</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Iterations" panelId={panelId} editable={true} {...props}>Iterations</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute dilate', inputs);
        if (!inputs.inputIterations || isNaN(inputs.inputIterations) || !inputs.inputImage) return { outputImage: null };
        if (inputs.inputImage.components > 1) return { outputImage: null };

        return Promise.resolve()
            .then(() => inputs.inputImage.dilate({ iterations: parseInt(inputs.inputIterations) }))
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
        height: 74
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['image', 'picture', 'filter', 'effect'],
    inputEndpoints,
    outputEndpoints
};