import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

import Led from '../../Led/Led';

const panelType = 'Led';

const inputEndpoints = [{
    name: 'Hue',
    defaultValue: undefined,
    type: 'number',
    signal: 'Value'
}];

const outputEndpoints = [];

const panelSizes = {
    ...defaultSizes,
    width: 60,
    height: 89
};

const create = (panelId: number): Panel => {
    const isFloat = (x) => typeof x === 'number' && !isNaN(x);

    const Component = (props) => {

        return <>
            <div className="Row">
                <InputEndpoint name="Hue" panelId={panelId} {...props}>Hue</InputEndpoint>
            </div>
            <div className="Row">
                {
                    (props.panel.inputEpValues.inputHue == null || !isFloat(props.panel.inputEpValues.inputHue))
                        ? <Led status="Inactive" />
                        : <Led hue={props.panel.inputEpValues.inputHue} />
                }
            </div>
        </>;
    };

    const execute = (panel, values) => values;

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
    tags: ['output'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};