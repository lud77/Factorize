import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Enable" panelId={panelId} signal="Pulse" {...props}>Enable</InputEndpoint>
                <OutputEndpoint name="Then" panelId={panelId} signal="Pulse" {...props}>Then</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Expression" panelId={panelId} {...props}>Expression</InputEndpoint>
                <OutputEndpoint name="Else" panelId={panelId} signal="Pulse" {...props}>Else</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Enable',
        signal: 'Pulse'
    }, {
        name: 'Expression',
        defaultValue: undefined,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Then',
        signal: 'Pulse'
    }, {
        name: 'Else',
        signal: 'Pulse'
    }];

    const onPulse = (ep, panel, sendPulseTo) => {
        switch (ep) {
            case 'inputEnable':
                if (panel.inputEpValues.inputExpression) {
                    sendPulseTo(panel.panelId, 'outputThen');
                } else {
                    sendPulseTo(panel.panelId, 'outputElse');
                }
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
        height: 84
    } as Panel;
};

export default {
    create
};