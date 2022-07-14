import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addInputEndpoint(
            panelId,
            `Addend ${panel.addendEps.length + 3}`,
            `Addend${panel.addendEps.length + 3}`,
            0,
            0,
            'addendEps'
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
                <InputEndpoint name="Addend1" panelId={panelId} {...props}>Addend 1</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Addend2" panelId={panelId} {...props}>Addend 2</InputEndpoint>
            </div>
            {
                props.panel.addendEps.map(([ep, epRef, label, name], key) => (
                    <div className="Row" key={key}>
                        <InputEndpoint name={name} panelId={panelId} removable={true} {...props}>{label}</InputEndpoint>
                    </div>
                ))
            }
        </>;
    };

    const inputEndpoints = [{
        name: 'Addend1',
        defaultValue: 0
    }, {
        name: 'Addend2',
        defaultValue: 0
    }];

    const outputEndpoints = [{
        name: 'Result',
        default: 0
    }];

    const isNum = (x) => !isNaN(x);

    const execute = (panel, values) => {
        const eps =
            Array(panel.addendEps.length + 2).fill(1)
                .map((addend, i) => `inputAddend${i + 1}`);

        const allNumbers = eps.reduce((a, ep) => a && isNum(values[ep]), true);

        if (!allNumbers) return { outputResult: '' };
        return { outputResult: eps.reduce((a, ep) => a + values[ep], 0) };
    };

    return {
        type: 'Value',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        addendEps: [],
        Component,
        execute
    } as Panel;
};

export default {
    create
};