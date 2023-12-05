import * as React from 'react';

import * as math from 'mathjs';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Simplify';

const inputEndpoints = [{
    name: 'Function',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Function',
    defaultValue: '',
    type: 'string',
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
                <OutputEndpoint name="Function" panelId={panelId} signal="Value" {...props}>Function</OutputEndpoint>
            </div>
        </>;
    };

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
        ...panelSizes,
        Component,
        execute
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;