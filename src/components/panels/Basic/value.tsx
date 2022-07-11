import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const handleClick = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, {
            tuningRoll: Array(panel.inputEpValues.inputDice).fill(1)
                .map(() => Math.floor(panel.inputEpValues.inputFaces * Math.random() + 1))
                .reduce((a, v) => a + v, 0)
        });
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <button onClick={handleClick(props)}>Roll!</button>
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Dice" panelId={panelId} {...props}>Dice</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
            <div className="Row">
                <InputEndpoint name="Faces" panelId={panelId} {...props}>Faces</InputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Dice',
        defaultValue: 1
    }, {
        name: 'Faces',
        defaultValue: 6
    }];

    const outputEndpoints = [{
        name: 'Value',
        defaultValue: 1
    }];

    const execute = (panel, values) => ({ outputValue: values.tuningRoll });

    return {
        type: 'Value',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 134,
        height: 94,
        Component,
        execute
    } as Panel;
};

export default {
    create
};