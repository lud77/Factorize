import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="Changed" panelId={panelId} signal="Pulse" {...props}>Changed</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Value',
        defaultValue: '',
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Changed',
        signal: 'Pulse'
    }];

    const execute = (panel, values, { sendPulseTo }) => {
        sendPulseTo(panel.panelId, 'outputChanged');
        return values;
    };

    return {
        type: 'Delta',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 54
    } as Panel;
};

export default {
    create
};