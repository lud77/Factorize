import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Date';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Timestamp',
    defaultValue: 0,
    type: 'number',
    signal: 'Value'
}];

const panelSizes = {
    ...defaultSizes
};

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningTimestamp: (new Date(e.target.value)).getTime() });

        return true;
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <input
                        type="date"
                        onChange={handleChange(props)}
                        defaultValue={ props.panel.outputEpValues.outputTimestamp }
                        style={{ borderRadius: '5px', border: 'none' }}
                        />
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Timestamp" panelId={panelId} {...props}>Timestamp</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, inputs) => {
        return {
            outputTimestamp: inputs.tuningTimestamp
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
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['input', 'calendar'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};