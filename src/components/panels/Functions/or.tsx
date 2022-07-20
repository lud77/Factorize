import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import isBoolean from '../../../utils/isBoolean';

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addInputEndpoint(
            panelId,
            `Operand`,
            `Operand${panel.operandEpsCounter}`,
            0,
            'Value',
            0,
            'operandEps'
        );
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <button onClick={handleClick(props)}>+</button>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Operand1" panelId={panelId} {...props}>Operand</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Operand2" panelId={panelId} {...props}>Operand</InputEndpoint>
            </div>
            {
                props.panel.operandEps.map(([ep, epRef, label, name], key) => (
                    <div className="Row" key={key}>
                        <InputEndpoint name={name} panelId={panelId} removable={true} registry="operandEps" {...props}>{label}</InputEndpoint>
                    </div>
                ))
            }
        </>;
    };

    const inputEndpoints = [{
        name: 'Operand1',
        defaultValue: 0,
        signal: 'Value'
    }, {
        name: 'Operand2',
        defaultValue: 0,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Result',
        default: 0,
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        const eps = ['inputOperand1', 'inputOperand2'].concat(panel.operandEps.map(([ep]) => ep));

        const allBooleans = eps.map((ep) => values[ep]).every(isBoolean);

        console.log('execute or', panel.operandEps, eps.find((ep) => values[ep] == true));

        if (!allBooleans) return { outputResult: '' };
        return { outputResult: eps.find((ep) => values[ep] == true) }
    };

    return {
        type: 'Or',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        operandEps: [],
        operandEpsCounter: 3,
        Component,
        execute
    } as Panel;
};

export default {
    create
};