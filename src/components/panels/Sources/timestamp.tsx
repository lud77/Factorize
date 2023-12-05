import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Timestamp';

const inputEndpoints = [{
    name: 'Fetch',
    signal: 'Pulse'
}];

const outputEndpoints = [{
    name: 'Timestamp',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    width: 144,
    height: 54
};

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
        ...panelSizes,
        Component,
        execute,
        onPulse
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['date'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;