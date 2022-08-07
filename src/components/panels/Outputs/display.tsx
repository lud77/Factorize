import os from 'os';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Display';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const displayStyle = {
            fontFamily: 'courier',
            fontSize: '20px',
            lineHeight: '20px',
            overflowY: 'scroll',
            width: '100%',
            backgroundColor: 'var(--background)',
            flexGrow: 1,
            display: 'block',
            marginTop: '2px'
        };

        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
            </div>
            <div className="Row" style={displayStyle}>
                {props.panel.inputEpValues.inputValue.split('\n').map((str) => <p style={{ margin: '0px', height: '20px' }}>{str}</p>)}
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Value',
        defaultValue: '',
        type: 'any',
        signal: 'Value'
    }];

    const outputEndpoints = [];

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        width: 200,
        height: 200,
        resizer: 'both'
    } as Panel;
};

export default {
    type: panelType,
    create
};