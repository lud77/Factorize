import { fas } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import Toggle from '../../Toggle/Toggle';

const panelType = 'Toggle';

const inputEndpoints = [];

const outputEndpoints = [{
    name: 'Active',
    defaultValue: false,
    type: 'boolean',
    signal: 'Value'
}];

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, {
            tuningActive: Boolean(e.target.checked)
        });
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <Toggle onChange={handleChange(props)} status={ props.panel.outputEpValues.outputActive }/>
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Active" panelId={panelId} {...props}>Active</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values) => ({ outputActive: values.tuningActive });

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        width: 100,
        height: 94,
        Component,
        execute
    } as Panel;
};

export default {
    type: panelType,
    create,
    tags: ['switch'],
    inputEndpoints,
    outputEndpoints
};