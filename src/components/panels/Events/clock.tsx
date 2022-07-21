import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Active" panelId={panelId} {...props}>Active</InputEndpoint>
                <OutputEndpoint name="Tick" panelId={panelId} signal="Pulse" {...props}>Tick</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Seconds" panelId={panelId} {...props}>Seconds</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Active',
        defaultValue: false,
        signal: 'Value'
    }, {
        name: 'Seconds',
        defaultValue: 5,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Tick',
        signal: 'Pulse'
    }];

    const run = (panel, sendPulseTo) => {
        if (!panel.inputEpValues.inputActive) return;

        timerRef.current = setTimeout(() => {
            sendPulseTo(panel.panelId, 'outputTick');
            run(panel, sendPulseTo);
        }, panel.inputEpValues.inputSeconds * 1000);
    };

    const execute = (panel, values, { sendPulseTo }) => {
        if (timerRef.current != null) {
            clearTimeout(timerRef.current);
        }

        const timeoutHandler = run(panel, sendPulseTo);

        return values;
    };

    return {
        type: 'Clock',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 84
    } as Panel;
};

export default {
    create
};