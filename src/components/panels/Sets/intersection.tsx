import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Intersection';

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
    defaultValue: [],
    type: 'array',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 94
};

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

    const intersect = (a, b) => {
        const setB = new Set(b);
        return Array.from(new Set(a)).filter((item) => setB.has(item));
    };

    const intersectMany = (arrays) => {
        if (arrays.length < 1) return [];
        if (arrays.length === 1) return arrays[0];

        const sorted = arrays.sort((a, b) => a.length > b.length);
        const first = arrays.shift();
        return arrays.reduce((a, v) => intersect(a, v), first);
    };

    const execute = (panel, values) => {
        const eps = ['inputCollection1', 'inputCollection2'].concat(panel.collectionEps.map(([ep]) => ep));

        const allArrays = eps.reduce((a, ep) => a && Array.isArray(values[ep]), true);

        console.log('execute intesect', panel.collectionEps, intersectMany(eps.map((ep) => values[ep])));

        if (!allArrays) return { outputResult: [] };
        return { outputResult: intersectMany(eps.map((ep) => values[ep])) };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        collectionEps: [],
        collectionEpsCounter: 3,
        Component,
        execute
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['array', 'list', 'set', 'collection'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;