import { fas } from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import Toggle from '../../Toggle/Toggle';

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, {
            tuningActive: Boolean(e.target.checked)
        });
    };

    const Component = (props) => {
        const { inputDice, inputFaces } = props.panel.inputEpValues;
        const ready = parseInt(inputDice) > 0 && parseInt(inputFaces) > 0;

        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <Toggle onChange={handleChange(props)} />
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Active" panelId={panelId} {...props}>Active</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Active',
        defaultValue: false,
        signal: 'Value'
    }];

    const execute = (panel, values) => ({ outputActive: values.tuningActive });

    return {
        type: 'Toggle',
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
    create
};