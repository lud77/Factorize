import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Join';

const inputEndpoints = [{
    name: 'List',
    defaultValue: [],
    type: 'array',
    signal: 'Value'
}, {
    name: 'Separator',
    defaultValue: '\n',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Text',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 75
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="List" panelId={panelId} {...props}>List</InputEndpoint>
                <OutputEndpoint name="Text" panelId={panelId} {...props}>Text</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Separator" panelId={panelId} editor="text" {...props}>Separator</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        if (!Array.isArray(values.inputList)) return values;

        const separator = String(values.inputSeparator);
        return { outputText: values.inputList.join(separator) };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['string', 'set', 'collection', 'implode'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;