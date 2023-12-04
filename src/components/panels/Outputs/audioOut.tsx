import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Sound from '../../../domain/types/Sound';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'AudioOut';

const inputEndpoints = [{
    name: 'Sound',
    defaultValue: null,
    type: 'sound',
    signal: 'Value'
}];

const outputEndpoints = [];

const panelSizes = {
    ...defaultSizes,
    height: 54
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Sound" panelId={panelId} {...props}>Sound</InputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute soundPlay', inputs);

        if (!inputs.inputSound) return { oldSound: null };

        const hasSoundChanged = (panel.outputEpValues.oldSound == null) || (inputs.inputSound != panel.outputEpValues.oldSound);

        const hasChanged = hasSoundChanged;

        if (!hasChanged) return {};

        if (panel.outputEpValues.oldSound) {
            inputs.inputSound.contents.disconnect();
        }

        // console.log('xxxx', inputs.inputSound);

        if (inputs.inputSound) {
            inputs.inputSound.contents.connect(Sound.getContext().destination);
        }

        return {
            oldSound: inputs.inputSound
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
    tags: ['output', 'audio'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;