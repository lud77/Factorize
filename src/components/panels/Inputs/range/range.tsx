import * as React from 'react';

import { Panel } from '../../../../types/Panel';

import InputEndpoint from '../../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../../Editor/Panel/defaultSizes';

import './range.css';

const panelType = 'Range';

const inputEndpoints = [{
    name: 'Scale',
    defaultValue: 1,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Value',
    defaultValue: .5,
    type: 'number',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes
};

const create = (panelId: number): Panel => {
    const clamp = (v) => Math.max(0, Math.min(1, v));

    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningValue: parseInt(e.target.value) / 100 });

        return true;
    };

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
                    <div className="Range">
                        <input
                            type="range"
                            min={0}
                            max={100}
                            onChange={handleChange(props)}
                            onWheel={handleMouseWheel(props)}
                            value={ props.panel.outputEpValues.outputValue * 100 / parseInt(props.panel.inputEpValues.inputScale) }
                            />
                    </div>
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
        return {
            outputValue: ((inputs.tuningValue != null) ? inputs.tuningValue : 0.5) * parseInt(inputs.inputScale != null ? inputs.inputScale : 0)
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        ...panelSizes,
        Component,
        execute
    } as unknown as Panel;
};

const PanelBundle = {
    type: panelType,
    create,
    tags: ['number', 'input'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;