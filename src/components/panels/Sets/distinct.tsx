import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Distinct';

const inputEndpoints = [{
    name: 'List',
    defaultValue: [],
    type: 'array',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Distinct',
    defaultValue: [],
    type: 'array',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="List" panelId={panelId} {...props}>List</InputEndpoint>
                <OutputEndpoint name="Distinct" panelId={panelId} {...props}>Distinct</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        if (!Array.isArray(values.inputList)) return { outputDistinct: [] };
        return { outputDistinct: Array.from(new Set(values.inputList)) };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 54,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['unique', 'set', 'collection'],
    inputEndpoints,
    outputEndpoints
};