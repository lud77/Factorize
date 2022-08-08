import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Split';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Text" panelId={panelId} {...props}>Text</InputEndpoint>
                <OutputEndpoint name="Array" panelId={panelId} {...props}>Array</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Separator" panelId={panelId} {...props}>Separator</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Text',
        defaultValue: '',
        type: 'string',
        signal: 'Value'
    }, {
        name: 'Separator',
        defaultValue: '\n',
        type: 'string',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Array',
        default: [],
        type: 'array',
        signal: 'Value'
    }];

    const execute = (panel, values) => {
        const text = String(values.inputText);
        const separator = String(values.inputSeparator);
        return { outputArray: text.split(separator) };
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