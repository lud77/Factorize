import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'List';

const inputEndpoints = [{
    name: 'AddLast',
    signal: 'Pulse'
}, {
    name: 'AddFirst',
    signal: 'Pulse'
}, {
    name: 'Value',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}, {
    name: 'PickLast',
    signal: 'Pulse'
}, {
    name: 'PickFirst',
    signal: 'Pulse'
}, {
    name: 'Store',
    signal: 'Pulse'
}, {
    name: 'Reset',
    signal: 'Pulse'
}];

const outputEndpoints = [{
    name: 'List',
    defaultValue: [],
    type: 'array',
    signal: 'Value'
}, {
    name: 'Value',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}, {
    name: 'Size',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="AddLast" panelId={panelId} signal="Pulse" description="Add the input [Value] at the end the [List]" {...props}>Add Last</InputEndpoint>
                <OutputEndpoint name="List" panelId={panelId} {...props}>List</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="AddFirst" panelId={panelId} signal="Pulse" description="Add the input [Value] at the beginning the [List]" {...props}>Add First</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="Size" panelId={panelId} {...props}>Size</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="PickLast" panelId={panelId} signal="Pulse" description="Remove the last element of [List] and expose it as the output [Value]" {...props}>Pick Last</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="PickFirst" panelId={panelId} signal="Pulse" description="Remove the first element of [List] and expose it as the output [Value]" {...props}>Pick First</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Store" panelId={panelId} signal="Pulse" description="Replace the [List] with the one in the input [Value]" {...props}>Store</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Reset" panelId={panelId} signal="Pulse" description="Empty the [List]" {...props}>Reset</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputAddLast':
                return {
                    outputList: [ ...panel.outputEpValues.outputList, panel.inputEpValues.inputValue ],
                    outputValue: null,
                    outputSize: panel.outputEpValues.outputList.length + 1
                };
            case 'inputAddFirst':
                return {
                    outputList: [ panel.inputEpValues.inputValue, ...panel.outputEpValues.outputList ],
                    outputValue: null,
                    outputSize: panel.outputEpValues.outputList.length + 1
                };
            case 'inputPickLast':
                const lastValue = panel.outputEpValues.outputList.length > 0 ? panel.outputEpValues.outputList.pop() : '';
                return {
                    outputList: [ ...panel.outputEpValues.outputList ],
                    outputValue: lastValue,
                    outputSize: panel.outputEpValues.outputList.length
                };
            case 'inputPickFirst':
                const firstValue = panel.outputEpValues.outputList.length > 0 ? panel.outputEpValues.outputList.shift() : '';
                return {
                    outputList: [ ...panel.outputEpValues.outputList ],
                    outputValue: firstValue,
                    outputSize: panel.outputEpValues.outputList.length
                };
            case 'inputStore':
                if (!Array.isArray(panel.inputEpValues.inputValue)) return {};
                return {
                    outputList: panel.inputEpValues.inputValue,
                    outputValue: null,
                    outputSize: panel.inputEpValues.inputValue.length
                };
            case 'inputReset':
                return {
                    outputList: [],
                    outputValue: null,
                    outputSize: 0
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
    tags: ['array', 'set', 'collection'],
    inputEndpoints,
    outputEndpoints
};