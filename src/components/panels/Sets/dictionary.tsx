import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Dictionary';

const inputEndpoints = [{
    name: 'Store',
    signal: 'Pulse'
}, {
    name: 'Read',
    signal: 'Pulse'
}, {
    name: 'Remove',
    signal: 'Pulse'
}, {
    name: 'Key',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}, {
    name: 'Value',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}, {
    name: 'Reset',
    signal: 'Pulse'
}];

const outputEndpoints = [{
    name: 'Dictionary',
    defaultValue: {},
    type: 'object',
    signal: 'Value'
}, {
    name: 'Value',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Store" panelId={panelId} signal="Pulse" description="Store the [Key]-[Value] pair to the [Dictionary]" {...props}>Store</InputEndpoint>
                <OutputEndpoint name="Dictionary" panelId={panelId} {...props}>Dictionary</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Read" panelId={panelId} signal="Pulse" description="Expose the dictionary content for the specified [Key] as the output [Value]" {...props}>Read</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Remove" panelId={panelId} signal="Pulse" description="Remove the specified [Key] from the [Dictionary]" {...props}>Remove</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Key" panelId={panelId} {...props}>Key</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Reset" panelId={panelId} signal="Pulse" description="Empty the [Dictionary]" {...props}>Reset</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputStore':
                console.log(panel.inputEpValues.inputKey, panel.inputEpValues.inputValue, panel.outputEpValues.outputDictionary);
                return {
                    outputDictionary: { ...panel.outputEpValues.outputDictionary, [panel.inputEpValues.inputKey]: panel.inputEpValues.inputValue },
                    outputValue: null
                };
            case 'inputRead':
                console.log(panel.inputEpValues.inputKey, panel.outputEpValues.outputDictionary[panel.inputEpValues.inputKey]);
                return {
                    outputValue: panel.outputEpValues.outputDictionary[panel.inputEpValues.inputKey]
                };
            case 'inputRemove':
                delete panel.outputEpValues.outputDictionary[panel.inputEpValues.inputKey];
                return {
                    outputDictionary: { ...panel.outputEpValues.outputDictionary }
                };
            case 'inputReset':
                return {
                    outputDictionary: {},
                    outputValue: null
                };
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
        height: 179
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['associative', 'hashmap'],
    inputEndpoints,
    outputEndpoints
};