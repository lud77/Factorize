import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import System from '../../../domain/System';

const panelType = 'StdOut';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Log" panelId={panelId} signal="Pulse" description="Write the [Message] to standard output" {...props}>Log</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Message" panelId={panelId} {...props}>Message</InputEndpoint>
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
    }];

    const outputEndpoints = [];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputLog':
                System.consoleLog(panel.inputEpValues.inputMessage);
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
        height: 74
    } as Panel;
};

export default {
    type: panelType,
    create
};