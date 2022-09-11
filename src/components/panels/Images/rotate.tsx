import * as React from 'react';
import { Image } from 'image-js';

import { Panel } from '../../../types/Panel';
import * as Matrix from '../../../domain/Matrix';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

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

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Image" panelId={panelId} {...props}>Image</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Angle" panelId={panelId} editable={true} {...props}>Angle</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute rotate', inputs);
        if (!inputs.inputAngle || isNaN(inputs.inputAngle) || !inputs.inputImage) return { outputImage: inputs.inputImage };

        return Promise.resolve()
            .then(() => inputs.inputImage.rotate(parseInt(inputs.inputAngle)))
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
    tags: ['picture', 'filter', 'effect'],
    inputEndpoints,
    outputEndpoints
};