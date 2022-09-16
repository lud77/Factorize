import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'If';

const inputEndpoints = [{
    name: 'Enable',
    signal: 'Pulse'
}, {
    name: 'Condition',
    defaultValue: undefined,
    type: 'boolean',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Then',
    signal: 'Pulse'
}, {
    name: 'Else',
    signal: 'Pulse'
}];

const panelSizes = {
    ...defaultSizes,
    height: 74
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Enable" panelId={panelId} signal="Pulse" description="Check the condition" {...props}>Enable</InputEndpoint>
                <OutputEndpoint name="Then" panelId={panelId} signal="Pulse" description="The condition is true" {...props}>Then</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Condition" panelId={panelId} {...props}>Condition</InputEndpoint>
                <OutputEndpoint name="Else" panelId={panelId} signal="Pulse" description="The condition is false" {...props}>Else</OutputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel, { sendPulseTo }) => {
        switch (ep) {
            case 'inputEnable':
                if (panel.inputEpValues.inputCondition) {
                    sendPulseTo(panel.panelId, 'outputThen');
                } else {
                    sendPulseTo(panel.panelId, 'outputElse');
                }
                return {};
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
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['condition'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};