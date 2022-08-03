import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Intersection';

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.addInputEndpoint(
            panelId,
            `Collection`,
            `Collection${panel.collectionEpsCounter}`,
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
                    <button onClick={handleClick(props)}>+</button>
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
                props.panel.collectionEps.map(([ep, epRef, label, name], key) => (
                    <div className="Row" key={key}>
                        <InputEndpoint name={name} panelId={panelId} removable={true} registry="collectionEps" {...props}>{label}</InputEndpoint>
                    </div>
                ))
            }
        </>;
    };

    const inputEndpoints = [{
        name: 'Collection1',
        defaultValue: [],
        signal: 'Value'
    }, {
        name: 'Collection2',
        defaultValue: [],
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Result',
        default: 0,
        signal: 'Value'
    }];

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
    create
};