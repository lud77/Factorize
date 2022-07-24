import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import System from '../../../domain/System';

const panelType = 'FileAppend';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Log" panelId={panelId} signal="Pulse" {...props}>Log</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Message" panelId={panelId} signal="Value" {...props}>Message</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="File" panelId={panelId} signal="Value" {...props}>File</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Log',
        signal: 'Pulse'
    }, {
        name: 'Message',
        defaultValue: '',
        signal: 'Value'
    }, {
        name: 'File',
        defaultValue: '',
        signal: 'Value'
    }];

    const outputEndpoints = [];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputLog':
                if (panel.inputEpValues.inputFile === '' || panel.inputEpValues.inputMessage === '') return {}

                System.appendToFile(panel.inputEpValues.inputFile, panel.inputEpValues.inputMessage + '\n');
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
    create
};