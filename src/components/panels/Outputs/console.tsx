import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Log" panelId={panelId} signal="Pulse" {...props}>Log</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Message" panelId={panelId} signal="Value" {...props}>Message</InputEndpoint>
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
    }];

    const outputEndpoints = [];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputLog':
                console.log('FACTORIZE:', Date.now(), panel.inputEpValues.inputMessage);
                return {};
        }
    };

    const execute = (panel, values) => values;

    return {
        type: 'Console',
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
    create
};