import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Deviator';

const inputEndpoints = [{
    name: 'StoreA',
    signal: 'Pulse'
}, {
    name: 'StoreB',
    signal: 'Pulse'
}, {
    name: 'A',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}, {
    name: 'B',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Value',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    height: 116
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="StoreA" panelId={panelId} signal="Pulse" description="Store the input [A] in memory" {...props}>Store A</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="StoreB" panelId={panelId} signal="Pulse" description="Store the input [B] in memory" {...props}>Store B</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="A" panelId={panelId} editor="text" {...props}>A</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="B" panelId={panelId} editor="text" {...props}>B</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputStoreA':
                return { outputValue: panel.inputEpValues.inputA };
            case 'inputStoreB':
                return { outputValue: panel.inputEpValues.inputB };
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute,
        onPulse
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['variable', 'store', 'choice', 'memory'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;