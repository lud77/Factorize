import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Accumulator';

const inputEndpoints = [{
    name: 'Event',
    signal: 'Pulse'
}, {
    name: 'Value',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
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

const panelSizes = {
    ...defaultSizes,
    height: 95
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Event" panelId={panelId} signal="Pulse" description="Increase counter" {...props}>Event</InputEndpoint>
                <OutputEndpoint name="Count" panelId={panelId} {...props}>Count</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} signal="Value" editor="text" {...props}>Value</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Reset" panelId={panelId} signal="Pulse" description="Set the counter to zero" {...props}>Reset</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputEvent':
                if (isNaN(panel.inputEpValues.inputValue)) return {};

                return {
                    outputCount: panel.outputEpValues.outputCount + parseFloat(panel.inputEpValues.inputValue)
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
        ...panelSizes,
        Component,
        execute,
        onPulse
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['counter', 'event'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;