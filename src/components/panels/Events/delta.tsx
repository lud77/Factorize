import * as React from 'react';

import { Panel } from '../../../types/Panel';

import InputEndpoint from '../../Editor/Panel/InputEndpoint';
import OutputEndpoint from '../../Editor/Panel/OutputEndpoint';
import defaultSizes from '../../Editor/Panel/defaultSizes';

const panelType = 'Delta';

const inputEndpoints = [{
    name: 'Value',
    defaultValue: '',
    type: 'any',
    signal: 'Value'
}];

const outputEndpoints = [{
    name: 'Changed',
    signal: 'Pulse'
}];

const panelSizes = {
    ...defaultSizes,
    height: 54
};

const create = (panelId: number): Panel => {
    const Component = (props) => {
        return <>
            <div className="Row">
                <InputEndpoint name="Value" panelId={panelId} {...props}>Value</InputEndpoint>
                <OutputEndpoint name="Changed" panelId={panelId} signal="Pulse" description="Input value changes" {...props}>Changed</OutputEndpoint>
            </div>
        </>;
    };

    const execute = (panel, values, { sendPulseTo }) => {
        sendPulseTo(panel.panelId, 'outputChanged');
        return values;
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

const PanelBundle = {
    type: panelType,
    create,
    tags: ['change', 'event'],
    inputEndpoints,
    outputEndpoints,
    ...panelSizes
};

export default PanelBundle;