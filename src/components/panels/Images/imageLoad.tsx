import * as React from 'react';
import { Image } from 'image-js';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import System from '../../../domain/System';

const panelType = 'ImageLoad';

const inputEndpoints = [{
    name: 'File',
    defaultValue: '',
    type: 'string',
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
                <InputEndpoint name="File" panelId={panelId} {...props}>File</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute picture', inputs);
        if (inputs.inputFile == '') return {
            outputImage: null
        };

        return Promise.resolve()
            .then(() => System.readImageFile(inputs.inputFile))
            .then((info) => Image.load(info.data))
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
    tags: ['picture'],
    inputEndpoints,
    outputEndpoints
};