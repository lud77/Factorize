import * as React from 'react';
import { Image } from 'image-js';

import { Panel } from '../../../types/Panel';
import * as Matrix from '../../../domain/Matrix';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'ExtractChannel';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: '',
    type: 'image',
    signal: 'Value'
}, {
    name: 'Channel',
    defaultValue: null,
    type: 'any',
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
                <InputEndpoint name="Channel" panelId={panelId} editable={true} {...props}>Channel</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute extract channel', inputs);
        if (!inputs.inputChannel || !inputs.inputImage) return { outputImage: null };

        return Promise.resolve()
            .then(() => inputs.inputImage.getChannel(inputs.inputChannel))
            .then((outputImage) => {
                return { outputImage };
            })
            .catch(() => {
                return { outputImage: null };
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
    tags: ['picture', 'split', 'separate'],
    inputEndpoints,
    outputEndpoints
};