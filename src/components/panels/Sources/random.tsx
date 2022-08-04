import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Random';

const create = (panelId: number): Panel => {
    const getValue = () => Math.random();

    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Fetch" panelId={panelId} signal="Pulse" description="Produce a random number" {...props}>Fetch</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Fetch',
        signal: 'Pulse'
    }];

    const outputEndpoints = [{
        name: 'Value',
        defaultValue: getValue(),
        type: 'number',
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputFetch':
                return { outputValue: getValue() };
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