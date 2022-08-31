import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Modulus';

const inputEndpoints = [{
    name: 'Number',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Modulus',
    defaultValue: 2,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Remainder',
    default: 0,
    type: 'number',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Number" panelId={panelId} {...props}>Number</InputEndpoint>
                <OutputEndpoint name="Remainder" panelId={panelId} {...props}>Remainder</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Modulus" panelId={panelId} {...props}>Modulus</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        return { outputRemainder: parseInt(values.inputNumber) % parseInt(values.inputModulus) };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 74,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    inputEndpoints,
    outputEndpoints
};