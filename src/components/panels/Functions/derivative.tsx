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
    type: 'string',
    signal: 'Value'
}, {
    name: 'Variable',
    defaultValue: 'x',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Derivative',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 74
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Function" panelId={panelId} signal="Value" {...props}>Function</InputEndpoint>
                <OutputEndpoint name="Derivative" panelId={panelId} signal="Value" {...props}>Derivative</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Variable" panelId={panelId} signal="Value" editor="text" {...props}>Variable</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        const hasFunctionChanged = (panel.outputEpValues.oldFunction == null) || (values.inputFunction != panel.outputEpValues.oldFunction);
        const hasVariableChanged = (panel.outputEpValues.oldVariable == null) || (values.inputVariable != panel.outputEpValues.oldVariable);

        const hasChanged =
            hasFunctionChanged ||
            hasVariableChanged;

        if (!hasChanged) return {};

        try {
            const outputDerivative = math.derivative(values.inputFunction, values.inputVariable).toString();

            return {
                ...values,
                oldFunction: values.inputFunction,
                oldVariable: values.inputVariable,
                outputDerivative
            };
        } catch (e) {
            return {
                ...values,
                oldFunction: values.inputFunction,
                oldVariable: values.inputVariable
            };
        }
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

const PanelBundle = {
    type: panelType,
    create,
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;