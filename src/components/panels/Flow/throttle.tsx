import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Throttle';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="In" panelId={panelId} signal="Pulse" description="Pulse to transmit" {...props}>In</InputEndpoint>
                <OutputEndpoint name="Accepted" panelId={panelId} signal="Pulse" description="No more than [Max] pulses received in the last [Window]" {...props}>Accepted</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Window" panelId={panelId} {...props}>Window</InputEndpoint>
                <OutputEndpoint name="Discarded" panelId={panelId} signal="Pulse" description="More than [Max] pulses received in the last [Window]" {...props}>Discarded</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Max" panelId={panelId} {...props}>Max</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Reset" panelId={panelId} signal="Pulse" description="Reset counter for this window" {...props}>Reset</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'In',
        signal: 'Pulse'
    }, {
        name: 'Window',
        defaultValue: Infinity, // seconds
        type: 'number',
        signal: 'Value'
    }, {
        name: 'Max',
        defaultValue: 1, // events
        type: 'number',
        signal: 'Value'
    }, {
        name: 'Reset',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Accepted',
        signal: 'Pulse'
    }, {
        name: 'Discarded',
        signal: 'Pulse'
    }];

    const onPulse = (ep, panel, { sendPulseTo }) => {
        switch (ep) {
            case 'inputIn':
                const outputEvents = (panel.outputEpValues.outputEvents || [])
                    .filter((event) => event > (Date.now() - (panel.inputEpValues.inputWindow || 5) * 1000));

                console.log('outputEvents', outputEvents);

                if (outputEvents.length < (panel.inputEpValues.inputMax || 1)) {
                    outputEvents.push(Date.now());
                    sendPulseTo(panel.panelId, 'outputAccepted');
                    return { outputEvents };
                }

                sendPulseTo(panel.panelId, 'outputDiscarded');
                return { outputEvents };
            case 'inputReset':
                return { outputEvents: [] };
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
        height: 114
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['rate limiter']
};