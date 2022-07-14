import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addOutputEndpoint(
            panelId,
            `Out ${panel.outEps.length + 3}`,
            `Out${panel.outEps.length + 3}`,
            '',
            panel.inputEpValues.inputIn,
            'outEps'
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
                <InputEndpoint name="In" panelId={panelId} {...props}>In</InputEndpoint>
                <OutputEndpoint name="Out1" panelId={panelId} {...props}>Out 1</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Out2" panelId={panelId} {...props}>Out 2</OutputEndpoint>
            </div>
            {
                props.panel.outEps.map(([ep, epRef, label, name], key) => (
                    <div className="Row" key={key}>
                        <OutputEndpoint name={name} panelId={panelId} {...props}>{label}</OutputEndpoint>
                    </div>
                ))
            }
         </>;
    };

    const inputEndpoints = [{
        name: 'In',
        defaultValue: ''
    }];

    const outputEndpoints = [{
        name: 'Out1',
        defaultValue: ''
    }, {
        name: 'Out2',
        defaultValue: ''
    }];

    const execute = (panel, values) => {
        const update = {
            outputOut1: values.inputIn,
            outputOut2: values.inputIn
        };

        const results = panel.outEps
            .map(([ep, epRef, label, name]) => ({ [ep]: values.inputIn }))
            .reduce((a, v) => ({ ...a, ...v }), update);

        console.log('execute', panel.outEps, results);

        return results;
    };

    return {
        type: 'Value',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        outEps: [],
        Component,
        execute
    } as Panel;
};

export default {
    create
};