import * as React from 'react';

import * as math from 'mathjs';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Evaluate';

const inputEndpoints = [{
    name: 'Function',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}, {
    name: 'X',
    defaultValue: null,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Value',
    defaultValue: null,
    type: 'number',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 75
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Function" panelId={panelId} signal="Value" {...props}>Function</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} signal="Value" {...props}>Value</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="X" panelId={panelId} signal="Value" {...props}>x</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        if (values.inputFunction == null || values.inputX == null || isNaN(values.inputX)) return { outputImage: null };

        const x = parseFloat(values.inputX);

        const hasFunctionChanged = (panel.outputEpValues.oldFunction == null) || (values.inputFunction != panel.outputEpValues.oldFunction);
        const hasXChanged = (panel.outputEpValues.oldX == null) || (x != panel.outputEpValues.oldX);

        const hasChanged =
            hasFunctionChanged ||
            hasXChanged;

        if (!hasChanged) return {};

        try {
            const outputValue = math.evaluate(values.inputFunction, { x });

            return {
                oldFunction: values.inputFunction,
                oldX: x,
                outputValue
            };
        } catch (e) {
            return { outputValue: null };
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

export default {
    type: panelType,
    create,
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};