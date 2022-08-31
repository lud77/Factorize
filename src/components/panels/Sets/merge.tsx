import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Merge';

const inputEndpoints = [{
    name: 'Collection1',
    defaultValue: [],
    type: 'array',
    signal: 'Value'
}, {
    name: 'Collection2',
    defaultValue: [],
    type: 'array',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Result',
    default: [],
    type: 'array',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addInputEndpoint(
            panelId,
            `Collection`,
            `Collection${panel.collectionEpsCounter}`,
            'array',
            [],
            'Value',
            [],
            'collectionEps'
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
                <InputEndpoint name="Collection1" panelId={panelId} {...props}>Collection</InputEndpoint>
                <OutputEndpoint name="Result" panelId={panelId} {...props}>Result</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Collection2" panelId={panelId} {...props}>Collection</InputEndpoint>
            </div>
            {
                props.panel.collectionEps.map(([ep, epRef, label, name, type], key) => (
                    <div className="Row" key={key}>
                        <InputEndpoint name={name} panelId={panelId} removable={true} registry="collectionEps" {...props}>{label}</InputEndpoint>
                    </div>
                ))
            }
        </>;
    };

    const execute = (panel, values) => {
        const eps = ['inputCollection1', 'inputCollection2'].concat(panel.collectionEps.map(([ep]) => ep));

        const allArrays = eps.reduce((a, ep) => a && Array.isArray(values[ep]), true);

        console.log('execute concat', panel.collectionEps, eps.reduce((a, ep) => a.concat(values[ep]), []));

        if (!allArrays) return { outputResult: [] };
        return { outputResult: eps.reduce((a, ep) => a.concat(values[ep]), []) };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        collectionEps: [],
        collectionEpsCounter: 3,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['array', 'list'],
    inputEndpoints,
    outputEndpoints
};