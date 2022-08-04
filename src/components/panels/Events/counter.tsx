import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Counter';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Event" panelId={panelId} signal="Pulse" description="Increase counter" {...props}>Event</InputEndpoint>
                <OutputEndpoint name="Count" panelId={panelId} {...props}>Count</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Reset" panelId={panelId} signal="Pulse" description="Set the counter to zero" {...props}>Reset</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Event',
        signal: 'Pulse'
    }, {
        name: 'Reset',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Count',
        defaultValue: 0,
        type: 'number',
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputEvent':
                return {
                    outputCount: panel.outputEpValues.outputCount + 1
                };
            case 'inputReset':
                return {
                    outputCount: 0
                };
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