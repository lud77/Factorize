import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Sound from '../../../domain/types/Sound';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'MicrophoneIn';

const inputEndpoints = [{
    name: 'Open',
    defaultValue: false,
    type: 'boolean',
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
    height: 54
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Open" panelId={panelId} {...props}>Open</InputEndpoint>
                <OutputEndpoint name="Sound" panelId={panelId} {...props}>Sound</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute mike in', inputs);

        const hasOpenChanged = (panel.outputEpValues.oldOpen == null) || (inputs.inputOpen != panel.outputEpValues.oldOpen);

        const hasChanged = hasOpenChanged;

        if (!hasChanged) return {};

        if (inputs.inputOpen && navigator.mediaDevices) {
            return Promise.resolve()
                .then(() => navigator.mediaDevices.getUserMedia({ "audio": true }))
                .then((stream) => {
                    const microphone = Sound.getContext().createMediaStreamSource(stream);

                    return {
                        oldOpen: inputs.inputOpen,
                        outputSound: Sound.toSound(microphone)
                    };
                })
                .catch((e) => {
                    console.log('microphone panel error', e);

                    return {
                        oldOpen: inputs.inputOpen
                    };
                });
        }

        return {
            oldOpen: inputs.inputOpen
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

export default {
    type: panelType,
    create,
    tags: ['output', 'audio'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};