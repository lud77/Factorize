import os from 'os';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Logger';

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
                <InputEndpoint name="Log" panelId={panelId} signal="Pulse" description="Append the [Message] to the [Contents]" {...props}>Log</InputEndpoint>
                <OutputEndpoint name="Contents" panelId={panelId} {...props}>Contents</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Message" panelId={panelId} {...props}>Message</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Clear" panelId={panelId} signal="Pulse" description="Clear the [Contents]" {...props}>Clear</InputEndpoint>
            </div>
            <div className="Row" style={displayStyle}>
                {props.panel.outputEpValues.outputContents.split('\n').map((str) => <p style={{ margin: '0px' }}>{str}</p>)}
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Log',
        signal: 'Pulse'
    }, {
        name: 'Message',
        defaultValue: '',
        type: 'any',
        signal: 'Value'
    }, {
        name: 'Clear',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Contents',
        defaultValue: '',
        type: 'string',
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputLog':
                return { outputContents: panel.outputEpValues.outputContents + panel.inputEpValues.inputMessage + os.EOL };
            case 'inputClear':
                return { outputContents: '' };
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        onPulse,
        width: 200,
        height: 200,
        resizer: 'both'
    } as Panel;
};

export default {
    type: panelType,
    create
};