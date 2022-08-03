import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';

import Led from '../../Led/Led';

const panelType = 'Led';

const create = (panelId: number): Panel => {
    const Component = (props) => {

        return <>
            <div className="Row">
                <InputEndpoint name="Color" panelId={panelId} {...props}>Color</InputEndpoint>
            </div>
            <div className="Row">
                {
                    (props.panel.inputEpValues.inputColor == null)
                        ? <Led status="Inactive" />
                        : <Led color={props.panel.inputEpValues.inputColor} />
                }
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Color',
        defaultValue: undefined,
        signal: 'Value'
    }];

    const outputEndpoints = [];

    const execute = (panel, values) => values;

    return {
        type: panelType,
        starter: true,
        inputEndpoints,
        outputEndpoints,
        Component,
        execute,
        width: 60,
        height: 89
    } as Panel;
};

export default {
    type: panelType,
    create
};