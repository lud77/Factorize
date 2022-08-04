import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Opposite';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="Opposite" panelId={panelId} {...props}>-Value</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Value',
        defaultValue: 0,
        type: 'number',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Opposite',
        default: 0,
        type: 'number',
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        if (isNaN(values.inputValue)) return { outputOpposite: '' };
        return { outputOpposite: -parseFloat(values.inputValue) };
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
    create
};