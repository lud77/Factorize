import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const displayStyle = {
            fontFamily: 'courier',
            fontSize: '35px',
            lineHeight: '35px',
            height: '35px',
            textAlign: 'center',
            width: '100%',
            overflow: 'hidden'
        };

        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
            </div>
            <div className="Row">
                <span style={displayStyle}>{props.panel.inputEpValues.inputValue}</span>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Value',
        defaultValue: '',
        signal: 'Value'
    }];

    const outputEndpoints = [];

    const execute = (values) => values;

    return {
        type: 'Display',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute
    } as Panel;
};

export default {
    create
};