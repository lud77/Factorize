import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Sound from '../../../domain/signal-formats/Sound';

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
    height: 75
};

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningMikeId: e.target.value });

        return true;
    };


    const formatAudioInputDevices = (devices) => {
        console.log('devices', devices);
        return devices
            .filter((device) => device.kind === 'audioinput')
            .map((device, key) => ({
                id: device.id,
                label: device.label || `device #${key}`
            }));
    };

    const Component = (props) => {
        const [ audioInputs, setAudioInputs ] = React.useState([{ id: -1, label: 'Not supported' }]);

        React.useEffect(() => {
            if (navigator.mediaDevices) {
                Promise.resolve()
                    .then(() => navigator.mediaDevices.enumerateDevices())
                    .then(formatAudioInputDevices)
                    .then((devices) => {
                        if (devices.length) {
                            setAudioInputs(devices);
                            return;
                        }

                        setAudioInputs([{
                            id: -1,
                            label: 'No device found'
                        }]);
                    });
            }
        }, []);

        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <select
                        onChange={handleChange(props)}
                        defaultValue={ props.panel.outputEpValues.outputMikeId }
                        style={{ width: '100%', borderRadius: '5px', border: 'none' }}
                        >
                        {
                            audioInputs.map((audioInput, key) => (<option key={key} value={audioInput.id}>{audioInput.label}</option>))
                        }
                    </select>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Open" panelId={panelId} {...props}>Open</InputEndpoint>
                <OutputEndpoint name="Sound" panelId={panelId} {...props}>Sound</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('execute mike in', inputs);

        const hasMikeChanged = (panel.outputEpValues.oldMike == null) || (inputs.tuningMikeId != panel.outputEpValues.oldMike);
        const hasOpenChanged = (panel.outputEpValues.oldOpen == null) || (inputs.inputOpen != panel.outputEpValues.oldOpen);

        const hasChanged = hasMikeChanged || hasOpenChanged;

        if (!hasChanged) return {};

        if (!inputs.inputOpen) {
            if (panel.outputEpValues.stream != null) {
                panel.outputEpValues.stream.getAudioTracks()
                    .forEach((track) => {
                        track.stop();
                    });
            }

            return {
                oldOpen: inputs.inputOpen,
                outputSound: null,
                stream: null
            };
        }

        if (navigator.mediaDevices) {
            return Promise.resolve()
                .then(() => navigator.mediaDevices.getUserMedia({
                    audio: inputs.tuningMikeId
                        ? { deviceId: inputs.tuningMikeId }
                        : true
                }))
                .then((stream) => {
                    const microphone = Sound.getContext().createMediaStreamSource(stream);

                    return {
                        oldOpen: inputs.inputOpen,
                        outputSound: Sound.toSound(microphone),
                        stream
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
    } as unknown as Panel;
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