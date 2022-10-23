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
    name: 'PauseResume',
    signal: 'Pulse'
}, {
    name: 'Stop',
    signal: 'Pulse'
}, {
    name: 'Sound',
    defaultValue: null,
    type: 'sound',
    signal: 'Value'
}, {
    name: 'Loop',
    defaultValue: false,
    type: 'boolean',
    signal: 'Value'
}, {
    name: 'LoopStart',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'LoopEnd',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'EOP',
    signal: 'Pulse'
}, {
    name: 'Sound',
    defaultValue: null,
    type: 'sound',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes,
    height: 179
};

const create = (panelId: number): Panel => {
    const playStyle = {
        marginLeft: '1px'
    };

    const pauseStyle = {
        fontSize: '9px',
        lineHeight: '13px',
        letterSpacing: '-2px',
        marginLeft: '-1px'
    };

    const stopStyle = {
        fontSize: '17px',
        lineHeight: '13px'
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Play" panelId={panelId} signal="Pulse" description="Play the [Sound]" {...props}><span style={playStyle}>▶</span></InputEndpoint>
                <OutputEndpoint name="EOP" panelId={panelId} signal="Pulse" description="Finished playing the [Sound]" {...props}>EOP</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="PauseResume" panelId={panelId} signal="Pulse" description="Stop or restart playing" {...props}><span style={pauseStyle}>❚❚</span></InputEndpoint>
                <OutputEndpoint name="Sound" panelId={panelId} {...props}>Sound</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Stop" panelId={panelId} signal="Pulse" description="Stop playing" {...props}><span style={stopStyle}>■</span></InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Sound" panelId={panelId} {...props}>Sound</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Loop" panelId={panelId} editor="text" {...props}>Loop</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="LoopStart" panelId={panelId} editor="text" {...props}>Loop Start</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="LoopEnd" panelId={panelId} editor="text" {...props}>Loop End</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel, { sendPulseTo }) => {
        switch (ep) {
            case 'inputPlay':
                if (panel.outputEpValues.source != null) {
                    panel.outputEpValues.source.stop();
                }

                const source = panel.outputEpValues.createSound();
                console.log('source', source);
                if (!panel.inputEpValues.inputLoop) {
                    source.contents.addEventListener('ended', () => {
                        sendPulseTo(panel.panelId, 'outputEOP');
                    });
                }

                source.contents.start();

                return { outputSound: source, playing: true };

            case 'inputPauseResume':
                if (panel.outputEpValues.source == null) return {};

                // stuff

                return { playing: !panel.outputEpValues.playing };

            case 'inputStop':
                if (panel.outputEpValues.source != null) {
                    panel.outputEpValues.source.stop();
                }

                return { source: null, playing: false };
        }
    };

    const execute = (panel, inputs) => {
        console.log('execute soundPlay', inputs);

        if (!inputs.inputSound) return { oldSound: null };

        const start = inputs.inputLoopStart || 0;
        const end = inputs.inputLoopStart || 0;

        const hasSoundChanged = (panel.outputEpValues.oldSound == null) || (inputs.inputSound != panel.outputEpValues.oldSound);
        const hasLoop = (panel.outputEpValues.oldLoop == null) || (inputs.inputLoop != panel.outputEpValues.oldLoop);
        const hasLoopStart = (panel.outputEpValues.oldLoopStart == null) || (start != panel.outputEpValues.oldLoopStart);
        const hasLoopEnd = (panel.outputEpValues.oldLoopEnd == null) || (end != panel.outputEpValues.oldLoopEnd);

        const hasChanged = hasSoundChanged || hasLoop || hasLoopStart || hasLoopEnd;

        if (!hasChanged) return {};

        const createSound = () => inputs.inputSound.getSound(inputs.inputSound.contents, inputs.inputSound.inputLoop, start, end);

        return {
            oldSound: inputs.inputSound,
            oldCreateSound: createSound,
            createSound
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