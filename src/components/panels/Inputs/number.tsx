import * as React from 'react';

import { Panel } from '../../../types/Panel';
import BlendModes from '../../../domain/BlendModes';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Number';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Number',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningNumber: parseFloat(e.target.value) });

        return true;
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <input
                        type="number" step="any"
                        onChange={handleChange(props)}
                        defaultValue={ props.panel.outputEpValues.outputNumber }
                        style={{ borderRadius: '5px', border: 'none' }}
                        />
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Number" panelId={panelId} {...props}>Number</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        return {
            outputNumber: inputs.tuningNumber
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['input'],
    inputEndpoints,
    outputEndpoints
};