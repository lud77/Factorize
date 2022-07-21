import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const rollDice = (dice, faces) => {
        return Array(parseInt(dice)).fill(1)
            .map(() => Math.floor(parseInt(faces) * Math.random() + 1))
            .reduce((a, v) => a + v, 0)
    };

    const handleClick = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, {
            tuningRoll: rollDice(panel.inputEpValues.inputDice, panel.inputEpValues.inputFaces)
        });
    };

    const Component = (props) => {
        const { inputDice, inputFaces } = props.panel.inputEpValues;
        const ready = parseInt(inputDice) > 0 && parseInt(inputFaces) > 0;

        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <button disabled={!ready} onClick={handleClick(props)}>Roll!</button>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Roll" panelId={panelId} signal="Pulse" {...props}>Roll</InputEndpoint>
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

    const inputEndpoints = [{
        name: 'Roll',
        signal: 'Pulse'
    }, {
        name: 'Dice',
        defaultValue: 1,
        signal: 'Value'
    }, {
        name: 'Faces',
        defaultValue: 6,
        signal: 'Value'
    }];

    const outputEndpoints = [{
        name: 'Value',
        defaultValue: 1,
        signal: 'Value'
    }];

    const onPulse = (ep, panel) => {
        switch (ep) {
            case 'inputRoll':
                return { outputValue: rollDice(panel.inputEpValues.inputDice, panel.inputEpValues.inputFaces) };
        }
    };

    const execute = (panel, values) => ({ outputValue: values.tuningRoll });

    return {
        type: 'Value',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 114,
        Component,
        execute,
        onPulse
    } as Panel;
};

export default {
    create
};