import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Subtract';

const inputEndpoints = [{
    name: 'Minuend',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Subtrahend',
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
                <InputEndpoint name="Minuend" panelId={panelId} editor="text" {...props}>Minuend</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Subtrahend" panelId={panelId} editor="text" {...props}>Subtrahend</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        return { outputResult: parseFloat(values.inputMinuend) - parseFloat(values.inputSubtrahend) };
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
    tags: ['algebra'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;