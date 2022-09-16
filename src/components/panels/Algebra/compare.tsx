import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Compare';

const inputEndpoints = [{
    name: 'A',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'B',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'High',
    defaultValue: false,
    type: 'boolean',
    signal: 'Value'
}, {
    name: 'Equal',
    defaultValue: false,
    type: 'boolean',
    signal: 'Value'
}, {
    name: 'Low',
    defaultValue: false,
    type: 'boolean',
    signal: 'Value'
}, {
    name: 'Different',
    defaultValue: false,
    type: 'boolean',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 114
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="A" panelId={panelId} {...props}>A</InputEndpoint>
                <OutputEndpoint name="High" panelId={panelId} {...props}>A &lt; B</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="B" panelId={panelId} {...props}>B</InputEndpoint>
                <OutputEndpoint name="Equal" panelId={panelId} {...props}>A = B</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Low" panelId={panelId} {...props}>A &gt; B</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Different" panelId={panelId} {...props}>A ≠ B</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        return {
            outputHigh: parseFloat(values.inputB) > parseFloat(values.inputA),
            outputEqual: parseFloat(values.inputB) === parseFloat(values.inputA),
            outputLow: parseFloat(values.inputB) < parseFloat(values.inputA),
            outputDifferent: parseFloat(values.inputB) !== parseFloat(values.inputA)
        };
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
    tags: ['greater', 'lesser', 'lower', 'higher', 'equal', 'threshold'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};