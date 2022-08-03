import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Array';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="AddLast" panelId={panelId} signal="Pulse" description="Add the input [Value] at the end the [Array]" {...props}>Add Last</InputEndpoint>
                <OutputEndpoint name="Array" panelId={panelId} {...props}>Array</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="AddFirst" panelId={panelId} signal="Pulse" description="Add the input [Value] at the beginning the [Array]" {...props}>Add First</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="Size" panelId={panelId} {...props}>Size</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="PickLast" panelId={panelId} signal="Pulse" description="Remove the last element of [Array] and expose it as the output [Value]" {...props}>Pick Last</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="PickFirst" panelId={panelId} signal="Pulse" description="Remove the first element of [Array] and expose it as the output [Value]" {...props}>Pick First</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Reset" panelId={panelId} signal="Pulse" description="Empty the [Array]" {...props}>Reset</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'AddLast',
        signal: 'Pulse'
    }, {
        name: 'AddFirst',
        signal: 'Pulse'
    }, {
        name: 'Value',
        defaultValue: '',
        signal: 'Value'
    }, {
        name: 'PickLast',
        signal: 'Pulse'
    }, {
        name: 'PickFirst',
        signal: 'Pulse'
    }, {
        name: 'Reset',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Array',
        defaultValue: [],
        signal: 'Value'
    }, {
        name: 'Value',
        defaultValue: '',
        signal: 'Value'
    }, {
        name: 'Size',
        defaultValue: 0,
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputAddLast':
                return {
                    outputArray: [ ...panel.outputEpValues.outputArray, panel.inputEpValues.inputValue ],
                    outputSize: panel.outputEpValues.outputArray.length + 1
                };
            case 'inputAddFirst':
                return {
                    outputArray: [ panel.inputEpValues.inputValue, ...panel.outputEpValues.outputArray ],
                    outputSize: panel.outputEpValues.outputArray.length + 1
                };
            case 'inputPickLast':
                const lastValue = panel.outputEpValues.outputArray.length > 0 ? panel.outputEpValues.outputArray.pop() : '';
                return {
                    outputArray: [ ...panel.outputEpValues.outputArray ],
                    outputValue: lastValue,
                    outputSize: panel.outputEpValues.outputArray.length
                };
            case 'inputPickFirst':
                const firstValue = panel.outputEpValues.outputArray.length > 0 ? panel.outputEpValues.outputArray.shift() : '';
                return {
                    outputArray: [ ...panel.outputEpValues.outputArray ],
                    outputValue: firstValue,
                    outputSize: panel.outputEpValues.outputArray.length
                };
            case 'inputReset':
                return {
                    outputArray: [],
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
        height: 159
    } as Panel;
};

export default {
    type: panelType,
    create
};