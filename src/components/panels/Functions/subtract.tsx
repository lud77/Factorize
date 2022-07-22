import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Minuend" panelId={panelId} {...props}>Minuend</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Subtrahend" panelId={panelId} {...props}>Subtrahend</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Minuend',
        defaultValue: 0,
        signal: 'Value'
    }, {
        name: 'Subtrahend',
        defaultValue: 0,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Result',
        default: 0,
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        return { outputResult: parseFloat(values.inputMinuend) - parseFloat(values.inputSubtrahend) };
    };

    return {
        type: 'Subtract',
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