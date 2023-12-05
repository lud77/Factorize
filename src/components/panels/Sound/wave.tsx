
import * as React from 'react';

import { Panel } from '../../../types/Panel';
import * as Sound from '../../../domain/types/Sound';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Wave';

const inputEndpoints = [{
    name: 'Play',
    signal: 'Pulse'
}, {
    name: 'Stop',
    signal: 'Pulse'
}, {
    name: 'Frequency',
    defaultValue: 440,
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
    height: 116
};

const waveTypes = {
    'Sine': 'sine',
    'Square': 'square',
    'Sawtooth': 'sawtooth',
    'Triangle': 'triangle'
};

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningWaveType: e.target.value });

        return true;
    };

    const Component = (props) => {
        const playStyle = {
            marginLeft: '1px'
        };

        const stopStyle = {
            fontSize: '17px',
            lineHeight: '13px'
        };

        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <select
                        onChange={handleChange(props)}
                        defaultValue={ props.panel.outputEpValues.outputWaveType || 'sine' }
                        style={{ width: '100%', borderRadius: '5px', border: 'none' }}
                        >
                        {
                            Object.keys(waveTypes).map((waveType, key) => (<option key={key} value={waveTypes[waveType]}>{waveType}</option>))
                        }
                    </select>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Play" panelId={panelId} signal="Pulse" description="Start the oscillator" {...props}><span style={playStyle}>▶</span></InputEndpoint>
                <OutputEndpoint name="Sound" panelId={panelId} {...props}>Sound</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Stop" panelId={panelId} signal="Pulse" description="Stop playing" {...props}><span style={stopStyle}>■</span></InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Frequency" panelId={panelId} editor="text" {...props}>Frequency</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputPlay':
                console.log('inputPlay', panel.outputEpValues.outputSound);
                if (panel.outputEpValues.outputSound != null) {
                    panel.outputEpValues.outputSound.contents.stop();
                }

                const oscillator = Sound.createOscillator(panel.outputEpValues.tuningWaveType, panel.inputEpValues.inputFrequency);
                oscillator.contents.start();

                return {
                    outputSound: oscillator,
                    playing: true
                };

            case 'inputStop':
                if (panel.outputEpValues.outputSound != null) {
                    panel.outputEpValues.outputSound.contents.stop();
                }

                return {
                    outputSound: null,
                    playing: false
                };
        }
    };

    const execute = (panel, values) => {
        console.log('execute oscillator', values);

        return values;
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
    tags: ['audio', 'sound', 'oscillator'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;