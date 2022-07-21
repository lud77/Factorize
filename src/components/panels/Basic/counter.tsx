import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        const displayStyle = {
            fontFamily: 'courier',
            fontSize: '35px',
            lineHeight: '35px',
            height: '35px',
            textAlign: 'center',
            width: '100%',
            overflow: 'hidden'
        };

        return <>
            <div className="Row">
                <InputEndpoint name="Event" panelId={panelId} signal="Pulse" {...props}>Event</InputEndpoint>
                <OutputEndpoint name="Count" panelId={panelId} {...props}>Count</OutputEndpoint>
            </div>
            <div className="Row">
                <span style={displayStyle}>{`${props.panel.outputEpValues.outputCount}`}</span>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Event',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Count',
        defaultValue: 0,
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputEvent':
                return {
                    outputCount: panel.outputEpValues.outputCount + 1
                };
        }
    };

    const execute = (panel, values) => values;

    return {
        type: 'Counter',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        onPulse
    } as Panel;
};

export default {
    create
};