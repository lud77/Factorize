import os from 'os';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import System from '../../../domain/System';

const panelType = 'FileLogger';

const inputEndpoints = [{
    name: 'Log',
    signal: 'Pulse'
}, {
    name: 'Message',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}, {
    name: 'File',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}];

const outputEndpoints = [];

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Log" panelId={panelId} signal="Pulse" description="Append the [Message] to the [File]" {...props}>Log</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Message" panelId={panelId} {...props}>Message</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="File" panelId={panelId} {...props}>File</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputLog':
                if (panel.inputEpValues.inputFile === '' || panel.inputEpValues.inputMessage === '') return {}

                System.appendToFile(panel.inputEpValues.inputFile, panel.inputEpValues.inputMessage + os.EOL);
                return {};
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
        height: 94
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['log', 'output'],
    inputEndpoints,
    outputEndpoints
};