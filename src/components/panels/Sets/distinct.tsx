import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

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

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 54
};

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
        ...panelSizes,
        Component,
        execute
    } as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['unique', 'set', 'collection'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;