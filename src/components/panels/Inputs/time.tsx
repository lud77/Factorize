import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const panelType = 'Time';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Hours',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}, {
    name: 'Minutes',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        console.log('+-+-+-+', e.target.value);
        const [tuningHours, tuningMinutes] = e.target.value.split(':');
        machine.executePanelLogic(panelId, {
            tuningHours,
            tuningMinutes
        });

        return true;
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <input
                        type="time"
                        onChange={handleChange(props)}
                        defaultValue={ props.panel.outputEpValues.outputHours + ':' + props.panel.outputEpValues.outputMinutes }
                        style={{ borderRadius: '5px', border: 'none' }}
                        />
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Hours" panelId={panelId} {...props}>Hours</OutputEndpoint>
            </div>
            <div className="Row">
                <OutputEndpoint name="Minutes" panelId={panelId} {...props}>Minutes</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        return {
            outputHours: inputs.tuningHours,
            outputMinutes: inputs.tuningMinutes
        };
    };

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        height: 95,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['input', 'time'],
    inputEndpoints,
    outputEndpoints
};