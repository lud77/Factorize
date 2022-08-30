import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Sum';

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addInputEndpoint(
            panelId,
            `Addend`,
            `Addend${panel.addendEpsCounter}`,
            'number',
            0,
            'Value',
            0,
            'addendEps'
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
                <InputEndpoint name="Addend1" panelId={panelId} editable={true} {...props}>Addend</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Addend2" panelId={panelId} editable={true} {...props}>Addend</InputEndpoint>
            </div>
            {
                props.panel.addendEps.map(([ep, epRef, label, name, type], key) => (
                    <div className="Row" key={key}>
                        <InputEndpoint name={name} panelId={panelId} removable={true} registry="addendEps" editable={true} {...props}>{label}</InputEndpoint>
                    </div>
                ))
            }
        </>;
    };

    const inputEndpoints = [{
        name: 'Addend1',
        defaultValue: 0,
        type: 'number',
        signal: 'Value'
    }, {
        name: 'Addend2',
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
        const eps = ['inputAddend1', 'inputAddend2'].concat(panel.addendEps.map(([ep]) => ep));

        const allNumbers = eps.reduce((a, ep) => a && !isNaN(values[ep]), true);

        console.log('execute sum', panel.addendEps, eps.reduce((a, ep) => a + parseFloat(values[ep]), 0));

        if (!allNumbers) return { outputResult: '' };
        return { outputResult: eps.reduce((a, ep) => a + parseFloat(values[ep]), 0) };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        addendEps: [],
        addendEpsCounter: 3,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['addition']
};