import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Dice';

const inputEndpoints = [{
    name: 'Roll',
    signal: 'Pulse'
}, {
    name: 'Dice',
    defaultValue: 1,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Faces',
    defaultValue: 6,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Value',
    defaultValue: 1,
    type: 'number',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const rollDice = (dice, faces) => {
        return Array(parseInt(dice)).fill(1)
            .map(() => Math.floor(parseInt(faces) * Math.random() + 1))
            .reduce((a, v) => a + v, 0)
    };

    const Component = (props) => {
        const { inputDice, inputFaces } = props.panel.inputEpValues;
        const ready = parseInt(inputDice) > 0 && parseInt(inputFaces) > 0;

        return <>
            <div className="Row">
                <InputEndpoint name="Roll" panelId={panelId} signal="Pulse" description="Roll the dice" {...props}>Roll</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Dice" panelId={panelId} {...props}>Dice</InputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Faces" panelId={panelId} {...props}>Faces</InputEndpoint>
            </div>
        </>;
    };

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputRoll':
                return { outputValue: rollDice(panel.inputEpValues.inputDice, panel.inputEpValues.inputFaces) };
        }
    };

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        Component,
        execute,
        onPulse
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['random'],
    inputEndpoints,
    outputEndpoints
};