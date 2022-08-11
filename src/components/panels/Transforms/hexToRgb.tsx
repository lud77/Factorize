import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import { hex2rgb, hex2hsl } from '../../../utils/colors';

const panelType = 'HexToRGB';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Hex" panelId={panelId} {...props}>Hex</InputEndpoint>
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

    const inputEndpoints = [{
        name: 'Hex',
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

    const execute = (panel, inputs) => {
        const [ outputRed, outputGreen, outputBlue ] = hex2rgb(inputs.inputHex);
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
        Component,
        execute,
        height: 95
    } as Panel;
};

export default {
    type: panelType,
    create
};