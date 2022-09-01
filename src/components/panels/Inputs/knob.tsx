import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import Knob from '../../Knob/Knob';

const panelType = 'Knob';

const inputEndpoints = [{
    name: 'Scale',
    defaultValue: 1,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Value',
    defaultValue: 0.5,
    type: 'number',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const clamp = (v) => Math.max(0, Math.min(1, v));

    const handleMouseWheel = ({ panel, machine }) => (e) => {
        const currentValue = (panel.outputEpValues.outputValue != null ? panel.outputEpValues.outputValue : panel.outputEpDefaults.outputValue) / parseInt(panel.inputEpValues.inputScale);
        machine.executePanelLogic(panelId, {
            tuningValue: clamp(currentValue - e.deltaY / 6000)
        });
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <Knob
                        onMouseWheel={handleMouseWheel(props)}
                        value={ props.panel.outputEpValues.outputValue / parseInt(props.panel.inputEpValues.inputScale) }
                        />
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Scale" panelId={panelId} editable={true} {...props}>Scale</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('inputs', inputs);
        return {
            outputValue: ((inputs.tuningValue != null) ? inputs.tuningValue : 0.5) * parseInt(inputs.inputScale)
        };
    }

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 100,
        height: 109,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['number', 'potentiometer', 'input'],
    inputEndpoints,
    outputEndpoints
};