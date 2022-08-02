import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Memory';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Replace" panelId={panelId} signal="Pulse" description="Replace the value in memory with the input [Value]" {...props}>Replace</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Replace',
        signal: 'Pulse'
    }, {
        name: 'Value',
        defaultValue: '',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Value',
        defaultValue: '',
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputReplace':
                return { outputValue: panel.inputEpValues.inputValue };
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        onPulse,
        height: 74
    } as Panel;
};

export default {
    type: panelType,
    create
};