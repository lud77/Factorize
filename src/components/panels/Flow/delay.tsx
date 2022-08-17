import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Delay';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="In" panelId={panelId} signal="Pulse" description="Input pulse" {...props}>In</InputEndpoint>
                <OutputEndpoint name="Out" panelId={panelId} signal="Pulse" description="Output pulse" {...props}>Out</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Seconds" panelId={panelId} signal="Value" {...props}>Seconds</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'In',
        signal: 'Pulse'
    }, {
        name: 'Seconds',
        defaultValue: 1,
        type: 'number',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Out',
        signal: 'Pulse'
    }];

    const onPulse = (ep, panel, { sendPulseTo }) => {
        switch (ep) {
            default:
                if (isNaN(panel.inputEpValues.inputSeconds) || panel.inputEpValues.inputSeconds < 0) return {};

                setTimeout(() => {
                    sendPulseTo(panel.panelId, 'outputOut');
                }, panel.inputEpValues.inputSeconds * 1000);

                return {};
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 74,
        inEps: [],
        inEpsCounter: 3,
        Component,
        execute,
        onPulse
    } as Panel;
};

export default {
    type: panelType,
    create
};