import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Inverse';

const inputEndpoints = [{
    name: 'Value',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Inverse',
    default: 0,
    type: 'number',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="Inverse" panelId={panelId} {...props}>1/Value</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => {
        if (isNaN(values.inputValue)) return { outputInverse: '' };
        console.log('execute invert', { outputInverse: 1/parseFloat(values.inputValue) });
        return { outputInverse: 1/parseFloat(values.inputValue) };
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
    inputEndpoints,
    outputEndpoints
};