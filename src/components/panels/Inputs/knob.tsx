import * as React from 'react';

import clamp from '../../../utils/clamp';
import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

import Knob from '../../Knob/Knob';
import { min } from 'mathjs';

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

const panelSizes = {
    ...defaultSizes,
    width: 100,
    height: 109
};


const debounce = (func, delay = 250) => {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func(args);
        }, delay);
    };
};

const create = (panelId: number): Panel => {
    const handleMouseWheel = ({ panel, machine }) => (value) => {
        machine.executePanelLogic(panelId, {
            tuningNormalizedValue: value
        });
    };

    const debouncedMouseWheel = (props) => debounce(handleMouseWheel(props));

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <Knob
                        onMouseWheel={debouncedMouseWheel(props)}
                        value={ props.panel.outputEpValues.outputValue / parseInt(props.panel.inputEpValues.inputScale) }
                        />
                </div>
            </div>
            <div className="Row">
                <InputEndpoint name="Scale" panelId={panelId} editor="text" {...props}>Scale</InputEndpoint>
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        console.log('inputs', inputs);
        const scale = parseInt(inputs.inputScale != null ? inputs.inputScale : 0);
        const baseNormalizedValue = panel.outputEpValues.normalizedValue != null ? panel.outputEpValues.normalizedValue : 0.5;
        const normalizedValue = (inputs.tuningNormalizedValue != null) ? inputs.tuningNormalizedValue : baseNormalizedValue;
        return {
            normalizedValue,
            outputValue: normalizedValue * scale
        };
    }

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
    tags: ['number', 'potentiometer', 'input'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};