import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Threshold';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Threshold" panelId={panelId} {...props}>Threshold</InputEndpoint>
                <OutputEndpoint name="High" panelId={panelId} {...props}>High</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="Equal" panelId={panelId} {...props}>Equal</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Low" panelId={panelId} {...props}>Low</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Threshold',
        defaultValue: 0,
        signal: 'Value'
    }, {
        name: 'Value',
        defaultValue: 0,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'High',
        default: false,
        signal: 'Value'
    }, {
        name: 'Equal',
        default: false,
        signal: 'Value'
    }, {
        name: 'Low',
        default: false,
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        return {
            outputHigh: parseFloat(values.inputValue) > parseFloat(values.inputThreshold),
            outputEqual: parseFloat(values.inputValue) == parseFloat(values.inputThreshold),
            outputLow: parseFloat(values.inputValue) < parseFloat(values.inputThreshold)
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create
};