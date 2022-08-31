import * as React from 'react';

import { Panel } from '../../../../types/Panel';

import InputEndpoint from '../../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../../Editor/Panel/OutputEndpoint';

import './colorPicker.css';

const panelType = 'ColorPicker';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Hex',
    defaultValue: '#ffffff',
    type: 'string',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        console.log('new color', e.target.value);
        machine.executePanelLogic(panelId, { tuningColor: e.target.value });

        return true;
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <div className="ColorPicker">
                        <input
                            type="color"
                            onChange={handleChange(props)}
                            value={ props.panel.outputEpValues.outputHex }
                            />
                    </div>
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Hex" panelId={panelId} {...props}>Hex</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        return {
            outputHex: inputs.tuningColor
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        height: 84
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['input'],
    inputEndpoints,
    outputEndpoints
};