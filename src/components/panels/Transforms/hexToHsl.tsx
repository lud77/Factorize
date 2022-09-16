import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

import { hex2hsl } from '../../../utils/colors';

const panelType = 'HexToHSL';

const inputEndpoints = [{
    name: 'Hex',
    defaultValue: '#ffffff',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Hue',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Saturation',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Luminosity',
    defaultValue: 100,
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
                <InputEndpoint name="Hex" panelId={panelId} {...props}>Hex</InputEndpoint>
                <OutputEndpoint name="Hue" panelId={panelId} {...props}>Hue</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Saturation" panelId={panelId} {...props}>Saturation</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Luminosity" panelId={panelId} {...props}>Luminosity</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        const [ outputHue, outputSaturation, outputLuminosity ] = hex2hsl(inputs.inputHex);
        return {
            outputHue,
            outputSaturation,
            outputLuminosity
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