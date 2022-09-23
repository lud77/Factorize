import * as React from 'react';

import * as math from 'mathjs';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Derivative';

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

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 54
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Function" panelId={panelId} signal="Value" {...props}>Function</InputEndpoint>
                <OutputEndpoint name="Derivative" panelId={panelId} signal="Value" {...props}>Derivative</OutputEndpoint>
            </div>
        </>;
    };

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
        ...panelSizes,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};