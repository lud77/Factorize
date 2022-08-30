import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Fan';

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addOutputEndpoint(
            panelId,
            `Out`,
            `Out${panel.outEpsCounter}`,
            'any',
            '',
            'Value',
            panel.inputEpValues.inputIn,
            'outEps'
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
                <InputEndpoint name="In" panelId={panelId} {...props}>In</InputEndpoint>
                <OutputEndpoint name="Out1" panelId={panelId} {...props}>Out</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Out2" panelId={panelId} {...props}>Out</OutputEndpoint>
            </div>
            {
                props.panel.outEps.map(([ep, epRef, label, name, type], key) => (
                    <div className="Row" key={key}>
                        <OutputEndpoint name={name} panelId={panelId} removable={true} registry="outEps" {...props}>{label}</OutputEndpoint>
                    </div>
                ))
            }
         </>;
    };

    const inputEndpoints = [{
        name: 'In',
        defaultValue: '',
        type: 'any',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Out1',
        defaultValue: '',
        type: 'any',
        signal: 'Value'
    }, {
        name: 'Out2',
        defaultValue: '',
        type: 'any',
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        const update = {
            outputOut1: values.inputIn,
            outputOut2: values.inputIn
        };

        const results = panel.outEps
            .map(([ep, epRef, label, name, type]) => ({ [ep]: values.inputIn }))
            .reduce((a, v) => ({ ...a, ...v }), update);

        console.log('execute fan', panel.outEps, results);

        return results;
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        outEps: [],
        outEpsCounter: 3,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['split']
};