import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import './range.css';

const panelType = 'Range';

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningValue: parseInt(e.target.value) / 100 });

        return true;
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
                            value={ props.panel.outputEpValues.outputValue * 100 }
                            />
                    </div>
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
        defaultValue: .5,
        type: 'number',
        signal: 'Value'
    }];

    const execute = (panel, inputs) => {
        return {
            outputValue: inputs.tuningValue
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