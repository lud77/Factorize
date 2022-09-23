import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

import { color2rgba } from '../../../utils/colors';

const panelType = 'ColorToRGB';

const inputEndpoints = [{
    name: 'Color',
    defaultValue: '#ffffff',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Red',
    defaultValue: 255,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Green',
    defaultValue: 255,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Blue',
    defaultValue: 255,
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
                <InputEndpoint name="Color" panelId={panelId} editable={true} {...props}>Color</InputEndpoint>
                <OutputEndpoint name="Red" panelId={panelId} {...props}>Red</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Green" panelId={panelId} {...props}>Green</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Blue" panelId={panelId} {...props}>Blue</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        const color = color2rgba(inputs.inputColor);
        if (color == null) return {
            outputRed: null,
            outputGreen: null,
            outputBlue: null
        };

        const [ outputRed, outputGreen, outputBlue ] = color;

        return {
            outputRed,
            outputGreen,
            outputBlue
        };
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
    tags: ['color'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};