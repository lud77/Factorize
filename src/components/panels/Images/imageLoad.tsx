import * as React from 'react';
import { Image } from 'image-js';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

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

const panelSizes = {
    ...defaultSizes,
    height: 95
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="File" panelId={panelId} {...props}>File</InputEndpoint>
                <OutputEndpoint name="Image" panelId={panelId} {...props}>Image</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Width" panelId={panelId} {...props}>Width</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Height" panelId={panelId} {...props}>Height</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        console.log('execute imageLoad', values);
        if (values.inputFile == '') return { outputImage: null };

        const hasFileChanged = (panel.outputEpValues.oldFile == null) || (values.inputFile != panel.outputEpValues.oldFile);

        const hasChanged = hasFileChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => System.readImageFile(values.inputFile))
            .then((info) => Image.load(info.data))
            .then((outputImage) => {
                return {
                    oldFile: values.inputFile,
                    outputImage,
                    outputWidth: outputImage.width,
                    outputHeight: outputImage.height
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
    tags: ['picture', 'import'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};