import * as React from 'react';

import functionPlot from 'function-plot';
import * as math from 'mathjs';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Simplify';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Function" panelId={panelId} signal="Value" {...props}>Function</InputEndpoint>
                <OutputEndpoint name="Function" panelId={panelId} signal="Value" {...props}>Function</OutputEndpoint>
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
        name: 'Function',
        defaultValue: '',
        type: 'function',
        signal: 'Value'
    }];

    const execute = (panel, inputs) => {
        const oldFunction = panel.outputEpValues.inputFunction;

        if (oldFunction != inputs.inputFunction) {

            try {
                const outputFunction = math.simplify(inputs.inputFunction).toString();

                return {
                    ...inputs,
                    oldFunction: inputs.inputFunction,
                    outputFunction
                };
            } catch (e) {
                return { ...inputs, inputFunction: '', outputFunction: '' };
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