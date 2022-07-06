import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
            </div>
            <div className="Row"><span>{props.panel.inputEpValues.inputValue}</span></div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Value',
        defaultValue: ''
    }];

    const outputEndpoints = [];

    const execute = (values) => {};

    return {
        type: 'Display',
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