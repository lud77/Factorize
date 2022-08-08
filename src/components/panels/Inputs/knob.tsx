import * as React from 'react';
import { flushSync } from 'react-dom';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import Knob from '../../Knob/Knob';

import mostRecent from '../../../utils/mostRecent';

const panelType = 'Knob';

const create = (panelId: number): Panel => {
    const clamp = (v) => Math.max(0, Math.min(1, v));

    const handleMouseWheel = ({ panel, machine }) => (e) => {
        const currentValue = panel.outputEpValues.outputValue != null ? panel.outputEpValues.outputValue : panel.outputEpDefaults.outputValue;
        machine.executePanelLogic(panelId, {
            tuningValue: clamp(currentValue - e.deltaY / 6000)
        });
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <Knob onMouseWheel={handleMouseWheel(props)} value={ props.panel.outputEpValues.outputValue }/>
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Value" panelId={panelId} {...props}>Value</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Value',
        defaultValue: 0.5,
        type: 'number',
        signal: 'Value'
    }];

    const execute = (panel, inputs) => {
        return {
            outputValue: inputs.tuningValue
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
    create
};