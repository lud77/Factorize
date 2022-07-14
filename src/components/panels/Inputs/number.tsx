import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const handleChange = ({ panel, machine }) => (e) => {
        machine.executePanelLogic(panelId, { tuningNumber: parseInt(e.target.value) });

        return true;
    };

    const Component = (props) => {
        return <>
            <div className="Row">
                <div className="InteractiveItem">
                    <input
                        type="number"
                        onChange={handleChange(props)}
                        />
                </div>
            </div>
            <div className="Row">
                <OutputEndpoint name="Number" panelId={panelId} {...props}>Number</OutputEndpoint>
            </div>
        </>;
    };

    const inputEndpoints = [];

    const outputEndpoints = [{
        name: 'Number',
        defaultValue: ''
    }];

    const execute = (panel, inputs) => {
        return {
            outputNumber: inputs.tuningNumber
        };
    };

    return {
        type: 'Number',
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute
    } as Panel;
};

export default {
    create
};