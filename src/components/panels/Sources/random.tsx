import * as React from 'react';
import Random from 'random-seed';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Random';

const defaultSeed = Math.random();

const inputEndpoints = [{
    name: 'Fetch',
    signal: 'Pulse'
}, {
    name: 'Seed',
    defaultValue: defaultSeed,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Reset',
    signal: 'Pulse'
}];

const outputEndpoints = [{
    name: 'Value',
    defaultValue: '',
    type: 'number',
    signal: 'Value'
}];

let rand = Random(defaultSeed);

const panelSizes = {
    ...defaultSizes,
    width: 134,
    height: 93
};

const create = (panelId: number): Panel => {
    const getValue = () => rand.random();

    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Fetch" panelId={panelId} signal="Pulse" description="Produce a random number" {...props}>Fetch</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Seed" panelId={panelId} signal="Value" editor="text" {...props}>Seed</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Reset" panelId={panelId} signal="Pulse" description="Produce a random number" {...props}>Reset</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputFetch':
                return { outputValue: getValue() };

            case 'inputReset':
                rand = Random(panel.inputEpValues.inputSeed);
                return { outputValue: '' };
        }
    };

    const execute = (panel, values) => {
        console.log('random execute');
        if ((panel.outputEpValues.oldSeed == null) || (panel.inputEpValues.inputSeed != panel.outputEpValues.oldSeed)) {
            console.log('random execute - create instance');
            rand = Random(panel.inputEpValues.inputSeed);

            return {
                ...values,
                oldSeed: panel.inputEpValues.inputSeed,
                outputValue: ''
            };
        }

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
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;