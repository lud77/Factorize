import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Join';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Array" panelId={panelId} {...props}>Array</InputEndpoint>
                <OutputEndpoint name="Text" panelId={panelId} {...props}>Text</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Separator" panelId={panelId} {...props}>Separator</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Array',
        default: [],
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

    const execute = (panel, values) => {
        if (!Array.isArray(values.inputArray)) return values;

        const separator = String(values.inputSeparator);
        return { outputText: values.inputArray.join(separator) };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 75,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create
};