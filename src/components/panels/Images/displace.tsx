import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Image from '../../../domain/signal-formats/Image';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Displace';

const inputEndpoints = [{
    name: 'Image',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Map',
    defaultValue: null,
    type: 'image',
    signal: 'Value'
}, {
    name: 'Offset',
    defaultValue: 10,
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
                <InputEndpoint name="Map" panelId={panelId} {...props}>Map</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Offset" panelId={panelId} editor="text" {...props}>Offset</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute displacement', inputs);
        if (!inputs.inputOffset || isNaN(inputs.inputOffset) || !inputs.inputImage || !inputs.inputMap) return { outputImage: null };

        const offset = parseInt(inputs.inputOffset);

        const hasImageChanged = (panel.outputEpValues.oldImage == null) || (inputs.inputImage != panel.outputEpValues.oldImage);
        const hasMapChanged = (panel.outputEpValues.oldMap == null) || (inputs.inputMap != panel.outputEpValues.oldMap);
        const hasOffsetChanged = (panel.outputEpValues.oldOffset == null) || (offset != panel.outputEpValues.oldOffset);

        const hasChanged =
            hasImageChanged ||
            hasMapChanged ||
            hasOffsetChanged;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => {
                return Image.displace(inputs.inputImage, inputs.inputMap, offset);
            })
            .then((outputImage) => {
                return {
                    oldImage: inputs.inputImage,
                    oldMap: inputs.inputMap,
                    oldOffset: offset,
                    outputImage
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
    } as unknown as Panel;
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