import os from 'os';
import * as React from 'react';

import { Panel } from '../../../types/Panel';
import { getExtendedFormat } from '../../../domain/Contents';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

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

const panelSizes = {
    ...defaultSizes,
    height: 94
};

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

                const inputMessage = panel.inputEpValues.inputMessage != null ? panel.inputEpValues.inputMessage : '';
                System.appendToFile(panel.inputEpValues.inputFile, getExtendedFormat(inputMessage) + os.EOL);
                return {};
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute,
        onPulse
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['log', 'output'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;