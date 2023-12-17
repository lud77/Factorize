import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Sound from '../../../domain/signal-formats/Sound';
import System from '../../../domain/System';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';
import { getModeForResolutionAtIndex } from 'typescript';

const panelType = 'SampleLoad';

const inputEndpoints = [{
    name: 'File',
    defaultValue: '',
    type: 'string',
    signal: 'Value'
}, {
    name: 'Play',
    signal: 'Pulse'
}, {
    name: 'PauseResume',
    signal: 'Pulse'
}, {
    name: 'Stop',
    signal: 'Pulse'
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
    height: 158
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
                <InputEndpoint name="File" panelId={panelId} {...props}>File</InputEndpoint>
                <OutputEndpoint name="EOP" panelId={panelId} signal="Pulse" description="Finished playing the [Sound]" {...props}>EOP</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Play" panelId={panelId} signal="Pulse" description="Play the [Sound]" {...props}><span style={playStyle}>▶</span></InputEndpoint>
                <OutputEndpoint name="Sound" panelId={panelId} {...props}>Sound</OutputEndpoint>
            </div>
            {/* <div className="Row">
                <InputEndpoint name="PauseResume" panelId={panelId} signal="Pulse" description="Stop or restart playing" {...props}><span style={pauseStyle}>❚❚</span></InputEndpoint>
            </div> */}
            <div className="Row">
                <InputEndpoint name="Stop" panelId={panelId} signal="Pulse" description="Stop playing" {...props}><span style={stopStyle}>■</span></InputEndpoint>
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

    const startPlay = (panel, sendPulseTo) => {
        const source = panel.outputEpValues.createSound();

        if (!panel.inputEpValues.inputLoop) {
            source.contents.addEventListener('ended', () => {
                sendPulseTo(panel.panelId, 'outputEOP');
            });
        }

        source.contents.start();

        return source;
    };

    const stopPlay = (sound) => {
        if (sound != null) {
            sound.contents.stop();
        }

        return null;
    };

    const onPulse = (ep, panel, { sendPulseTo }) => {
        switch (ep) {
            case 'inputPlay':
                stopPlay(panel.outputEpValues.outputSound);

                return {
                    outputSound: startPlay(panel, sendPulseTo),
                    playing: true
                };

            // case 'inputPauseResume':
            //     if (panel.outputEpValues.outputSound == null) return {};

            //     if (panel.outputEpValues.playing) {
            //         return {
            //             outputSound: stopPlay(panel.outputEpValues.outputSound),
            //             playing: false
            //         };
            //     }

            //     return {
            //         outputSound: startPlay(panel, sendPulseTo),
            //         playing: true
            //     };

            case 'inputStop':
                return {
                    outputSound: stopPlay(panel.outputEpValues.outputSound),
                    playing: false
                };
        }
    };

    const execute = (panel, inputs) => {
        console.log('execute sampleLoad', inputs);

        if (inputs.inputFile == '') return { outputSound: null };

        const start = inputs.inputLoopStart || 0;
        const end = inputs.inputLoopStart || 0;

        const hasFileChanged = (panel.outputEpValues.oldFile == null) || (inputs.inputFile != panel.outputEpValues.oldFile);
        const hasLoop = (panel.outputEpValues.oldLoop == null) || (inputs.inputLoop != panel.outputEpValues.oldLoop);
        const hasLoopStart = (panel.outputEpValues.oldLoopStart == null) || (start != panel.outputEpValues.oldLoopStart);
        const hasLoopEnd = (panel.outputEpValues.oldLoopEnd == null) || (end != panel.outputEpValues.oldLoopEnd);

        const hasChanged = hasFileChanged || hasLoop || hasLoopStart || hasLoopEnd;

        if (!hasChanged) return {};

        return Promise.resolve()
            .then(() => System.readSoundFile(inputs.inputFile))
            .then((info) => Sound.loadSample(info.data))
            .then((loadedSound) => {
                console.log('loadedSound', loadedSound);
                const createSound = () => loadedSound.getSound(loadedSound.contents, inputs.inputLoop, start, end);

                return {
                    oldFile: inputs.inputFile,
                    oldCreateSound: createSound,
                    createSound
                };
            });
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
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['import', 'audio'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;