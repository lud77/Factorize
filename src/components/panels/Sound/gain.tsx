
import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Sound from '../../../domain/types/Sound';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

import System from '../../../domain/System';

const panelType = 'Gain';

const inputEndpoints = [{
    name: 'Sound',
    defaultValue: null,
    type: 'sound',
    signal: 'Value'
}, {
    name: 'Gain',
    defaultValue: 1,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Sound',
    defaultValue: null,
    type: 'sound',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    height: 74
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Sound" panelId={panelId} {...props}>Sound</InputEndpoint>
                <OutputEndpoint name="Sound" panelId={panelId} {...props}>Sound</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Gain" panelId={panelId} {...props}>Gain</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute gain', inputs);

        if (inputs.inputSound == null) return { outputSound: null };

        const gain = parseFloat(inputs.inputGain);

        const hasSoundChanged = (panel.outputEpValues.oldSound == null) || (inputs.inputSound != panel.outputEpValues.oldSound);
        const hasGainChanged = (panel.outputEpValues.oldGain == null) || (gain != panel.outputEpValues.oldGain);

        const hasChanged = hasSoundChanged || hasGainChanged;

        if (!hasChanged) return {};

        if (panel.outputEpValues.oldSound) {
            inputs.inputSound.contents.disconnect();
        }

        const gainNode = Sound.createGain(gain);
        inputs.inputSound.contents.connect(gainNode.contents);

        return {
            oldSound: inputs.inputSound,
            oldGain: gainNode,
            outputSound: gainNode
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute
    } as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['audio', 'import'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;