import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { toImage } from '../../../domain/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

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
                <InputEndpoint name="Channel" panelId={panelId} editable={true} {...props}>Channel</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute extract channel', inputs);
        if (!inputs.inputChannel || !inputs.inputImage) return { outputImage: null };

        const hasImageChanged = (panel.outputEpValues.oldImage == null) || (inputs.inputImage != panel.outputEpValues.oldImage);
        const hasChannelChanged = (panel.outputEpValues.oldChannel == null) || (inputs.inputChannel != panel.outputEpValues.oldChannel);

        const hasChanged =
            hasImageChanged ||
            hasChannelChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => inputs.inputImage.contents.getChannel(inputs.inputChannel))
            .then((resultImage) => {
                return { outputImage: toImage(resultImage) };
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
        ...panelSizes,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['image', 'picture', 'split', 'separate'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};