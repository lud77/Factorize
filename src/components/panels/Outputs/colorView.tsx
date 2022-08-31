import os from 'os';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'ColorView';

const inputEndpoints = [{
    name: 'Hex',
    defaultValue: '#fff',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [];

const create = (panelId: number): Panel => {

    const Component = (props) => {
        console.log('hex', props.panel.inputEpValues.inputHex);
        const displayStyle = {
            overflow: 'auto',
            width: '100%',
            backgroundColor: `${props.panel.inputEpValues.inputHex}`,
            flexGrow: 1,
            display: 'block',
            marginTop: '2px',
            borderRadius: '5px'
        };

        return <>
            <div className="Row">
                <InputEndpoint name="Hex" panelId={panelId} {...props}>Hex</InputEndpoint>
            </div>
            <div className="Row" style={displayStyle}></div>
        </>;
    };

    const execute = (panel, inputs) => inputs;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        width: 200,
        height: 200,
        minWidth: 120,
        minHeight: 120,
        resizer: 'both'
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['color', 'output'],
    inputEndpoints,
    outputEndpoints
};