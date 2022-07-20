import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

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

    const inputEndpoints = [{
        name: 'Dividend',
        defaultValue: 0,
        signal: 'Value'
    }, {
        name: 'Divisor',
        defaultValue: 0,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Result',
        default: 0,
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        return { outputResult: values.inputDividend / values.inputDivisor };
    };

    return {
        type: 'Subtract',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        Component,
        execute
    } as Panel;
};

export default {
    create
};