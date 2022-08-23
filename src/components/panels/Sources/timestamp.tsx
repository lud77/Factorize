import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Timestamp';

const create = (panelId: number): Panel => {
    const getValue = () => Date.now();

    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Fetch" panelId={panelId} signal="Pulse" description="Produce current timestamp" {...props}>Fetch</InputEndpoint>
                <OutputEndpoint name="Timestamp" panelId={panelId} {...props}>Timestamp</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Fetch',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Timestamp',
        defaultValue: getValue(),
        type: 'number',
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputFetch':
                return { outputTimestamp: getValue() };
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 54,
        Component,
        execute,
        onPulse
    } as Panel;
};

export default {
    type: panelType,
    create
};