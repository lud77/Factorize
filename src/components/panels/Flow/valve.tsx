import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Valve';

const inputEndpoints = [{
    name: 'Open',
    defaultValue: false,
    type: 'boolean',
    signal: 'Value'
}, {
    name: 'Value',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Value',
    defaultValue: null,
    type: 'any',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Open" panelId={panelId} {...props}>Open</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        return {
            outputValue: values.inputOpen ? values.inputValue : null
        };
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
    tags: ['switch'],
    inputEndpoints,
    outputEndpoints
};