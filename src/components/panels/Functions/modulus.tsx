import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

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

    const inputEndpoints = [{
        name: 'Number',
        defaultValue: 0,
        signal: 'Value'
    }, {
        name: 'Modulus',
        defaultValue: 0,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Remainder',
        default: 0,
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        return { outputRemainder: parseInt(values.inputNumber) % parseInt(values.inputModulus) };
    };

    return {
        type: 'Modulus',
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
    create
};