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
                <InputEndpoint name="Hue" panelId={panelId} {...props}>Hue</InputEndpoint>
            </div>
            <div className="Row">
                {
                    (props.panel.inputEpValues.inputHue == null)
                        ? <Led status="Inactive" />
                        : <Led hue={props.panel.inputEpValues.inputHue} />
                }
            </div>
        </>;
    };

    const inputEndpoints = [{
        name: 'Hue',
        defaultValue: null,
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