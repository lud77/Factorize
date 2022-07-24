import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Invert';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="InvertedValue" panelId={panelId} {...props}>1/Value</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Value',
        defaultValue: 0,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'InvertedValue',
        default: 0,
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        if (isNaN(values.inputValue)) return { outputInvertedValue: '' };
        console.log('execute invert', { outputInvertedValue: 1/parseFloat(values.inputValue) });
        return { outputInvertedValue: 1/parseFloat(values.inputValue) };
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