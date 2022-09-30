import os from 'os';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'ColorView';

const inputEndpoints = [{
    name: 'Color',
    defaultValue: 'transparent',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [];

const panelSizes = {
    ...defaultSizes,
    width: 200,
    height: 200,
    minWidth: 120,
    minHeight: 120
};

const create = (panelId: number): Panel => {

    const Component = (props) => {
        console.log('Color', props.panel.inputEpValues.inputColor);
        const backgroundStyle = {
            backgroundImage: 'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
            backgroundColor: '#ccc',
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            overflow: 'auto',
            width: '100%',
            flexGrow: 1,
            display: 'block',
            marginTop: '2px',
            borderRadius: '5px'
        };

        const displayStyle = {
            backgroundColor: `${props.panel.inputEpValues.inputColor}`,
            overflow: 'auto',
            width: '100%',
            height: '100%',
            display: 'block'
        };

        return <>
            <div className="Row">
                <InputEndpoint name="Color" panelId={panelId} editor="text" {...props}>Color</InputEndpoint>
            </div>
            <div className="Row" style={backgroundStyle}>
                <div style={displayStyle}></div>
            </div>
        </>;
    };

    const execute = (panel, inputs) => inputs;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute,
        resizer: 'both'
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['color', 'output'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};