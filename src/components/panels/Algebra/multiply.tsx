import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Multiply';

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addInputEndpoint(
            panelId,
            `Multiplicand`,
            `Multiplicand${panel.multiplicandEpsCounter}`,
            'number',
            0,
            'Value',
            0,
            'multiplicandEps'
        );
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <button className="Button" onClick={handleClick(props)}>+</button>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Multiplicand1" panelId={panelId} span={2} {...props}>Multiplicand</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Multiplicand2" panelId={panelId} {...props}>Multiplicand</InputEndpoint>
            </div>
            {
                props.panel.multiplicandEps.map(([ep, epRef, label, name, type], key) => (
                    <div className="Row" key={key}>
                        <InputEndpoint name={name} panelId={panelId} removable={true} registry="multiplicandEps" {...props}>{label}</InputEndpoint>
                    </div>
                ))
            }
        </>;
    };

    const inputEndpoints = [{
        name: 'Multiplicand1',
        defaultValue: 0,
        type: 'number',
        signal: 'Value'
    }, {
        name: 'Multiplicand2',
        defaultValue: 0,
        type: 'number',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Result',
        default: 0,
        type: 'number',
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        const eps = ['inputMultiplicand1', 'inputMultiplicand2'].concat(panel.multiplicandEps.map(([ep]) => ep));

        const allNumbers = eps.reduce((a, ep) => a && !isNaN(values[ep]), true);

        console.log('execute multiply', panel.multiplicandEps, eps.reduce((a, ep) => a * parseFloat(values[ep]), 1));

        if (!allNumbers) return { outputResult: '' };
        return { outputResult: eps.reduce((a, ep) => a * parseFloat(values[ep]), 1) };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        multiplicandEps: [],
        multiplicandEpsCounter: 3,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create
};