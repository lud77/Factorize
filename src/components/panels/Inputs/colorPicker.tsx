import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'ColorPicker';

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
                    <input
                        type="color"
                        onChange={handleChange(props)}
                        color={ props.panel.outputEpValues.outputColor }
                        style={{ borderRadius: '4px' }}
                        />
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Color" panelId={panelId} {...props}>Color</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Color',
        defaultValue: '#000000',
        signal: 'Value'
    }];

    const execute = (panel, inputs) => {
        return {
            outputColor: inputs.tuningColor
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
    create
};