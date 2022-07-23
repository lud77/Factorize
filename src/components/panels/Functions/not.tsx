import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import isBoolean from '../../../utils/isBoolean';

const panelType = 'Not';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="NegatedValue" panelId={panelId} {...props}>¬Value</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Value',
        defaultValue: 0,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'NegatedValue',
        default: 0,
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        if (!isBoolean(values.inputValue)) return { outputNegatedValue: '' };
        return { outputNegatedValue: !values.inputValue };
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