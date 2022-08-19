import * as React from 'react';

import functionPlot from 'function-plot';
import * as math from 'mathjs';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Derivative';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Function" panelId={panelId} signal="Value" {...props}>Function</InputEndpoint>
                <OutputEndpoint name="Derivative" panelId={panelId} signal="Value" {...props}>Derivative</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Function',
        defaultValue: '',
        type: 'function',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Derivative',
        defaultValue: '',
        type: 'function',
        signal: 'Value'
    }];

    const execute = (panel, inputs) => {
        const oldFunction = panel.outputEpValues.inputFunction;

        if (oldFunction != inputs.inputFunction) {

            try {
                const outputDerivative = math.derivative(inputs.inputFunction, 'x').toString();

                return {
                    ...inputs,
                    oldFunction: inputs.inputFunction,
                    outputDerivative
                };
            } catch (e) {
                return { ...inputs, inputFunction: '', outputDerivative: '' };
            }
        }

        return inputs;
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        width: 134,
        height: 54
    } as Panel;
};

export default {
    type: panelType,
    create
};