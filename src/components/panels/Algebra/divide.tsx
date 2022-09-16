import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Divide';

const inputEndpoints = [{
    name: 'Dividend',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Divisor',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Result',
    defaultValue: 0,
    type: 'number',
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
                <InputEndpoint name="Dividend" panelId={panelId} {...props}>Dividend</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Divisor" panelId={panelId} {...props}>Divisor</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        return { outputResult: parseFloat(values.inputDividend) / parseFloat(values.inputDivisor) };
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
    tags: ['algebra', 'division'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};