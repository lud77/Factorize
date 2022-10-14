import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'SoundPlay';

const inputEndpoints = [{
    name: 'Play',
    signal: 'Pulse'
}, {
    name: 'Sound',
    defaultValue: null,
    type: 'sound',
    signal: 'Value'
}];

const outputEndpoints = [];

const panelSizes = {
    ...defaultSizes,
    height: 74
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Play" panelId={panelId} signal="Pulse" description="Play the [Sound]" {...props}>Play</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Sound" panelId={panelId} {...props}>Sound</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputPlay':
                panel.inputEpValues.inputSound.contents.source.start();
                return {};
        }
    };

    const execute = (panel, inputs) => {
        console.log('execute soundPlay', inputs);

        if (!inputs.inputSound) return { oldSound: null };

        const hasSoundChanged = (panel.outputEpValues.oldSound == null) || (inputs.inputSound != panel.outputEpValues.oldSound);

        const hasChanged = hasSoundChanged;

        if (!hasChanged) return {};

        return {
            oldSound: inputs.inputSound,
            imageData: inputs.inputSound ? inputs.inputSound.contents : ''
        };
    };

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
    tags: ['output', 'audio'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};