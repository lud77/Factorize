import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';
import isBoolean from '../../../utils/isBoolean';

const panelType = 'Not';

const inputEndpoints = [{
    name: 'Value',
    defaultValue: 0,
    type: 'boolean',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'NegatedValue',
    defaultValue: 0,
    type: 'boolean',
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
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="NegatedValue" panelId={panelId} {...props}>¬Value</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        if (!isBoolean(values.inputValue)) return { outputNegatedValue: '' };
        return { outputNegatedValue: !values.inputValue };
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
    tags: ['algebra', 'boolean', 'binary', 'negation'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;